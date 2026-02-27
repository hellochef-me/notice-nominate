<script setup lang="ts">
import { computed } from 'vue'
import Button from './ui/button/Button.vue'
import { coreValues } from '@/data/coreValues'

const props = defineProps<{
  nominatorName: string
  nominatorDepartment: string
  nomineeName: string
  nomineeDepartment: string
  coreValue: string
  behavior: string
  story: string
}>()

defineEmits<{
  back: []
  submit: []
}>()

const formattedDate = computed(() =>
  new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-')
)

const selectedValueDisplay = computed(() => {
  const value = coreValues.find(v => v.id === props.coreValue)
  if (!value) return props.behavior
  return `${value.label} - ${props.behavior}`
})
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-xl sm:text-2xl font-semibold text-foreground text-center">
      Employee Nomination Card
    </h2>

    <!-- Two-column: Nominee | Nominator -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div class="space-y-3">
        <div>
          <p class="text-xs font-medium text-muted-foreground mb-1">Nominee's Name:</p>
          <p class="text-sm font-medium text-foreground">{{ nomineeName }}</p>
        </div>
        <div>
          <p class="text-xs font-medium text-muted-foreground mb-1">Nominee's Department:</p>
          <p class="text-sm font-medium text-foreground">{{ nomineeDepartment }}</p>
        </div>
      </div>
      <div class="space-y-3">
        <div>
          <p class="text-xs font-medium text-muted-foreground mb-1">Your Name:</p>
          <p class="text-sm font-medium text-foreground">{{ nominatorName }}</p>
        </div>
        <div>
          <p class="text-xs font-medium text-muted-foreground mb-1">Your Department:</p>
          <p class="text-sm font-medium text-foreground">{{ nominatorDepartment }}</p>
        </div>
        <div>
          <p class="text-xs font-medium text-muted-foreground mb-1">Date:</p>
          <p class="text-sm font-medium text-foreground">{{ formattedDate }}</p>
        </div>
      </div>
    </div>

    <!-- Nomination Value -->
    <div class="space-y-2">
      <p class="text-xs font-medium text-muted-foreground">Nomination Value:</p>
      <p class="text-sm font-medium text-foreground">{{ selectedValueDisplay }}</p>
    </div>

    <!-- Reason for Nomination -->
    <div class="space-y-2">
      <p class="text-xs font-medium text-muted-foreground">Reason for Nomination:</p>
      <div
        class="p-3 rounded-lg border bg-muted/30 text-foreground text-sm whitespace-pre-wrap min-h-[120px]"
      >
        {{ story }}
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex items-center justify-between pt-4">
      <Button variant="ghost" @click="$emit('back')">
        <svg class="mr-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 17l-5-5m0 0l5-5m-5 5h12" />
        </svg>
        Go Back
      </Button>
      <Button @click="$emit('submit')">
        Submit
        <svg class="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </Button>
    </div>
  </div>
</template>
