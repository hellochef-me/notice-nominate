<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Nomination } from '@/lib/fetchNominations'
import { coreValueColors } from '@/lib/colors'
import { getNominationId } from '@/lib/nominationId'

const props = withDefaults(
  defineProps<{
    nomination: Nomination
    rotation?: number
    size?: 'default' | 'large'
  }>(),
  { rotation: 0, size: 'default' }
)

const nominationId = computed(() => getNominationId(props.nomination))
const showActionFooter = computed(() => props.size === 'default' && nominationId.value)

const bgColor = computed(() => {
  const cv = props.nomination.coreValue || ''
  return coreValueColors[cv] ?? '#FEF4D7'
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
    class="rounded-xl hover:shadow-lg transition-shadow"
    :class="size === 'large' ? '' : 'break-inside-avoid'"
    :style="{
      backgroundColor: bgColor,
      transform: size === 'large' ? 'none' : `rotate(${rotation}deg)`,
      boxShadow: '2px 4px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)',
    }"
  >
    <!-- To: nominee + value/behavior -->
    <div :class="size === 'large' ? 'px-8 pt-8 pb-4' : 'px-4 pt-4 pb-2'">
      <p :class="size === 'large' ? 'text-lg font-semibold' : 'text-[13px] font-semibold'" class="text-charcoal">
        To: {{ nomination.nomineeName || 'Anonymous' }}<span v-if="nomination.nomineeDepartment" class="font-normal text-charcoal/50"> · {{ nomination.nomineeDepartment }}</span>
      </p>
      <p :class="size === 'large' ? 'text-sm mt-1' : 'text-[11px] mt-0.5'" class="text-charcoal/50">
        <span v-if="nomination.coreValue">{{ nomination.coreValue }}</span>
        <span v-if="nomination.coreValue && nomination.behavior"> · </span>
        <span v-if="nomination.behavior" class="italic">{{ nomination.behavior }}</span>
      </p>
    </div>

    <!-- Message -->
    <div :class="size === 'large' ? 'px-8 pb-6' : 'px-4 pb-3'">
      <p :class="size === 'large' ? 'text-lg leading-relaxed' : 'text-[13px] leading-relaxed'" class="text-charcoal">
        {{ nomination.story || '—' }}
      </p>
    </div>

    <!-- From: nominator + date -->
    <div :class="size === 'large' ? 'px-8 pb-6 pt-4' : 'px-4 pb-4 pt-2'" class="border-t border-black/[0.06]">
      <p :class="size === 'large' ? 'text-lg font-semibold' : 'text-[13px] font-semibold'" class="text-charcoal">
        From: {{ nomination.nominatorName || 'Anonymous' }}<span v-if="nomination.nominatorDepartment" class="font-normal text-charcoal/50"> · {{ nomination.nominatorDepartment }}</span>
      </p>
      <p v-if="formattedDate" :class="size === 'large' ? 'text-sm mt-1' : 'text-[11px] mt-0.5'" class="text-charcoal/40">
        {{ formattedDate }}
      </p>
    </div>

    <!-- Action footer: View button (only on default size) -->
    <div v-if="showActionFooter" class="px-4 pb-3 pt-1 border-t border-black/[0.06]">
      <RouterLink
        :to="`/n/${nominationId}`"
        class="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary hover:text-primary/80 transition"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" />
        </svg>
        View full
      </RouterLink>
    </div>
  </article>
</template>

