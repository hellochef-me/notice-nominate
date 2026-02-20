<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import NoticeCard from './NoticeCard.vue'
import HelloChefLogo from './HelloChefLogo.vue'
import { fetchNominations, type Nomination } from '@/lib/fetchNominations'
import { coreValues } from '@/data/coreValues'
import { coreValueColors } from '@/lib/colors'

const nominations = ref<Nomination[]>([])
const loading = ref(true)
const error = ref('')

const rotations = [-1.5, 1, -0.8, 1.2, -1, 0.5, -1.2, 0.8, -0.5, 1.5, -1.2, 0.7]

function getRotation(index: number) {
  return rotations[index % rotations.length]
}

const NUM_COLS = 4
const MIN_PER_COL = 4

interface PlaceholderCard {
  type: 'placeholder'
  coreValue: string
  bgColor: string
}

type WallItem =
  | { type: 'nomination'; data: Nomination; index: number }
  | PlaceholderCard

/**
 * Distribute items column-first (fill col 0, then col 1, etc.)
 * to match the visual order of CSS column-count.
 */
const columns = computed<WallItem[][]>(() => {
  const noms = nominations.value
  const allItems: WallItem[] = noms.map((data, index) => ({
    type: 'nomination' as const, data, index,
  }))

  const totalNeeded = Math.max(allItems.length, MIN_PER_COL * NUM_COLS)
  while (allItems.length < totalNeeded) {
    const i = allItems.length
    const cv = coreValues[i % coreValues.length]
    allItems.push({
      type: 'placeholder',
      coreValue: cv.label,
      bgColor: coreValueColors[cv.label] ?? '#FEF4D7',
    })
  }

  const perCol = Math.ceil(allItems.length / NUM_COLS)
  const cols: WallItem[][] = []
  for (let c = 0; c < NUM_COLS; c++) {
    cols.push(allItems.slice(c * perCol, (c + 1) * perCol))
  }
  return cols
})

// Each column gets a slightly different speed for a natural feel
const columnSpeeds = [0.25, 0.3, 0.22, 0.28]

// Per-column scroll state
const columnRefs = ref<(HTMLElement | null)[]>([])
const scrollPositions: number[] = [0, 0, 0, 0]
let rafId = 0
let paused = false
let userScrollTimeout: ReturnType<typeof setTimeout> | null = null

function setColumnRef(el: any, idx: number) {
  columnRefs.value[idx] = el as HTMLElement | null
}

function tick() {
  for (let c = 0; c < NUM_COLS; c++) {
    const el = columnRefs.value[c]
    if (!el) continue

    if (!paused) {
      scrollPositions[c] += columnSpeeds[c]
    }

    const half = el.scrollHeight / 2
    if (half > 0) {
      if (scrollPositions[c] >= half) scrollPositions[c] -= half
      if (scrollPositions[c] < 0) scrollPositions[c] += half
    }

    el.style.transform = `translateY(${-scrollPositions[c]}px)`
  }

  rafId = requestAnimationFrame(tick)
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  for (let c = 0; c < NUM_COLS; c++) {
    scrollPositions[c] += e.deltaY
  }
  paused = true
  if (userScrollTimeout) clearTimeout(userScrollTimeout)
  userScrollTimeout = setTimeout(() => { paused = false }, 800)
}

onMounted(() => {
  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  if (userScrollTimeout) clearTimeout(userScrollTimeout)
})

const springReady = ref(false)

function cardDelay(colIdx: number, i: number) {
  return `${colIdx * 80 + i * 60}ms`
}

async function loadNominations() {
  loading.value = true
  error.value = ''
  try {
    nominations.value = await fetchNominations()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load nominations'
  } finally {
    loading.value = false
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { springReady.value = true })
    })
  }
}

onMounted(loadNominations)
</script>

<template>
  <div class="wall-viewport bg-offWhite" @wheel="onWheel">
    <!-- Fixed header -->
    <header class="fixed top-0 left-0 right-0 z-20 pt-5 pb-3 px-4 text-center bg-offWhite/90 backdrop-blur-md">
      <div class="flex flex-col items-center gap-0.5">
        <HelloChefLogo class="h-7 w-auto" />
        <span class="text-lg text-charcoal/80 font-medium">Notice Wall</span>
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

    <!-- Infinite scroll wall: independent columns -->
    <template v-if="!loading && !error && nominations.length > 0">
      <div class="wall-columns">
      <div
        v-for="(col, colIdx) in columns"
        :key="colIdx"
        class="wall-column"
        :class="{ 'wall-col-hide-lg': colIdx === 3, 'wall-col-hide-md': colIdx >= 2, 'wall-col-hide-sm': colIdx >= 1 }"
      >
        <div
          :ref="(el) => setColumnRef(el, colIdx)"
          class="wall-column-inner"
        >
          <!-- Original set -->
          <div class="wall-column-cards">
            <template v-for="(item, i) in col" :key="`a-${i}`">
              <div
                class="card-spring"
                :class="springReady ? 'card-in' : 'card-out'"
                :style="{ animationDelay: cardDelay(colIdx, i) }"
              >
                <NoticeCard
                  v-if="item.type === 'nomination'"
                  :nomination="item.data"
                  :rotation="getRotation(item.index)"
                />
                <div
                  v-else
                  class="placeholder-card"
                  :style="{ backgroundColor: item.bgColor, transform: `rotate(${getRotation(colIdx * 10 + i)}deg)` }"
                >
                  <svg class="w-6 h-6 mx-auto mb-2 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                  <p class="text-xs font-medium opacity-40 text-center text-charcoal">{{ item.coreValue }}</p>
                </div>
              </div>
            </template>
          </div>
          <!-- Duplicate set (seamless loop) — no animation, always visible -->
          <div class="wall-column-cards">
            <template v-for="(item, i) in col" :key="`b-${i}`">
              <NoticeCard
                v-if="item.type === 'nomination'"
                :nomination="item.data"
                :rotation="getRotation(item.index)"
              />
              <div
                v-else
                class="placeholder-card"
                :style="{ backgroundColor: item.bgColor, transform: `rotate(${getRotation(colIdx * 10 + i)}deg)` }"
              >
                <svg class="w-6 h-6 mx-auto mb-2 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <p class="text-xs font-medium opacity-40 text-center text-charcoal">{{ item.coreValue }}</p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<style scoped>
.wall-viewport {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.wall-columns {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: 1.25rem;
  padding: 0 1.5rem;
  overflow: hidden;
}

.wall-column {
  flex: 1;
  overflow: hidden;
  padding-top: 5.5rem;
}

.wall-column-inner {
  will-change: transform;
}

.wall-column-cards {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-bottom: 1.25rem;
}

.wall-column-cards :deep(article) {
  flex-shrink: 0;
}

.placeholder-card {
  flex-shrink: 0;
  padding: 1.5rem 1rem;
  border-radius: 0.5rem;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.05);
}

/* Spring-in animation for all cards */
.card-spring {
  flex-shrink: 0;
}

.card-out {
  opacity: 0;
  transform: scale(0.8);
}

.card-in {
  animation: springIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes springIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive column hiding */
@media (max-width: 1024px) {
  .wall-col-hide-lg { display: none; }
}

@media (max-width: 768px) {
  .wall-col-hide-md { display: none; }
  .wall-columns { padding: 0 1rem; }
}

@media (max-width: 480px) {
  .wall-col-hide-sm { display: none; }
  .wall-columns { padding: 0 0.75rem; }
}
</style>
