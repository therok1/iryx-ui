import type { TableColumn } from '../src'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Table } from '../src'

interface Row {
  id: number
  name: string
  amount: number
  nested?: { city: string }
}

const rows: Row[] = [
  { id: 1, name: 'Charlie', amount: 30, nested: { city: 'Northgate' } },
  { id: 2, name: 'alice', amount: 10, nested: { city: 'Eastvale' } },
  { id: 3, name: 'Bob', amount: 20, nested: { city: 'Westbrook' } },
]

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true, align: 'end' },
  { key: 'nested.city', label: 'City' },
]

function cellsOf(wrapper: ReturnType<typeof mount>, columnIndex: number) {
  return wrapper.findAll('tbody tr').map(tr => tr.findAll('td')[columnIndex]?.text())
}

describe('iTable rendering', () => {
  it('renders a header and a row per item, reading nested paths', () => {
    const wrapper = mount(Table, { props: { rows, columns } })

    expect(wrapper.findAll('thead th').map(th => th.text())).toEqual(['Name', 'Amount', 'City'])
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    expect(cellsOf(wrapper, 2)).toEqual(['Northgate', 'Eastvale', 'Westbrook'])
  })

  it('shows the empty message when there are no rows', () => {
    const wrapper = mount(Table, { props: { rows: [], columns, emptyText: 'Nothing here' } })
    expect(wrapper.text()).toContain('Nothing here')
    expect(wrapper.find('tbody tr td').attributes('colspan')).toBe('3')
  })

  it('renders skeletons while loading with nothing to show, not the empty message', () => {
    const wrapper = mount(Table, {
      props: { rows: [], columns, loading: true, loadingRows: 4, emptyText: 'Nothing here' },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(4)
    expect(wrapper.text()).not.toContain('Nothing here')
    expect(wrapper.find('table').attributes('aria-busy')).toBe('true')
  })

  /*
   * Money and quantities only line up column-wise with tabular figures; with
   * proportional ones the digits wander and the column stops being scannable.
   */
  it('gives a numeric column tabular figures and end alignment', () => {
    const wrapper = mount(Table, {
      props: { rows, columns: [{ key: 'amount', label: 'Amount', numeric: true }] as TableColumn[] },
    })
    const cell = wrapper.find('tbody td').attributes('class') ?? ''
    expect(cell).toContain('tabular-nums')
    expect(cell).toContain('text-end')

    // The header is a label, not a number, so it stays proportional.
    expect(wrapper.find('thead th').attributes('class')).not.toContain('tabular-nums')
  })

  it('lets align override the alignment a numeric column implies', () => {
    const wrapper = mount(Table, {
      props: { rows, columns: [{ key: 'amount', numeric: true, align: 'start' }] as TableColumn[] },
    })
    const cell = wrapper.find('tbody td').attributes('class') ?? ''
    expect(cell).toContain('tabular-nums')
    expect(cell).not.toContain('text-end')
  })

  it('hides a column marked hidden', () => {
    const wrapper = mount(Table, {
      props: { rows, columns: [...columns, { key: 'secret', label: 'Secret', hidden: true } as TableColumn] },
    })
    expect(wrapper.findAll('thead th')).toHaveLength(3)
  })
})

describe('iTable sorting', () => {
  it('cycles a column ascending, descending, then back to unsorted', async () => {
    const wrapper = mount(Table, { props: { rows, columns } })
    const header = wrapper.findAll('thead th')[0]!
    const button = header.find('button')

    await button.trigger('click')
    expect(cellsOf(wrapper, 0)).toEqual(['alice', 'Bob', 'Charlie'])
    expect(header.attributes('aria-sort')).toBe('ascending')

    await button.trigger('click')
    expect(cellsOf(wrapper, 0)).toEqual(['Charlie', 'Bob', 'alice'])
    expect(header.attributes('aria-sort')).toBe('descending')

    await button.trigger('click')
    expect(cellsOf(wrapper, 0)).toEqual(['Charlie', 'alice', 'Bob'])
    expect(header.attributes('aria-sort')).toBe('none')
  })

  it('sorts numbers numerically rather than as text', async () => {
    const wrapper = mount(Table, {
      props: { rows: [{ id: 1, name: 'a', amount: 100 }, { id: 2, name: 'b', amount: 9 }], columns },
    })
    await wrapper.findAll('thead th')[1]!.find('button').trigger('click')
    expect(cellsOf(wrapper, 1)).toEqual(['9', '100'])
  })

  it('emits sort without reordering rows in server mode', async () => {
    const wrapper = mount(Table, { props: { rows, columns, total: 99 } })
    await wrapper.findAll('thead th')[0]!.find('button').trigger('click')

    // The server owns the order, so the rows passed in are left exactly as given.
    expect(cellsOf(wrapper, 0)).toEqual(['Charlie', 'alice', 'Bob'])
    expect(wrapper.emitted('update:sort')?.at(-1)).toEqual([{ key: 'name', order: 'asc' }])
  })

  it('sorts by sortKey when the column displays a different field', async () => {
    const wrapper = mount(Table, {
      props: {
        rows,
        columns: [{ key: 'nested.city', label: 'City', sortable: true, sortKey: 'city' }],
        total: 5,
      },
    })
    await wrapper.find('thead th button').trigger('click')
    expect(wrapper.emitted('update:sort')?.at(-1)).toEqual([{ key: 'city', order: 'asc' }])
  })

  it('leaves a blank value last in both directions', async () => {
    const withBlank: Row[] = [{ id: 1, name: '', amount: 1 }, { id: 2, name: 'Zoe', amount: 2 }]
    const wrapper = mount(Table, { props: { rows: withBlank, columns } })
    const button = wrapper.findAll('thead th')[0]!.find('button')

    await button.trigger('click')
    expect(cellsOf(wrapper, 0)).toEqual(['Zoe', ''])
    await button.trigger('click')
    expect(cellsOf(wrapper, 0)).toEqual(['Zoe', ''])
  })

  it('does not make a non-sortable column clickable', () => {
    const wrapper = mount(Table, { props: { rows, columns } })
    expect(wrapper.findAll('thead th')[2]!.find('button').exists()).toBe(false)
    expect(wrapper.findAll('thead th')[2]!.attributes('aria-sort')).toBeUndefined()
  })
})

describe('iTable pagination', () => {
  it('slices rows locally when no total is given', () => {
    const wrapper = mount(Table, { props: { rows, columns, perPage: 2 } })
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('renders every row it was given in server mode', () => {
    const wrapper = mount(Table, { props: { rows, columns, perPage: 2, total: 50 } })
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
  })
})

describe('iTable selection', () => {
  it('selects and deselects a row by key', async () => {
    const wrapper = mount(Table, { props: { rows, columns, selectable: true, selection: [] } })
    const boxes = wrapper.findAll('tbody [role="checkbox"]')

    await boxes[1]!.trigger('click')
    expect(wrapper.emitted('update:selection')?.at(-1)).toEqual([[2]])
  })

  it('the header checkbox reads indeterminate on a partial selection', async () => {
    const wrapper = mount(Table, {
      props: { rows, columns, selectable: true, selection: [1] },
    })
    expect(wrapper.find('thead [role="checkbox"]').attributes('aria-checked')).toBe('mixed')

    await wrapper.setProps({ selection: [1, 2, 3] })
    expect(wrapper.find('thead [role="checkbox"]').attributes('aria-checked')).toBe('true')
  })

  it('select-all covers only selectable rows on the page', async () => {
    const wrapper = mount(Table, {
      props: {
        rows,
        columns,
        selectable: true,
        selection: [],
        isRowSelectable: (row: any) => row.id !== 2,
      },
    })
    await wrapper.find('thead [role="checkbox"]').trigger('click')
    expect(wrapper.emitted('update:selection')?.at(-1)).toEqual([[1, 3]])
  })

  it('hides the checkbox on a row that cannot be selected', () => {
    const wrapper = mount(Table, {
      props: { rows, columns, selectable: true, isRowSelectable: (row: any) => row.id !== 2 },
    })
    expect(wrapper.findAll('tbody [role="checkbox"]')).toHaveLength(2)
  })

  it('keeps selections made on other pages when clearing the current one', async () => {
    const wrapper = mount(Table, {
      props: { rows, columns, selectable: true, perPage: 2, selection: [1, 2, 99] },
    })
    await wrapper.find('thead [role="checkbox"]').trigger('click')
    // 99 is not on this page, so it survives.
    expect(wrapper.emitted('update:selection')?.at(-1)).toEqual([[99]])
  })
})

describe('iTable expansion', () => {
  it('renders the expanded slot only for expanded rows', async () => {
    const wrapper = mount(Table, {
      props: { rows, columns, expandable: true },
      slots: { expanded: '<div class="detail">details</div>' },
    })
    expect(wrapper.find('.detail').exists()).toBe(false)

    await wrapper.findAll('tbody button')[0]!.trigger('click')
    expect(wrapper.find('.detail').exists()).toBe(true)
    expect(wrapper.findAll('tbody button')[0]!.attributes('aria-expanded')).toBe('true')
  })

  it('hides the chevron on a row that cannot expand', () => {
    const wrapper = mount(Table, {
      props: { rows, columns, expandable: true, canExpandRow: (row: any) => row.id === 1 },
    })
    expect(wrapper.findAll('tbody button')).toHaveLength(1)
  })
})

describe('iTable slots and events', () => {
  it('a cell slot replaces the default rendering and receives the value', () => {
    const wrapper = mount(Table, {
      props: { rows, columns },
      slots: { 'cell-name': '<template #cell-name="{ value }"><b>{{ value }}!</b></template>' },
    })
    expect(wrapper.find('tbody b').text()).toBe('Charlie!')
  })

  it('emits rowClick only when clickableRows is set', async () => {
    const plain = mount(Table, { props: { rows, columns } })
    await plain.find('tbody tr').trigger('click')
    expect(plain.emitted('rowClick')).toBeUndefined()

    const clickable = mount(Table, { props: { rows, columns, clickableRows: true } })
    await clickable.find('tbody tr').trigger('click')
    expect(clickable.emitted('rowClick')?.[0]).toEqual([rows[0]])
  })

  it('does not emit rowClick from the selection checkbox', async () => {
    const wrapper = mount(Table, {
      props: { rows, columns, clickableRows: true, selectable: true },
    })
    await wrapper.find('tbody [role="checkbox"]').trigger('click')
    expect(wrapper.emitted('rowClick')).toBeUndefined()
  })

  it('exposes an accessible name and honours a caption', () => {
    const wrapper = mount(Table, { props: { rows, columns, label: 'Invoices', caption: 'Q3' } })
    expect(wrapper.find('table').attributes('aria-label')).toBe('Invoices')
    expect(wrapper.find('caption').text()).toBe('Q3')
  })
})
