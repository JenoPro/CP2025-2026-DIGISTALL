<template>
  <v-dialog v-model="model" max-width="720" persistent>
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">Add Collector Details</v-card-title>
      <v-divider />
      <v-card-text class="pt-6">
        <v-form @submit.prevent="submit">
          <v-row>
            <v-col cols="12" md="4"
              ><v-text-field
                v-model="form.lastName"
                label="Last Name"
                variant="outlined"
                density="comfortable"
            /></v-col>
            <v-col cols="12" md="4"
              ><v-text-field
                v-model="form.firstName"
                label="First Name"
                variant="outlined"
                density="comfortable"
            /></v-col>
            <v-col cols="12" md="4"
              ><v-text-field
                v-model="form.middleName"
                label="Middle Name"
                variant="outlined"
                density="comfortable"
            /></v-col>

            <v-col cols="12" md="4"
              ><v-text-field
                v-model="form.suffix"
                label="Suffix (if any)"
                variant="outlined"
                density="comfortable"
            /></v-col>
            <v-col cols="12" md="4"
              ><v-text-field
                v-model="form.birthdate"
                type="date"
                label="Birthdate"
                variant="outlined"
                density="comfortable"
            /></v-col>
            <v-col cols="12" md="4">
              <div class="mb-1 text-medium-emphasis">Gender</div>
              <v-btn-toggle v-model="form.gender" divided mandatory>
                <v-btn value="Male" size="small">Male</v-btn>
                <v-btn value="Female" size="small">Female</v-btn>
              </v-btn-toggle>
            </v-col>

            <v-col cols="12" md="4"
              ><v-text-field
                v-model="form.phone"
                label="Phone Number"
                variant="outlined"
                density="comfortable"
            /></v-col>
            <v-col cols="12" md="4"
              ><v-text-field
                v-model="form.email"
                label="Email Address"
                type="email"
                variant="outlined"
                density="comfortable"
            /></v-col>
            <v-col cols="12" md="4"
              ><v-text-field
                v-model="form.collectorId"
                label="Collector ID"
                variant="outlined"
                density="comfortable"
            /></v-col>

            <v-col cols="12"
              ><v-text-field
                v-model="form.address"
                label="Complete Address"
                variant="outlined"
                density="comfortable"
            /></v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="form.location"
                :items="locations"
                label="Assigned Location"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-file-input
                v-model="form.picture"
                label="2x2 Picture (White background)"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-paperclip"
                show-size
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="tonal" color="grey" @click="cancel">Cancel</v-btn>
        <v-spacer />
        <v-btn color="primary" @click="submit">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, reactive } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  locations: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'save'])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const form = reactive({
  lastName: 'Corpuz',
  firstName: 'Peter',
  middleName: 'Reyes',
  suffix: '',
  birthdate: '1994-10-04',
  gender: 'Male',
  phone: '09123456789',
  email: 'peter.corpuz@email.com',
  collectorId: '123456',
  address: 'Block 6 Lot 15 Maharlika Village Barangay Rosario Naga City',
  location: 'Panganiban',
  picture: null,
})

function submit() {
  if (!form.firstName || !form.lastName) return alert('Please complete required fields.')
  emit('save', {
    id: form.collectorId,
    name: [form.firstName, form.lastName].filter(Boolean).join(' '),
    contact: form.phone,
    location: form.location,
    raw: { ...form }, // keep File
  })
  model.value = false
}
function cancel() {
  model.value = false
}
</script>
