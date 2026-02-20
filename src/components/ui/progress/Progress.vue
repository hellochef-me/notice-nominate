<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number
  max?: number
}>()

const percentage = computed(() => {
  const max = props.max ?? 100
  return Math.min(100, Math.max(0, (props.value / max) * 100))
})
</script>

<template>
  <div class="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
    <div
      class="h-full rounded-full bg-primary transition-all duration-500 ease-out"
      :style="{ width: `${percentage}%` }"
    />
  </div>
</template>
