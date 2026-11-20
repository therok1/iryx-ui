<script setup lang="ts">
import type { Appearance, FormError } from 'iryx-ui'
import { CreditCardIcon, Notification03Icon, PaintBoardIcon, UserIcon } from '@hugeicons/core-free-icons'
import { useAppearance, useToast } from 'iryx-ui'
import { reactive, ref } from 'vue'
import Tray from '../components/Tray.vue'
import { user } from '../data'

const { success } = useToast()
const { appearance, setAppearance } = useAppearance()

const state = reactive({
  name: user.name,
  role: user.role,
  company: 'Northwind Ops',
  email: 'billing@iryx.example',
  terms: '30',
  currency: 'EUR',
  reminders: true,
  attachPdf: true,
})

function validate(values: typeof state): FormError[] {
  const errors: FormError[] = []

  if (!values.name.trim())
    errors.push({ name: 'name', message: 'Your name is on the emails you send.' })

  if (!values.company.trim())
    errors.push({ name: 'company', message: 'A company name appears on every invoice.' })

  if (!values.email.includes('@'))
    errors.push({ name: 'email', message: 'Enter an address replies can reach.' })

  if (!/^\d+$/.test(values.terms) || Number(values.terms) < 1)
    errors.push({ name: 'terms', message: 'Payment terms are a whole number of days.' })

  return errors
}

const roles = [
  { label: 'Owner', value: 'owner' },
  { label: 'Administrator', value: 'admin' },
  { label: 'Accountant', value: 'accountant' },
  { label: 'Viewer', value: 'viewer' },
]

const currencies = [
  { label: 'Euro (EUR)', value: 'EUR' },
  { label: 'Pound sterling (GBP)', value: 'GBP' },
  { label: 'US dollar (USD)', value: 'USD' },
]

const appearances: { label: string, value: Appearance }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Match system', value: 'system' },
  { label: 'Dark', value: 'dark' },
]

const saving = ref(false)

async function onSubmit(): Promise<void> {
  saving.value = true
  await new Promise(resolve => setTimeout(resolve, 600))
  saving.value = false
  success('Billing settings saved')
}
</script>

<template>
  <div class="flex max-w-2xl flex-col gap-6">
    <IPageHeader title="Settings" description="How invoices are issued and chased." />

    <IForm :state="state" :validate="validate" class="flex flex-col gap-4" @submit="onSubmit">
      <Tray label="Profile" :icon="UserIcon">
        <ICard padding="none" class="flex-1 overflow-hidden rounded-xl shadow-none">
          <div class="flex items-center gap-4 border-b border-border p-4">
            <IAvatar :name="state.name" size="lg" class="bg-muted" />

            <div class="min-w-0 flex-1">
              <p class="truncate font-medium">
                {{ state.name || 'Unnamed' }}
              </p>
              <p class="truncate text-sm text-muted-foreground">
                {{ user.email }}
              </p>
            </div>

            <IButton class="rounded-full" variant="outline" size="sm" type="button">
              Change photo
            </IButton>
          </div>

          <div class="grid gap-4 p-4 sm:grid-cols-2">
            <IFormField name="name" label="Full name" required>
              <IInput v-model="state.name" class="rounded-full" />
            </IFormField>

            <IFormField
              name="role"
              label="Role"
              help="Decides what this account can see and change."
            >
              <ISelect v-model="state.role" :ui="{ content: 'rounded-2xl', item: 'rounded-xl' }" class="rounded-full" :items="roles" />
            </IFormField>
          </div>
        </ICard>
      </Tray>

      <Tray label="Billing details" :icon="CreditCardIcon">
        <ICard padding="md" class="flex-1 rounded-xl shadow-none">
          <div class="flex flex-col gap-4">
            <IFormField name="company" label="Company name" required>
              <IInput v-model="state.company" class="rounded-full" />
            </IFormField>

            <IFormField
              name="email"
              label="Billing email"
              help="Replies to invoices and reminders arrive here."
              required
            >
              <IInput v-model="state.email" class="rounded-full" type="email" />
            </IFormField>

            <div class="grid gap-4 sm:grid-cols-2">
              <IFormField name="terms" label="Payment terms" hint="Days" required>
                <INumberInput v-model="state.terms" :ui="{ input: 'rounded-full', stepper: 'rounded-e-full' }" min="1" max="180" />
              </IFormField>

              <IFormField name="currency" label="Currency">
                <ISelect v-model="state.currency" :ui="{ content: 'rounded-2xl', item: 'rounded-xl' }" class="rounded-full" :items="currencies" />
              </IFormField>
            </div>
          </div>
        </ICard>
      </Tray>

      <Tray label="Reminders" :icon="Notification03Icon">
        <ICard padding="md" class="flex-1 rounded-xl shadow-none">
          <div class="flex flex-col gap-4">
            <ISwitch
              v-model="state.reminders"
              label="Chase overdue invoices"
              description="Sends a reminder three days after the due date, then weekly."
            />
            <ISwitch
              v-model="state.attachPdf"
              label="Attach a PDF"
              description="Some customers' systems will not accept a link."
            />
          </div>
        </ICard>
      </Tray>

      <Tray label="Appearance" :icon="PaintBoardIcon">
        <ICard padding="md" class="flex-1 rounded-xl shadow-none">
          <IRadioGroup
            :model-value="appearance"
            :items="appearances"
            orientation="horizontal"
            @update:model-value="(value) => setAppearance(value as Appearance)"
          />
        </ICard>
      </Tray>

      <div class="flex justify-end gap-3">
        <IButton class="rounded-full" type="reset" variant="ghost">
          Discard
        </IButton>
        <IButton class="rounded-full" type="submit" :loading="saving">
          Save changes
        </IButton>
      </div>
    </IForm>
  </div>
</template>
