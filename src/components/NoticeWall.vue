<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import NoticeCard from './NoticeCard.vue'
import HelloChefLogo from './HelloChefLogo.vue'
import { fetchNominations, type Nomination } from '@/lib/fetchNominations'

const nominations = ref<Nomination[]>([])
const loading = ref(true)
const error = ref('')

async function loadNominations() {
  loading.value = true
  error.value = ''
  try {
    nominations.value = await fetchNominations()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load nominations'
  } finally {
    loading.value = false
  }
}

onMounted(loadNominations)
</script>

<template>
  <div class="wall-page min-h-screen bg-offWhite">
    <!-- Fixed header - liquid glass effect -->
    <header class="glass-header">
      <div class="glass-header-inner">
        <div class="flex flex-col items-start gap-0.5">
          <HelloChefLogo class="h-7 w-auto" />
          <span class="text-base sm:text-lg text-charcoal/80 font-medium">Notice Wall</span>
        </div>
        <RouterLink
          to="/nominate"
          class="glass-btn inline-flex items-center justify-center rounded-full p-2 sm:rounded-lg sm:px-5 sm:py-2.5 sm:gap-2 text-white transition hover:opacity-90 shrink-0"
        >
          <svg class="w-5 h-5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span class="hidden sm:inline text-sm font-medium">Nominate</span>
        </RouterLink>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="h-screen flex flex-col items-center justify-center">
      <div class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p class="mt-4 text-charcoal/70">Loading nominations...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="h-screen flex flex-col items-center justify-center px-4">
      <p class="text-charcoal/80 text-center mb-4">{{ error }}</p>
      <button
        class="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
        @click="loadNominations"
      >
        Retry
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="nominations.length === 0" class="h-screen flex flex-col items-center justify-center px-4">
      <div class="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <svg class="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-charcoal mb-2">No nominations yet</h2>
      <p class="text-charcoal/70 text-center mb-6 max-w-sm">
        Be the first to recognize a colleague who embodies our core values!
      </p>
      <RouterLink
        to="/nominate"
        class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-primary/90"
      >
        Submit a Nomination
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </RouterLink>
    </div>

    <!-- Card grid -->
    <main v-else class="wall-content">
      <div class="masonry">
        <NoticeCard v-for="(n, i) in nominations" :key="i" :nomination="n" />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Liquid glass header */
.glass-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  padding: 1rem 1rem 0.75rem;
  margin: 1rem;
}
@media (min-width: 640px) {
  .glass-header { padding: 1rem 1.5rem 0.75rem; }
}
.glass-header::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  border-radius: 30px;
  -webkit-box-shadow: inset 2px 2px 0px -2px rgba(255, 255, 255, 0.7), inset 0 0 3px 1px rgba(255, 255, 255, 0.7);
          box-shadow: inset 2px 2px 0px -2px rgba(255, 255, 255, 0.7), inset 0 0 3px 1px rgba(255, 255, 255, 0.7);
  padding: 1rem;
  background-color: rgb(255 255 255 / 40%);
}
.glass-header::after {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 0;
  border-radius: 30px;
  -webkit-backdrop-filter: blur(5px);
          backdrop-filter: blur(5px);
  filter: url(#header-glass);
  -webkit-filter: url(#header-glass);
  overflow: hidden;
  isolation: isolate;
  pointer-events: none;
  padding: 1rem;
}
.glass-header-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.glass-btn {
  background: #e42a12;
  box-shadow: 0 4px 14px rgba(228, 42, 18, 0.35);
}

.wall-content {
  padding-top: 7.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 2rem;
}

.masonry {
  column-count: 3;
  column-gap: 1.25rem;
}

@media (max-width: 1024px) {
  .masonry { column-count: 2; }
}

@media (max-width: 640px) {
  .masonry { column-count: 1; }
}
</style>
