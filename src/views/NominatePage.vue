<script setup lang="ts">
import { RouterLink } from 'vue-router'
import FormWizard from '@/components/FormWizard.vue'
</script>

<template>
  <div class="relative">
    <RouterLink
      to="/"
      class="fixed top-4 left-4 z-50 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back to Wall
    </RouterLink>
    <FormWizard />
  </div>
</template>
