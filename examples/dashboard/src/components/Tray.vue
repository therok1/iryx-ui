<script setup lang="ts">
import type { IconLike } from 'iryx-ui'

defineProps<{ label: string, icon: IconLike }>()
</script>

<template>
  <section class="flex flex-col rounded-2xl bg-muted/60 p-1">
    <header class="flex flex-wrap items-center gap-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap">
      <IIcon :icon="icon" class="size-4 text-muted-foreground" />
      {{ label }}
      <slot name="actions" />
    </header>
    <div class="flex flex-1 gap-1 max-lg:flex-col">
      <slot />
    </div>
  </section>
</template>
