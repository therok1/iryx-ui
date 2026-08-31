<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { computed, useSlots } from 'vue'
import Avatar from '../components/Avatar.vue'
import Card from '../components/Card.vue'
import { useIryxUiConfig } from '../config'
import { testimonialCardTheme } from '../theme/testimonial-card'

export interface TestimonialCardProps {
  /** What they said. Curly quotes are added around it. */
  quote?: string
  /** Who said it. Also derives the avatar's initials. */
  name?: string
  /** Their job, company, or both. */
  role?: string
  /** Their photo. Initials stand in without one. */
  avatar?: string
  size?: 'sm' | 'md' | 'lg'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ quote: 'italic' }`. */
  ui?: {
    root?: string
    quote?: string
    author?: string
    identity?: string
    name?: string
    role?: string
  }
}

const props = withDefaults(defineProps<TestimonialCardProps>(), {
  unstyled: undefined,
})

const slots = useSlots()

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => testimonialCardTheme({ size: props.size }))

function slotClass(slot: keyof NonNullable<TestimonialCardProps['ui']>, extra?: ClassValue): ClassValue {
  if (isUnstyled.value)
    return [props.ui?.[slot], extra]
  return theme.value[slot as 'root']({ class: [props.ui?.[slot], extra] })
}

const hasAuthor = computed(() => Boolean(props.name ?? props.role) || Boolean(slots.author))
</script>

<template>
  <Card :unstyled="props.unstyled" :class="slotClass('root', props.class)">
    <!-- A `blockquote`: the words are quoted, the attribution beside them is not. -->
    <blockquote v-if="props.quote || slots.default" :class="slotClass('quote')">
      <slot>
        &ldquo;{{ props.quote }}&rdquo;
      </slot>
    </blockquote>

    <template v-if="hasAuthor" #footer>
      <slot name="author">
        <div :class="slotClass('author')">
          <!-- `alt` stays empty: the name is printed right beside it. -->
          <Avatar :src="props.avatar" :name="props.name" alt="" size="sm" />

          <div :class="slotClass('identity')">
            <p v-if="props.name" :class="slotClass('name')">
              {{ props.name }}
            </p>
            <p v-if="props.role" :class="slotClass('role')">
              {{ props.role }}
            </p>
          </div>
        </div>
      </slot>
    </template>
  </Card>
</template>
