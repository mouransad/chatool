/*
 * The Material 3 Expressive shapes the loading indicator morphs through, ported
 * from Compose's `MaterialShapes` with their original control values. Everything
 * is built lazily and once: the geometry only costs something on first use.
 */

import { type Point } from "./cubic";
import { type Morph, createMorph } from "./morph";
import {
  type CornerRounding,
  type RoundedPolygon,
  circlePolygon,
  createPolygon,
  normalizePolygon,
  polygonBounds,
  polygonMaxBounds,
  rotation,
  starPolygon,
  transformPolygon,
} from "./polygon";

type PointAndRounding = [point: Point, rounding?: CornerRounding];

const CENTER: Point = [0.5, 0.5];

/** Repeats a point list `reps` times around the center (`customPolygon`). */
const repeatPoints = (points: PointAndRounding[], reps: number) => {
  const result: PointAndRounding[] = [];
  for (let rep = 0; rep < reps; rep++) {
    const rotate = rotation((rep * 360) / reps);
    for (const [[x, y], rounding] of points) {
      const [rotatedX, rotatedY] = rotate(x - CENTER[0], y - CENTER[1]);
      result.push([[rotatedX + CENTER[0], rotatedY + CENTER[1]], rounding]);
    }
  }
  return result;
};

/** Like {@link repeatPoints}, but every other repetition is mirrored. */
const mirrorPoints = (points: PointAndRounding[], reps: number) => {
  const angles = points.map(
    ([[x, y]]) => (Math.atan2(y - CENTER[1], x - CENTER[0]) * 180) / Math.PI,
  );
  const distances = points.map(([[x, y]]) =>
    Math.hypot(x - CENTER[0], y - CENTER[1]),
  );
  const actualReps = reps * 2;
  const sectionAngle = 360 / actualReps;
  const result: PointAndRounding[] = [];
  for (let rep = 0; rep < actualReps; rep++) {
    points.forEach((_, index) => {
      const i = rep % 2 === 0 ? index : points.length - 1 - index;
      if (i > 0 || rep % 2 === 0) {
        const degrees =
          sectionAngle * rep +
          (rep % 2 === 0
            ? angles[i]!
            : sectionAngle - angles[i]! + 2 * angles[0]!);
        const radians = (degrees * Math.PI) / 180;
        result.push([
          [
            Math.cos(radians) * distances[i]! + CENTER[0],
            Math.sin(radians) * distances[i]! + CENTER[1],
          ],
          points[i]![1],
        ]);
      }
    });
  }
  return result;
};

const customPolygon = (points: PointAndRounding[]) =>
  createPolygon(
    points.map(([point]) => point),
    points.map(([, rounding]) => rounding ?? { radius: 0 }),
    CENTER,
  );

const softBurst = () =>
  customPolygon(
    repeatPoints(
      [
        [[0.193, 0.277], { radius: 0.053 }],
        [[0.176, 0.055], { radius: 0.053 }],
      ],
      10,
    ),
  );

const cookie9 = () =>
  transformPolygon(starPolygon(9, 0.8, { radius: 0.5 }), rotation(-90));

const pentagon = () =>
  customPolygon(
    mirrorPoints(
      [
        [[0.5, -0.009], { radius: 0.172 }],
        [[1.03, 0.365], { radius: 0.164 }],
        [[0.828, 0.97], { radius: 0.169 }],
      ],
      1,
    ),
  );

const pill = () =>
  customPolygon(
    mirrorPoints(
      [
        [[0.961, 0.039], { radius: 0.426 }],
        [[1.001, 0.428]],
        [[1, 0.609], { radius: 1 }],
      ],
      2,
    ),
  );

const sunny = () => starPolygon(8, 0.8, { radius: 0.15 });

const cookie4 = () =>
  customPolygon(
    repeatPoints(
      [
        [[1.237, 1.236], { radius: 0.258 }],
        [[0.5, 0.918], { radius: 0.233 }],
      ],
      4,
    ),
  );

const oval = () =>
  transformPolygon(
    transformPolygon(circlePolygon(), (x, y) => [x, y * 0.64]),
    rotation(-45),
  );

/** Normalized polygons plus the morphs and fit that a whole sequence shares. */
export interface MorphSequence {
  morphs: Morph[];
  /**
   * Scale that keeps every shape inside its container while it rotates
   * (`calculateScaleFactor`), before the 38/48 active-indicator scale.
   */
  scale: number;
}

const createSequence = (
  polygons: RoundedPolygon[],
  circular: boolean,
): MorphSequence => {
  let scale = 1;
  for (const polygon of polygons) {
    const [left, top, right, bottom] = polygonBounds(polygon);
    const [maxLeft, maxTop, maxRight, maxBottom] = polygonMaxBounds(polygon);
    // `max` handles shapes like the pill, whose long axis would skew the result.
    scale = Math.min(
      scale,
      Math.max(
        (right - left) / (maxRight - maxLeft),
        (bottom - top) / (maxBottom - maxTop),
      ),
    );
  }

  const morphs: Morph[] = [];
  polygons.forEach((polygon, i) => {
    const next = i + 1 < polygons.length ? polygons[i + 1] : undefined;
    if (next) morphs.push(createMorph(polygon, next));
    else if (circular) morphs.push(createMorph(polygon, polygons[0]!));
  });
  return { morphs, scale };
};

let indeterminate: MorphSequence | undefined;
let determinate: MorphSequence | undefined;

/** The seven-shape loop of `LoadingIndicatorDefaults.IndeterminateIndicatorPolygons`. */
export const indeterminateSequence = () =>
  (indeterminate ??= createSequence(
    [
      softBurst(),
      cookie9(),
      pentagon(),
      pill(),
      sunny(),
      cookie4(),
      oval(),
    ].map(normalizePolygon),
    true,
  ));

/**
 * `DeterminateIndicatorPolygons`: a circle into the soft burst. The circle is
 * rotated by 1/20 of a turn so its vertices line up with the burst's, which is
 * what keeps this morph from twisting.
 */
export const determinateSequence = () =>
  (determinate ??= createSequence(
    [
      normalizePolygon(
        transformPolygon(
          normalizePolygon(circlePolygon(10)),
          rotation(360 / 20),
        ),
      ),
      normalizePolygon(softBurst()),
    ],
    false,
  ));

/**
 * Fits an origin-centered polygon into the unit square by its true radius. Plain
 * normalizing goes by control points, which sit unevenly around a circle and would
 * leave the ring slightly small and off-center against its perfectly round track.
 */
const fitByRadius = (polygon: RoundedPolygon) => {
  const [left, , right] = polygonMaxBounds(polygon);
  const side = right - left;
  return transformPolygon(polygon, (x, y) => [x / side + 0.5, y / side + 0.5]);
};

const waveMorphs = new Map<number, Morph>();

/**
 * The circular progress outline for `numVertices` waves: amplitude 0 is the track
 * circle and amplitude 1 the rounded star (`CircularShapes.update`). Matching the
 * vertex count on both sides keeps the amplitude animation from twisting.
 */
export const waveMorph = (numVertices: number) => {
  let morph = waveMorphs.get(numVertices);
  if (!morph) {
    morph = createMorph(
      fitByRadius(circlePolygon(numVertices)),
      fitByRadius(
        starPolygon(
          numVertices,
          0.75,
          { radius: 0.35, smoothing: 0.4 },
          { radius: 0.5 },
        ),
      ),
    );
    waveMorphs.set(numVertices, morph);
  }
  return morph;
};
