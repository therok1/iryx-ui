import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { ToggleGroup } from '../src'

const views = ['List', 'Board', 'Calendar']

/*
 * A stateful stub, not a bare arrow function: a functional component with no
 * declared props receives every attribute as a prop instead of letting it
 * fall through, so the marker would never reach the SVG.
 */
const StubIcon = { render: () => h('svg') }

function items(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('button')
}

function item(wrapper: ReturnType<typeof mount>, index = 0) {
  const found = items(wrapper)[index]
  if (!found)
    throw new Error(`no item at index ${index}`)
  return found
}

describe('toggleGroup', () => {
  it('renders one button per item', () => {
    const wrapper = mount(ToggleGroup, { props: { items: views } })
    expect(items(wrapper)).toHaveLength(3)
    expect(wrapper.text()).toContain('Board')
  })

  // String items are the common case; the value falls back to the label.
  it('takes bare strings as items', async () => {
    const wrapper = mount(ToggleGroup, { props: { items: views } })
    await item(wrapper, 1).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Board'])
  })

  it('prefers an explicit value over the label', async () => {
    const wrapper = mount(ToggleGroup, {
      props: { items: [{ label: 'Board', value: 'board' }] },
    })
    await item(wrapper).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['board'])
  })

  it('marks the selected item pressed', () => {
    const wrapper = mount(ToggleGroup, { props: { items: views, modelValue: 'Board' } })
    expect(item(wrapper, 1).attributes('data-state')).toBe('on')
    expect(item(wrapper, 0).attributes('data-state')).toBe('off')
  })

  it('emits an array when type is multiple', async () => {
    const wrapper = mount(ToggleGroup, {
      props: { items: views, type: 'multiple' as const, modelValue: ['List'] },
    })
    await item(wrapper, 1).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['List', 'Board']])
  })

  it('disables a single item without disabling the group', () => {
    const wrapper = mount(ToggleGroup, {
      props: { items: [{ label: 'List' }, { label: 'Board', disabled: true }] },
    })
    expect(item(wrapper, 0).attributes('disabled')).toBeUndefined()
    expect(item(wrapper, 1).attributes('disabled')).toBeDefined()
  })

  /*
   * With one toggle look, the variant only decides spacing: `joined` collapses
   * the shared borders, `plain` leaves a gap. The items themselves are the
   * same button either way.
   */
  it('collapses adjacent borders when joined', () => {
    const wrapper = mount(ToggleGroup, { props: { items: views } })
    expect(item(wrapper).classes()).toContain('[&:not(:first-child)]:-ml-px')
    expect(item(wrapper).classes()).toContain('[&:not(:last-child)]:rounded-r-none')
  })

  it('leaves a gap and no joining when plain', () => {
    const wrapper = mount(ToggleGroup, { props: { items: views, variant: 'plain' as const } })
    expect(wrapper.classes()).toContain('gap-1')
    expect(item(wrapper).classes()).not.toContain('[&:not(:first-child)]:-ml-px')
  })

  it('renders its items as the same button IToggle does', () => {
    const wrapper = mount(ToggleGroup, { props: { items: views } })
    expect(item(wrapper).classes()).toContain('border-border')
    expect(item(wrapper).classes()).toContain('data-[state=on]:bg-accent')
  })

  // Hiding the label leaves nothing to name the button, so it becomes the name.
  it('names an icon-only item after its hidden label', () => {
    const wrapper = mount(ToggleGroup, { props: { items: views, iconOnly: true } })
    expect(item(wrapper).attributes('aria-label')).toBe('List')
    expect(wrapper.text()).not.toContain('List')
  })

  it('prefers an explicit ariaLabel', () => {
    const wrapper = mount(ToggleGroup, {
      props: { items: [{ label: 'List', ariaLabel: 'List view' }], iconOnly: true },
    })
    expect(item(wrapper).attributes('aria-label')).toBe('List view')
  })

  /*
   * An icon beside a label marks itself as leading so the padding tightens on
   * that side; an icon-only item is square with no padding to tighten, so the
   * marker would be a lie.
   */
  it('marks an icon that sits beside a label', () => {
    const withLabel = mount(ToggleGroup, {
      props: { items: [{ label: 'Bold', icon: StubIcon }] },
    })
    expect(withLabel.get('button [data-icon]').attributes('data-icon')).toBe('inline-start')

    const iconOnly = mount(ToggleGroup, {
      props: { items: [{ label: 'Bold', icon: StubIcon }], iconOnly: true },
    })
    expect(iconOnly.find('button [data-icon]').exists()).toBe(false)
  })

  it('squares icon-only items', () => {
    const wrapper = mount(ToggleGroup, { props: { items: views, iconOnly: true, size: 'md' as const } })
    expect(item(wrapper).classes()).toContain('w-9')
  })

  it('stretches its items when block', () => {
    const wrapper = mount(ToggleGroup, { props: { items: views, block: true } })
    expect(wrapper.classes()).toContain('w-full')
    expect(item(wrapper).classes()).toContain('flex-1')
  })

  it('stacks when vertical', () => {
    const wrapper = mount(ToggleGroup, { props: { items: views, orientation: 'vertical' as const } })
    expect(wrapper.classes()).toContain('flex-col')
  })

  it('applies ui slot overrides', () => {
    const wrapper = mount(ToggleGroup, { props: { items: views, ui: { item: 'px-8' } } })
    expect(item(wrapper).classes()).toContain('px-8')
    expect(item(wrapper).classes()).not.toContain('px-4')
  })

  it('drops every built-in class when unstyled', () => {
    const wrapper = mount(ToggleGroup, { props: { items: views, unstyled: true } })
    expect(wrapper.classes()).toHaveLength(0)
    expect(item(wrapper).classes()).toHaveLength(0)
  })
})
