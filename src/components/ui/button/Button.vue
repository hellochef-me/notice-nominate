<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
  type: 'button',
})

const classes = computed(() =>
  cn(
    'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
      'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm': props.variant === 'default',
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground': props.variant === 'outline',
      'hover:bg-accent hover:text-accent-foreground': props.variant === 'ghost',
      'bg-secondary text-secondary-foreground hover:bg-secondary/80': props.variant === 'secondary',
    },
    {
      'h-10 px-6 py-2': props.size === 'default',
      'h-9 rounded-md px-3': props.size === 'sm',
      'h-12 rounded-lg px-8 text-base': props.size === 'lg',
      'h-10 w-10': props.size === 'icon',
    }
  )
)
</script>

<template>
  <button :class="classes" :disabled="disabled" :type="type">
    <slot />
  </button>
</template>
