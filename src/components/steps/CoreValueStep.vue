<script setup lang="ts">
import RadioGroup from '../ui/radio-group/RadioGroup.vue'
import RadioGroupItem from '../ui/radio-group/RadioGroupItem.vue'
import { coreValues } from '@/data/coreValues'

defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const valueDescriptions: Record<string, string> = {
  'people-first': 'Be humble, emphasize team over self, provide thoughtful feedback',
  'positive-spirit': 'Look forward with optimism, respect all walks of life, celebrate together',
  'simplify': 'Less is more, learn and be curious, improve with each day',
  'whatever-it-takes': 'Do the right thing, demonstrate passions and perseverance, roll up your sleeves',
}
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <h2 class="text-xl sm:text-2xl font-semibold text-foreground">Which core value did the nominee embody?</h2>
    </div>
    <RadioGroup
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <RadioGroupItem
        v-for="value in coreValues"
        :key="value.id"
        :value="value.id"
        :label="value.label"
        :description="valueDescriptions[value.id]"
      />
    </RadioGroup>
  </div>
</template>
