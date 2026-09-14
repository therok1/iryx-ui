import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Calendar, commonDateRangePresets, DatePicker, DateRangePicker, formatIsoDate, isoToday, toCalendarDate, toIsoDate } from '../src'

// The calendars portal into document.body, so a left-over popover from an
// earlier test would be counted by the next one's queries.
enableAutoUnmount(afterEach)

describe('date helpers', () => {
  it('round-trips an ISO date without shifting the day', () => {
    const date = toCalendarDate('2026-08-15')!
    expect(date.year).toBe(2026)
    expect(date.month).toBe(8)
    expect(date.day).toBe(15)
    expect(toIsoDate(date)).toBe('2026-08-15')
  })

  it('pads single-digit months and days', () => {
    expect(toIsoDate(toCalendarDate('2026-01-05'))).toBe('2026-01-05')
  })

  /**
   * The whole reason the model is a string: a `Date` would resolve
   * `2026-08-15` to UTC midnight and render as the 14th west of Greenwich.
   */
  it('treats the date as a calendar day, not a timestamp', () => {
    expect(formatIsoDate('2026-08-15', 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }))
      .toBe('15 August 2026')
  })

  it('resolves malformed input to no selection rather than throwing', () => {
    for (const bad of ['', null, undefined, 'nonsense', '15/08/2026', '2026-8-15', '2026-13-01']) {
      expect(toCalendarDate(bad)).toBeUndefined()
      expect(formatIsoDate(bad)).toBe('')
    }
  })

  it('formats for the requested locale', () => {
    expect(formatIsoDate('2026-08-15', 'en-US', { month: 'short', day: 'numeric' })).toBe('Aug 15')
    expect(formatIsoDate('2026-08-15', 'de-DE', { month: 'short', day: 'numeric' })).toContain('15')
  })

  it('produces a parseable today', () => {
    expect(toCalendarDate(isoToday())).toBeDefined()
  })
})

describe('datePicker', () => {
  it('shows the placeholder until a date is picked', async () => {
    const wrapper = mount(DatePicker, {
      props: { 'placeholder': 'Pick a date', 'modelValue': null, 'onUpdate:modelValue': () => {} },
      attachTo: document.body,
    })
    expect(wrapper.text()).toContain('Pick a date')

    await wrapper.setProps({ modelValue: '2026-08-15' })
    expect(wrapper.text()).not.toContain('Pick a date')
    expect(wrapper.text()).toContain('2026')
  })

  it('renders the value in the requested locale and format', () => {
    const wrapper = mount(DatePicker, {
      props: { modelValue: '2026-08-15', locale: 'en-GB', format: { day: 'numeric', month: 'long', year: 'numeric' } },
      attachTo: document.body,
    })
    expect(wrapper.text()).toContain('15 August 2026')
  })

  it('falls back to the placeholder for a malformed model', () => {
    const wrapper = mount(DatePicker, {
      props: { modelValue: 'not-a-date', placeholder: 'Pick a date' },
      attachTo: document.body,
    })
    expect(wrapper.text()).toContain('Pick a date')
  })

  it('opens the calendar on click and emits an ISO string', async () => {
    const wrapper = mount(DatePicker, {
      props: { 'modelValue': '2026-08-15', 'onUpdate:modelValue': () => {} },
      attachTo: document.body,
    })
    await wrapper.get('button').trigger('click')
    await nextTick()

    const day = document.querySelectorAll('[data-reka-calendar-cell-trigger]')
    expect(day.length).toBeGreaterThan(0)

    const target = [...day].find(el => el.textContent?.trim() === '20') as HTMLElement
    target.click()
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')?.at(-1)?.[0]
    expect(emitted).toBe('2026-08-20')
  })

  it('marks itself invalid for the form layer', () => {
    const wrapper = mount(DatePicker, { props: { invalid: true }, attachTo: document.body })
    expect(wrapper.get('button').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('button').classes()).toContain('border-red-500')
  })
})

describe('dateRangePicker', () => {
  it('shows the placeholder until a range is picked', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        'placeholder': 'Pick a range',
        'modelValue': { start: null, end: null },
        'onUpdate:modelValue': () => {},
      },
      attachTo: document.body,
    })
    expect(wrapper.text()).toContain('Pick a range')

    await wrapper.setProps({ modelValue: { start: '2026-08-01', end: '2026-08-31' } })
    expect(wrapper.text()).not.toContain('Pick a range')
  })

  it('renders both ends around the separator', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { start: '2026-08-01', end: '2026-08-31' },
        locale: 'en-GB',
        format: { day: 'numeric', month: 'short' },
        separator: ' to ',
      },
      attachTo: document.body,
    })
    expect(wrapper.text()).toContain('1 Aug to 31 Aug')
  })

  /**
   * Regression: closing was driven by `start && end` on a computed whose
   * getter rebuilt `{ start, end }` on every read. The identity churn made
   * Reka drop the half-finished selection, so picking a new start over an
   * existing range shut the calendar before an end could be chosen.
   */
  it('stays open while only the start is chosen', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        'modelValue': { start: '2026-08-01', end: '2026-08-31' },
        'onUpdate:modelValue': () => {},
      },
      attachTo: document.body,
    })
    await wrapper.get('button').trigger('click')
    await nextTick()
    expect(document.querySelectorAll('[data-reka-calendar-cell-trigger]').length).toBeGreaterThan(0)

    await wrapper.setProps({ modelValue: { start: '2026-08-10', end: null } })
    await nextTick()
    expect(document.querySelectorAll('[data-reka-calendar-cell-trigger]').length).toBeGreaterThan(0)
  })

  it('closes once both ends are set', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        'modelValue': { start: null, end: null },
        'onUpdate:modelValue': () => {},
      },
      attachTo: document.body,
    })
    await wrapper.get('button').trigger('click')
    await nextTick()
    expect(document.querySelectorAll('[data-reka-calendar-cell-trigger]').length).toBeGreaterThan(0)

    await wrapper.setProps({ modelValue: { start: '2026-08-10', end: '2026-08-18' } })
    // Two flushes: one for the watcher to set `open`, one for the unmount.
    await flushPromises()
    await flushPromises()
    expect(document.querySelectorAll('[data-reka-calendar-cell-trigger]').length).toBe(0)
  })

  it('renders every month at a fixed six weeks so months align', async () => {
    const wrapper = mount(DateRangePicker, {
      props: { modelValue: { start: '2026-08-01', end: '2026-08-31' }, months: 2 },
      attachTo: document.body,
    })
    await wrapper.get('button').trigger('click')
    await nextTick()
    // 2 months x 6 weeks x 7 days. Ragged months would stretch under flex.
    expect(document.querySelectorAll('[data-reka-calendar-cell-trigger]')).toHaveLength(84)
  })

  it('renders a half-picked range without a dangling separator', () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { start: '2026-08-01', end: null },
        locale: 'en-GB',
        format: { day: 'numeric', month: 'short' },
        separator: ' to ',
      },
      attachTo: document.body,
    })
    expect(wrapper.text()).toContain('1 Aug')
    expect(wrapper.text()).not.toContain('to')
  })
})

describe('commonDateRangePresets', () => {
  afterEach(() => vi.useRealTimers())

  function resolved(labels?: Parameters<typeof commonDateRangePresets>[0]) {
    return commonDateRangePresets(labels).map(preset => [
      preset.label,
      typeof preset.range === 'function' ? preset.range() : preset.range,
    ])
  }

  it('builds the usual ranges relative to today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 14, 12))
    expect(resolved()).toEqual([
      ['Today', { start: '2026-09-14', end: '2026-09-14' }],
      ['Yesterday', { start: '2026-09-13', end: '2026-09-13' }],
      ['Last 7 days', { start: '2026-09-08', end: '2026-09-14' }],
      ['Last 30 days', { start: '2026-08-16', end: '2026-09-14' }],
      ['This month', { start: '2026-09-01', end: '2026-09-30' }],
      ['Last month', { start: '2026-08-01', end: '2026-08-31' }],
    ])
  })

  // "Last month" in March must be February, including its short length.
  it('handles a short previous month', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 2, 3, 12))
    expect(resolved().at(-1)).toEqual(['Last month', { start: '2026-02-01', end: '2026-02-28' }])
  })

  it('takes translated labels', () => {
    expect(resolved({ today: 'Danes' })[0]![0]).toBe('Danes')
  })
})

describe('dateRangePicker presets', () => {
  const august = { label: 'August', range: { start: '2026-08-01', end: '2026-08-31' } }

  async function open(props: Record<string, unknown>) {
    const wrapper = mount(DateRangePicker, {
      props: { 'modelValue': { start: null, end: null }, 'onUpdate:modelValue': () => {}, ...props },
      attachTo: document.body,
    })
    await wrapper.get('button').trigger('click')
    await nextTick()
    return wrapper
  }

  function presetButtons() {
    return [...document.querySelectorAll<HTMLButtonElement>('[role="group"][aria-label="Presets"] button')]
  }

  it('lists presets beside the calendar', async () => {
    await open({ presets: [august, { label: 'Q3', range: { start: '2026-07-01', end: '2026-09-30' } }] })
    expect(presetButtons().map(b => b.textContent?.trim())).toEqual(['August', 'Q3'])
  })

  it('renders no preset list without presets', async () => {
    await open({})
    expect(presetButtons()).toHaveLength(0)
  })

  it('fills the range and closes when a preset is picked', async () => {
    const wrapper = await open({ presets: [august] })
    presetButtons()[0]!.click()
    await flushPromises()
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([{ start: '2026-08-01', end: '2026-08-31' }])
    expect(document.querySelectorAll('[data-reka-calendar-cell-trigger]').length).toBe(0)
  })

  it('marks the preset matching the current range', async () => {
    await open({ presets: [august], modelValue: { start: '2026-08-01', end: '2026-08-31' } })
    expect(presetButtons()[0]!.getAttribute('aria-pressed')).toBe('true')
  })

  it('disables a preset outside min or max', async () => {
    await open({ presets: [august], min: '2026-08-15' })
    expect(presetButtons()[0]!.disabled).toBe(true)
  })

  // A tab left open overnight must not keep yesterday's "Today".
  it('re-runs a function preset when the picker opens', async () => {
    const range = vi.fn(() => ({ start: '2026-09-14', end: '2026-09-14' }))
    await open({ presets: [{ label: 'Today', range }] })
    expect(range).toHaveBeenCalled()
  })

  it('takes a translated group label', async () => {
    await open({ presets: [august], presetsLabel: 'Hitre izbire' })
    expect(document.querySelector('[role="group"][aria-label="Hitre izbire"]')).not.toBeNull()
  })
})

describe('calendar', () => {
  function mountCalendar(props: Record<string, unknown> = {}) {
    return mount(Calendar, {
      props: { modelValue: '2026-08-15', ...props },
      attachTo: document.body,
    })
  }

  it('renders the month of the selected date, inline', () => {
    const wrapper = mountCalendar()
    expect(wrapper.text()).toContain('August 2026')
    // Inline: no trigger, no portal — the grid is the component.
    expect(wrapper.find('table').exists()).toBe(true)
  })

  it('marks the selected day', () => {
    const wrapper = mountCalendar()
    expect(wrapper.get('[data-selected]').text()).toBe('15')
  })

  it('emits an ISO string when a day is picked', async () => {
    const wrapper = mountCalendar()
    const days = wrapper.findAll('[data-reka-calendar-cell-trigger]')
    await days.find(day => day.text() === '20')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-08-20'])
  })

  /** The caller works in ISO strings; Reka's predicate takes a DateValue. */
  it('takes an unavailability predicate in ISO strings', () => {
    const seen: string[] = []
    const wrapper = mountCalendar({
      isUnavailable: (date: string) => {
        seen.push(date)
        return date === '2026-08-20'
      },
    })
    expect(seen).toContain('2026-08-20')
    expect(wrapper.find('[data-unavailable]').text()).toBe('20')
  })

  it('shows several months side by side', () => {
    const wrapper = mountCalendar({ months: 2 })
    expect(wrapper.findAll('table')).toHaveLength(2)
  })

  /**
   * Without it the calendar changes height as you page through, which moves
   * everything below it. On by default for that reason.
   */
  it('keeps every month six rows tall by default', () => {
    const wrapper = mountCalendar({ modelValue: '2026-02-10' })
    expect(wrapper.findAll('tbody tr')).toHaveLength(6)
  })

  /**
   * Otherwise a calendar for next month's appointments opens on this month
   * with every day disabled, and the reader has to work out that the fix is
   * to page forward.
   */
  it('opens inside the bounds when nothing is selected', () => {
    const wrapper = mount(Calendar, {
      props: { modelValue: null, min: '2027-03-01', max: '2027-04-30' },
      attachTo: document.body,
    })
    expect(wrapper.text()).toContain('March 2027')
  })

  it('drops every built-in class when unstyled', () => {
    const wrapper = mountCalendar({ unstyled: true })
    expect(wrapper.get('table').classes()).toHaveLength(0)
  })
})
