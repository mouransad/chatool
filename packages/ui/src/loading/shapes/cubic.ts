/*
 * TypeScript port of `androidx.graphics.shapes.Cubic` (+ the helpers in its
 * `Utils.kt`). A cubic is a flat `[a0x, a0y, c0x, c0y, c1x, c1y, a1x, a1y]` array
 * so morphing can interpolate it index-by-index with no allocation per point.
 */

export type Point = readonly [x: number, y: number];
export type Cubic = readonly number[];

export const DISTANCE_EPSILON = 1e-4;
export const ANGLE_EPSILON = 1e-6;

export const distance = (x: number, y: number) => Math.hypot(x, y);

/** Unit vector for `(x, y)`; a zero vector stays zero instead of throwing. */
export const direction = (x: number, y: number): Point => {
  const d = distance(x, y);
  return d > 0 ? [x / d, y / d] : [0, 0];
};

export const positiveModulo = (value: number, mod: number) =>
  ((value % mod) + mod) % mod;

export const pointOnCubic = (c: Cubic, t: number): Point => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * t * u * u;
  const d = 3 * t * t * u;
  const e = t * t * t;
  return [
    c[0]! * a + c[2]! * b + c[4]! * d + c[6]! * e,
    c[1]! * a + c[3]! * b + c[5]! * d + c[7]! * e,
  ];
};

export const isZeroLength = (c: Cubic) =>
  Math.abs(c[0]! - c[6]!) < DISTANCE_EPSILON &&
  Math.abs(c[1]! - c[7]!) < DISTANCE_EPSILON;

export const reverseCubic = (c: Cubic): Cubic => [
  c[6]!,
  c[7]!,
  c[4]!,
  c[5]!,
  c[2]!,
  c[3]!,
  c[0]!,
  c[1]!,
];

/** De Casteljau split at `t`. */
export const splitCubic = (c: Cubic, t: number): [Cubic, Cubic] => {
  const u = 1 - t;
  const [px, py] = pointOnCubic(c, t);
  return [
    [
      c[0]!,
      c[1]!,
      c[0]! * u + c[2]! * t,
      c[1]! * u + c[3]! * t,
      c[0]! * (u * u) + c[2]! * (2 * u * t) + c[4]! * (t * t),
      c[1]! * (u * u) + c[3]! * (2 * u * t) + c[5]! * (t * t),
      px,
      py,
    ],
    [
      px,
      py,
      c[2]! * (u * u) + c[4]! * (2 * u * t) + c[6]! * (t * t),
      c[3]! * (u * u) + c[5]! * (2 * u * t) + c[7]! * (t * t),
      c[4]! * u + c[6]! * t,
      c[5]! * u + c[7]! * t,
      c[6]!,
      c[7]!,
    ],
  ];
};

export const straightLine = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): Cubic => [
  x0,
  y0,
  x0 + (x1 - x0) / 3,
  y0 + (y1 - y0) / 3,
  x0 + ((x1 - x0) * 2) / 3,
  y0 + ((y1 - y0) * 2) / 3,
  x1,
  y1,
];

/** The cubic approximating the circular arc from `(x0, y0)` to `(x1, y1)`. */
export const circularArc = (
  centerX: number,
  centerY: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): Cubic => {
  const [d0x, d0y] = direction(x0 - centerX, y0 - centerY);
  const [d1x, d1y] = direction(x1 - centerX, y1 - centerY);
  const clockwise = -d0y * (x1 - centerX) + d0x * (y1 - centerY) >= 0;
  const cos = d0x * d1x + d0y * d1y;
  // The arc is so small that a straight line is the better approximation.
  if (cos > 0.999) return straightLine(x0, y0, x1, y1);
  const k =
    ((distance(x0 - centerX, y0 - centerY) * 4) / 3) *
    ((Math.sqrt(2 * (1 - cos)) - Math.sqrt(1 - cos * cos)) / (1 - cos)) *
    (clockwise ? 1 : -1);
  return [
    x0,
    y0,
    x0 - d0y * k,
    y0 + d0x * k,
    x1 + d1y * k,
    y1 - d1x * k,
    x1,
    y1,
  ];
};

export const transformCubic = (
  c: Cubic,
  transform: (x: number, y: number) => Point,
): Cubic => {
  const result: number[] = [];
  for (let i = 0; i < 8; i += 2) {
    const [x, y] = transform(c[i]!, c[i + 1]!);
    result.push(x, y);
  }
  return result;
};
