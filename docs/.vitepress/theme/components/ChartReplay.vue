<script setup lang="ts">
import type { ChartEasing } from 'iryx-ui'
import { computed, ref } from 'vue'

/**
 * A stage for a chart's reveal: a curve, a duration, and a button that plays
 * it again.
 *
 * The replay is a **remount**, handed to the slot as a `key`. A chart's reveal
 * deliberately runs once per instance — a live dashboard re-animating on every
 * poll reads as a fault — so there is no "play again" API to call, and a demo
 * that wants one asks for a new instance instead. That keeps the component's
 * rule intact rather than widening it for the sake of a docs page.
 */
const key = ref(0)
const easing = ref<ChartEasing>('ease-out')

/** `INumberInput` is strings throughout, so the number is made at the edge. */
const duration = ref('700')

const easings: ChartEasing[] = ['ease-out', 'ease-in', 'ease-in-out', 'linear']

const animate = computed(() => ({
  easing: easing.value,
  duration: Number(duration.value) || 0,
}))

function play(): void {
  key.value++
}
</script>

<template>
  <div class="flex w-full flex-col gap-5">
    <div class="flex flex-wrap items-end justify-center gap-3">
      <IFormField label="Easing" class="w-40">
        <ISelect v-model="easing" :items="easings" />
      </IFormField>

      <IFormField label="Duration (ms)" class="w-36">
        <INumberInput v-model="duration" min="0" step="100" />
      </IFormField>

      <IButton class="mb-px" @click="play">
        Play animation
      </IButton>
    </div>

    <slot :key="key" :animate="animate" />
  </div>
</template>
