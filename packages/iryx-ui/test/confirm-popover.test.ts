import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { ConfirmPopover } from '../src'

// The panel is portalled to body and outlives its wrapper.
enableAutoUnmount(afterEach)

function query(selector: string) {
  return document.body.querySelector(selector)
}

function queryAll(selector: string) {
  return [...document.body.querySelectorAll(selector)]
}

async function settle() {
  await nextTick()
  await nextTick()
}

function mountOpen(props: Record<string, unknown> = {}) {
  return mount(ConfirmPopover, {
    props: { title: 'Delete this row?', open: true, ...props },
    slots: { trigger: '<button>Delete</button>' },
    attachTo: document.body,
  })
}

function panelButton(text: string) {
  return queryAll('[role="dialog"] button').find(b => b.textContent?.trim() === text) as HTMLElement
}

describe('confirmPopover', () => {
  it('renders the question and both buttons', async () => {
    mountOpen()
    await settle()
    expect(document.body.textContent).toContain('Delete this row?')
    expect(panelButton('Confirm')).toBeTruthy()
    expect(panelButton('Cancel')).toBeTruthy()
  })

  it('renders a description when given one', async () => {
    mountOpen({ description: 'This cannot be undone.' })
    await settle()
    expect(document.body.textContent).toContain('This cannot be undone.')
  })

  it('emits confirm and closes when the confirm button is clicked', async () => {
    const wrapper = mountOpen()
    await settle()
    panelButton('Confirm').click()
    await settle()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('emits cancel and closes when the cancel button is clicked', async () => {
    const wrapper = mountOpen()
    await settle()
    panelButton('Cancel').click()
    await settle()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('confirm')).toBeUndefined()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('styles the confirm button as destructive when danger is set', async () => {
    mountOpen({ danger: true })
    await settle()
    expect(panelButton('Confirm').className).toContain('bg-danger')
  })

  it('stays closed until the trigger is used', async () => {
    mountOpen({ open: undefined })
    await settle()
    expect(query('[role="dialog"]')).toBeNull()
  })
})
