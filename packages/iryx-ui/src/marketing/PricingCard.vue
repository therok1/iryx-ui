<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import { computed, useSlots } from 'vue'
import Badge from '../components/Badge.vue'
import Button from '../components/Button.vue'
import Card from '../components/Card.vue'
import Icon from '../components/Icon.vue'
import { useIryxUiConfig } from '../config'
import { pricingCardTheme } from '../theme/pricing-card'

export interface PricingCardProps {
  name?: string
  /**
   * The price, already formatted — `'€19'`, `'Free'`, `'Custom'`. A string
   * rather than a number: the card never formats currency, because it does not
   * know the locale and half the plans in the world do not name a figure.
   */
  price?: string
  /** What the price is per, e.g. `'/ month'`. */
  period?: string
  description?: string
  /** One line each. Every line gets a tick. */
  features?: string[]
  /** Label for the button. Leave out and no button renders. */
  cta?: string
  /**
   * The plan being pushed: a ring, a heavier shadow and a solid button. One
   * card in a row should carry it.
   */
  featured?: boolean
  /** Text of the badge shown on the featured card. */
  badge?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ amount: 'text-5xl' }`. */
  ui?: {
    root?: string
    header?: string
    name?: string
    price?: string
    amount?: string
    period?: string
    description?: string
    features?: string
    feature?: string
    featureIcon?: string
  }
}

const props = withDefaults(defineProps<PricingCardProps>(), {
  badge: 'Most popular',
  unstyled: undefined,
})

const emit = defineEmits<{ select: [] }>()

const slots = useSlots()

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => pricingCardTheme({ featured: props.featured }))

function slotClass(slot: keyof NonNullable<PricingCardProps['ui']>, extra?: ClassValue): ClassValue {
  if (isUnstyled.value)
    return [props.ui?.[slot], extra]
  return theme.value[slot as 'root']({ class: [props.ui?.[slot], extra] })
}

const hasHeader = computed(() => Boolean(props.name ?? slots.name) || Boolean(props.featured && props.badge))
const hasFooter = computed(() => Boolean(props.cta ?? slots.footer))
</script>

<template>
  <Card :unstyled="props.unstyled" :class="slotClass('root', props.class)">
    <template v-if="hasHeader" #header>
      <div :class="slotClass('header')">
        <h3 :class="slotClass('name')">
          <slot name="name">
            {{ props.name }}
          </slot>
        </h3>

        <slot name="badge">
          <Badge v-if="props.featured && props.badge" size="sm">
            {{ props.badge }}
          </Badge>
        </slot>
      </div>
    </template>

    <p v-if="props.price != null || slots.price" :class="slotClass('price')">
      <slot name="price">
        <span :class="slotClass('amount')">{{ props.price }}</span>
        <span v-if="props.period" :class="slotClass('period')">{{ props.period }}</span>
      </slot>
    </p>

    <p v-if="props.description || slots.description" :class="slotClass('description')">
      <slot name="description">
        {{ props.description }}
      </slot>
    </p>

    <ul v-if="props.features?.length" :class="slotClass('features')">
      <li v-for="line in props.features" :key="line" :class="slotClass('feature')">
        <Icon :icon="Tick02Icon" :class="slotClass('featureIcon')" />
        {{ line }}
      </li>
    </ul>

    <slot />

    <template v-if="hasFooter" #footer>
      <slot name="footer">
        <Button :variant="props.featured ? 'solid' : 'outline'" block @click="emit('select')">
          {{ props.cta }}
        </Button>
      </slot>
    </template>
  </Card>
</template>
