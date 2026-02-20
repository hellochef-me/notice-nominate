<script setup lang="ts">
import { provide, ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selected = ref(props.modelValue ?? '')

watch(() => props.modelValue, (val) => {
  selected.value = val ?? ''
})

function selectValue(val: string) {
  selected.value = val
  emit('update:modelValue', val)
}

provide('radio-group', { selected, selectValue })
</script>

<template>
  <div role="radiogroup" class="grid gap-3">
    <slot />
  </div>
</template>
