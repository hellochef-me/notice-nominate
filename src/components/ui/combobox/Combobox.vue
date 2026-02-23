<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  options: { value: string; label: string }[]
  allowCustom?: boolean
  class?: string
}>(), {
  allowCustom: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const searchQuery = ref('')
const isOpen = ref(false)
const highlightedIndex = ref(-1)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLDivElement | null>(null)

watch(() => props.modelValue, (val) => {
  const match = props.options.find(o => o.value === val)
  searchQuery.value = match?.label ?? val ?? ''
}, { immediate: true })

const filteredOptions = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return props.options
  return props.options.filter(o => o.label.toLowerCase().includes(q))
})

function openDropdown() {
  isOpen.value = true
  highlightedIndex.value = -1
}

function closeDropdown() {
  isOpen.value = false
  highlightedIndex.value = -1
}

function selectOption(option: { value: string; label: string }) {
  searchQuery.value = option.label
  emit('update:modelValue', option.value)
  closeDropdown()
}

function handleInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  searchQuery.value = val
  isOpen.value = true
  highlightedIndex.value = -1

  if (props.allowCustom) {
    emit('update:modelValue', val)
  } else {
    const exact = props.options.find(o => o.label.toLowerCase() === val.toLowerCase())
    emit('update:modelValue', exact ? exact.value : '')
  }
}

function handleFocus() {
  openDropdown()
}

function handleBlur() {
  setTimeout(() => {
    if (!props.allowCustom) {
      const exact = props.options.find(o => o.label.toLowerCase() === searchQuery.value.toLowerCase())
      if (exact) {
        searchQuery.value = exact.label
        emit('update:modelValue', exact.value)
      } else {
        searchQuery.value = ''
        emit('update:modelValue', '')
      }
    }
    closeDropdown()
  }, 150)
}

function handleKeydown(e: KeyboardEvent) {
  if (!isOpen.value && e.key !== 'Escape') {
    openDropdown()
  }

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      if (highlightedIndex.value < filteredOptions.value.length - 1) {
        highlightedIndex.value++
      } else {
        highlightedIndex.value = 0
      }
      scrollToHighlighted()
      break

    case 'ArrowUp':
      e.preventDefault()
      if (highlightedIndex.value > 0) {
        highlightedIndex.value--
      } else {
        highlightedIndex.value = filteredOptions.value.length - 1
      }
      scrollToHighlighted()
      break

    case 'Enter':
      if (isOpen.value && highlightedIndex.value >= 0 && filteredOptions.value[highlightedIndex.value]) {
        e.preventDefault()
        e.stopPropagation()
        selectOption(filteredOptions.value[highlightedIndex.value])
      } else if (isOpen.value && filteredOptions.value.length === 1) {
        e.preventDefault()
        e.stopPropagation()
        selectOption(filteredOptions.value[0])
      }
      break

    case 'Escape':
      e.preventDefault()
      closeDropdown()
      break
  }
}

function scrollToHighlighted() {
  nextTick(() => {
    if (!listRef.value) return
    const items = listRef.value.querySelectorAll('[data-combobox-option]')
    const target = items[highlightedIndex.value] as HTMLElement | undefined
    target?.scrollIntoView({ block: 'nearest' })
  })
}
</script>

<template>
  <div class="relative">
    <input
      ref="inputRef"
      type="text"
      :value="searchQuery"
      :placeholder="placeholder || 'Search...'"
      :class="cn(
        'flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
        $props.class
      )"
      autocomplete="off"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    />
    <svg
      class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none transition-transform"
      :class="isOpen && 'rotate-180'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen && filteredOptions.length > 0"
        class="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg"
      >
        <div ref="listRef" class="max-h-60 overflow-auto p-1">
          <button
            v-for="(option, idx) in filteredOptions"
            :key="option.value"
            type="button"
            data-combobox-option
            class="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 px-3 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
            :class="[
              modelValue === option.value && 'font-medium',
              highlightedIndex === idx && 'bg-accent text-accent-foreground',
            ]"
            @mousedown.prevent="selectOption(option)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
