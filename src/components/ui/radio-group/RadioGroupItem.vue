<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'

const props = defineProps<{
  value: string
  label: string
  description?: string
}>()

const group = inject<{
  selected: Ref<string>
  selectValue: (val: string) => void
}>('radio-group')!

const isSelected = computed(() => group.selected.value === props.value)
</script>

<template>
  <button
    type="button"
    role="radio"
    :aria-checked="isSelected"
    class="flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
    :class="isSelected ? 'border-primary bg-primary/10 shadow-sm' : 'border-border'"
    @click="group.selectValue(value)"
  >
    <span
      class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all"
      :class="isSelected ? 'border-primary' : 'border-muted-foreground/40'"
    >
      <span
        v-if="isSelected"
        class="h-2.5 w-2.5 rounded-full bg-primary"
      />
    </span>
    <div class="flex-1">
      <span class="font-medium text-foreground">{{ label }}</span>
      <p v-if="description" class="mt-1 text-sm text-muted-foreground">{{ description }}</p>
    </div>
  </button>
</template>
