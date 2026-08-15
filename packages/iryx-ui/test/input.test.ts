import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Input, Label, PasswordInput, Textarea } from '../src'

describe('input', () => {
  it('wraps a text input in the field chrome', () => {
    const wrapper = mount(Input)
    // The chrome sits on the wrapper so leading/trailing content can take space.
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('h-9')
    expect(wrapper.get('input').attributes('type')).toBe('text')
  })

  it('forwards stray attributes to the input, not the wrapper', () => {
    const wrapper = mount(Input, { attrs: { autocomplete: 'off', name: 'email' } })
    expect(wrapper.get('input').attributes('name')).toBe('email')
    expect(wrapper.attributes('name')).toBeUndefined()
  })

  it('supports v-model', async () => {
    const wrapper = mount(Input, { props: { 'modelValue': '', 'onUpdate:modelValue': () => {} } })
    await wrapper.setValue('hello')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
  })

  it('applies size and invalid state', () => {
    const wrapper = mount(Input, { props: { size: 'lg', invalid: true } })
    expect(wrapper.classes()).toContain('h-10')
    expect(wrapper.classes()).toContain('border-red-500')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('renders no built-in classes when unstyled', () => {
    const wrapper = mount(Input, { props: { unstyled: true, class: 'my-input' } })
    expect(wrapper.attributes('class')).toBe('my-input')
  })

  it('renders leading and trailing slots', () => {
    const wrapper = mount(Input, {
      slots: { leading: '<span class="lead">@</span>', trailing: '<span class="trail">.com</span>' },
    })
    expect(wrapper.find('.lead').exists()).toBe(true)
    expect(wrapper.find('.trail').exists()).toBe(true)
  })

  it('shows a clear button only when clearable and non-empty', async () => {
    const wrapper = mount(Input, { props: { 'clearable': true, 'modelValue': '', 'onUpdate:modelValue': () => {} } })
    expect(wrapper.find('button').exists()).toBe(false)

    await wrapper.setProps({ modelValue: 'hello' })
    expect(wrapper.find('button').exists()).toBe(true)

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
  })

  it('shows a spinner while loading without disabling the field', () => {
    const wrapper = mount(Input, { props: { loading: true } })
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
    expect(wrapper.get('input').attributes('disabled')).toBeUndefined()
  })
})

describe('input debounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('delays the model update but shows the keystroke immediately', async () => {
    const wrapper = mount(Input, { props: { 'debounce': 300, 'modelValue': '', 'onUpdate:modelValue': () => {} } })
    const input = wrapper.get('input')

    await input.setValue('ab')
    expect(input.element.value).toBe('ab')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    vi.advanceTimersByTime(300)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['ab'])
  })

  it('emits only the last value in a burst', async () => {
    const wrapper = mount(Input, { props: { 'debounce': 300, 'modelValue': '', 'onUpdate:modelValue': () => {} } })
    const input = wrapper.get('input')

    await input.setValue('a')
    vi.advanceTimersByTime(100)
    await input.setValue('ab')
    vi.advanceTimersByTime(100)
    await input.setValue('abc')
    vi.advanceTimersByTime(300)

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['abc'])
  })

  it('flushes a pending value on blur so a submit never reads it stale', async () => {
    const wrapper = mount(Input, { props: { 'debounce': 300, 'modelValue': '', 'onUpdate:modelValue': () => {} } })
    const input = wrapper.get('input')

    await input.setValue('abc')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['abc'])
  })

  it('lets an external write cancel a pending update', async () => {
    const wrapper = mount(Input, { props: { 'debounce': 300, 'modelValue': '', 'onUpdate:modelValue': () => {} } })
    const input = wrapper.get('input')

    await input.setValue('typed')
    await wrapper.setProps({ modelValue: 'reset' })
    vi.advanceTimersByTime(300)

    expect(input.element.value).toBe('reset')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('textarea', () => {
  it('renders a textarea and forwards rows', () => {
    const wrapper = mount(Textarea, { props: { rows: 5 } })
    expect(wrapper.element.tagName).toBe('TEXTAREA')
    expect(wrapper.attributes('rows')).toBe('5')
    expect(wrapper.classes()).toContain('min-h-20')
  })

  it('supports v-model', async () => {
    const wrapper = mount(Textarea, { props: { 'modelValue': '', 'onUpdate:modelValue': () => {} } })
    await wrapper.setValue('note')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['note'])
  })
})

describe('textarea autosize', () => {
  it('drops the fixed min-height and the drag handle', () => {
    const wrapper = mount(Textarea, { props: { autosize: true } })
    expect(wrapper.classes()).toContain('resize-none')
    expect(wrapper.classes()).not.toContain('min-h-20')
  })

  it('seeds rows from the min bound instead of the rows prop', () => {
    const wrapper = mount(Textarea, { props: { autosize: { min: 3 }, rows: 9 } })
    expect(wrapper.attributes('rows')).toBe('3')
  })

  it('leaves the fixed height alone when autosize is off', () => {
    const wrapper = mount(Textarea, { props: { rows: 4 } })
    expect(wrapper.attributes('rows')).toBe('4')
    expect(wrapper.classes()).toContain('resize-y')
    expect(wrapper.element.style.height).toBe('')
  })

  it('sets an explicit height once mounted with autosize', async () => {
    const wrapper = mount(Textarea, { props: { autosize: true }, attachTo: document.body })
    await nextTick()
    expect(wrapper.element.style.height).toMatch(/px$/)
  })
})

describe('passwordInput', () => {
  it('masks by default and reveals on toggle', async () => {
    const wrapper = mount(PasswordInput)
    const input = wrapper.get('input')
    expect(input.attributes('type')).toBe('password')

    const toggle = wrapper.get('button')
    expect(toggle.attributes('aria-label')).toBe('Show password')

    await toggle.trigger('click')
    expect(wrapper.get('input').attributes('type')).toBe('text')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Hide password')
  })

  it('can drop the toggle entirely', () => {
    const wrapper = mount(PasswordInput, { props: { toggle: false } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('hides the meter until there is a value', async () => {
    const wrapper = mount(PasswordInput, {
      props: { 'strength': true, 'modelValue': '', 'onUpdate:modelValue': () => {} },
    })
    expect(wrapper.find('[role="status"]').exists()).toBe(false)

    await wrapper.setProps({ modelValue: 'abc' })
    expect(wrapper.get('[role="status"]').text()).toBe('Weak')
  })

  it('scores length and character variety', async () => {
    const wrapper = mount(PasswordInput, {
      props: { 'strength': true, 'modelValue': 'abc', 'onUpdate:modelValue': () => {} },
    })
    const label = () => wrapper.get('[role="status"]').text()
    expect(label()).toBe('Weak')

    await wrapper.setProps({ modelValue: 'abcdefgh' })
    expect(label()).toBe('Weak')

    await wrapper.setProps({ modelValue: 'Abcdefgh1' })
    expect(label()).toBe('Good')

    await wrapper.setProps({ modelValue: 'Abcdefghijkl1!' })
    expect(label()).toBe('Strong')
  })

  it('fills one segment per point of score', async () => {
    const wrapper = mount(PasswordInput, {
      props: { 'strength': true, 'modelValue': 'Abcdefgh1', 'onUpdate:modelValue': () => {} },
    })
    expect(wrapper.findAll('[data-filled]')).toHaveLength(3)

    await wrapper.setProps({ modelValue: 'Abcdefghijkl1!' })
    expect(wrapper.findAll('[data-filled]')).toHaveLength(4)
  })

  it('takes translated labels', async () => {
    const wrapper = mount(PasswordInput, {
      props: {
        'strength': true,
        'strengthLabels': ['Uno', 'Due', 'Tre', 'Quattro'],
        'showLabel': 'Mostra',
        'modelValue': 'abc',
        'onUpdate:modelValue': () => {},
      },
    })
    expect(wrapper.get('[role="status"]').text()).toBe('Uno')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Mostra')
  })

  it('forwards stray attributes to the control', () => {
    const wrapper = mount(PasswordInput, { attrs: { autocomplete: 'new-password' } })
    expect(wrapper.get('input').attributes('autocomplete')).toBe('new-password')
  })
})

describe('label', () => {
  it('renders its content and links to a field', () => {
    const wrapper = mount(Label, { props: { for: 'email' }, slots: { default: 'Email' } })
    expect(wrapper.element.tagName).toBe('LABEL')
    expect(wrapper.text()).toBe('Email')
    expect(wrapper.attributes('for')).toBe('email')
  })

  it('marks required fields', () => {
    const wrapper = mount(Label, { props: { required: true }, slots: { default: 'Name' } })
    expect(wrapper.classes().join(' ')).toContain('after:content-[\'*\']')
  })
})
