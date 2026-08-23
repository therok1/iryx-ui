import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { TagsInput } from '../src'

const tags = ['design', 'vue']

function field(wrapper: ReturnType<typeof mount>) {
  return wrapper.get('input:not([aria-hidden])')
}

function items(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[data-reka-collection-item]')
}

async function type(wrapper: ReturnType<typeof mount>, value: string) {
  const input = field(wrapper)
  await input.setValue(value)
  await input.trigger('keydown', { key: 'Enter' })
}

describe('tagsInput', () => {
  it('renders one tag per value', () => {
    const wrapper = mount(TagsInput, { props: { modelValue: tags } })
    expect(items(wrapper)).toHaveLength(2)
    expect(wrapper.text()).toContain('design')
    expect(wrapper.text()).toContain('vue')
  })

  it('adds a tag on Enter', async () => {
    const wrapper = mount(TagsInput, { props: { modelValue: [] } })
    await type(wrapper, 'design')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['design']])
    expect(wrapper.emitted('addTag')?.[0]).toEqual(['design'])
  })

  it('appends to the existing tags', async () => {
    const wrapper = mount(TagsInput, { props: { modelValue: ['design'] } })
    await type(wrapper, 'vue')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['design', 'vue']])
  })

  // A repeated tag is nearly always a slip, so it is refused by default.
  it('refuses a duplicate and says so', async () => {
    const wrapper = mount(TagsInput, { props: { modelValue: ['design'] } })
    await type(wrapper, 'design')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('invalidTag')?.[0]).toEqual(['design'])
  })

  it('allows duplicates when asked', async () => {
    const wrapper = mount(TagsInput, { props: { modelValue: ['design'], duplicate: true } })
    await type(wrapper, 'design')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['design', 'design']])
  })

  it('removes a tag from its delete control', async () => {
    const wrapper = mount(TagsInput, { props: { modelValue: tags } })
    await wrapper.get('[aria-label="Remove design"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['vue']])
    expect(wrapper.emitted('removeTag')?.[0]).toEqual(['design'])
  })

  /*
   * Read-only at the limit rather than removed: unmounting the input would
   * take away what a `<label for>` points at, quietly turning a full field
   * into an unlabelled one.
   */
  it('makes the input read-only once max is reached', () => {
    const full = mount(TagsInput, { props: { modelValue: tags, max: 2 } })
    expect(field(full).attributes('readonly')).toBeDefined()
    expect(field(full).attributes('placeholder')).toBeUndefined()

    const room = mount(TagsInput, { props: { modelValue: tags, max: 3 } })
    expect(field(room).attributes('readonly')).toBeUndefined()
  })

  /*
   * The name has to reach the input, not the box around it — axe reported the
   * field as unlabelled while the attribute stopped at the root.
   */
  it('names the input rather than the wrapper', () => {
    const wrapper = mount(TagsInput, {
      props: { modelValue: tags },
      attrs: { 'aria-label': 'Tags' },
    })
    expect(field(wrapper).attributes('aria-label')).toBe('Tags')
    expect(wrapper.attributes('aria-label')).toBeUndefined()
  })

  it('puts a given id on the input, where a label can point at it', () => {
    const wrapper = mount(TagsInput, { props: { modelValue: tags, id: 'topics' } })
    expect(field(wrapper).attributes('id')).toBe('topics')
  })

  it('shows the clear control only when there is something to clear', () => {
    const empty = mount(TagsInput, { props: { modelValue: [], clearable: true } })
    expect(empty.find('[aria-label="Clear all"]').exists()).toBe(false)

    const filled = mount(TagsInput, { props: { modelValue: tags, clearable: true } })
    expect(filled.find('[aria-label="Clear all"]').exists()).toBe(true)
  })

  it('keeps the clear control out of the way unless asked for', () => {
    const wrapper = mount(TagsInput, { props: { modelValue: tags } })
    expect(wrapper.find('[aria-label="Clear all"]').exists()).toBe(false)
  })

  it('names each delete control after the tag it removes', () => {
    const wrapper = mount(TagsInput, { props: { modelValue: tags } })
    expect(wrapper.find('[aria-label="Remove vue"]').exists()).toBe(true)
  })

  it('takes a placeholder', () => {
    const wrapper = mount(TagsInput, { props: { modelValue: [], placeholder: 'Add a tag' } })
    expect(field(wrapper).attributes('placeholder')).toBe('Add a tag')
  })

  it('marks the field invalid', () => {
    const wrapper = mount(TagsInput, { props: { modelValue: [], invalid: true } })
    expect(field(wrapper).attributes('aria-invalid')).toBe('true')
    expect(wrapper.classes()).toContain('border-red-500')
  })

  it('disables the field', () => {
    const wrapper = mount(TagsInput, { props: { modelValue: tags, disabled: true } })
    expect(field(wrapper).attributes('disabled')).toBeDefined()
  })

  // The field grows rather than scrolling, so added tags stay visible.
  it('wraps and grows instead of scrolling', () => {
    const wrapper = mount(TagsInput, { props: { modelValue: tags } })
    expect(wrapper.classes()).toContain('flex-wrap')
    expect(wrapper.classes()).toContain('h-auto')
    expect(wrapper.classes()).toContain('min-h-9')
  })

  it('sizes the field and its tags together', () => {
    const wrapper = mount(TagsInput, { props: { modelValue: tags, size: 'lg' } })
    expect(wrapper.classes()).toContain('min-h-10')
    expect(items(wrapper)[0]?.classes()).toContain('h-7')
  })

  it('applies ui slot overrides', () => {
    const wrapper = mount(TagsInput, { props: { modelValue: tags, ui: { tag: 'bg-accent' } } })
    expect(items(wrapper)[0]?.classes()).toContain('bg-accent')
  })

  it('drops every built-in class when unstyled', () => {
    const wrapper = mount(TagsInput, { props: { modelValue: tags, unstyled: true } })
    expect(wrapper.classes()).toHaveLength(0)
    expect(items(wrapper)[0]?.classes()).toHaveLength(0)
  })
})
