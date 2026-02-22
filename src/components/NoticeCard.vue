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
    class="notice-card rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-shadow flex flex-col"
  >
    <!-- Top row: nominee name, ribbon icon, share icon -->
    <div class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <h3 :class="size === 'large' ? 'text-2xl font-bold' : 'text-xl font-bold'" class="text-charcoal truncate">
          {{ nomination.nomineeName || 'Anonymous' }}
        </h3>
        <svg
          class="shrink-0 w-5 h-5 text-amber-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
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

    <!-- Subheader: department -->
    <p v-if="nomination.nomineeDepartment" :class="size === 'large' ? 'text-base mt-1' : 'text-sm mt-0.5'" class="text-charcoal/60">
      {{ nomination.nomineeDepartment }}
    </p>

    <!-- Pill tag: core value -->
      <div
        v-if="nomination.coreValue"
        class="mt-3 inline-block px-6 py-1 -mx-6 font-medium text-charcoal"
        :style="{ backgroundColor: pillColor }"
      >
      <span :class="size === 'large' ? 'text-lg' : 'text-base'" class="font-medium">
        {{ nomination.coreValue }}
      </span>
        <!-- Summary: behavior -->
      <div v-if="nomination.behavior" :class="size === 'large' ? 'text-base' : 'text-sm'" class="text-charcoal/60">
        {{ nomination.behavior }}
      </div>
    </div>

    <!-- Story section -->
    <div class="mt-5 flex-1 min-h-0">
      <h4 :class="size === 'large' ? 'text-lg font-bold' : 'text-base font-bold'" class="text-charcoal mb-2">
        Story
      </h4>
      <p :class="size === 'large' ? 'text-lg leading-relaxed' : 'text-base leading-relaxed'" class="text-charcoal/80">
        {{ nomination.story || '—' }}
      </p>
    </div>

    <!-- Footer: nominated by -->
    <div class="mt-5 pt-5 border-t border-charcoal/10">
      <p class="text-xs text-charcoal/50">Nominated by</p>
      <div class="flex items-start justify-between gap-4 mt-1">
        <div>
          <p :class="size === 'large' ? 'text-base font-bold' : 'text-sm font-bold'" class="text-charcoal">
            {{ nomination.nominatorName || 'Anonymous' }}
          </p>
          <p v-if="nomination.nominatorDepartment" class="text-xs text-charcoal/50 mt-0.5">
            {{ nomination.nominatorDepartment }}
          </p>
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
</style>
