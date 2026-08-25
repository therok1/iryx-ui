import type { Ref } from 'vue'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

/**
 * The reveal every chart plays on its first paint.
 *
 * Two mechanisms, because the marks are not all the same kind of thing. A bar
 * or a line can be revealed by a CSS transition on a transform or a dash
 * offset — the browser animates it off the main thread and Vue never renders
 * a second time. A donut cannot: `d` is not an animatable property, so
 * sweeping one open means recomputing the path, which needs a value per frame.
 *
 * Both play **once**, on the first paint with something to draw. A live
 * dashboard whose data updates every few seconds would otherwise re-animate
 * on every poll, which reads as a fault rather than as polish.
 */

/** Long enough to be seen finishing, short enough not to delay reading. */
export const REVEAL_DURATION = 700

/**
 * The curves on offer.
 *
 * A closed set rather than any CSS timing function, because the same curve
 * has to be evaluated two ways: handed to a CSS transition as a string, and
 * solved in JavaScript for the charts that animate their geometry. One set of
 * control points feeds both, so the two mechanisms stay in step.
 */
export type ChartEasing = 'ease-out' | 'ease-in' | 'ease-in-out' | 'linear'

const CURVES: Record<ChartEasing, readonly [number, number, number, number]> = {
  // Most of the distance early, settling at the end. The default: it reads as
  // the chart arriving rather than as the chart being drawn.
  'ease-out': [0.22, 1, 0.36, 1],
  /*
   * A gentle one. The textbook ease-in puts its second control point at
   * x = 1, which leaves the curve vertical at the finish: the reveal crawls
   * for most of its duration and then snaps the last third in a couple of
   * frames. Pulling that point inside the box bounds the closing speed, and a
   * little lift on the first point stops the opening being a dead stop.
   */
  'ease-in': [0.4, 0.05, 0.7, 0.65],
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
 * By bisection rather than Newton-Raphson: twenty halvings land inside a
 * thousandth of a pixel's worth of progress, it cannot diverge on the curves
 * with near-vertical starts, and it is a third of the code.
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

/** The one place a chart's `animate` prop is turned into numbers. */
export function useChartAnimation(animate: Ref<ChartAnimate | undefined>) {
  return computed<ResolvedAnimation>(() => {
    const value = animate.value ?? true
    const options = typeof value === 'object' ? value : {}
    const easing = options.easing ?? 'ease-out'
    const points = CURVES[easing] ?? CURVES['ease-out']

    return {
      enabled: value !== false,
      // A zero or negative duration is "no animation" rather than an error.
      duration: Math.max(options.duration ?? REVEAL_DURATION, 0),
      css: `cubic-bezier(${points.join(', ')})`,
      ease: bezier(points),
    }
  })
}

/**
 * Motion is a preference, and a chart is information first. Read at the
 * moment of the reveal rather than watched: this decides whether to animate
 * once, and a chart already on screen should not restart because the setting
 * changed underneath it.
 */
function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** No `requestAnimationFrame` on the server, and nothing there to animate. */
function canAnimate(animation: ResolvedAnimation): boolean {
  return animation.enabled
    && animation.duration > 0
    && typeof requestAnimationFrame !== 'undefined'
    && !prefersReducedMotion()
}

/**
 * A flag for CSS-driven charts: `false` for the first painted frame, `true`
 * from the next one, which is what makes a transition run.
 *
 * `ready` is the chart's own "there is something to draw" — a measured width
 * and at least one mark. Flipping on mount instead would animate an empty box
 * and be over by the time the `ResizeObserver` reports.
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

/**
 * A value from 0 to 1 for charts whose marks have to be recomputed to be
 * revealed. Eased, so it can be applied to geometry directly.
 */
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

    // Read once, at the start: retuning the curve halfway through a reveal
    // would make it jump.
    const { duration, ease } = animation.value

    // The first frame's timestamp is the start, so the clock begins when the
    // browser is actually ready to paint rather than when this was scheduled.
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
