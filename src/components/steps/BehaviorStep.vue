<script setup lang="ts">
import { computed } from 'vue'
import RadioGroup from '../ui/radio-group/RadioGroup.vue'
import RadioGroupItem from '../ui/radio-group/RadioGroupItem.vue'
import { coreValues } from '@/data/coreValues'

const props = defineProps<{
  modelValue: string
  coreValueId: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectedValue = computed(() =>
  coreValues.find(v => v.id === props.coreValueId)
)

const valueLabel = computed(() => selectedValue.value?.label ?? '')
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <h2 class="text-xl sm:text-2xl font-semibold text-foreground">
        Which <span class="text-primary">{{ valueLabel }}</span> behavior did they demonstrate?
      </h2>
    </div>
    <RadioGroup
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <RadioGroupItem
        v-for="behavior in selectedValue?.behaviors ?? []"
        :key="behavior"
        :value="behavior"
        :label="behavior"
      />
    </RadioGroup>
  </div>
</template>
