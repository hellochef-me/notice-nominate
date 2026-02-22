<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Nomination } from '@/lib/fetchNominations'
import { coreValueColors } from '@/lib/colors'
import { getNominationId } from '@/lib/nominationId'

const props = withDefaults(
  defineProps<{
    nomination: Nomination
    size?: 'default' | 'large'
  }>(),
  { size: 'default' }
)

const nominationId = computed(() => getNominationId(props.nomination))
const shareLabel = ref('')

const starColors = ['#f59e0b', '#fbbf24', '#f97316', '#eab308', '#fb923c']

const decorativeStars = computed(() => {
  const name = props.nomination.nomineeName || props.nomination.story || 'x'
  const seed = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const rng = (i: number) => {
    const x = Math.sin(seed * 9301 + i * 49297) * 49297
    return x - Math.floor(x)
  }

  const count = 2 + Math.floor(rng(0) * 2) // 2-3 stars
  return Array.from({ length: count }, (_, i) => {
    const side = Math.floor(rng(i * 7 + 1) * 4)
    const pos = 8 + rng(i * 7 + 2) * 84 // 8-92% along edge
    const size = 10 + rng(i * 7 + 3) * 22 // 10-32px
    const rotation = Math.floor(rng(i * 7 + 4) * 50) - 25 // -25 to 25deg
    const color = starColors[Math.floor(rng(i * 7 + 5) * starColors.length)]
    const opacity = 0.45 + rng(i * 7 + 6) * 0.55 // 0.45-1.0

    const offset = -(size * 0.4) // stick out ~40%
    const style: Record<string, string> = {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      transform: `rotate(${rotation}deg)`,
      opacity: String(opacity),
      color,
      zIndex: '1',
      pointerEvents: 'none',
    }

    if (side === 0) {
      style.top = `${offset}px`
      style.left = `${pos}%`
    } else if (side === 1) {
      style.right = `${offset}px`
      style.top = `${pos}%`
    } else if (side === 2) {
      style.bottom = `${offset}px`
      style.left = `${pos}%`
    } else {
      style.left = `${offset}px`
      style.top = `${pos}%`
    }

    return { style, animDelay: `${(rng(i * 7 + 3) * 3).toFixed(1)}s` }
  })
})

async function share() {
  const id = nominationId.value
  if (!id) return
  const url = `${window.location.origin}/n/${id}`

  if (navigator.share) {
    try {
      await navigator.share({ title: `${props.nomination.nomineeName}'s Recognition`, url })
      return
    } catch { /* user cancelled or not supported */ }
  }

  await navigator.clipboard.writeText(url)
  shareLabel.value = 'Copied!'
  setTimeout(() => { shareLabel.value = '' }, 2000)
}

const pillColor = computed(() => {
  const cv = props.nomination.coreValue || ''
  return coreValueColors[cv] ?? '#f3f4f6'
})

const formattedDate = computed(() => {
  const t = props.nomination.timestamp
  if (!t) return ''
  try {
    const d = new Date(t)
    return isNaN(d.getTime()) ? t : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return t
  }
})
</script>

<template>
  <article
    class="notice-card relative rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-shadow flex flex-col"
  >
  <!-- Pill tag: core value and behavior -->
       <div
        v-if="nomination.coreValue"
        class="mb-4 -mt-6 inline-block px-6 py-2 -mx-6 font-medium text-charcoal rounded-t-xl"
        :style="{ backgroundColor: pillColor }"
      >
      <span :class="size === 'large' ? 'text-base' : 'text-sm'" class="font-medium">
        {{ nomination.coreValue }} | {{ nomination.behavior }}
      </span>
    </div>
    <div class="star-container" aria-hidden="true">
      <svg
        v-for="(star, idx) in decorativeStars"
        :key="idx"
        :style="star.style"
        class="star-float"
        :class="`star-float-${idx % 3}`"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    </div>
    <!-- Top row: nominee name, ribbon icon, share icon -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex flex-col min-w-0">
        <h3 :class="size === 'large' ? 'text-2xl font-bold' : 'text-xl font-bold'" class="text-charcoal">
          {{ nomination.nomineeName || 'Anonymous' }}
        </h3>
        <div v-if="nomination.nomineeDepartment" class="text-charcoal/60">
          {{ nomination.nomineeDepartment }}
        </div>
      </div>
      <button
        v-if="nominationId"
        type="button"
        class="shrink-0 p-1 rounded hover:bg-black/5 transition-colors relative"
        aria-label="Share"
        @click="share"
      >
        <svg class="w-5 h-5 text-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.59 13.51 6.82 3.98M15.41 6.51l-6.82 3.98" />
        </svg>
        <span
          v-if="shareLabel"
          class="absolute -bottom-6 right-0 text-[10px] font-medium text-primary whitespace-nowrap"
        >
          {{ shareLabel }}
        </span>
      </button>
    </div>



    <!-- Story section -->
    <blockquote class="mt-5 flex-1 min-h-0">
      <p :class="size === 'large' ? 'text-xl leading-relaxed' : 'text-lg leading-relaxed'" class="text-charcoal/80 italic">
        "{{ nomination.story || '—' }}"
      </p>
    </blockquote>

    <!-- Footer: nominated by -->
    <div class="mt-5 pt-3 border-t border-charcoal/10 -mx-6 px-6">
      <div class="flex flex-col justify-between gap-2">
        <div>
          <p class="text-xs text-charcoal/50">By: {{ nomination.nominatorName || 'Anonymous' }} from {{ nomination.nominatorDepartment }}</p>
        </div>
        <div v-if="formattedDate" class="flex items-center gap-1.5 shrink-0 text-xs text-charcoal/50">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {{ formattedDate }}
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.notice-card {
  break-inside: avoid;
  margin-bottom: 1.25rem;
}

.star-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: visible;
}

.star-float {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.star-float-0 {
  animation: float-a 4s ease-in-out infinite;
}
.star-float-1 {
  animation: float-b 5s ease-in-out infinite;
  animation-delay: 0.8s;
}
.star-float-2 {
  animation: float-c 3.5s ease-in-out infinite;
  animation-delay: 1.6s;
}

@keyframes float-a {
  0%, 100% { translate: 0 0; }
  50% { translate: 2px -3px; }
}
@keyframes float-b {
  0%, 100% { translate: 0 0; }
  50% { translate: -3px 2px; }
}
@keyframes float-c {
  0%, 100% { translate: 0 0; }
  50% { translate: 1px -2px; }
}
</style>
