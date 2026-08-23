import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { Tree } from '../src'

const items = [
  {
    label: 'src',
    children: [
      { label: 'components', children: [{ label: 'Button.vue' }] },
      { label: 'index.ts' },
    ],
  },
  { label: 'README.md' },
]

function rows(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[role="treeitem"]')
}

describe('tree', () => {
  it('renders the top level collapsed', () => {
    const wrapper = mount(Tree, { props: { items } })
    expect(rows(wrapper)).toHaveLength(2)
    expect(wrapper.text()).toContain('src')
    expect(wrapper.text()).not.toContain('index.ts')
  })

  it('shows the children of an expanded node', () => {
    const wrapper = mount(Tree, { props: { items, expanded: ['src'] } })
    expect(rows(wrapper)).toHaveLength(4)
    expect(wrapper.text()).toContain('index.ts')
    expect(wrapper.text()).not.toContain('Button.vue')
  })

  it('expands more than one level at a time', () => {
    const wrapper = mount(Tree, { props: { items, expanded: ['src', 'components'] } })
    expect(wrapper.text()).toContain('Button.vue')
  })

  it('prefers an explicit value over the label', () => {
    const wrapper = mount(Tree, {
      props: { items: [{ label: 'src', value: 'src-dir', children: [{ label: 'a' }] }], expanded: ['src-dir'] },
    })
    expect(wrapper.text()).toContain('a')
  })

  /*
   * Reka's `flattenItems` reports a 1-based level, so the top row has to be
   * shifted back or the whole tree starts one step in. It keeps a small base
   * inset so a top-level chevron does not sit flush against the border.
   */
  it('indents by depth, over a base inset', () => {
    const wrapper = mount(Tree, { props: { items, expanded: ['src'] } })
    const styles = rows(wrapper).map(r => r.attributes('style'))
    expect(styles[0]).toContain('padding-left: 8px')
    expect(styles[1]).toContain('padding-left: 24px')
  })

  it('takes a custom indent', () => {
    const wrapper = mount(Tree, { props: { items, expanded: ['src'], indent: 24 } })
    expect(rows(wrapper)[1]?.attributes('style')).toContain('padding-left: 32px')
  })

  /*
   * A leaf gets a blank the same size as a chevron, or its label would sit
   * where its siblings' chevrons are and the column would zig-zag.
   */
  it('reserves the chevron column on a leaf', () => {
    const wrapper = mount(Tree, { props: { items } })
    const readme = rows(wrapper).at(-1)
    expect(readme?.find('svg').exists()).toBe(false)
    expect(readme?.find('span.shrink-0').exists()).toBe(true)
  })

  it('gives a branch a chevron', () => {
    const wrapper = mount(Tree, { props: { items } })
    expect(rows(wrapper)[0]?.find('svg').exists()).toBe(true)
  })

  it('marks the expanded chevron so it can rotate', () => {
    const wrapper = mount(Tree, { props: { items, expanded: ['src'] } })
    expect(rows(wrapper)[0]?.find('svg').attributes('data-expanded')).toBeDefined()
  })

  /*
   * Reka holds the selection as item objects; this library models it as an
   * array of values, so the two are translated at the component boundary.
   */
  it('reports selection as an array of values', async () => {
    const wrapper = mount(Tree, { props: { items } })
    await rows(wrapper).at(-1)?.trigger('click')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(['README.md'])
  })

  it('marks the row named by the model', () => {
    const wrapper = mount(Tree, { props: { items, modelValue: ['README.md'] } })
    expect(rows(wrapper).at(-1)?.attributes('data-selected')).toBeDefined()
    expect(rows(wrapper)[0]?.attributes('data-selected')).toBeUndefined()
  })

  it('selects several at once when multiple', () => {
    const wrapper = mount(Tree, {
      props: { items, multiple: true, expanded: ['src'], modelValue: ['index.ts', 'README.md'] },
    })
    const selected = rows(wrapper).filter(r => r.attributes('data-selected') !== undefined)
    expect(selected).toHaveLength(2)
  })

  it('ignores a value that matches no node', () => {
    const wrapper = mount(Tree, { props: { items, modelValue: ['nope'] } })
    expect(rows(wrapper).filter(r => r.attributes('data-selected') !== undefined)).toHaveLength(0)
  })

  /*
   * Pushed to the trailing edge, so the number sits against the row's right
   * side however deep the row is — a count following the label would step
   * inward with every level.
   */
  it('shows a count against the trailing edge', () => {
    const wrapper = mount(Tree, { props: { items: [{ label: 'src', count: 12 }] } })
    const count = rows(wrapper)[0]?.find('span.ml-auto')
    expect(count?.exists()).toBe(true)
    expect(count?.text()).toBe('12')
  })

  it('shows a zero count rather than hiding it', () => {
    const wrapper = mount(Tree, { props: { items: [{ label: 'src', count: 0 }] } })
    expect(rows(wrapper)[0]?.find('span.ml-auto').text()).toBe('0')
  })

  it('renders no count when a node has none', () => {
    const wrapper = mount(Tree, { props: { items: [{ label: 'src' }] } })
    expect(rows(wrapper)[0]?.find('span.ml-auto').exists()).toBe(false)
  })

  it('names the tree', () => {
    const wrapper = mount(Tree, { props: { items, ariaLabel: 'Project files' } })
    expect(wrapper.attributes('aria-label')).toBe('Project files')
  })

  it('disables a single node', () => {
    const wrapper = mount(Tree, { props: { items: [{ label: 'a', disabled: true }] } })
    expect(rows(wrapper)[0]?.attributes('data-disabled')).toBeDefined()
  })

  it('sizes the rows', () => {
    const wrapper = mount(Tree, { props: { items, size: 'sm' } })
    expect(rows(wrapper)[0]?.classes()).toContain('text-xs')
  })

  it('drops every built-in class when unstyled', () => {
    const wrapper = mount(Tree, { props: { items, unstyled: true } })
    expect(wrapper.classes()).toHaveLength(0)
    expect(rows(wrapper)[0]?.classes()).toHaveLength(0)
  })
})
