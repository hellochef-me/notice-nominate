<script setup lang="ts">
import Textarea from '../ui/textarea/Textarea.vue'
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
      <h2 class="text-xl sm:text-2xl font-semibold text-foreground">Share the story behind your nomination</h2>
    </div>
    <div class="space-y-2">
      <Label>Your nomination story</Label>
      <Textarea
        :model-value="modelValue"
        placeholder="Describe what happened, how it made an impact, and why this person deserves recognition..."
        :rows="6"
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>
