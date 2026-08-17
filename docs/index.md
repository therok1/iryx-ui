---
layout: home
---

<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<div class="mx-auto max-w-[90rem] px-4 sm:px-6">
  <section class="flex flex-col items-start gap-6 py-20 sm:py-28">
    <IBadge variant="neutral" dot>v0.11.0 — 42 components</IBadge>
    <h1 class="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
      A Vue component library that gets out of the way.
    </h1>
    <p class="max-w-2xl text-lg text-muted-foreground text-pretty">
      Built on Reka UI for behaviour and Tailwind CSS v4 for style. Every component
      is themeable through plain CSS variables, overridable per slot, and can be
      stripped back to unstyled primitives when you want to take over completely.
    </p>
    <div class="flex flex-wrap items-center gap-3">
      <IButton as="a" :href="withBase('/guide/installation')" size="lg">Get started</IButton>
      <IButton as="a" :href="withBase('/components/')" variant="outline" size="lg">Browse components</IButton>
    </div>
  </section>

  <section class="grid gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-3">
    <ICard>
      <h2 class="font-semibold">Themed with CSS variables</h2>
      <p class="mt-2 text-sm text-muted-foreground">
        Every colour, radius and font resolves to an <code>--iryx-*</code> token you can
        override at runtime — no build step, no plugin, no config file.
      </p>
    </ICard>
    <ICard>
      <h2 class="font-semibold">Accessible by default</h2>
      <p class="mt-2 text-sm text-muted-foreground">
        Reka UI handles focus, keyboard and ARIA. An automated axe sweep runs over
        every component on each commit, and every component renders on the server.
      </p>
    </ICard>
    <ICard>
      <h2 class="font-semibold">Charts without a dependency</h2>
      <p class="mt-2 text-sm text-muted-foreground">
        Bar, line, area and sparkline charts in plain SVG, on a categorical palette
        validated for colour-vision deficiency in both light and dark.
      </p>
    </ICard>
    <ICard>
      <h2 class="font-semibold">Escape hatches everywhere</h2>
      <p class="mt-2 text-sm text-muted-foreground">
        <code>class</code> merges intelligently, <code>ui</code> reaches individual slots,
        and <code>unstyled</code> drops the styling entirely while keeping the behaviour.
      </p>
    </ICard>
    <ICard>
      <h2 class="font-semibold">Forms that carry their own state</h2>
      <p class="mt-2 text-sm text-muted-foreground">
        Any Standard Schema validator, labels and errors wired up automatically, and
        decimal-safe number and money fields whose model is a string.
      </p>
    </ICard>
    <ICard>
      <h2 class="font-semibold">Vue and Nuxt</h2>
      <p class="mt-2 text-sm text-muted-foreground">
        A Vue plugin for global registration, or a Nuxt module with auto-imports.
        Tree-shakeable either way — nothing you don't import is bundled.
      </p>
    </ICard>
  </section>
</div>
