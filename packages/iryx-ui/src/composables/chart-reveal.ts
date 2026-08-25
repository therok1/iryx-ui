import type { Ref } from 'vue'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

/**
 * The reveal every chart plays on its first paint, once per instance — a
 * dashboard that re-animated on every poll would read as a fault.
 *
 * A CSS transition where the marks can be transformed, a per-frame value
 * where they cannot: `d` is not an animatable property, so a donut has to
 * recompute its geometry.
 */

export const REVEAL_DURATION = 700

/**
 * A closed set rather than any CSS timing function: the same curve is handed
 * to CSS as a string and solved in JavaScript for the donut, so both come
 * from one set of control points.
 */
export type ChartEasing = 'ease-out' | 'ease-in' | 'ease-in-out' | 'linear'

const CURVES: Record<ChartEasing, readonly [number, number, number, number]> = {
  'ease-out': [0.16, 1, 0.3, 1],
  'ease-in': [0.7, 0, 0.84, 0],
  'ease-in-out': [0.65, 0, 0.35, 1],
  'linear': [0, 0, 1, 1],
}

export interface ChartAnimation {
  /** How long the reveal runs, in ms. */
  duration?: number
  easing?: ChartEasing
}

/** `false` turns the reveal off; an object tunes it. */
export type ChartAnimate = boolean | ChartAnimation

export interface ResolvedAnimation {
  enabled: boolean
  duration: number
  /** The curve as a CSS timing function. */
  css: string
  /** The same curve, solved: progress in, eased progress out. */
  ease: (t: number) => number
}

/**
 * Solve a cubic Bézier for `y` at a given `x`, with the endpoints pinned at
 * (0,0) and (1,1) as CSS does.
 *
 * Bisection rather than Newton-Raphson: it cannot diverge on the curves with
 * near-vertical starts, and twenty halvings is well past sub-pixel.
 */
function bezier([x1, y1, x2, y2]: readonly [number, number, number, number]) {
  const axis = (a: number, b: number, t: number) => {
    const inverse = 1 - t
    return 3 * inverse * inverse * t * a + 3 * inverse * t * t * b + t * t * t
  }

  return (x: number): number => {
    if (x <= 0)
      return 0
    if (x >= 1)
      return 1

    let low = 0
    let high = 1
    let t = x
    for (let i = 0; i < 20; i++) {
      const at = axis(x1, x2, t)
      if (at < x)
        low = t
      else
        high = t
      t = (low + high) / 2
    }
    return axis(y1, y2, t)
  }
}

export function useChartAnimation(animate: Ref<ChartAnimate | undefined>) {
  return computed<ResolvedAnimation>(() => {
    const value = animate.value ?? true
    const options = typeof value === 'object' ? value : {}
    const easing = options.easing ?? 'ease-out'
    const points = CURVES[easing] ?? CURVES['ease-out']

    return {
      enabled: value !== false,
      duration: Math.max(options.duration ?? REVEAL_DURATION, 0),
      css: `cubic-bezier(${points.join(', ')})`,
      ease: bezier(points),
    }
  })
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function canAnimate(animation: ResolvedAnimation): boolean {
  return animation.enabled
    && animation.duration > 0
    && typeof requestAnimationFrame !== 'undefined'
    && !prefersReducedMotion()
}

/**
 * `false` for the first painted frame, `true` from the next — which is what
 * makes a transition run. Gated on `ready` rather than on mount: a chart with
 * no measured width yet would animate an empty box and be finished before the
 * `ResizeObserver` reported.
 */
export function useChartReveal(ready: Ref<boolean>, animation: Ref<ResolvedAnimation>) {
  const revealed = ref(false)
  let played = false

  watch(ready, (value) => {
    if (!value || played)
      return
    played = true

    if (!canAnimate(animation.value)) {
      revealed.value = true
      return
    }

    /*
     * Two frames, not one. The from-state has to be committed to the DOM
     * before the to-state arrives, or the browser coalesces both into the
     * same style recalculation and there is no transition to run.
     */
    requestAnimationFrame(() => requestAnimationFrame(() => {
      revealed.value = true
    }))
  }, { immediate: true })

  return { revealed }
}

/** Eased 0 to 1, for marks that have to be recomputed to be revealed. */
export function useChartProgress(ready: Ref<boolean>, animation: Ref<ResolvedAnimation>) {
  const progress = ref(0)
  let played = false
  let frame: number | undefined

  watch(ready, (value) => {
    if (!value || played)
      return
    played = true

    if (!canAnimate(animation.value)) {
      progress.value = 1
      return
    }

    const { duration, ease } = animation.value

    let start: number | undefined
    function step(now: number): void {
      start ??= now
      const elapsed = Math.min((now - start) / duration, 1)
      progress.value = ease(elapsed)
      if (elapsed < 1)
        frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
  }, { immediate: true })

  onBeforeUnmount(() => {
    if (frame != null)
      cancelAnimationFrame(frame)
  })

  return { progress }
}
