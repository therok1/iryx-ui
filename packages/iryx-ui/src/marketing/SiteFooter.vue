<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { SiteLink } from './SiteHeader.vue'
import { Primitive } from 'reka-ui'
import { computed, useSlots } from 'vue'
import Container from '../components/Container.vue'
import { useIryxUiConfig } from '../config'
import { siteFooterTheme } from '../theme/site-footer'

export interface SiteFooterProps {
  /** Render as a different element or component. */
  as?: string
  /** The product's name, beside the logo. */
  name?: string
  /** Where the brand links to. Omit to render the name as plain text. */
  href?: string
  links?: SiteLink[]
  /** The line of small print, usually a copyright. */
  note?: string
  bordered?: boolean
  /** Vertical rhythm. */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Maximum content width, passed to the container. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ nav: 'gap-x-10' }`. */
  ui?: {
    root?: string
    container?: string
    brand?: string
    nav?: string
    link?: string
    note?: string
  }
}

const props = withDefaults(defineProps<SiteFooterProps>(), {
  as: 'footer',
  bordered: undefined,
  unstyled: undefined,
})

const slots = useSlots()

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() =>
  siteFooterTheme({ bordered: props.bordered ?? true, padding: props.padding }),
)

function slotClass(slot: keyof NonNullable<SiteFooterProps['ui']>, extra?: ClassValue): ClassValue {
  if (isUnstyled.value)
    return [props.ui?.[slot], extra]
  return theme.value[slot as 'root']({ class: [props.ui?.[slot], extra] })
}
</script>

<template>
  <Primitive :as="props.as" :class="slotClass('root', props.class)">
    <Container :size="props.size" :class="slotClass('container')">
      <!-- A link only when there is somewhere to go: the page a footer sits on
           is often the one the brand would link to. -->
      <component
        :is="props.href ? 'a' : 'span'"
        v-if="props.name || slots.brand"
        :href="props.href"
        :class="slotClass('brand')"
      >
        <slot name="brand">
          {{ props.name }}
        </slot>
      </component>

      <nav v-if="props.links?.length || slots.links" :class="slotClass('nav')">
        <slot name="links">
          <a
            v-for="link in props.links"
            :key="link.href"
            :href="link.href"
            :aria-current="link.current ? 'page' : undefined"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noreferrer' : undefined"
            :class="slotClass('link')"
          >
            {{ link.label }}
          </a>
        </slot>
      </nav>

      <p v-if="props.note || slots.note" :class="slotClass('note')">
        <slot name="note">
          {{ props.note }}
        </slot>
      </p>

      <slot />
    </Container>
  </Primitive>
</template>
