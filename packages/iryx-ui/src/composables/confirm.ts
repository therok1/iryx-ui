import { shallowRef } from 'vue'

export interface ConfirmOptions {
  title: string
  description?: string
  /** Text for the confirming button. Supply your own for non-English apps. */
  confirmLabel?: string
  /** Text for the dismissing button. Supply your own for non-English apps. */
  cancelLabel?: string
  /** Style the confirming button as destructive. */
  danger?: boolean
}

/** An open request, plus the resolver its promise is waiting on. */
export interface ConfirmRequest extends ConfirmOptions {
  id: number
  resolve: (confirmed: boolean) => void
}

/*
 * Module-level state, so `confirm()` can be called from anywhere — including
 * plain functions outside a component's setup, which is the whole point of an
 * imperative API. `<IConfirmDialog>` renders whatever is here.
 */
const active = shallowRef<ConfirmRequest | null>(null)
let nextId = 0

/** Internal: the request `<IConfirmDialog>` should currently render. */
export function useConfirmState() {
  return active
}

/** Settle the open request and clear it. */
export function resolveConfirm(confirmed: boolean): void {
  const request = active.value
  if (!request)
    return
  active.value = null
  request.resolve(confirmed)
}

export interface ConfirmApi {
  /** Resolves `true` if the user confirms, `false` if they cancel or dismiss. */
  confirm: (options: ConfirmOptions | string) => Promise<boolean>
}

/**
 * Promise-based confirmation for destructive actions.
 *
 * Requires a single `<IConfirmDialog />` mounted somewhere in the app —
 * typically just inside `<IApp>`.
 *
 * ```ts
 * const { confirm } = useConfirm()
 * if (await confirm({ title: 'Delete draft?', danger: true }))
 *   await remove()
 * ```
 */
export function useConfirm(): ConfirmApi {
  function confirm(options: ConfirmOptions | string): Promise<boolean> {
    const resolved = typeof options === 'string' ? { title: options } : options

    // A second call supersedes the first; the old promise resolves false so
    // nothing is left awaiting forever.
    resolveConfirm(false)

    return new Promise<boolean>((resolve) => {
      active.value = { ...resolved, id: nextId++, resolve }
    })
  }

  return { confirm }
}
