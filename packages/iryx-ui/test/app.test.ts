import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { App, Input, Select, themes } from '../src'

describe('app', () => {
  // ConfigProvider is renderless, so `wrapper.element` is VTU's mount
  // container rather than App's root — assert on the markup instead.
  it('renders no wrapper element by default', () => {
    const wrapper = mount(App, { slots: { default: () => h(Input) } })
    expect(wrapper.html()).toMatch(/^<input/)
  })

  it('can own the page shell via as + class', () => {
    const wrapper = mount(App, {
      props: { as: 'div', class: 'min-h-screen bg-background' },
      slots: { default: () => h(Input) },
    })
    const root = wrapper.get('div.min-h-screen')
    expect(root.classes()).toContain('bg-background')
    expect(root.find('input').exists()).toBe(true)
  })

  it('provides the unstyled config to descendants', () => {
    const styled = mount(App, { slots: { default: () => h(Input) } })
    expect(styled.get('input').attributes('class')).toBeTruthy()

    const unstyled = mount(App, { props: { unstyled: true }, slots: { default: () => h(Input) } })
    expect(unstyled.get('input').attributes('class') ?? '').toBe('')
  })

  it('applies config changes reactively — the plugin cannot do this', async () => {
    const unstyled = ref(false)
    const wrapper = mount(defineComponent({
      setup: () => () => h(App, { unstyled: unstyled.value }, { default: () => h(Input) }),
    }))
    expect(wrapper.get('input').attributes('class')).toBeTruthy()

    unstyled.value = true
    await flushPromises()
    expect(wrapper.get('input').attributes('class') ?? '').toBe('')
  })

  it('lets a component prop override the app config', () => {
    const wrapper = mount(App, {
      props: { unstyled: true },
      slots: { default: () => h(Input, { unstyled: false }) },
    })
    expect(wrapper.get('input').attributes('class')).toContain('rounded-xl')
  })

  it('applies a theme preset', () => {
    mount(App, { props: { theme: 'violet' }, slots: { default: () => h(Input) } })
    const style = document.getElementById('iryx-ui-theme')
    expect(style?.textContent).toContain(`--iryx-primary: ${themes.violet.light.primary};`)
  })

  it('swaps the theme reactively and clears it when removed', async () => {
    const theme = ref<'violet' | 'rose' | undefined>('violet')
    mount(defineComponent({
      setup: () => () => h(App, { theme: theme.value }, { default: () => h(Input) }),
    }))
    expect(document.getElementById('iryx-ui-theme')?.textContent).toContain(themes.violet.light.primary!)

    theme.value = 'rose'
    await flushPromises()
    expect(document.getElementById('iryx-ui-theme')?.textContent).toContain(themes.rose.light.primary!)

    theme.value = undefined
    await flushPromises()
    expect(document.getElementById('iryx-ui-theme')).toBeNull()
  })

  it('forwards dir to Reka primitives for RTL', () => {
    const wrapper = mount(App, {
      props: { dir: 'rtl' },
      slots: { default: () => h(Select, { items: ['One'] }) },
      attachTo: document.body,
    })
    expect(wrapper.get('[role="combobox"]').attributes('dir')).toBe('rtl')
  })

  it('applies the appearance to the document', async () => {
    expect(window.localStorage.getItem('iryx-ui:appearance')).toBeNull()
    mount(App, { props: { appearance: 'dark' }, slots: { default: () => h(Input) } })
    await flushPromises()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('stays out of appearance entirely when the prop is absent', () => {
    document.documentElement.classList.remove('dark')
    mount(App, { slots: { default: () => h(Input) } })
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
