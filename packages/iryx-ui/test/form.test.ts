import type { StandardSchemaLike } from '../src'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, reactive } from 'vue'
import { Form, FormField, Input } from '../src'

/**
 * A hand-rolled Standard Schema validator — proves the integration works
 * against the spec rather than against one specific library.
 */
function emailSchema(): StandardSchemaLike {
  return {
    '~standard': {
      version: 1,
      vendor: 'test',
      validate: (value: unknown) => {
        const state = value as { email?: string, name?: string }
        const issues = []
        if (!state.email)
          issues.push({ message: 'Email is required', path: ['email'] })
        else if (!state.email.includes('@'))
          issues.push({ message: 'Must be a valid email', path: ['email'] })
        if (state.name !== undefined && state.name.length < 2)
          issues.push({ message: 'Too short', path: ['name'] })
        return issues.length ? { issues } : { value: state }
      },
    },
  }
}

function mountForm(state: Record<string, unknown>, formProps: Record<string, unknown> = {}) {
  const onSubmit = vi.fn()
  const onError = vi.fn()
  const wrapper = mount(defineComponent({
    setup() {
      return () => h(
        Form as any,
        { state, schema: emailSchema(), onSubmit, onError, ...formProps },
        {
          default: () => [
            h(FormField, { name: 'email', label: 'Email' }, {
              default: () => h(Input, {
                'modelValue': (state as any).email,
                'onUpdate:modelValue': (v: string | number | null | undefined) => { (state as any).email = v },
              }),
            }),
          ],
        },
      )
    },
  }), { attachTo: document.body })
  return { wrapper, onSubmit, onError }
}

describe('form', () => {
  it('renders a form with the field label wired to the control', () => {
    const state = reactive({ email: '' })
    const { wrapper } = mountForm(state)
    const input = wrapper.get('input')
    expect(wrapper.get('label').attributes('for')).toBe(input.attributes('id'))
  })

  it('blocks submit and emits error when the schema fails', async () => {
    const state = reactive({ email: '' })
    const { wrapper, onSubmit, onError } = mountForm(state)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledOnce()
    expect(wrapper.text()).toContain('Email is required')
  })

  it('submits the state when validation passes', async () => {
    const state = reactive({ email: 'rok@example.com' })
    const { wrapper, onSubmit, onError } = mountForm(state)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(onError).not.toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith({ data: state })
  })

  it('marks the control invalid and links the message with aria-describedby', async () => {
    const state = reactive({ email: 'nope' })
    const { wrapper } = mountForm(state)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    const input = wrapper.get('input')
    expect(input.attributes('aria-invalid')).toBe('true')
    // The red border is on Input's wrapper, which carries the field chrome.
    expect(input.element.parentElement?.className).toContain('border-red-500')
    const describedBy = input.attributes('aria-describedby')!
    expect(wrapper.get(`#${describedBy}`).text()).toBe('Must be a valid email')
  })

  it('clears the error once the value becomes valid', async () => {
    const state = reactive({ email: '' })
    const { wrapper } = mountForm(state)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(wrapper.text()).toContain('Email is required')

    state.email = 'rok@example.com'
    await flushPromises()
    expect(wrapper.text()).not.toContain('Email is required')
  })

  it('validates on blur when configured', async () => {
    const state = reactive({ email: '' })
    const { wrapper } = mountForm(state, { validateOn: ['blur'] })
    expect(wrapper.text()).not.toContain('Email is required')
    await wrapper.get('[data-iryx-field="email"]').trigger('focusout')
    await flushPromises()
    expect(wrapper.text()).toContain('Email is required')
  })

  it('focuses the first invalid control on submit', async () => {
    const state = reactive({ email: '' })
    const { wrapper } = mountForm(state)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(document.activeElement).toBe(wrapper.get('input').element)
  })

  it('runs a custom validate function alongside the schema', async () => {
    const state = reactive({ email: 'taken@example.com' })
    const { wrapper, onSubmit } = mountForm(state, {
      validate: (s: any) => (s.email === 'taken@example.com' ? [{ name: 'email', message: 'Already registered' }] : []),
    })
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Already registered')
  })

  it('only surfaces the error for the field being validated', async () => {
    const state = reactive({ email: '', name: 'a' })
    const { wrapper } = mountForm(state, { validateOn: ['blur'] })
    await wrapper.get('[data-iryx-field="email"]').trigger('focusout')
    await flushPromises()
    expect(wrapper.text()).toContain('Email is required')
    // "name" has an error in the schema but has no field rendered, and must
    // not leak into this field's message.
    expect(wrapper.text()).not.toContain('Too short')
  })
})

describe('formField', () => {
  it('shows a manual error over form validation', () => {
    const wrapper = mount(FormField, {
      props: { name: 'x', label: 'X', error: 'Manual problem' },
    })
    expect(wrapper.text()).toContain('Manual problem')
  })

  it('shows help text when there is no error', () => {
    const wrapper = mount(FormField, { props: { label: 'X', help: 'Some guidance' } })
    expect(wrapper.text()).toContain('Some guidance')
  })

  it('renders hint and description', () => {
    const wrapper = mount(FormField, {
      props: { label: 'X', hint: 'Optional', description: 'What this does' },
    })
    expect(wrapper.text()).toContain('Optional')
    expect(wrapper.text()).toContain('What this does')
  })

  it('works standalone without a Form', () => {
    const wrapper = mount(FormField, { props: { label: 'Standalone' } })
    expect(wrapper.get('label').text()).toBe('Standalone')
  })
})
