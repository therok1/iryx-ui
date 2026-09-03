import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Code } from '../src'

const writeText = vi.fn(() => Promise.resolve())

beforeEach(() => {
  writeText.mockClear()
  vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
})

describe('code', () => {
  it('renders inline as a span with no copy button', () => {
    const wrapper = mount(Code, { props: { code: 'pnpm add iryx-ui' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.get('code').text()).toBe('pnpm add iryx-ui')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renders a block as a pre with a copy button', () => {
    const wrapper = mount(Code, { props: { code: 'pnpm add iryx-ui', block: true } })
    expect(wrapper.element.tagName).toBe('PRE')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('copies the code and reports it', async () => {
    const wrapper = mount(Code, { props: { code: 'pnpm add iryx-ui', copy: true } })
    await wrapper.get('button').trigger('click')
    expect(writeText).toHaveBeenCalledWith('pnpm add iryx-ui')
    await wrapper.vm.$nextTick()
    expect(wrapper.get('button').attributes('aria-label')).toBe('Copied')
  })

  it('copies slotted content when there is no code prop', async () => {
    const wrapper = mount(Code, { props: { copy: true }, slots: { default: 'echo hello' } })
    await wrapper.get('button').trigger('click')
    expect(writeText).toHaveBeenCalledWith('echo hello')
  })

  it('does not claim success when the clipboard rejects', async () => {
    writeText.mockRejectedValueOnce(new Error('denied'))
    const wrapper = mount(Code, { props: { code: 'x', copy: true } })
    await wrapper.get('button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.get('button').attributes('aria-label')).toBe('Copy code')
  })
})
