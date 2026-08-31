import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { BrowserFrame } from '../src/marketing'

describe('browserFrame', () => {
  it('renders three window dots', () => {
    expect(mount(BrowserFrame).findAll('.size-2\\.5')).toHaveLength(3)
  })

  it('shows the url only when given', () => {
    expect(mount(BrowserFrame).text()).toBe('')
    expect(mount(BrowserFrame, { props: { url: 'app.example/invoices' } }).text())
      .toBe('app.example/invoices')
  })

  it('renders the slot content', () => {
    expect(mount(BrowserFrame, { slots: { default: '<img alt="Shot">' } }).find('img').exists()).toBe(true)
  })

  it('reserves a fixed box only when a ratio is given', () => {
    expect(mount(BrowserFrame, { props: { ratio: 16 / 10 } }).html()).toContain('padding-bottom')
    expect(mount(BrowserFrame).html()).not.toContain('padding-bottom')
  })
})
