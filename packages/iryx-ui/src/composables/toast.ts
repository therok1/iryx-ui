import { shallowRef } from 'vue'

export type ToastVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

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

  function dismiss(id: number): void {
    items.value = items.value.filter(item => item.id !== id)
  }

  return {
    toast,
    success: withVariant('success'),
    warning: withVariant('warning'),
    danger: withVariant('danger'),
    info: withVariant('info'),
    dismiss,
    clear: () => (items.value = []),
  }
}
