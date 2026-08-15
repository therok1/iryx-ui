import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { FileUpload } from '../src'

function file(name: string, type = 'text/plain', size = 100): File {
  const blob = new File(['x'], name, { type })
  // File size is read-only, so it is stubbed rather than built from real bytes.
  Object.defineProperty(blob, 'size', { value: size })
  return blob
}

/** Drives the hidden input the way a picker would. */
async function pick(wrapper: ReturnType<typeof mount>, files: File[]) {
  const input = wrapper.get('input[type="file"]')
  Object.defineProperty(input.element, 'files', { value: files, configurable: true })
  await input.trigger('change')
}

describe('fileUpload', () => {
  it('accepts a picked file into the model', async () => {
    const wrapper = mount(FileUpload, { props: { 'modelValue': [], 'onUpdate:modelValue': () => {} } })
    await pick(wrapper, [file('notes.txt')])

    const emitted = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as File[]
    expect(emitted.map(f => f.name)).toEqual(['notes.txt'])
  })

  it('replaces rather than appends when single', async () => {
    const first = file('one.txt')
    const wrapper = mount(FileUpload, {
      props: { 'modelValue': [first], 'onUpdate:modelValue': () => {} },
    })
    await pick(wrapper, [file('two.txt')])

    const emitted = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as File[]
    expect(emitted.map(f => f.name)).toEqual(['two.txt'])
  })

  it('appends when multiple', async () => {
    const wrapper = mount(FileUpload, {
      props: { 'multiple': true, 'modelValue': [file('one.txt')], 'onUpdate:modelValue': () => {} },
    })
    await pick(wrapper, [file('two.txt')])

    const emitted = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as File[]
    expect(emitted.map(f => f.name)).toEqual(['one.txt', 'two.txt'])
  })

  it('rejects a file over maxSize', async () => {
    const wrapper = mount(FileUpload, {
      props: { 'maxSize': 1000, 'modelValue': [], 'onUpdate:modelValue': () => {} },
    })
    await pick(wrapper, [file('big.txt', 'text/plain', 5000)])

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('reject')?.[0]?.[0]).toMatchObject([{ reason: 'size' }])
    expect(wrapper.text()).toContain('big.txt is too large')
  })

  /**
   * The native picker enforces `accept` itself, but a drop bypasses it — so
   * the check has to exist here or dragged-in files skip validation.
   */
  it('rejects a type outside accept', async () => {
    const wrapper = mount(FileUpload, {
      props: { 'accept': 'image/*,.pdf', 'modelValue': [], 'onUpdate:modelValue': () => {} },
    })
    await pick(wrapper, [file('notes.txt', 'text/plain')])
    expect(wrapper.emitted('reject')?.[0]?.[0]).toMatchObject([{ reason: 'type' }])

    await pick(wrapper, [file('photo.png', 'image/png')])
    const accepted = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as File[]
    expect(accepted.map(f => f.name)).toEqual(['photo.png'])
  })

  it('matches an accept entry by extension', async () => {
    const wrapper = mount(FileUpload, {
      props: { 'accept': '.pdf', 'modelValue': [], 'onUpdate:modelValue': () => {} },
    })
    await pick(wrapper, [file('report.PDF', 'application/octet-stream')])
    expect(wrapper.emitted('update:modelValue')).toBeDefined()
  })

  it('rejects files past maxFiles', async () => {
    const wrapper = mount(FileUpload, {
      props: {
        'multiple': true,
        'maxFiles': 2,
        'modelValue': [file('one.txt')],
        'onUpdate:modelValue': () => {},
      },
    })
    await pick(wrapper, [file('two.txt'), file('three.txt')])

    const emitted = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as File[]
    expect(emitted.map(f => f.name)).toEqual(['one.txt', 'two.txt'])
    expect(wrapper.emitted('reject')?.[0]?.[0]).toMatchObject([{ reason: 'count' }])
  })

  it('lists a held file with a human-readable size', () => {
    const wrapper = mount(FileUpload, {
      props: { modelValue: [file('report.pdf', 'application/pdf', 2_097_152)] },
    })
    expect(wrapper.text()).toContain('report.pdf')
    expect(wrapper.text()).toContain('2 MB')
  })

  it('removes a file', async () => {
    const wrapper = mount(FileUpload, {
      props: {
        'multiple': true,
        'modelValue': [file('one.txt'), file('two.txt')],
        'onUpdate:modelValue': () => {},
      },
    })
    await wrapper.get('button').trigger('click')

    const emitted = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as File[]
    expect(emitted.map(f => f.name)).toEqual(['two.txt'])
  })

  it('accepts dropped files and clears the drag state', async () => {
    const wrapper = mount(FileUpload, { props: { 'modelValue': [], 'onUpdate:modelValue': () => {} } })
    const zone = wrapper.get('label')

    await zone.trigger('dragenter')
    expect(zone.classes()).toContain('border-primary')

    await zone.trigger('drop', { dataTransfer: { files: [file('dropped.txt')] } })
    expect(zone.classes()).not.toContain('border-primary')
    const dropped = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as File[]
    expect(dropped.map(f => f.name)).toEqual(['dropped.txt'])
  })

  /**
   * `dragleave` fires whenever the pointer crosses onto a child, so the state
   * is a depth counter — a plain boolean flickers off mid-drag.
   */
  it('stays in the drag state when the pointer crosses a child', async () => {
    const wrapper = mount(FileUpload)
    const zone = wrapper.get('label')

    await zone.trigger('dragenter')
    await zone.trigger('dragenter')
    await zone.trigger('dragleave')
    expect(zone.classes()).toContain('border-primary')

    await zone.trigger('dragleave')
    expect(zone.classes()).not.toContain('border-primary')
  })

  it('ignores drops while disabled', async () => {
    const wrapper = mount(FileUpload, {
      props: { 'disabled': true, 'modelValue': [], 'onUpdate:modelValue': () => {} },
    })
    await wrapper.get('label').trigger('drop', { dataTransfer: { files: [file('nope.txt')] } })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('releases object URLs for files that leave the list', async () => {
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:stub')

    const image = file('logo.png', 'image/png')
    const wrapper = mount(FileUpload, { props: { modelValue: [image] } })
    expect(wrapper.find('img').exists()).toBe(true)

    await wrapper.setProps({ modelValue: [] })
    expect(revoke).toHaveBeenCalledWith('blob:stub')

    vi.restoreAllMocks()
  })

  /**
   * The label exists to turn a click anywhere in the zone into a picker. A
   * real <button> would swallow that click and nest one interactive element
   * inside another, so the browse control is a styled span.
   */
  it('renders browse as a span, leaving the label the only control', () => {
    const wrapper = mount(FileUpload, { props: { browseLabel: 'Browse files' } })
    const zone = wrapper.get('label')

    expect(zone.text()).toContain('Browse files')
    expect(zone.findAll('button')).toHaveLength(0)
  })

  it('takes translated labels', () => {
    const wrapper = mount(FileUpload, {
      props: { label: 'Déposez un fichier ici', browseLabel: 'Parcourir', hint: 'PNG ou JPG' },
    })
    expect(wrapper.text()).toContain('Déposez un fichier ici')
    expect(wrapper.text()).toContain('Parcourir')
    expect(wrapper.text()).toContain('PNG ou JPG')
  })
})
