<script setup lang="ts">
import Button from './ui/button/Button.vue'

defineEmits<{
  start: []
  'start-photo': []
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

    <div class="w-full space-y-3 max-w-xs mx-auto">
      <Button size="lg" class="w-full" @click="$emit('start')">
        Fill Step by Step
        <svg class="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Button>

      <Button size="lg" variant="outline" class="w-full" @click="$emit('start-photo')">
        <svg class="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
          <path d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
        </svg>
        Take a Photo
      </Button>
    </div>
  </div>
</template>
