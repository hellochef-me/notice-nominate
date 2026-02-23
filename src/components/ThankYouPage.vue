<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Button from './ui/button/Button.vue'

const props = defineProps<{
  nominationId: string
}>()

defineEmits<{
  restart: []
}>()

const detailPath = computed(() => `/n/${props.nominationId}`)
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

    <RouterLink :to="detailPath">
      <Button size="lg" as="span">
        View and share your nomination
        <svg class="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Button>
    </RouterLink>

    <button
      class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      @click="$emit('restart')"
    >
      Submit Another Nomination
    </button>
  </div>
</template>
