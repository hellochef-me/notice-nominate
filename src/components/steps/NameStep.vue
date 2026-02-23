<script setup lang="ts">
import Input from '../ui/input/Input.vue'
import Label from '../ui/label/Label.vue'

defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <h2 class="text-xl sm:text-2xl font-semibold text-foreground">What is your name?</h2>
    </div>
    <div class="space-y-2">
      <Label>Your full name</Label>
      <Input
        :model-value="modelValue"
        placeholder="e.g. John Smith"
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>
