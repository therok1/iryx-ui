import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Carousel } from '../src'

const items = ['One', 'Two', 'Three']

/**
 * jsdom lays nothing out: every element is zero-sized and `scrollTo` does not
 * exist. These stub the parts the component reads, so the index maths and the
 * edge state can be tested without a browser — the geometry itself is the
 * browser's job, and `scroll-snap` is doing it.
 */
function mountCarousel(options: { width?: number, slide?: number } = {}) {
  const width = options.width ?? 100
  const slide = options.slide ?? 100

  const wrapper = mount(Carousel, {
    props: { items, label: 'Stories' },
    slots: { default: '<span>{{ params.item }}</span>' },
  })

  const track = wrapper.find('[tabindex="0"]').element as HTMLElement
  const scrollTo = vi.fn(({ left }: { left: number }) => {
    Object.defineProperty(track, 'scrollLeft', { value: left, configurable: true, writable: true })
    track.dispatchEvent(new Event('scroll'))
  })

  Object.defineProperties(track, {
    clientWidth: { value: width, configurable: true },
    scrollWidth: { value: slide * items.length, configurable: true },
    scrollLeft: { value: 0, configurable: true, writable: true },
    offsetLeft: { value: 0, configurable: true },
    scrollTo: { value: scrollTo, configurable: true },
  })

  for (const [index, child] of [...track.children].entries())
    Object.defineProperty(child, 'offsetLeft', { value: index * slide, configurable: true })

  // The edges were measured on mount, when every box was still zero-sized.
  // A scroll event is what the composable listens to, so it re-measures.
  track.dispatchEvent(new Event('scroll'))

  return { wrapper, track, scrollTo }
}

describe('carousel', () => {
  it('names itself as a carousel and each slide within it', () => {
    const { wrapper } = mountCarousel()
    expect(wrapper.attributes('aria-roledescription')).toBe('carousel')
    expect(wrapper.attributes('aria-label')).toBe('Stories')

    const slides = wrapper.findAll('[aria-roledescription="slide"]')
    expect(slides).toHaveLength(3)
    expect(slides[0]!.attributes('aria-label')).toBe('1 of 3')
    expect(slides[2]!.attributes('aria-label')).toBe('3 of 3')
  })

  /* A region that scrolls has to be reachable without a mouse. */
  it('makes the track focusable', () => {
    const { wrapper } = mountCarousel()
    expect(wrapper.find('[tabindex="0"]').exists()).toBe(true)
  })

  it('renders each item through the default slot', () => {
    const { wrapper } = mountCarousel()
    expect(wrapper.text()).toContain('One')
    expect(wrapper.text()).toContain('Three')
  })

  it('scrolls to the slide a dot names', async () => {
    const { wrapper, scrollTo } = mountCarousel()
    await wrapper.findAll('[aria-label^="Go to slide"]')[2]!.trigger('click')
    expect(scrollTo).toHaveBeenCalledWith({ left: 200 })
    expect(wrapper.emitted('update:active')?.at(-1)).toEqual([2])
  })

  /*
   * `data-state` is the styling hook, the way Reka's own components expose
   * theirs; `aria-current` is the part assistive technology reads. Both, and
   * on both the dot and the slide, so a caller can style either.
   */
  it('marks the dot for the slide in view', async () => {
    const { wrapper } = mountCarousel()
    await wrapper.findAll('[aria-label^="Go to slide"]')[1]!.trigger('click')

    const dots = wrapper.findAll('[aria-label^="Go to slide"]')
    expect(dots.map(dot => dot.attributes('data-state')))
      .toEqual(['inactive', 'active', 'inactive'])
    expect(dots.filter(dot => dot.attributes('aria-current') === 'true')).toHaveLength(1)
  })

  /*
   * Smooth scrolling fires `scroll` the whole way, and every slide passed is
   * briefly the nearest — so a jump would light each dot in turn en route.
   */
  it('does not light the dots it passes on the way to a distant slide', async () => {
    const { wrapper, track } = mountCarousel()
    const activeDot = () => wrapper.findAll('[aria-label^="Go to slide"]')
      .findIndex(dot => dot.attributes('data-state') === 'active')

    // A smooth scroll that has not landed yet: the request is made, the
    // position has not reached the target, and `scroll` fires along the way.
    Object.defineProperty(track, 'scrollTo', { value: () => {}, configurable: true })
    await wrapper.findAll('[aria-label^="Go to slide"]')[2]!.trigger('click')
    expect(activeDot()).toBe(2)

    Object.defineProperty(track, 'scrollLeft', { value: 100, configurable: true, writable: true })
    track.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(activeDot()).toBe(2)

    // On arrival the guard lifts, and a later scroll of the reader's own moves
    // it again.
    Object.defineProperty(track, 'scrollLeft', { value: 200, configurable: true, writable: true })
    track.dispatchEvent(new Event('scroll'))
    Object.defineProperty(track, 'scrollLeft', { value: 0, configurable: true, writable: true })
    track.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(activeDot()).toBe(0)
  })

  it('marks the slide in view as well as its dot', async () => {
    const { wrapper } = mountCarousel()
    await wrapper.findAll('[aria-label^="Go to slide"]')[2]!.trigger('click')
    expect(wrapper.findAll('[aria-roledescription="slide"]').map(s => s.attributes('data-state')))
      .toEqual(['inactive', 'inactive', 'active'])
  })

  it('steps with the arrow keys', async () => {
    const { wrapper, scrollTo } = mountCarousel()
    await wrapper.find('[tabindex="0"]').trigger('keydown', { key: 'ArrowRight' })
    expect(scrollTo).toHaveBeenCalledWith({ left: 100 })

    await wrapper.find('[tabindex="0"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0 })
  })

  it('does not step past either end', async () => {
    const { wrapper, scrollTo } = mountCarousel()
    await wrapper.find('[tabindex="0"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(scrollTo).toHaveBeenCalledWith({ left: 0 })

    for (let i = 0; i < 5; i++)
      await wrapper.find('[tabindex="0"]').trigger('keydown', { key: 'ArrowRight' })

    expect(scrollTo).toHaveBeenLastCalledWith({ left: 200 })
  })

  /*
   * Measured, not derived from the index: a partly visible last slide reaches
   * the end of the scroll before the index reaches the last slide.
   */
  it('disables the arrows at the ends', async () => {
    const { wrapper } = mountCarousel()
    await nextTick()
    const previous = () => wrapper.find('[aria-label="Previous"]')
    expect(previous().attributes('disabled')).toBeDefined()

    await wrapper.findAll('[aria-label^="Go to slide"]')[2]!.trigger('click')
    expect(previous().attributes('disabled')).toBeUndefined()
    expect(wrapper.find('[aria-label="Next"]').attributes('disabled')).toBeDefined()
  })

  it('hides the arrows when everything already fits', async () => {
    const { wrapper } = mountCarousel({ width: 500, slide: 100 })
    await nextTick()
    expect(wrapper.find('[aria-label="Next"]').exists()).toBe(false)
  })

  /* The model drives the track, not only reports it — an autoplay timer, a
   * thumbnail strip and a router all set it from outside. */
  it('scrolls when the model is set from outside', async () => {
    const { wrapper, scrollTo } = mountCarousel()
    await wrapper.setProps({ active: 2 })
    expect(scrollTo).toHaveBeenCalledWith({ left: 200 })
  })

  /*
   * With several across, the last slides can never reach the start of the
   * track — a dot each would leave the trailing ones dead. One per scroll
   * position instead.
   */
  it('gives a dot to each place the track can stop at', async () => {
    const wrapper = mount(Carousel, {
      props: { items: ['One', 'Two', 'Three', 'Four'], perView: 2, label: 'Stories' },
      slots: { default: '<span>{{ params.item }}</span>' },
    })

    const track = wrapper.find('[tabindex="0"]').element as HTMLElement
    Object.defineProperties(track, {
      clientWidth: { value: 200, configurable: true },
      scrollWidth: { value: 400, configurable: true },
      scrollLeft: { value: 0, configurable: true, writable: true },
      offsetLeft: { value: 0, configurable: true },
    })
    for (const [index, child] of [...track.children].entries())
      Object.defineProperty(child, 'offsetLeft', { value: index * 100, configurable: true })

    track.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect(wrapper.findAll('[aria-label^="Go to slide"]')).toHaveLength(3)
  })

  describe('dragging', () => {
    function drag(track: HTMLElement, from: number, to: number, pointerType = 'mouse') {
      track.setPointerCapture = () => {}
      track.releasePointerCapture = () => {}
      track.dispatchEvent(new PointerEvent('pointerdown', { clientX: from, pointerType, bubbles: true }))
      track.dispatchEvent(new PointerEvent('pointermove', { clientX: to, pointerType, bubbles: true }))
    }

    it('pans the track with a mouse', async () => {
      const { wrapper, track } = mountCarousel()
      Object.defineProperty(track, 'scrollLeft', { value: 0, configurable: true, writable: true })

      drag(track, 300, 220)
      // Dragged 80px to the left, so the track scrolls 80px to the right.
      expect(track.scrollLeft).toBe(80)

      await nextTick()
      expect(wrapper.find('[tabindex="0"]').classes()).toContain('cursor-grabbing')
    })

    /* Touch already pans natively, with momentum this could not match. */
    it('leaves touch alone', () => {
      const { track } = mountCarousel()
      Object.defineProperty(track, 'scrollLeft', { value: 0, configurable: true, writable: true })

      drag(track, 300, 220, 'touch')
      expect(track.scrollLeft).toBe(0)
    })

    it('can be turned off', async () => {
      const { wrapper, track } = mountCarousel()
      await wrapper.setProps({ draggable: false })
      Object.defineProperty(track, 'scrollLeft', { value: 0, configurable: true, writable: true })

      drag(track, 300, 220)
      expect(track.scrollLeft).toBe(0)
    })

    /*
     * The landing is decided here rather than left to the browser's snapping,
     * which is what makes the threshold adjustable at all.
     */
    it('moves on once the drag clears the threshold', async () => {
      const { wrapper, track } = mountCarousel()
      Object.defineProperty(track, 'scrollLeft', { value: 0, configurable: true, writable: true })

      // A third of a slide: past the default quarter.
      drag(track, 300, 267)
      track.dispatchEvent(new PointerEvent('pointerup', { clientX: 267, pointerType: 'mouse', bubbles: true }))
      await nextTick()
      expect(wrapper.emitted('update:active')?.at(-1)).toEqual([1])
    })

    it('springs back when it does not', async () => {
      const { wrapper, track } = mountCarousel()
      Object.defineProperty(track, 'scrollLeft', { value: 0, configurable: true, writable: true })

      // A tenth of a slide: short of the quarter.
      drag(track, 300, 290)
      track.dispatchEvent(new PointerEvent('pointerup', { clientX: 290, pointerType: 'mouse', bubbles: true }))
      await nextTick()
      expect(wrapper.emitted('update:active')?.at(-1) ?? [0]).toEqual([0])
    })

    it('honours a threshold of its own', async () => {
      const { wrapper, track } = mountCarousel()
      await wrapper.setProps({ dragThreshold: 0.75 })
      Object.defineProperty(track, 'scrollLeft', { value: 0, configurable: true, writable: true })

      // The same third of a slide, now short of the demanded three quarters.
      drag(track, 300, 267)
      track.dispatchEvent(new PointerEvent('pointerup', { clientX: 267, pointerType: 'mouse', bubbles: true }))
      await nextTick()
      expect(wrapper.emitted('update:active')?.at(-1) ?? [0]).toEqual([0])
    })

    /* Snapping is off while dragging, or the browser fights every frame. */
    it('suspends snapping only while the pointer is down', async () => {
      const { wrapper, track } = mountCarousel()
      const classes = () => wrapper.find('[tabindex="0"]').classes()
      expect(classes()).toContain('snap-mandatory')

      drag(track, 300, 220)
      await nextTick()
      expect(classes()).toContain('snap-none')

      track.dispatchEvent(new PointerEvent('pointerup', { clientX: 220, pointerType: 'mouse', bubbles: true }))
      await nextTick()
      expect(classes()).toContain('snap-mandatory')
    })
  })

  it('drops every built-in class under unstyled', () => {
    const wrapper = mount(Carousel, { props: { items, unstyled: true, class: 'mine' } })
    expect(wrapper.classes()).toEqual(['mine'])
  })
})
