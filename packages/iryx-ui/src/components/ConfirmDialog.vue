<script setup lang="ts">
import { computed } from 'vue'
import { resolveConfirm, useConfirmState } from '../composables/confirm'
import Button from './Button.vue'
import Dialog from './Dialog.vue'

export interface ConfirmDialogProps {
  /** Fallback confirm label, used when a request doesn't supply one. */
  confirmLabel?: string
  /** Fallback cancel label, used when a request doesn't supply one. */
  cancelLabel?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
}

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  size: 'sm',
  unstyled: undefined,
})

const request = useConfirmState()

const open = computed({
  get: () => request.value != null,
  // Dismissing (Escape, overlay, close button) counts as declining.
  set: (value: boolean) => {
    if (!value)
      resolveConfirm(false)
  },
})
</script>

<template>
  <Dialog
    v-if="request"
    v-model:open="open"
    :title="request.title"
    :description="request.description"
    :size="props.size"
    :close-label="request.cancelLabel ?? props.cancelLabel"
    :show-close="false"
    :unstyled="props.unstyled"
    :class="props.class"
  >
    <template #footer>
      <Button variant="outline" @click="resolveConfirm(false)">
        {{ request.cancelLabel ?? props.cancelLabel }}
      </Button>
      <Button
        :class="request.danger ? 'bg-danger bg-none text-danger-foreground hover:brightness-110' : undefined"
        @click="resolveConfirm(true)"
      >
        {{ request.confirmLabel ?? props.confirmLabel }}
      </Button>
    </template>
  </Dialog>
</template>
