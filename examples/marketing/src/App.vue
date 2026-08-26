<script setup lang="ts">
import {
  ArrowRight02Icon,
  Menu01Icon,
  Moon02Icon,
  Sun03Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { useAppearance } from 'iryx-ui'
import { ref } from 'vue'
import { customers, features, plans, product, questions, stats, testimonials } from './data'
import SignIn from './pages/SignIn.vue'

const { isDark, setAppearance } = useAppearance()

function toggleAppearance(): void {
  setAppearance(isDark.value ? 'light' : 'dark')
}

const nav = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Customers', href: '#customers' },
  { label: 'Questions', href: '#questions' },
]

const menuOpen = ref(false)

const view = ref<'home' | 'signIn'>('home')
</script>

<template>
  <IApp>
    <SignIn v-if="view === 'signIn'" @back="view = 'home'" />

    <div v-else class="min-h-svh bg-background text-foreground">
      <header class="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <IContainer class="flex h-16 items-center gap-6">
          <a href="#top" class="flex items-center gap-2.5 font-semibold tracking-tight">
            <img src="/logo.svg" alt="" class="h-5 w-auto">
            {{ product.name }}
          </a>

          <nav class="ml-4 hidden items-center gap-1 md:flex">
            <a
              v-for="link in nav"
              :key="link.href"
              :href="link.href"
              class="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {{ link.label }}
            </a>
          </nav>

          <div class="ml-auto flex items-center gap-2">
            <IButton
              variant="ghost"
              size="sm"
              square
              :aria-label="isDark ? 'Switch to light appearance' : 'Switch to dark appearance'"
              @click="toggleAppearance"
            >
              <IIcon :icon="isDark ? Sun03Icon : Moon02Icon" data-icon />
            </IButton>

            <IButton variant="ghost" size="sm" class="hidden sm:inline-flex" @click="view = 'signIn'">
              Sign in
            </IButton>
            <IButton size="sm">
              Start free
            </IButton>

            <IDrawer v-model:open="menuOpen" side="right" title="Menu" class="md:hidden">
              <template #trigger>
                <IButton variant="ghost" size="sm" square aria-label="Open the menu" class="md:hidden">
                  <IIcon :icon="Menu01Icon" data-icon />
                </IButton>
              </template>

              <nav class="flex flex-col">
                <a
                  v-for="link in nav"
                  :key="link.href"
                  :href="link.href"
                  class="rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent"
                  @click="menuOpen = false"
                >
                  {{ link.label }}
                </a>

                <ISeparator class="my-2" />

                <button
                  type="button"
                  class="rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent"
                  @click="menuOpen = false; view = 'signIn'"
                >
                  Sign in
                </button>
              </nav>
            </IDrawer>
          </div>
        </IContainer>
      </header>

      <main id="top">
        <section class="hero">
          <div class="hero-aurora" aria-hidden="true" />
          <div class="hero-grid" aria-hidden="true" />

          <IContainer class="py-20 text-center sm:py-28">
            <IBadge variant="info" dot class="mb-6">
              Now billing in 14 currencies
            </IBadge>

            <h1 class="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
              {{ product.tagline }}
            </h1>

            <p class="mx-auto mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
              {{ product.summary }}
            </p>

            <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
              <IButton size="lg">
                Start free
                <IIcon :icon="ArrowRight02Icon" data-icon="inline-end" />
              </IButton>
              <IButton size="lg" variant="outline">
                See a sample invoice
              </IButton>
            </div>

            <p class="mt-4 text-sm text-muted-foreground">
              Free for five invoices a month. No card.
            </p>

            <div class="mx-auto mt-16 max-w-4xl">
              <ICard padding="none" class="overflow-hidden text-left shadow-lg">
                <div class="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
                  <span class="size-2.5 rounded-full bg-muted-foreground/25" />
                  <span class="size-2.5 rounded-full bg-muted-foreground/25" />
                  <span class="size-2.5 rounded-full bg-muted-foreground/25" />
                  <span class="ml-3 rounded-md bg-background px-2.5 py-1 text-xs text-muted-foreground">
                    app.iryx.example/invoices
                  </span>
                </div>

                <IAspectRatio :ratio="16 / 10" class="rounded-t-none">
                  <div class="shot grid h-full w-full place-items-center">
                    <span class="text-sm text-muted-foreground">Product screenshot</span>
                  </div>
                </IAspectRatio>
              </ICard>
            </div>
          </IContainer>
        </section>

        <IContainer class="pb-20">
          <p class="text-center text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Billing runs on Iryx Billing at
          </p>
          <div class="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <span
              v-for="name in customers"
              :key="name"
              class="text-sm font-medium text-muted-foreground/70"
            >
              {{ name }}
            </span>
          </div>
        </IContainer>

        <IContainer class="pb-20">
          <div class="grid gap-4 sm:grid-cols-3">
            <ICard v-for="stat in stats" :key="stat.label" class="bg-muted/50 text-center shadow-xs">
              <p class="text-3xl font-semibold tracking-tight tabular-nums">
                {{ stat.value }}
              </p>
              <p class="mt-1 text-sm text-muted-foreground">
                {{ stat.label }}
              </p>
            </ICard>
          </div>
        </IContainer>

        <section id="features" class="border-t border-border bg-muted/20 py-20 sm:py-24">
          <IContainer>
            <div class="mx-auto max-w-2xl text-center">
              <h2 class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Everything the money side needs
              </h2>
              <p class="mt-4 text-pretty text-muted-foreground">
                Not a general ledger. The part of the ledger that decides whether you get paid this month.
              </p>
            </div>

            <div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ICard v-for="feature in features" :key="feature.title" class="shadow-xs">
                <h3 class="font-medium">
                  {{ feature.title }}
                </h3>
                <p class="mt-2 text-sm text-pretty text-muted-foreground">
                  {{ feature.description }}
                </p>
              </ICard>
            </div>
          </IContainer>
        </section>

        <section id="pricing" class="py-20 sm:py-24">
          <IContainer>
            <div class="mx-auto max-w-2xl text-center">
              <h2 class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                One price, whatever you invoice
              </h2>
              <p class="mt-4 text-pretty text-muted-foreground">
                No percentage of what you bill. Change plan or leave from the billing page.
              </p>
            </div>

            <div class="mt-12 grid items-start gap-4 lg:grid-cols-3">
              <ICard
                v-for="plan in plans"
                :key="plan.name"
                class="shadow-xs" :class="[
                  plan.featured ? 'border-primary shadow-md ring-1 ring-primary/20' : undefined,
                ]"
              >
                <template #header>
                  <div class="flex items-center justify-between gap-2">
                    <h3 class="font-medium">
                      {{ plan.name }}
                    </h3>
                    <IBadge v-if="plan.featured" size="sm">
                      Most chosen
                    </IBadge>
                  </div>
                </template>

                <p class="flex items-baseline gap-1.5">
                  <span class="text-4xl font-semibold tracking-tight tabular-nums">{{ plan.price }}</span>
                  <span class="text-sm text-muted-foreground">{{ plan.period }}</span>
                </p>
                <p class="mt-2 text-sm text-muted-foreground">
                  {{ plan.description }}
                </p>

                <ul class="mt-6 flex flex-col gap-2.5">
                  <li
                    v-for="line in plan.features"
                    :key="line"
                    class="flex items-start gap-2 text-sm"
                  >
                    <IIcon :icon="Tick02Icon" class="mt-0.5 size-4 shrink-0 text-primary" />
                    {{ line }}
                  </li>
                </ul>

                <template #footer>
                  <IButton :variant="plan.featured ? 'solid' : 'outline'" block>
                    {{ plan.cta }}
                  </IButton>
                </template>
              </ICard>
            </div>
          </IContainer>
        </section>

        <section id="customers" class="border-t border-border bg-muted/20 py-20 sm:py-24">
          <IContainer>
            <div class="mx-auto max-w-2xl text-center">
              <h2 class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                People who stopped chasing
              </h2>
            </div>

            <div class="mt-12 grid gap-4 lg:grid-cols-3">
              <ICard v-for="voice in testimonials" :key="voice.name" class="shadow-xs">
                <p class="text-pretty">
                  “{{ voice.quote }}”
                </p>
                <template #footer>
                  <div class="flex items-center gap-3">
                    <IAvatar :name="voice.name" size="sm" />
                    <div class="min-w-0">
                      <p class="truncate text-sm font-medium">
                        {{ voice.name }}
                      </p>
                      <p class="truncate text-xs text-muted-foreground">
                        {{ voice.role }}
                      </p>
                    </div>
                  </div>
                </template>
              </ICard>
            </div>
          </IContainer>
        </section>

        <section id="questions" class="py-20 sm:py-24">
          <IContainer size="md">
            <div class="text-center">
              <h2 class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Questions people ask first
              </h2>
            </div>

            <IAccordion
              class="mt-10"
              variant="outline"
              :items="questions.map(entry => ({ label: entry.question, content: entry.answer }))"
            />
          </IContainer>
        </section>

        <section class="border-t border-border py-20 sm:py-24">
          <IContainer>
            <ICard padding="lg" class="bg-muted/50 text-center shadow-xs">
              <h2 class="text-3xl font-semibold tracking-tight text-balance">
                Send your next invoice from Iryx Billing
              </h2>
              <p class="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
                Five invoices a month cost nothing, and the reminders work on the free plan too.
              </p>
              <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
                <IButton size="lg">
                  Start free
                  <IIcon :icon="ArrowRight02Icon" data-icon="inline-end" />
                </IButton>
                <IButton size="lg" variant="outline">
                  Book a walkthrough
                </IButton>
              </div>
            </ICard>
          </IContainer>
        </section>
      </main>

      <footer class="border-t border-border py-12">
        <IContainer class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <span class="flex items-center gap-2.5 text-sm font-medium">
            <img src="/logo.svg" alt="" class="h-4 w-auto">
            {{ product.name }}
          </span>

          <nav class="flex flex-wrap gap-x-6 gap-y-2">
            <a
              v-for="link in [...nav, { label: 'Status', href: '#top' }, { label: 'Privacy', href: '#top' }]"
              :key="link.label"
              :href="link.href"
              class="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {{ link.label }}
            </a>
          </nav>

          <p class="text-sm text-muted-foreground">
            © 2026 Iryx Billing. A fictional product.
          </p>
        </IContainer>
      </footer>
    </div>
  </IApp>
</template>
