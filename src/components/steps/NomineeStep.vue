<script setup lang="ts">
import Combobox from '../ui/combobox/Combobox.vue'
import Label from '../ui/label/Label.vue'
import type { Employee } from '@/lib/fetchEmployees'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  employees: Employee[]
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const employeeOptions = computed(() =>
  props.employees.map(e => ({ value: e.name, label: e.name }))
)
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <h2 class="text-xl sm:text-2xl font-semibold text-foreground">Who are you nominating?</h2>
    </div>
    <div class="space-y-2">
      <Label>Nominee's full name</Label>
      <Combobox
        :model-value="modelValue"
        :options="employeeOptions"
        :allow-custom="true"
        placeholder="e.g. Jane Doe"
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>
