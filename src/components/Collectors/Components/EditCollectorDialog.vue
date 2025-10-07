<template>
  <v-dialog v-model="model" max-width="720" persistent>
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">Edit Collector Details</v-card-title>
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
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  data: { type: Object, default: () => ({}) }, // raw payload to edit
  locations: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'update'])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const form = reactive(makeForm(props.data))
watch(
  () => props.data,
  (val) => Object.assign(form, makeForm(val)),
  { deep: true },
)

function makeForm(src) {
  return {
    lastName: '',
    firstName: '',
    middleName: '',
    suffix: '',
    birthdate: '',
    gender: 'Male',
    phone: '',
    email: '',
    collectorId: '',
    address: '',
    location: props.locations[0] || 'Panganiban',
    picture: null,
    ...(src || {}),
  }
}

function submit() {
  const updated = {
    id: form.collectorId,
    name: [form.firstName, form.lastName].filter(Boolean).join(' '),
    contact: form.phone,
    location: form.location,
    raw: { ...form },
  }
  emit('update', updated)
  model.value = false
}
function cancel() {
  model.value = false
}
</script>
