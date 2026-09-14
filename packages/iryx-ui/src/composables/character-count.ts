import { computed } from 'vue'

export function defaultCountLabel(remaining: number): string {
  return `${remaining} ${remaining === 1 ? 'character' : 'characters'} left`
}

export function useCharacterCount(value: () => string | number | null | undefined, max: () => number | undefined) {
  const length = computed(() => String(value() ?? '').length)
  const remaining = computed(() => {
    const limit = max()
    return limit == null ? undefined : limit - length.value
  })
  const nearLimit = computed(() => remaining.value != null && remaining.value <= Math.ceil(max()! * 0.1))
  const text = computed(() => (max() == null ? `${length.value}` : `${length.value}/${max()}`))
  return { remaining, nearLimit, text }
}
