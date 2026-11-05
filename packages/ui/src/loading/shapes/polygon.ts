/*
 * TypeScript port of `androidx.graphics.shapes.RoundedPolygon` (+ `Feature`,
 * `CornerRounding` and the `circle` / `star` factories from `Shapes.kt`) — the
 * geometry Android's Material 3 Expressive shapes are built from. Only what the
 * loading family needs is ported; the algorithm itself is deliberately unchanged
 * so the morphs land on the same outlines as Compose.
 */

import {
  type Cubic,
  DISTANCE_EPSILON,
  type Point,
  circularArc,
  direction,
  distance,
  isZeroLength,
  pointOnCubic,
  reverseCubic,
  splitCubic,
  straightLine,
  transformCubic,
} from "./cubic";

export interface CornerRounding {
  radius: number;
  smoothing?: number;
}

export interface Feature {
  cubics: Cubic[];
  /** `undefined` for an edge; a corner is either convex or concave. */
  convex?: boolean;
}

export interface RoundedPolygon {
  features: Feature[];
  center: Point;
  /** The features' outline as one contiguous, closed list of cubics. */
  cubics: Cubic[];
}

const UNROUNDED: CornerRounding = { radius: 0, smoothing: 0 };

/**
 * Stitches the feature cubics into one outline, starting mid-way through the
 * first corner so a morph never begins on a corner's shoulder. Zero-length cubics
 * are absorbed into their predecessor.
 */
const buildCubics = (features: Feature[], center: Point): Cubic[] => {
  const cubics: Cubic[] = [];
  let first: Cubic | undefined;
  let last: Cubic | undefined;
  let splitStart: Cubic[] | undefined;
  let splitEnd: Cubic[] | undefined;

  const firstFeature = features[0]?.cubics;
  if (firstFeature?.length === 3) {
    const [start, end] = splitCubic(firstFeature[1]!, 0.5);
    splitStart = [firstFeature[0]!, start];
    splitEnd = [end, firstFeature[2]!];
  }

  for (let i = 0; i <= features.length; i++) {
    let featureCubics: Cubic[];
    if (i === 0 && splitEnd) featureCubics = splitEnd;
    else if (i === features.length) {
      if (!splitStart) break;
      featureCubics = splitStart;
    } else featureCubics = features[i]!.cubics;

    for (const cubic of featureCubics) {
      if (!isZeroLength(cubic)) {
        if (last) cubics.push(last);
        last = cubic;
        first ??= cubic;
      } else if (last) {
        last = [...last.slice(0, 6), cubic[6]!, cubic[7]!];
      }
    }
  }

  if (last && first) {
    cubics.push([...last.slice(0, 6), first[0]!, first[1]!]);
  } else {
    const [x, y] = center;
    cubics.push([x, y, x, y, x, y, x, y]);
  }
  return cubics;
};

const fromFeatures = (features: Feature[], center: Point): RoundedPolygon => ({
  features,
  center,
  cubics: buildCubics(features, center),
});

export const transformPolygon = (
  polygon: RoundedPolygon,
  transform: (x: number, y: number) => Point,
): RoundedPolygon =>
  fromFeatures(
    polygon.features.map((feature) => ({
      ...feature,
      cubics: feature.cubics.map((c) => transformCubic(c, transform)),
    })),
    transform(polygon.center[0], polygon.center[1]),
  );

/** Control-point bounds as `[left, top, right, bottom]`. */
export const polygonBounds = (polygon: RoundedPolygon) => {
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  for (const cubic of polygon.cubics) {
    for (let i = 0; i < 8; i += 2) {
      left = Math.min(left, cubic[i]!);
      right = Math.max(right, cubic[i]!);
      top = Math.min(top, cubic[i + 1]!);
      bottom = Math.max(bottom, cubic[i + 1]!);
    }
  }
  return [left, top, right, bottom] as const;
};

/** The square bounds the polygon sweeps through as it rotates around its center. */
export const polygonMaxBounds = (polygon: RoundedPolygon) => {
  const [centerX, centerY] = polygon.center;
  let max = 0;
  for (const cubic of polygon.cubics) {
    const [midX, midY] = pointOnCubic(cubic, 0.5);
    max = Math.max(
      max,
      distance(cubic[0]! - centerX, cubic[1]! - centerY),
      distance(midX - centerX, midY - centerY),
    );
  }
  return [centerX - max, centerY - max, centerX + max, centerY + max] as const;
};

/** Fits the polygon into the unit square, centered. */
export const normalizePolygon = (polygon: RoundedPolygon): RoundedPolygon => {
  const [left, top, right, bottom] = polygonBounds(polygon);
  const width = right - left;
  const height = bottom - top;
  const side = Math.max(width, height);
  const offsetX = (side - width) / 2 - left;
  const offsetY = (side - height) / 2 - top;
  return transformPolygon(polygon, (x, y) => [
    (x + offsetX) / side,
    (y + offsetY) / side,
  ]);
};

/** Rotation around the origin, like Compose's `Matrix.rotateZ`. */
export const rotation = (degrees: number) => {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return (x: number, y: number): Point => [
    x * cos - y * sin,
    x * sin + y * cos,
  ];
};

const lineIntersection = (
  p0: Point,
  d0: Point,
  p1: Point,
  d1: Point,
): Point | undefined => {
  const rotatedX = -d1[1];
  const rotatedY = d1[0];
  const den = d0[0] * rotatedX + d0[1] * rotatedY;
  if (Math.abs(den) < DISTANCE_EPSILON) return undefined;
  const num = (p1[0] - p0[0]) * rotatedX + (p1[1] - p0[1]) * rotatedY;
  if (Math.abs(den) < DISTANCE_EPSILON * Math.abs(num)) return undefined;
  const k = num / den;
  return [p0[0] + d0[0] * k, p0[1] + d0[1] * k];
};

/** One vertex: computes how much of each side it needs, then its cubics. */
const createCorner = (
  p0: Point,
  p1: Point,
  p2: Point,
  rounding: CornerRounding,
) => {
  const v01x = p0[0] - p1[0];
  const v01y = p0[1] - p1[1];
  const v21x = p2[0] - p1[0];
  const v21y = p2[1] - p1[1];
  const d01 = distance(v01x, v01y);
  const d21 = distance(v21x, v21y);
  const valid = d01 > 0 && d21 > 0;

  const d1: Point = valid ? [v01x / d01, v01y / d01] : [0, 0];
  const d2: Point = valid ? [v21x / d21, v21y / d21] : [0, 0];
  const cornerRadius = valid ? rounding.radius : 0;
  const smoothing = valid ? (rounding.smoothing ?? 0) : 0;
  const cosAngle = d1[0] * d2[0] + d1[1] * d2[1];
  const sinAngle = Math.sqrt(1 - cosAngle * cosAngle);
  const expectedRoundCut =
    valid && sinAngle > 1e-3 ? (cornerRadius * (cosAngle + 1)) / sinAngle : 0;
  const expectedCut = (1 + smoothing) * expectedRoundCut;

  const actualSmoothing = (allowedCut: number) => {
    if (allowedCut > expectedCut) return smoothing;
    if (allowedCut > expectedRoundCut) {
      return (
        (smoothing * (allowedCut - expectedRoundCut)) /
        (expectedCut - expectedRoundCut)
      );
    }
    return 0;
  };

  const flankingCurve = (
    roundCut: number,
    smoothingValue: number,
    sideStart: Point,
    intersection: Point,
    otherIntersection: Point,
    center: Point,
    radius: number,
  ): Cubic => {
    const side = direction(sideStart[0] - p1[0], sideStart[1] - p1[1]);
    const reach = roundCut * (1 + smoothingValue);
    const curveStart: Point = [
      p1[0] + side[0] * reach,
      p1[1] + side[1] * reach,
    ];
    const midX = (intersection[0] + otherIntersection[0]) / 2;
    const midY = (intersection[1] + otherIntersection[1]) / 2;
    const px = intersection[0] + (midX - intersection[0]) * smoothingValue;
    const py = intersection[1] + (midY - intersection[1]) * smoothingValue;
    const toEnd = direction(px - center[0], py - center[1]);
    const curveEnd: Point = [
      center[0] + toEnd[0] * radius,
      center[1] + toEnd[1] * radius,
    ];
    const tangent: Point = [
      -(curveEnd[1] - center[1]),
      curveEnd[0] - center[0],
    ];
    const anchorEnd =
      lineIntersection(sideStart, side, curveEnd, tangent) ?? intersection;
    return [
      curveStart[0],
      curveStart[1],
      (curveStart[0] + anchorEnd[0] * 2) / 3,
      (curveStart[1] + anchorEnd[1] * 2) / 3,
      anchorEnd[0],
      anchorEnd[1],
      curveEnd[0],
      curveEnd[1],
    ];
  };

  const getCubics = (allowedCut0: number, allowedCut1: number): Cubic[] => {
    const allowedCut = Math.min(allowedCut0, allowedCut1);
    if (
      expectedRoundCut < DISTANCE_EPSILON ||
      allowedCut < DISTANCE_EPSILON ||
      cornerRadius < DISTANCE_EPSILON
    ) {
      return [straightLine(p1[0], p1[1], p1[0], p1[1])];
    }

    const roundCut = Math.min(allowedCut, expectedRoundCut);
    const radius = (cornerRadius * roundCut) / expectedRoundCut;
    const centerDistance = Math.hypot(radius, roundCut);
    const bisector = direction((d1[0] + d2[0]) / 2, (d1[1] + d2[1]) / 2);
    const center: Point = [
      p1[0] + bisector[0] * centerDistance,
      p1[1] + bisector[1] * centerDistance,
    ];
    const intersection0: Point = [
      p1[0] + d1[0] * roundCut,
      p1[1] + d1[1] * roundCut,
    ];
    const intersection2: Point = [
      p1[0] + d2[0] * roundCut,
      p1[1] + d2[1] * roundCut,
    ];
    const flanking0 = flankingCurve(
      roundCut,
      actualSmoothing(allowedCut0),
      p0,
      intersection0,
      intersection2,
      center,
      radius,
    );
    const flanking2 = reverseCubic(
      flankingCurve(
        roundCut,
        actualSmoothing(allowedCut1),
        p2,
        intersection2,
        intersection0,
        center,
        radius,
      ),
    );
    return [
      flanking0,
      circularArc(
        center[0],
        center[1],
        flanking0[6]!,
        flanking0[7]!,
        flanking2[0]!,
        flanking2[1]!,
      ),
      flanking2,
    ];
  };

  return { expectedRoundCut, expectedCut, getCubics };
};

/** Builds a polygon from `[x, y]` vertices, rounding each corner. */
export const createPolygon = (
  vertices: Point[],
  rounding: CornerRounding | CornerRounding[] = UNROUNDED,
  center?: Point,
): RoundedPolygon => {
  const n = vertices.length;
  const at = (i: number) => vertices[i % n]!;
  const roundingAt = (i: number) =>
    Array.isArray(rounding) ? (rounding[i] ?? UNROUNDED) : rounding;

  const corners = vertices.map((vertex, i) =>
    createCorner(at(i + n - 1), vertex, at(i + 1), roundingAt(i)),
  );

  // Shrink the cuts of any side too short to fit both of its corners' rounding.
  const cutAdjusts = vertices.map((vertex, i) => {
    const corner = corners[i]!;
    const next = corners[(i + 1) % n]!;
    const expectedRoundCut = corner.expectedRoundCut + next.expectedRoundCut;
    const expectedCut = corner.expectedCut + next.expectedCut;
    const nextVertex = at(i + 1);
    const sideSize = distance(
      vertex[0] - nextVertex[0],
      vertex[1] - nextVertex[1],
    );
    if (expectedRoundCut > sideSize) {
      return [sideSize / expectedRoundCut, 0] as const;
    }
    if (expectedCut > sideSize) {
      return [
        1,
        (sideSize - expectedRoundCut) / (expectedCut - expectedRoundCut),
      ] as const;
    }
    return [1, 1] as const;
  });

  const cornerCubics = corners.map((corner, i) => {
    const allowedCut = (delta: number) => {
      const [roundCutRatio, cutRatio] = cutAdjusts[(i + n - 1 + delta) % n]!;
      return (
        corner.expectedRoundCut * roundCutRatio +
        (corner.expectedCut - corner.expectedRoundCut) * cutRatio
      );
    };
    return corner.getCubics(allowedCut(0), allowedCut(1));
  });

  const features: Feature[] = [];
  for (let i = 0; i < n; i++) {
    const previous = at(i + n - 1);
    const current = at(i);
    const next = at(i + 1);
    const convex =
      (current[0] - previous[0]) * (next[1] - current[1]) -
        (current[1] - previous[1]) * (next[0] - current[0]) >
      0;
    const end = cornerCubics[i]!.at(-1)!;
    const start = cornerCubics[(i + 1) % n]![0]!;
    features.push(
      { cubics: cornerCubics[i]!, convex },
      { cubics: [straightLine(end[6]!, end[7]!, start[0]!, start[1]!)] },
    );
  }

  let polygonCenter = center;
  if (!polygonCenter) {
    const sum = vertices.reduce<[number, number]>(
      (total, [x, y]) => [total[0] + x, total[1] + y],
      [0, 0],
    );
    polygonCenter = [sum[0] / n, sum[1] / n];
  }
  return fromFeatures(features, polygonCenter);
};

/** `RoundedPolygon.circle`: a regular polygon rounded all the way into a circle. */
export const circlePolygon = (numVertices = 8): RoundedPolygon => {
  const polygonRadius = 1 / Math.cos(Math.PI / numVertices);
  const vertices = Array.from({ length: numVertices }, (_, i): Point => {
    const angle = (Math.PI / numVertices) * 2 * i;
    return [Math.cos(angle) * polygonRadius, Math.sin(angle) * polygonRadius];
  });
  return createPolygon(vertices, { radius: 1 }, [0, 0]);
};

/** `RoundedPolygon.star`: alternating outer and inner vertices. */
export const starPolygon = (
  numVerticesPerRadius: number,
  innerRadius: number,
  rounding: CornerRounding,
  innerRounding?: CornerRounding,
): RoundedPolygon => {
  const vertices: Point[] = [];
  const perVertexRounding: CornerRounding[] = [];
  for (let i = 0; i < numVerticesPerRadius; i++) {
    const outer = (Math.PI / numVerticesPerRadius) * 2 * i;
    const inner = (Math.PI / numVerticesPerRadius) * (2 * i + 1);
    vertices.push(
      [Math.cos(outer), Math.sin(outer)],
      [Math.cos(inner) * innerRadius, Math.sin(inner) * innerRadius],
    );
    perVertexRounding.push(rounding, innerRounding ?? rounding);
  }
  return createPolygon(vertices, perVertexRounding, [0, 0]);
};
