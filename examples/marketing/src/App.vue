<script setup lang="ts">
import {
  ArrowRight02Icon,
  Menu01Icon,
  Moon02Icon,
  Sun03Icon,
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
        <IHero
          grid
          :description="product.summary"
          note="Free for five invoices a month. No card."
        >
          <template #badge>
            <IBadge variant="info" dot>
              Now billing in 14 currencies
            </IBadge>
          </template>

          <template #heading>
            {{ product.tagline }}
          </template>

          <template #actions>
            <IButton size="lg">
              Start free
              <IIcon :icon="ArrowRight02Icon" data-icon="inline-end" />
            </IButton>
            <IButton size="lg" variant="outline">
              See a sample invoice
            </IButton>
          </template>

          <template #media>
            <IBrowserFrame url="app.iryx.example/invoices" :ratio="16 / 10" class="mx-auto max-w-4xl">
              <div class="shot grid h-full w-full place-items-center">
                <span class="text-sm text-muted-foreground">Product screenshot</span>
              </div>
            </IBrowserFrame>
          </template>
        </IHero>

        <ISection padding="none" class="pb-20" eyebrow="Billing runs on Iryx Billing at">
          <div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <span
              v-for="name in customers"
              :key="name"
              class="text-sm font-medium text-muted-foreground/70"
            >
              {{ name }}
            </span>
          </div>
        </ISection>

        <ISection padding="none" class="pb-20">
          <div class="grid gap-4 sm:grid-cols-3">
            <IStat
              v-for="stat in stats"
              :key="stat.label"
              :value="stat.value"
              :label="stat.label"
              :ui="{ root: 'flex-col-reverse', row: 'justify-center' }"
              size="lg"
              as="div"
              class="rounded-xl border border-border bg-muted/50 p-6 text-center shadow-xs"
            />
          </div>
        </ISection>

        <ISection
          id="features"
          tone="muted"
          bordered
          heading="Everything the money side needs"
          description="Not a general ledger. The part of the ledger that decides whether you get paid this month."
        >
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <IFeatureCard
              v-for="feature in features"
              :key="feature.title"
              :title="feature.title"
              :description="feature.description"
            />
          </div>
        </ISection>

        <ISection
          id="pricing"
          heading="One price, whatever you invoice"
          description="No percentage of what you bill. Change plan or leave from the billing page."
        >
          <IPricingTable :plans="plans" badge="Most chosen" />
        </ISection>

        <ISection
          id="customers"
          tone="muted"
          bordered
          heading="People who stopped chasing"
        >
          <div class="grid gap-4 lg:grid-cols-3">
            <ITestimonialCard
              v-for="voice in testimonials"
              :key="voice.name"
              :quote="voice.quote"
              :name="voice.name"
              :role="voice.role"
            />
          </div>
        </ISection>

        <ISection id="questions" size="md" heading="Questions people ask first">
          <IAccordion
            variant="outline"
            :items="questions.map(entry => ({ label: entry.question, content: entry.answer }))"
          />
        </ISection>

        <ISection bordered>
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
        </ISection>
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
