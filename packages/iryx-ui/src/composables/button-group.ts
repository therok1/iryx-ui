import type { ComputedRef, InjectionKey } from 'vue'
import { inject } from 'vue'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** Context a `ButtonGroup` exposes to the buttons it wraps. */
export interface ButtonGroupContext {
  size: ComputedRef<ButtonSize | undefined>
}

export const buttonGroupContextKey: InjectionKey<ButtonGroupContext> = Symbol.for('iryx-ui:button-group')

/**
 * Access the enclosing `ButtonGroup`, if any. Buttons use this to pick up a
 * shared size, so it only has to be set once on the group.
 */
export function useButtonGroup(): ButtonGroupContext | undefined {
  return inject(buttonGroupContextKey, undefined)
}
