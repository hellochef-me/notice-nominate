<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import Card from './ui/card/Card.vue'
import Button from './ui/button/Button.vue'
import Progress from './ui/progress/Progress.vue'
import WelcomePage from './WelcomePage.vue'
import ThankYouPage from './ThankYouPage.vue'
import NameStep from './steps/NameStep.vue'
import DepartmentStep from './steps/DepartmentStep.vue'
import NomineeStep from './steps/NomineeStep.vue'
import NomineeDepartmentStep from './steps/NomineeDepartmentStep.vue'
import CoreValueStep from './steps/CoreValueStep.vue'
import BehaviorStep from './steps/BehaviorStep.vue'
import StoryStep from './steps/StoryStep.vue'
import { coreValues } from '@/data/coreValues'
import { submitToSheet, type NominationData } from '@/lib/submitToSheet'

type Phase = 'welcome' | 'form' | 'submitting' | 'thankyou'

const phase = ref<Phase>('welcome')
const currentStep = ref(0)
const direction = ref<'forward' | 'backward'>('forward')
const submitError = ref('')

const TOTAL_STEPS = 7

const form = reactive({
  nominatorName: '',
  nominatorDepartment: '',
  nomineeName: '',
  nomineeDepartment: '',
  coreValue: '',
  behavior: '',
  story: '',
})

const coreValueLabel = computed(() =>
  coreValues.find(v => v.id === form.coreValue)?.label ?? ''
)

const isCurrentStepValid = computed(() => {
  switch (currentStep.value) {
    case 0: return form.nominatorName.trim().length > 0
    case 1: return form.nominatorDepartment.length > 0
    case 2: return form.nomineeName.trim().length > 0
    case 3: return form.nomineeDepartment.length > 0
    case 4: return form.coreValue.length > 0
    case 5: return form.behavior.length > 0
    case 6: return form.story.trim().length > 0
    default: return false
  }
})

const progressPercent = computed(() =>
  Math.round(((currentStep.value + 1) / TOTAL_STEPS) * 100)
)

function start() {
  phase.value = 'form'
  currentStep.value = 0
}

function next() {
  if (!isCurrentStepValid.value) return
  direction.value = 'forward'

  if (currentStep.value === 4) {
    form.behavior = ''
  }

  if (currentStep.value < TOTAL_STEPS - 1) {
    currentStep.value++
  } else {
    submit()
  }
}

function back() {
  direction.value = 'backward'
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

async function submit() {
  phase.value = 'submitting'
  submitError.value = ''

  const data: NominationData = {
    nominatorName: form.nominatorName.trim(),
    nominatorDepartment: form.nominatorDepartment,
    nomineeName: form.nomineeName.trim(),
    nomineeDepartment: form.nomineeDepartment,
    coreValue: coreValueLabel.value,
    behavior: form.behavior,
    story: form.story.trim(),
  }

  try {
    await submitToSheet(data)
    phase.value = 'thankyou'
  } catch (err) {
    submitError.value = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
    phase.value = 'form'
  }
}

function restart() {
  form.nominatorName = ''
  form.nominatorDepartment = ''
  form.nomineeName = ''
  form.nomineeDepartment = ''
  form.coreValue = ''
  form.behavior = ''
  form.story = ''
  currentStep.value = 0
  submitError.value = ''
  phase.value = 'welcome'
}

function handleKeydown(e: KeyboardEvent) {
  if (
    e.key === 'Enter' &&
    phase.value === 'form' &&
    isCurrentStepValid.value &&
    currentStep.value !== 6 // Don't auto-advance on story textarea
  ) {
    next()
  }
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12"
    @keydown="handleKeydown"
  >
    <!-- Logo -->
    <div class="mb-6 sm:mb-8">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <span class="text-white font-bold text-lg">H</span>
        </div>
        <span class="text-xl font-bold text-foreground">Hello Chef</span>
      </div>
    </div>

    <Card class="w-full max-w-lg p-6 sm:p-8">
      <!-- Progress bar (only during form) -->
      <div v-if="phase === 'form'" class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-muted-foreground">
            Step {{ currentStep + 1 }} of {{ TOTAL_STEPS }}
          </span>
          <span class="text-xs font-medium text-muted-foreground">
            {{ progressPercent }}%
          </span>
        </div>
        <Progress :value="progressPercent" />
      </div>

      <!-- Error message -->
      <div
        v-if="submitError"
        class="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
      >
        {{ submitError }}
      </div>

      <!-- Content area with transitions -->
      <Transition
        :name="direction === 'forward' ? 'slide-left' : 'slide-right'"
        mode="out-in"
      >
        <!-- Welcome -->
        <WelcomePage
          v-if="phase === 'welcome'"
          @start="start"
        />

        <!-- Submitting -->
        <div
          v-else-if="phase === 'submitting'"
          class="flex flex-col items-center justify-center py-12 space-y-4"
        >
          <div class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p class="text-muted-foreground font-medium">Submitting your nomination...</p>
        </div>

        <!-- Thank You -->
        <ThankYouPage
          v-else-if="phase === 'thankyou'"
          @restart="restart"
        />

        <!-- Form Steps -->
        <div v-else :key="currentStep">
          <NameStep
            v-if="currentStep === 0"
            v-model="form.nominatorName"
          />
          <DepartmentStep
            v-if="currentStep === 1"
            v-model="form.nominatorDepartment"
          />
          <NomineeStep
            v-if="currentStep === 2"
            v-model="form.nomineeName"
          />
          <NomineeDepartmentStep
            v-if="currentStep === 3"
            v-model="form.nomineeDepartment"
          />
          <CoreValueStep
            v-if="currentStep === 4"
            v-model="form.coreValue"
          />
          <BehaviorStep
            v-if="currentStep === 5"
            v-model="form.behavior"
            :core-value-id="form.coreValue"
          />
          <StoryStep
            v-if="currentStep === 6"
            v-model="form.story"
          />

          <!-- Navigation buttons -->
          <div class="flex items-center justify-between mt-8">
            <Button
              v-if="currentStep > 0"
              variant="ghost"
              @click="back"
            >
              <svg class="mr-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back
            </Button>
            <div v-else />

            <Button
              :disabled="!isCurrentStepValid"
              @click="next"
            >
              {{ currentStep === TOTAL_STEPS - 1 ? 'Submit' : 'Next' }}
              <svg v-if="currentStep < TOTAL_STEPS - 1" class="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <svg v-else class="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </Button>
          </div>
        </div>
      </Transition>
    </Card>

    <!-- Footer -->
    <p class="mt-6 text-xs text-muted-foreground">
      &copy; {{ new Date().getFullYear() }} Hello Chef. All rights reserved.
    </p>
  </div>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.25s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
</style>
