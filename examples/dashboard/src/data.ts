/*
 * Everything the dashboard shows, in one place.
 *
 * A real app fetches this. It is inline here so the example runs with no
 * backend and no mock server — swap these constants for your own calls and the
 * components above them do not change.
 *
 * Money is a *string*, never a number. `12.30` as a float is 12.299999999…, and
 * a total built from floats drifts by a cent over enough rows. The library's
 * decimal helpers work on these strings; `Intl.NumberFormat` renders them.
 */

/** The signed-in user. Read by the account menu and the profile card alike,
 * so the two cannot drift apart. */
export const user = {
  name: 'Rae Lindqvist',
  email: 'rae@northwind.example',
  role: 'owner',
}

export interface Invoice {
  id: string
  number: string
  customer: { name: string, email: string }
  issued: string
  due: string
  total: string
  status: 'paid' | 'sent' | 'overdue' | 'draft'
}

export const invoices: Invoice[] = [
  { id: '1', number: 'INV-2041', customer: { name: 'Meridian Foods', email: 'ap@meridianfoods.example' }, issued: '2026-08-01', due: '2026-08-31', total: '4820.00', status: 'paid' },
  { id: '2', number: 'INV-2042', customer: { name: 'Halcyon Labs', email: 'billing@halcyonlabs.example' }, issued: '2026-08-03', due: '2026-09-02', total: '1275.50', status: 'sent' },
  { id: '3', number: 'INV-2043', customer: { name: 'Northgate Supply', email: 'accounts@northgate.example' }, issued: '2026-07-12', due: '2026-08-11', total: '9340.00', status: 'overdue' },
  { id: '4', number: 'INV-2044', customer: { name: 'Copperline Media', email: 'finance@copperline.example' }, issued: '2026-08-08', due: '2026-09-07', total: '660.25', status: 'sent' },
  { id: '5', number: 'INV-2045', customer: { name: 'Vantage Rail', email: 'ap@vantagerail.example' }, issued: '2026-08-09', due: '2026-09-08', total: '15200.00', status: 'draft' },
  { id: '6', number: 'INV-2046', customer: { name: 'Meridian Foods', email: 'ap@meridianfoods.example' }, issued: '2026-07-28', due: '2026-08-27', total: '2140.75', status: 'paid' },
  { id: '7', number: 'INV-2047', customer: { name: 'Bramble & Co', email: 'hello@bramble.example' }, issued: '2026-06-30', due: '2026-07-30', total: '480.00', status: 'overdue' },
  { id: '8', number: 'INV-2048', customer: { name: 'Halcyon Labs', email: 'billing@halcyonlabs.example' }, issued: '2026-08-14', due: '2026-09-13', total: '7315.40', status: 'sent' },
  { id: '9', number: 'INV-2049', customer: { name: 'Stillwater Cider', email: 'ap@stillwater.example' }, issued: '2026-08-15', due: '2026-09-14', total: '1899.99', status: 'paid' },
  { id: '10', number: 'INV-2050', customer: { name: 'Northgate Supply', email: 'accounts@northgate.example' }, issued: '2026-08-18', due: '2026-09-17', total: '3050.00', status: 'draft' },
  { id: '11', number: 'INV-2051', customer: { name: 'Copperline Media', email: 'finance@copperline.example' }, issued: '2026-08-19', due: '2026-09-18', total: '12480.00', status: 'sent' },
  { id: '12', number: 'INV-2052', customer: { name: 'Vantage Rail', email: 'ap@vantagerail.example' }, issued: '2026-08-20', due: '2026-09-19', total: '845.60', status: 'paid' },
]

/** Badge appearance per status. Neutral for a draft — it is not a state to act on. */
export const statusVariant = {
  paid: 'success',
  sent: 'info',
  overdue: 'danger',
  draft: 'neutral',
} as const

export const revenue = [
  { label: 'Mar', value: 41200 },
  { label: 'Apr', value: 38950 },
  { label: 'May', value: 46100 },
  { label: 'Jun', value: 52300 },
  { label: 'Jul', value: 49870 },
  { label: 'Aug', value: 58420 },
]

export const byChannel = [
  { label: 'Direct', value: 24800 },
  { label: 'Partner', value: 18300 },
  { label: 'Marketplace', value: 9650 },
  { label: 'Referral', value: 5670 },
]

export interface ActivityEntry {
  title: string
  description: string
  at: string
  status: 'success' | 'info' | 'warning' | 'danger'
}

export const activity: ActivityEntry[] = [
  { title: 'INV-2052 paid', description: 'Vantage Rail settled €845.60 by transfer.', at: '2026-08-24T09:12:00Z', status: 'success' },
  { title: 'INV-2043 overdue', description: 'Northgate Supply is 13 days past due.', at: '2026-08-24T06:00:00Z', status: 'danger' },
  { title: 'INV-2051 sent', description: 'Copperline Media, due 18 September.', at: '2026-08-19T14:40:00Z', status: 'info' },
  { title: 'Payment retried', description: 'Card for Bramble & Co declined a second time.', at: '2026-08-18T11:05:00Z', status: 'warning' },
]

const money = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })

/** Renders a decimal string as money without ever turning it into a float. */
export function formatMoney(value: string): string {
  return money.format(Number(value))
}

const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export function formatDay(iso: string): string {
  // `T00:00` keeps a date-only string in local time; bare `new Date('2026-08-01')`
  // parses as UTC and can render as the day before, west of Greenwich.
  return day.format(new Date(`${iso}T00:00`))
}

const dateTime = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export function formatMoment(iso: string): string {
  return dateTime.format(new Date(iso))
}
