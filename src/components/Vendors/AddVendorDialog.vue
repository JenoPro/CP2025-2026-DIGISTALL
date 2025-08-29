<template>
  <v-dialog v-model="model" max-width="1280" persistent>
    <v-card class="compact-card">
      <!-- Top bar: title (no page number) + Import button -->
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">
          {{ step === 1 ? 'Add Vendor Details' : 'Add Business Details' }}
        </span>
        <v-btn
          color="primary"
          variant="elevated"
          rounded="lg"
          size="small"
          @click="importSampleData"
        >
          Import Data
        </v-btn>
      </v-card-title>

      <v-divider />

      <!-- CONTENT -->
      <v-card-text class="pt-4 pb-2">
        <v-row>
          <!-- PAGE 1 -->
          <v-col v-if="step === 1" cols="12">
            <v-row class="tight-grid">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.lastName"
                  label="Last Name"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.firstName"
                  label="First Name"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.middleName"
                  label="Middle Name"
                  variant="outlined"
                  density="compact"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.suffix"
                  label="Suffix (if any)"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.birthdate"
                  type="date"
                  label="Birthdate"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="4">
                <div class="mb-1 text-medium-emphasis">Gender</div>
                <v-btn-toggle v-model="form.gender" divided mandatory>
                  <v-btn value="Male" size="small">Male</v-btn>
                  <v-btn value="Female" size="small">Female</v-btn>
                </v-btn-toggle>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.phone"
                  label="Phone Number"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.vendorId"
                  label="Vendor ID"
                  variant="outlined"
                  density="compact"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.address"
                  label="Complete Address"
                  variant="outlined"
                  density="compact"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.spouseLast"
                  label="Spouse’s Last Name"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.spouseFirst"
                  label="Spouse’s First Name"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.spouseMiddle"
                  label="Spouse’s Middle Name"
                  variant="outlined"
                  density="compact"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.childLast"
                  label="Child’s Last Name"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.childFirst"
                  label="Child’s First Name"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.childMiddle"
                  label="Child’s Middle Name"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>
          </v-col>

          <!-- PAGE 2 -->
          <v-col v-else cols="12">
            <v-row class="tight-grid">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.businessName"
                  label="Business Name"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.businessType"
                  label="Business Type"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.productsSold"
                  label="Products Sold"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-1 text-medium-emphasis">Vending Time</div>
                <div class="d-flex ga-2">
                  <v-text-field
                    v-model="form.vendStart"
                    type="time"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                  <span class="d-flex align-center">–</span>
                  <v-text-field
                    v-model="form.vendEnd"
                    type="time"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </div>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.businessAddress"
                  label="Business Address"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>

            <div class="text-subtitle-1 font-weight-bold mt-3 mb-1">Upload Documents</div>
            <v-row class="tight-grid">
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="form.files.clearance"
                  label="Barangay Business Clearance"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-paperclip"
                  show-size
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="form.files.votersId"
                  label="Voter’s ID"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-paperclip"
                  show-size
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="form.files.cedula"
                  label="Cedula"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-paperclip"
                  show-size
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="form.files.picture"
                  label="2x2 Picture (White background)"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-paperclip"
                  show-size
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="form.files.association"
                  label="Association Clearance"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-paperclip"
                  show-size
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="form.files.healthcard"
                  label="Health Card/Yellow Card"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-paperclip"
                  show-size
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <!-- ACTIONS -->
      <v-card-actions class="px-6 py-3">
        <v-btn variant="tonal" color="grey" @click="cancel">Cancel</v-btn>
        <v-spacer />
        <v-btn v-if="step === 2" variant="tonal" color="grey" class="mr-2" @click="step = 1"
          >Previous</v-btn
        >
        <v-btn v-if="step === 1" color="primary" @click="goNext">Next</v-btn>
        <v-btn v-else color="primary" @click="submit">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, reactive, watch, ref } from 'vue'

const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue', 'save'])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const step = ref(1)

const form = reactive({
  // page 1
  lastName: 'Dela Cruz',
  firstName: 'Juan',
  middleName: 'Perez',
  suffix: 'Jr.',
  birthdate: '1990-10-05',
  gender: 'Male',
  phone: '09123456789',
  email: 'juan.delacruz@email.com',
  vendorId: '123456',
  address: 'Block 6 Lot 15 Maharlika Village Barangay Rosario Naga City',
  spouseLast: 'Dela Cruz',
  spouseFirst: 'Jessa',
  spouseMiddle: 'Caceres',
  childLast: 'Dela Cruz',
  childFirst: 'Pedro',
  childMiddle: 'Caceres',

  // page 2
  businessName: "Juan's Street Foods",
  businessType: 'Street Foods',
  productsSold: 'Street Foods',
  vendStart: '09:00',
  vendEnd: '13:00',
  businessAddress: 'Panganiban Naga City',

  files: {
    clearance: null,
    votersId: null,
    cedula: null,
    picture: null,
    association: null,
    healthcard: null,
  },
})

function importSampleData() {}

function goNext() {
  const required = [
    'lastName',
    'firstName',
    'birthdate',
    'gender',
    'phone',
    'email',
    'vendorId',
    'address',
  ]
  const missing = required.filter((k) => !String(form[k] || '').trim())
  if (missing.length) return alert('Please fill out all required personal fields.')
  step.value = 2
}

function submit() {
  // keep File objects — no JSON clone
  const newRow = {
    id: form.vendorId,
    name: `${form.firstName} ${form.lastName}`,
    business: form.businessName,
    collector: 'John Smith',
    status: 'Active',
    raw: { ...form, files: { ...form.files } },
  }
  emit('save', newRow)
  model.value = false
}

function cancel() {
  model.value = false
  step.value = 1
}

watch(model, (v) => {
  if (!v) step.value = 1
})
</script>

<style scoped>
.compact-card .v-card-title {
  background: #f5f5f7;
  padding: 10px 16px;
}
.compact-card .v-card-text {
  padding: 12px 16px !important;
}
.compact-card .v-card-actions {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

.tight-grid > .v-col {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}

:deep(.v-field) {
  --v-input-padding-top: 4px;
  --v-input-padding-bottom: 4px;
}
</style>
