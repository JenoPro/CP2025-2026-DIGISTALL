<template>
  <v-dialog v-model="model" max-width="1200" persistent>
    <v-card>
      <!-- STEPPER HEADER -->
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="text-h6 font-weight-bold">
          {{ step === 1 ? 'Add Vendor Form - Page 1' : 'Add Vendor Form - Page 2' }}
        </div>
        <v-btn
          v-if="step === 1"
          color="primary"
          variant="elevated"
          rounded="lg"
          size="small"
          @click="importSampleData"
          >Import Data</v-btn
        >
      </v-card-title>

      <v-divider />

      <!-- CONTENT -->
      <v-card-text class="pt-6">
        <v-row>
          <!-- PAGE 1 -->
          <v-col v-if="step === 1" cols="12" md="12">
            <div class="text-h5 font-weight-bold mb-4">Add Vendor Details</div>

            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.lastName"
                  label="Last Name"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.firstName"
                  label="First Name"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.middleName"
                  label="Middle Name"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.suffix"
                  label="Suffix (if any)"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.birthdate"
                  type="date"
                  label="Birthdate"
                  variant="outlined"
                  density="comfortable"
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
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.vendorId"
                  label="Vendor ID"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.address"
                  label="Complete Address"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.spouseLast"
                  label="Spouse’s Last Name"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.spouseFirst"
                  label="Spouse’s First Name"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.spouseMiddle"
                  label="Spouse’s Middle Name"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.childLast"
                  label="Child’s Last Name"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.childFirst"
                  label="Child’s First Name"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.childMiddle"
                  label="Child’s Middle Name"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
            </v-row>
          </v-col>

          <!-- PAGE 2 -->
          <v-col v-else cols="12">
            <div class="text-h5 font-weight-bold mb-6">Add Business Details</div>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.businessName"
                  label="Business Name"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.businessType"
                  label="Business Type"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.productsSold"
                  label="Products Sold"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-1 text-medium-emphasis">Vending Time</div>
                <div class="d-flex ga-2">
                  <v-text-field
                    v-model="form.vendStart"
                    type="time"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  />
                  <span class="d-flex align-center">–</span>
                  <v-text-field
                    v-model="form.vendEnd"
                    type="time"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  />
                </div>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.businessAddress"
                  label="Business Address"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
            </v-row>

            <div class="text-h6 font-weight-bold mt-6 mb-2">Upload Documents</div>
            <v-row>
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="form.files.clearance"
                  label="Barangay Business Clearance"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-paperclip"
                  show-size
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="form.files.votersId"
                  label="Voter’s ID"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-paperclip"
                  show-size
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-file-input
                  v-model="form.files.cedula"
                  label="Cedula"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-paperclip"
                  show-size
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="form.files.picture"
                  label="2x2 Picture (White background)"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-paperclip"
                  show-size
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-file-input
                  v-model="form.files.association"
                  label="Association Clearance"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-paperclip"
                  show-size
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="form.files.healthcard"
                  label="Health Card/Yellow Card"
                  variant="outlined"
                  density="comfortable"
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
      <v-card-actions class="px-6 py-4">
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

/** v-model for dialog */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'save'])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

/** Step control */
const step = ref(1)

/** Form state */
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

  // files
  files: {
    clearance: null,
    votersId: null,
    cedula: null,
    picture: null,
    association: null,
    healthcard: null,
  },
})

function importSampleData() {
  // already seeded above to match your mock; this function can pull from OCR/CSV in the future
}

function goNext() {
  // simple front-end validation for required fields on page 1
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
  // front-end only: emit a compact object back to parent to add to table
  const newRow = {
    id: form.vendorId,
    name: `${form.firstName} ${form.lastName}`,
    business: form.businessName,
    collector: 'John Smith', // default; parent can change or show another input
    status: 'Active',
    raw: JSON.parse(JSON.stringify(form)), // keep whole payload if parent needs it
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
.v-card-title {
  background: #f5f5f7;
}
</style>
