<script setup lang="ts">
import type { AuthProvider } from 'iryx-ui'
import { AppleIcon, ArrowLeft02Icon, Github01Icon, GoogleIcon } from '@hugeicons/core-free-icons'
import { ref } from 'vue'
import { product, testimonials } from '../data'

const emit = defineEmits<{ back: [] }>()

const providers: AuthProvider[] = [
  { id: 'google', label: 'Continue with Google', icon: GoogleIcon },
  { id: 'apple', label: 'Continue with Apple', icon: AppleIcon },
  { id: 'github', label: 'Continue with GitHub', icon: Github01Icon },
]

const testimonial = testimonials[0]!

const email = ref('')
const password = ref('')
const remember = ref(true)
const pending = ref<string>()

function signInWith(provider: AuthProvider): void {
  pending.value = provider.id
  window.setTimeout(() => (pending.value = undefined), 1500)
}
</script>

<template>
  <div class="grid min-h-svh bg-background text-foreground lg:grid-cols-2">
    <aside class="hero panel-treatment relative hidden flex-col justify-between border-r border-border bg-muted p-10 lg:flex">
      <div class="hero-aurora" aria-hidden="true" />
      <div class="hero-grid" aria-hidden="true" />

      <a href="#top" class="flex items-center gap-2.5 font-semibold tracking-tight" @click.prevent="emit('back')">
        <img src="/logo.svg" alt="" class="h-5 w-auto">
        {{ product.name }}
      </a>

      <blockquote class="max-w-md">
        <p class="text-lg leading-relaxed text-balance">
          &ldquo;{{ testimonial.quote }}&rdquo;
        </p>
        <footer class="mt-4 text-sm text-muted-foreground">
          {{ testimonial.name }} — {{ testimonial.role }}
        </footer>
      </blockquote>
    </aside>

    <div class="relative grid place-items-center px-5 py-12">
      <IButton variant="ghost" size="sm" class="absolute top-5 right-5" @click="emit('back')">
        <IIcon :icon="ArrowLeft02Icon" data-icon="inline-start" />
        Back to {{ product.name }}
      </IButton>

      <div class="w-full max-w-sm">
        <div class="mb-8 text-center">
          <img src="/logo.svg" alt="" class="mx-auto mb-5 h-7 w-auto lg:hidden">
          <h1 class="text-xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p class="mt-1.5 text-sm text-muted-foreground">
            Sign in to pick up where you left off.
          </p>
        </div>

        <IAuthProviders
          :providers="providers.map(p => ({ ...p, loading: pending === p.id, disabled: !!pending && pending !== p.id }))"
          @select="signInWith"
        />

        <ISeparator label="or" class="my-6" />

        <form class="flex flex-col gap-4" @submit.prevent>
          <IFormField label="Email">
            <IInput v-model="email" type="email" placeholder="you@example.com" autocomplete="email" />
          </IFormField>

          <IFormField label="Password">
            <IPasswordInput v-model="password" autocomplete="current-password" />
          </IFormField>

          <div class="flex items-center justify-between">
            <ICheckbox v-model="remember" label="Remember me" size="sm" />
            <a href="#" class="text-sm font-medium hover:underline" @click.prevent>Forgot password?</a>
          </div>

          <IButton type="submit" block>
            Sign in
          </IButton>
        </form>

        <p class="mt-8 text-center text-sm text-muted-foreground">
          New to {{ product.name }}?
          <a href="#pricing" class="font-medium text-foreground hover:underline" @click.prevent="emit('back')">Start a free trial</a>
        </p>
      </div>
    </div>
  </div>
</template>
