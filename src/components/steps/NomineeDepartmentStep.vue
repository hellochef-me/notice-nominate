<script setup lang="ts">
import Combobox from '../ui/combobox/Combobox.vue'
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
      <h2 class="text-xl sm:text-2xl font-semibold text-foreground">Which department does the nominee belong to?</h2>
    </div>
    <div class="space-y-2">
      <Label>Nominee's department</Label>
      <Combobox
        :model-value="modelValue"
        :options="departmentOptions"
        :allow-custom="false"
        placeholder="Select their department"
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>
