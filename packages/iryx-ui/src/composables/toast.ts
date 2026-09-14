import { shallowRef } from 'vue'

export type ToastVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'loading'

export interface ToastOptions {
  title?: string
  description?: string
  variant?: ToastVariant
  /** Milliseconds before auto-dismiss. `0` keeps it until dismissed. */
  duration?: number
  /** Optional action button. */
  action?: {
    label: string
    onClick: () => void
  }
}

type Message<T> = ToastOptions | string | ((value: T) => ToastOptions | string)

export interface ToastPromiseMessages<T> {
  loading: ToastOptions | string
  success: Message<T>
  error: Message<unknown>
}

export interface ToastRecord extends ToastOptions {
  id: number
}

/*
 * Module-level state, so `toast()` can be called from anywhere — including
 * plain functions outside a component's setup, which is the whole point of an
 * imperative API. `<IToaster>` renders whatever is here.
 */
const items = shallowRef<ToastRecord[]>([])
let nextId = 0

/** Internal: the toasts `<IToaster>` should currently render. */
export function useToastState() {
  return items
}

export interface ToastApi {
  /** Show a toast. Returns its id, so it can be dismissed early. */
  toast: (options: ToastOptions | string) => number
  success: (options: ToastOptions | string) => number
  warning: (options: ToastOptions | string) => number
  danger: (options: ToastOptions | string) => number
  info: (options: ToastOptions | string) => number
  /** Replace an open toast's content in place. Does nothing once it has closed. */
  update: (id: number, options: ToastOptions | string) => void
  /**
   * One toast for a piece of async work: a spinner while the promise is
   * pending, then the success or error message. Returns the toast's id; await
   * your own promise for its result.
   */
  promise: <T>(promise: Promise<T>, messages: ToastPromiseMessages<T>) => number
  /** Dismiss one toast by id. */
  dismiss: (id: number) => void
  /** Dismiss every open toast. */
  clear: () => void
}

function normalize(options: ToastOptions | string): ToastOptions {
  return typeof options === 'string' ? { title: options } : options
}

/**
 * Imperative toast notifications.
 *
 * Requires a single `<IToaster />` mounted somewhere in the app — typically
 * just inside `<IApp>`.
 *
 * ```ts
 * const toast = useToast()
 * toast.success('Saved')
 * ```
 */
export function useToast(): ToastApi {
  function toast(options: ToastOptions | string): number {
    const id = nextId++
    // Replace the array rather than mutating it: the ref is shallow.
    items.value = [...items.value, { ...normalize(options), id }]
    return id
  }

  function withVariant(variant: ToastVariant) {
    return (options: ToastOptions | string) => toast({ ...normalize(options), variant })
  }

  function update(id: number, options: ToastOptions | string): void {
    items.value = items.value.map(item => (item.id === id ? { ...normalize(options), id } : item))
  }

  function promise<T>(work: Promise<T>, messages: ToastPromiseMessages<T>): number {
    const id = toast({ duration: 0, ...normalize(messages.loading), variant: 'loading' })
    const settle = <V>(message: Message<V>, value: V, variant: ToastVariant) => {
      const resolved = typeof message === 'function' ? message(value) : message
      update(id, { variant, ...normalize(resolved) })
    }
    work.then(
      value => settle(messages.success, value, 'success'),
      error => settle(messages.error, error, 'danger'),
    )
    return id
  }

  function dismiss(id: number): void {
    items.value = items.value.filter(item => item.id !== id)
  }

  return {
    toast,
    success: withVariant('success'),
    warning: withVariant('warning'),
    danger: withVariant('danger'),
    info: withVariant('info'),
    update,
    promise,
    dismiss,
    clear: () => (items.value = []),
  }
}
