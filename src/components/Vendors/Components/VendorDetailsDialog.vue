<template>
  <v-dialog v-model="model" max-width="900">
    <v-card class="pa-4">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold">Vendor Details</span>
        <v-btn icon="mdi-close" variant="text" @click="model = false" />
      </v-card-title>

      <v-divider />

      <v-card-text class="pt-6">
        <!-- Header: Photo + Identity -->
        <v-row>
          <v-col cols="12" md="3" class="d-flex justify-center">
            <v-avatar size="140" rounded="lg">
              <v-img :src="photoSrc" alt="Vendor photo" />
            </v-avatar>
          </v-col>

          <v-col cols="12" md="9">
            <v-row>
              <v-col cols="12" md="6">
                <div class="label">Vendor Name</div>
                <div class="value">{{ fullName }}</div>

                <div class="label mt-4">Phone Number</div>
                <div class="value">{{ d.phone }}</div>

                <div class="label mt-4">Birthdate</div>
                <div class="value">{{ d.birthdate }}</div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="label">Vendor ID</div>
                <div class="value">{{ d.vendorId }}</div>

                <div class="label mt-4">Email Address</div>
                <div class="value">{{ d.email }}</div>

                <div class="label mt-4">Gender</div>
                <div class="value">{{ d.gender }}</div>
              </v-col>
            </v-row>

            <div class="label mt-4">Complete Address:</div>
            <div class="value">{{ d.address }}</div>
          </v-col>
        </v-row>

        <!-- Business + Family -->
        <v-row class="mt-6">
          <v-col cols="12" md="6">
            <div class="section-title">Business Details</div>
            <div class="pair">
              <span class="label">Business Name</span>
              <span class="value">{{ d.businessName }}</span>
            </div>
            <div class="pair">
              <span class="label">Products Sold</span>
              <span class="value">{{ d.productsSold }}</span>
            </div>
            <div class="pair">
              <span class="label">Business Address</span>
              <span class="value">{{ d.businessAddress }}</span>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="section-title">Family Details</div>
            <div class="pair">
              <span class="label">Business Type</span>
              <span class="value">{{ d.businessType }}</span>
            </div>
            <div class="pair">
              <span class="label">Vending Time</span>
              <span class="value">{{ d.vendStart }} – {{ d.vendEnd }}</span>
            </div>
            <div class="pair">
              <span class="label">Spouse’s Name</span>
              <span class="value">{{ spouseFull }}</span>
            </div>
            <div class="pair">
              <span class="label">Child’s Name</span>
              <span class="value">{{ childFull }}</span>
            </div>
          </v-col>
        </v-row>

        <!-- Documents -->
        <div class="section-title mt-6">Documents</div>
        <v-row>
          <v-col cols="12" md="6" v-for="doc in docListLeft" :key="doc.key">
            <div class="label mb-2">{{ doc.label }}</div>
            <div class="d-flex ga-2">
              <v-text-field
                :model-value="fileName(d.files?.[doc.key], doc.fallback)"
                variant="outlined"
                density="comfortable"
                readonly
                class="flex-1"
                prepend-inner-icon="mdi-paperclip"
              />
              <v-btn
                size="small"
                variant="tonal"
                :disabled="!toUrl(d.files?.[doc.key])"
                @click="openFile(d.files?.[doc.key])"
                >Open</v-btn
              >
              <v-btn
                size="small"
                color="primary"
                :disabled="!toUrl(d.files?.[doc.key])"
                @click="downloadFile(d.files?.[doc.key], doc.fallback)"
                >Download</v-btn
              >
            </div>
          </v-col>

          <v-col cols="12" md="6" v-for="doc in docListRight" :key="doc.key">
            <div class="label mb-2">{{ doc.label }}</div>
            <div class="d-flex ga-2">
              <v-text-field
                :model-value="fileName(d.files?.[doc.key], doc.fallback)"
                variant="outlined"
                density="comfortable"
                readonly
                class="flex-1"
                prepend-inner-icon="mdi-paperclip"
              />
              <v-btn
                size="small"
                variant="tonal"
                :disabled="!toUrl(d.files?.[doc.key])"
                @click="openFile(d.files?.[doc.key])"
                >Open</v-btn
              >
              <v-btn
                size="small"
                color="primary"
                :disabled="!toUrl(d.files?.[doc.key])"
                @click="downloadFile(d.files?.[doc.key], doc.fallback)"
                >Download</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, reactive, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  data: { type: Object, default: () => ({}) }, // full form payload
  photo: { type: String, default: 'https://i.pravatar.cc/200?img=12' },
})
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

// Flatten data for easier access
const d = computed(() => props.data || {})

// Names
const fullName = computed(() =>
  [d.value.firstName, d.value.middleName, d.value.lastName, d.value.suffix]
    .filter(Boolean)
    .join(' '),
)
const spouseFull = computed(() =>
  [d.value.spouseFirst, d.value.spouseMiddle, d.value.spouseLast].filter(Boolean).join(' '),
)
const childFull = computed(() =>
  [d.value.childFirst, d.value.childMiddle, d.value.childLast].filter(Boolean).join(' '),
)
const photoSrc = computed(() => props.photo)

// Document lists (two columns)
const docListLeft = [
  { key: 'clearance', label: 'Barangay Business Clearance', fallback: 'Clearance.pdf' },
  { key: 'cedula', label: 'Cedula', fallback: 'Cedula.pdf' },
  { key: 'association', label: 'Association Clearance', fallback: 'Association.pdf' },
]
const docListRight = [
  { key: 'votersId', label: "Voter's ID", fallback: 'VotersID.pdf' },
  { key: 'picture', label: '2x2 Picture (White background)', fallback: 'Picture.png' },
  { key: 'healthcard', label: 'Health Card/Yellow Card', fallback: 'healthcard.png' },
]

// --- File helpers (JS-only) ---

// store blob URLs for File objects so we can revoke later
const blobUrls = reactive({})

function toUrl(file) {
  if (!file) return null

  // absolute string URL
  if (typeof file === 'string') {
    try {
      const u = new URL(file)
      return u.href
    } catch {
      // plain filename, not openable without hosting
      return null
    }
  }

  // object with .url property
  if (file && file.url) return file.url

  // File object (from v-file-input)
  if (typeof File !== 'undefined' && file instanceof File) {
    if (!blobUrls[file.name]) blobUrls[file.name] = URL.createObjectURL(file)
    return blobUrls[file.name]
  }

  return null
}

function fileName(file, fallback) {
  if (!file) return fallback
  if (typeof file === 'string') {
    const parts = file.split('/')
    return parts[parts.length - 1] || fallback
  }
  return file?.name || fallback
}

function downloadFile(file, fallbackName) {
  const url = toUrl(file)
  if (!url) return
  const a = document.createElement('a')
  a.href = url
  const name = typeof file === 'string' ? file.split('/').pop() : file?.name || fallbackName
  a.download = name || fallbackName
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function openFile(file) {
  const url = toUrl(file)
  if (!url) return
  window.open(url, '_blank')
}

onUnmounted(() => {
  Object.values(blobUrls).forEach((u) => URL.revokeObjectURL(u))
})
</script>

<style scoped>
.label {
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.6);
}
.value {
  font-weight: 600;
}
.section-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}
.pair {
  display: grid;
  grid-template-columns: 1fr;
  margin: 0.4rem 0;
}
</style>
