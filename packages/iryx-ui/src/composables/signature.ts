/** One sampled point of a stroke. `t` is what makes the width vary. */
export interface SignaturePoint {
  x: number
  y: number
  /** Milliseconds since the stroke began. */
  t: number
  /** 0–1 where the hardware reports it; 0.5 is what a mouse sends. */
  pressure: number
}

/** A single continuous mark — one pen-down to pen-up. */
export type SignatureStroke = SignaturePoint[]

/**
 * How wide the pen is between two points.
 *
 * A constant width reads as a traced outline rather than handwriting: real
 * ink thins as the hand speeds up. Speed is measured in pixels per
 * millisecond and mapped onto a shrinking multiplier, then blended with
 * pressure where the hardware reports it.
 */
export function strokeWidth(base: number, from: SignaturePoint, to: SignaturePoint): number {
  const distance = Math.hypot(to.x - from.x, to.y - from.y)
  const elapsed = Math.max(to.t - from.t, 1)
  const speed = distance / elapsed

  // Fast strokes thin to 40%, slow ones swell to 120%. Clamped so a flick or
  // a pause never collapses the line or blobs it.
  const fromSpeed = clamp(1.2 - speed * 0.35, 0.4, 1.2)

  // A mouse reports a flat 0.5, so pressure only pulls the width around when
  // it is genuinely varying.
  const fromPressure = 0.7 + to.pressure * 0.6

  return base * fromSpeed * fromPressure
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Whether anything has actually been drawn. A stray tap is not a signature. */
export function hasInk(strokes: SignatureStroke[]): boolean {
  return strokes.some(stroke => stroke.length > 1)
}
