/*
 * TypeScript port of `androidx.graphics.shapes.Morph` (+ `FeatureMapping`,
 * `FloatMapping` and `PolygonMeasure`). Two polygons are measured, their corners
 * paired by proximity, and both outlines cut until every cubic of one has a
 * partner in the other — so interpolating the pairs carries corners to corners
 * instead of smearing the outline around, which is what makes Android's morphs
 * look organic.
 */

import {
  ANGLE_EPSILON,
  type Cubic,
  DISTANCE_EPSILON,
  distance,
  pointOnCubic,
  positiveModulo,
  splitCubic,
} from "./cubic";
import { type Feature, type RoundedPolygon } from "./polygon";

type Mapping = [from: number, to: number];

interface ProgressableFeature {
  progress: number;
  feature: Feature;
}

interface MeasuredCubic {
  cubic: Cubic;
  start: number;
  end: number;
  size: number;
}

interface MeasuredPolygon {
  cubics: MeasuredCubic[];
  features: ProgressableFeature[];
}

const SEGMENTS = 3;

/** Walks a cubic as three chords: `[t at threshold, total length]`. */
const walkCubic = (cubic: Cubic, threshold: number): [number, number] => {
  let total = 0;
  let remainder = threshold;
  let [previousX, previousY] = [cubic[0]!, cubic[1]!];
  for (let i = 1; i <= SEGMENTS; i++) {
    const progress = i / SEGMENTS;
    const [x, y] = pointOnCubic(cubic, progress);
    const segment = distance(x - previousX, y - previousY);
    if (segment >= remainder) {
      return [progress - (1 - remainder / segment) / SEGMENTS, threshold];
    }
    remainder -= segment;
    total += segment;
    previousX = x;
    previousY = y;
  }
  return [1, total];
};

const measureCubic = (cubic: Cubic) => walkCubic(cubic, Infinity)[1];

const createMeasured = (
  features: ProgressableFeature[],
  cubics: Cubic[],
  outlineProgress: number[],
): MeasuredPolygon => {
  const measured: MeasuredCubic[] = [];
  let start = 0;
  cubics.forEach((cubic, index) => {
    const end = outlineProgress[index + 1]!;
    if (end - outlineProgress[index]! > DISTANCE_EPSILON) {
      measured.push({ cubic, start, end, size: measureCubic(cubic) });
      start = end;
    }
  });
  measured.at(-1)!.end = 1;
  return { cubics: measured, features };
};

const measurePolygon = (polygon: RoundedPolygon): MeasuredPolygon => {
  const cubics: Cubic[] = [];
  const featureToCubic: [Feature, number][] = [];
  for (const feature of polygon.features) {
    feature.cubics.forEach((cubic, cubicIndex) => {
      if (
        feature.convex !== undefined &&
        cubicIndex === Math.floor(feature.cubics.length / 2)
      ) {
        featureToCubic.push([feature, cubics.length]);
      }
      cubics.push(cubic);
    });
  }

  const measures = [0];
  for (const cubic of cubics)
    measures.push(measures.at(-1)! + measureCubic(cubic));
  const total = measures.at(-1)!;
  const outlineProgress = measures.map((measure) => measure / total);

  const features = featureToCubic.map(([feature, index]) => ({
    feature,
    progress: positiveModulo(
      (outlineProgress[index]! + outlineProgress[index + 1]!) / 2,
      1,
    ),
  }));
  return createMeasured(features, cubics, outlineProgress);
};

const cutAtProgress = (
  measured: MeasuredCubic,
  progress: number,
): [MeasuredCubic, MeasuredCubic] => {
  const { cubic, start, end, size } = measured;
  const bounded = Math.min(Math.max(progress, start), end);
  const relative = (bounded - start) / (end - start);
  const t = walkCubic(cubic, relative * size)[0];
  const [c1, c2] = splitCubic(cubic, t);
  return [
    { cubic: c1, start, end: bounded, size: measureCubic(c1) },
    { cubic: c2, start: bounded, end, size: measureCubic(c2) },
  ];
};

/** Re-roots a measured outline so it begins at `cuttingPoint`. */
const cutAndShift = (
  polygon: MeasuredPolygon,
  cuttingPoint: number,
): MeasuredPolygon => {
  if (cuttingPoint < DISTANCE_EPSILON) return polygon;
  const { cubics, features } = polygon;
  const targetIndex = cubics.findIndex(
    ({ start, end }) => cuttingPoint >= start && cuttingPoint <= end,
  );
  const [b1, b2] = cutAtProgress(cubics[targetIndex]!, cuttingPoint);

  const shifted = [b2.cubic];
  for (let i = 1; i < cubics.length; i++) {
    shifted.push(cubics[(i + targetIndex) % cubics.length]!.cubic);
  }
  shifted.push(b1.cubic);

  const outlineProgress = [0];
  for (let index = 1; index <= cubics.length; index++) {
    const cubicIndex = (targetIndex + index - 1) % cubics.length;
    outlineProgress.push(
      positiveModulo(cubics[cubicIndex]!.end - cuttingPoint, 1),
    );
  }
  outlineProgress.push(1);

  return createMeasured(
    features.map(({ feature, progress }) => ({
      feature,
      progress: positiveModulo(progress - cuttingPoint, 1),
    })),
    shifted,
    outlineProgress,
  );
};

const progressInRange = (progress: number, from: number, to: number) =>
  to >= from
    ? progress >= from && progress <= to
    : progress >= from || progress <= to;

const progressDistance = (a: number, b: number) => {
  const d = Math.abs(a - b);
  return Math.min(d, 1 - d);
};

const linearMap = (xs: number[], ys: number[], x: number) => {
  const n = xs.length;
  const start = xs.findIndex((value, i) =>
    progressInRange(x, value, xs[(i + 1) % n]!),
  );
  const end = (start + 1) % n;
  const sizeX = positiveModulo(xs[end]! - xs[start]!, 1);
  const sizeY = positiveModulo(ys[end]! - ys[start]!, 1);
  const position =
    sizeX < 0.001 ? 0.5 : positiveModulo(x - xs[start]!, 1) / sizeX;
  return positiveModulo(ys[start]! + sizeY * position, 1);
};

/** A corner's representative point: the midpoint of its two ends. */
const representativePoint = ({ cubics }: Feature) => {
  const first = cubics[0]!;
  const last = cubics.at(-1)!;
  return [(first[0]! + last[6]!) / 2, (first[1]! + last[7]!) / 2] as const;
};

/** Pairs corners nearest-first, keeping the pairing monotonic around the outline. */
const mapFeatures = (
  features1: ProgressableFeature[],
  features2: ProgressableFeature[],
): Mapping[] => {
  const candidates: [number, ProgressableFeature, ProgressableFeature][] = [];
  for (const f1 of features1) {
    for (const f2 of features2) {
      // A convex corner never maps onto a concave one.
      if (f1.feature.convex !== f2.feature.convex) continue;
      const [x1, y1] = representativePoint(f1.feature);
      const [x2, y2] = representativePoint(f2.feature);
      candidates.push([(x1 - x2) ** 2 + (y1 - y2) ** 2, f1, f2]);
    }
  }
  candidates.sort((a, b) => a[0] - b[0]);

  if (candidates.length === 0) {
    return [
      [0, 0],
      [0.5, 0.5],
    ];
  }
  if (candidates.length === 1) {
    const { progress: p1 } = candidates[0]![1];
    const { progress: p2 } = candidates[0]![2];
    return [
      [p1, p2],
      [(p1 + 0.5) % 1, (p2 + 0.5) % 1],
    ];
  }

  const mapping: Mapping[] = [];
  const used1 = new Set<ProgressableFeature>();
  const used2 = new Set<ProgressableFeature>();
  for (const [, f1, f2] of candidates) {
    if (used1.has(f1) || used2.has(f2)) continue;
    const insertion = mapping.findIndex(([from]) => from >= f1.progress);
    const index = insertion === -1 ? mapping.length : insertion;
    if (mapping[index]?.[0] === f1.progress) continue;
    const n = mapping.length;
    if (n >= 1) {
      const [before1, before2] = mapping[(index + n - 1) % n]!;
      const [after1, after2] = mapping[index % n]!;
      if (
        progressDistance(f1.progress, before1) < DISTANCE_EPSILON ||
        progressDistance(f1.progress, after1) < DISTANCE_EPSILON ||
        progressDistance(f2.progress, before2) < DISTANCE_EPSILON ||
        progressDistance(f2.progress, after2) < DISTANCE_EPSILON
      ) {
        continue;
      }
      if (n > 1 && !progressInRange(f2.progress, before2, after2)) continue;
    }
    mapping.splice(index, 0, [f1.progress, f2.progress]);
    used1.add(f1);
    used2.add(f2);
  }
  return mapping;
};

const corners = (features: ProgressableFeature[]) =>
  features.filter(({ feature }) => feature.convex !== undefined);

const matchPolygons = (p1: RoundedPolygon, p2: RoundedPolygon) => {
  const measured1 = measurePolygon(p1);
  const measured2 = measurePolygon(p2);
  const mapping = mapFeatures(
    corners(measured1.features),
    corners(measured2.features),
  );
  const sources = mapping.map(([from]) => from);
  const targets = mapping.map(([, to]) => to);
  const map = (x: number) => linearMap(sources, targets, x);
  const mapBack = (x: number) => linearMap(targets, sources, x);

  const cutPoint = map(0);
  const bs1 = measured1.cubics;
  const bs2 = cutAndShift(measured2, cutPoint).cubics;

  const pairs: [Cubic, Cubic][] = [];
  let i1 = 0;
  let i2 = 0;
  let b1 = bs1[i1++];
  let b2 = bs2[i2++];
  while (b1 && b2) {
    const b1a = i1 === bs1.length ? 1 : b1.end;
    const b2a =
      i2 === bs2.length ? 1 : mapBack(positiveModulo(b2.end + cutPoint, 1));
    const min = Math.min(b1a, b2a);

    let segment1 = b1;
    let segment2 = b2;
    if (b1a > min + ANGLE_EPSILON) {
      [segment1, b1] = cutAtProgress(b1, min);
    } else {
      b1 = bs1[i1++];
    }
    if (b2a > min + ANGLE_EPSILON) {
      [segment2, b2] = cutAtProgress(
        b2,
        positiveModulo(map(min) - cutPoint, 1),
      );
    } else {
      b2 = bs2[i2++];
    }
    pairs.push([segment1.cubic, segment2.cubic]);
  }
  return pairs;
};

export interface Morph {
  /** Flat `[...startCubic, ...endCubic]` runs, 16 numbers per matched pair. */
  points: Float64Array;
  /** Number of matched cubics. */
  size: number;
}

export const createMorph = (
  start: RoundedPolygon,
  end: RoundedPolygon,
): Morph => {
  const pairs = matchPolygons(start, end);
  const points = new Float64Array(pairs.length * 16);
  pairs.forEach(([from, to], index) => {
    points.set(from, index * 16);
    points.set(to, index * 16 + 8);
  });
  return { points, size: pairs.length };
};

/**
 * Interpolates the morph into `out` as flat `[x, y, …]` points: the first anchor,
 * then `c0, c1, anchor` per cubic. `progress` is not clamped — a spring's overshoot
 * extrapolates past the end shape, exactly as Compose's `Morph.toPath` does.
 */
export const morphPoints = (
  { points, size }: Morph,
  progress: number,
  out: Float64Array,
) => {
  const u = 1 - progress;
  out[0] = points[0]! * u + points[8]! * progress;
  out[1] = points[1]! * u + points[9]! * progress;
  for (let i = 0; i < size; i++) {
    const base = i * 16;
    for (let j = 0; j < 6; j++) {
      out[2 + i * 6 + j] =
        points[base + 2 + j]! * u + points[base + 10 + j]! * progress;
    }
  }
  return out;
};

/** Length of the `out` buffer {@link morphPoints} needs. */
export const morphPointCount = ({ size }: Morph) => 2 + size * 6;
