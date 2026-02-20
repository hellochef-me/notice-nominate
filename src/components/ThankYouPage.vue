<script setup lang="ts">
import Button from './ui/button/Button.vue'

defineEmits<{
  restart: []
}>()
</script>

<template>
  <div class="flex flex-col items-center text-center space-y-8">
    <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
      <svg class="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    </div>

    <div class="space-y-3">
      <h1 class="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
        Thank You!
      </h1>
      <p class="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md mx-auto">
        Thank you for submitting your nomination. Your recognition helps us celebrate the amazing people at Hello Chef.
      </p>
    </div>

    <Button size="lg" @click="$emit('restart')">
      Submit Another Nomination
      <svg class="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
      </svg>
    </Button>
  </div>
</template>
