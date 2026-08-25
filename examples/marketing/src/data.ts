/**
 * Everything the page says, in one place. Fictional throughout — Iryx Billing is
 * the invoicing product whose admin side the dashboard example builds.
 */

export const product = {
  name: 'Iryx Billing',
  tagline: 'Invoicing that chases the money for you',
  summary:
    'Send an invoice, watch it land, and let the reminders go out without you. Iryx Billing keeps the ledger straight so you can spend the week on the work you actually sold.',
}

export interface Feature {
  title: string
  description: string
}

export const features: Feature[] = [
  {
    title: 'Money that adds up',
    description:
      'Totals are summed in integer cents, so a column of invoices agrees with the ledger to the penny however long it gets.',
  },
  {
    title: 'Reminders that go out',
    description:
      'Set the terms once. Iryx Billing sends the nudge on day three and the firmer one on day thirty, and stops the moment someone pays.',
  },
  {
    title: 'Every currency, every locale',
    description:
      'Dates, decimal marks and currency symbols follow the customer, not your office. A German client reads 15.08.2026 and €1.275,50.',
  },
  {
    title: 'Books your accountant recognises',
    description:
      'Export to the format your accountant already uses. No proprietary lock, no reconciliation weekend at the end of the quarter.',
  },
  {
    title: 'Answers before the meeting',
    description:
      'Outstanding, overdue and average days to pay, on one screen, without building a report to ask.',
  },
  {
    title: 'Nothing to install',
    description:
      'It runs in a browser and on a phone. Your bookkeeper does not need a licence, a laptop, or a training day.',
  },
]

export interface Plan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  featured?: boolean
}

export const plans: Plan[] = [
  {
    name: 'Solo',
    price: '€0',
    period: 'forever',
    description: 'For one person and a handful of clients.',
    features: ['Up to 5 invoices a month', 'One sending address', 'Automatic reminders', 'CSV export'],
    cta: 'Start for nothing',
  },
  {
    name: 'Studio',
    price: '€24',
    period: 'per month',
    description: 'For a small team that bills every week.',
    features: [
      'Unlimited invoices',
      'Five seats included',
      'Recurring invoices and retainers',
      'Multi-currency',
      'Accounting export',
    ],
    cta: 'Start the trial',
    featured: true,
  },
  {
    name: 'Agency',
    price: '€79',
    period: 'per month',
    description: 'For a book of clients and the people who chase it.',
    features: [
      'Everything in Studio',
      'Unlimited seats',
      'Approval before sending',
      'Client portals',
      'Priority support',
    ],
    cta: 'Talk to us',
  },
]

export interface Testimonial {
  quote: string
  name: string
  role: string
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'We were forty days to payment and had a person on it two afternoons a week. It is nineteen days now and nobody chases anything.',
    name: 'Rae Lindqvist',
    role: 'Founder, Meridian Foods',
  },
  {
    quote:
      'The multi-currency handling is the part I did not expect to care about. Our Dublin and Berlin clients each read their own invoice and neither of them asks us to re-send it.',
    name: 'Avery Lang',
    role: 'Operations, Halcyon Labs',
  },
  {
    quote:
      'Our accountant asked which system we had moved to, because the quarter reconciled without a single query.',
    name: 'Rowan Diaz',
    role: 'Director, Copperline Media',
  },
]

export const customers = [
  'Meridian Foods',
  'Halcyon Labs',
  'Northgate Supply',
  'Copperline Media',
  'Vantage Rail',
  'Stillwater Cider',
]

export interface Question {
  question: string
  answer: string
}

export const questions: Question[] = [
  {
    question: 'Can I bring my existing invoices with me?',
    answer:
      'Yes. Import a CSV from whatever you use now and Iryx Billing keeps the numbering, the dates and the paid status, so the history stays intact.',
  },
  {
    question: 'What happens when a client pays late?',
    answer:
      'The invoice moves to overdue and the reminder schedule takes over. You can pause it per client if a conversation is already happening.',
  },
  {
    question: 'Do you take a cut of what I invoice?',
    answer:
      'No. The price is the price, whether you bill four hundred a month or four hundred thousand.',
  },
  {
    question: 'Can I cancel?',
    answer:
      'Any time, from the billing page, without a call. Your invoices export in full on the way out.',
  },
]

export const stats = [
  { label: 'Invoiced through Iryx', value: '€412M' },
  { label: 'Average days to payment', value: '19' },
  { label: 'Businesses billing with it', value: '3,400' },
]
