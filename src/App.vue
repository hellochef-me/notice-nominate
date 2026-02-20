<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showNominateButton = computed(() => route.meta.showNominateButton === true)
</script>

<template>
  <div class="min-h-screen bg-background font-sans">
    <router-link
      v-if="showNominateButton"
      to="/nominate"
      class="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-primary/90"
    >
      Nominate
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </router-link>

    <router-view />
  </div>
</template>
