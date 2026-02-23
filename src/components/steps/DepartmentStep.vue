<script setup lang="ts">
import Select from '../ui/select/Select.vue'
import Label from '../ui/label/Label.vue'
import { departments } from '@/data/departments'

defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const departmentOptions = departments.map(d => ({ value: d, label: d }))
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <h2 class="text-xl sm:text-2xl font-semibold text-foreground">Which department are you from?</h2>
    </div>
    <div class="space-y-2">
      <Label>Department</Label>
      <Select
        :model-value="modelValue"
        :options="departmentOptions"
        placeholder="Select your department"
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>
