<script setup lang="ts">
import { ref } from 'vue'
import Button from './ui/button/Button.vue'

const emit = defineEmits<{
  analyze: [base64: string]
  back: []
}>()

const imagePreview = ref<string | null>(null)
const cameraInput = ref<HTMLInputElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function handleFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    imagePreview.value = reader.result as string
  }
  reader.readAsDataURL(file)
}

function triggerCamera() {
  cameraInput.value?.click()
}

function triggerUpload() {
  fileInput.value?.click()
}

function clearImage() {
  imagePreview.value = null
  if (cameraInput.value) cameraInput.value.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

function submitPhoto() {
  if (imagePreview.value) {
    emit('analyze', imagePreview.value)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center space-y-2">
      <h2 class="text-xl sm:text-2xl font-semibold text-foreground">
        Scan Nomination
      </h2>
      <p class="text-sm text-muted-foreground">
        Take a photo or upload an image of a nomination form and we'll fill in the details for you.
      </p>
    </div>

    <!-- Hidden file inputs -->
    <input
      ref="cameraInput"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden"
      @change="handleFile"
    />
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFile"
    />

    <!-- Image preview or capture buttons -->
    <div v-if="imagePreview" class="space-y-4">
      <div class="relative rounded-lg overflow-hidden border bg-muted/30">
        <img
          :src="imagePreview"
          alt="Nomination form photo"
          class="w-full max-h-72 object-contain"
        />
        <button
          class="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          @click="clearImage"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <Button class="w-full" size="lg" @click="submitPhoto">
        <svg class="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
        Analyze Photo
      </Button>
    </div>

    <div v-else class="space-y-3">
      <button
        class="w-full flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/20 hover:bg-muted/40 transition-colors py-10 px-4 cursor-pointer"
        @click="triggerCamera"
      >
        <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <svg class="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
          </svg>
        </div>
        <div class="text-center">
          <p class="text-sm font-medium text-foreground">Take a Photo</p>
          <p class="text-xs text-muted-foreground">Use your camera to capture the form</p>
        </div>
      </button>

      <div class="relative flex items-center">
        <div class="flex-1 border-t border-muted-foreground/20" />
        <span class="px-3 text-xs text-muted-foreground">or</span>
        <div class="flex-1 border-t border-muted-foreground/20" />
      </div>

      <button
        class="w-full flex items-center justify-center gap-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors py-3 px-4 text-sm font-medium cursor-pointer"
        @click="triggerUpload"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        Upload from Gallery
      </button>
    </div>

    <!-- Back button -->
    <div class="flex justify-start pt-2">
      <Button variant="ghost" @click="$emit('back')">
        <svg class="mr-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 17l-5-5m0 0l5-5m-5 5h12" />
        </svg>
        Back
      </Button>
    </div>
  </div>
</template>
