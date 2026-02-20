<script setup lang="ts">
import Button from './ui/button/Button.vue'

defineEmits<{
  start: []
}>()
</script>

<template>
  <div class="flex flex-col items-center text-center space-y-8">
    <div class="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
      <svg class="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    </div>

    <div class="space-y-3">
      <h1 class="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
        Notice & Nominate
      </h1>
      <p class="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md mx-auto">
        Welcome to the Hello Chef Notice and Nominate platform, where you can recognize colleagues for demonstrating our core values. Please nominate an employee and share their story.
      </p>
    </div>

    <Button size="lg" @click="$emit('start')">
      Get Started
      <svg class="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </Button>
  </div>
</template>
