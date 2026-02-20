<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  options: { value: string; label: string }[]
  class?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)

const selectedLabel = computed(() => {
  const opt = props.options.find(o => o.value === props.modelValue)
  return opt?.label
})

function select(value: string) {
  emit('update:modelValue', value)
  isOpen.value = false
}

function handleBlur() {
  setTimeout(() => { isOpen.value = false }, 150)
}
</script>

<template>
  <div class="relative" @blur="handleBlur">
    <button
      type="button"
      :class="cn(
        'flex h-12 w-full items-center justify-between rounded-lg border border-input bg-background px-4 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
        !modelValue && 'text-muted-foreground',
        $props.class
      )"
      @click="isOpen = !isOpen"
      @blur="handleBlur"
    >
      <span>{{ selectedLabel || placeholder || 'Select...' }}</span>
      <svg class="h-4 w-4 opacity-50 transition-transform" :class="isOpen && 'rotate-180'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg"
      >
        <div class="max-h-60 overflow-auto p-1">
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            class="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 px-3 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
            :class="modelValue === option.value && 'bg-accent font-medium'"
            @mousedown.prevent="select(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
