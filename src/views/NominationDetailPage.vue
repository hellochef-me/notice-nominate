<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import NoticeCard from '@/components/NoticeCard.vue'
import { fetchNominations, type Nomination } from '@/lib/fetchNominations'
import { getNominationId } from '@/lib/nominationId'

const route = useRoute()
const nominations = ref<Nomination[]>([])
const loading = ref(true)
const error = ref('')

const nomination = computed(() => {
  const id = route.params.id as string
  if (!id) return null
  return nominations.value.find((n) => getNominationId(n) === id) ?? null
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    nominations.value = await fetchNominations()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="h-screen bg-offWhite px-4 overflow-hidden">
    <RouterLink
      to="/"
      class="fixed top-4 left-4 z-50 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back to Wall
    </RouterLink>

    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[50vh]">
      <div class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p class="mt-4 text-charcoal/70">Loading...</p>
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[50vh]">
      <p class="text-charcoal/80 mb-4">{{ error }}</p>
      <button
        class="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
        @click="load"
      >
        Retry
      </button>
    </div>

    <div v-else-if="!nomination" class="flex flex-col items-center justify-center min-h-[50vh]">
      <p class="text-charcoal/80 mb-4">Nomination not found</p>
      <RouterLink to="/" class="text-primary font-medium hover:underline">
        Back to Notice Wall
      </RouterLink>
    </div>

    <div v-else class="h-full grid place-items-center">
      <div class="max-w-2xl w-full">
        <NoticeCard :nomination="nomination" size="large" />
      </div>
    </div>
  </div>
</template>
