<template>
  <v-dialog v-model="model" max-width="680">
    <v-card class="pa-4">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold">Collector Details</span>
        <v-btn icon="mdi-close" variant="text" @click="model = false" />
      </v-card-title>
      <v-divider />
      <v-card-text class="pt-6">
        <v-row>
          <v-col cols="12" md="4" class="d-flex justify-center">
            <v-avatar size="120" rounded="lg">
              <v-img :src="photoSrc" />
            </v-avatar>
          </v-col>
          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="12" md="6">
                <div class="label">Collector Name</div>
                <div class="value">{{ fullName }}</div>

                <div class="label mt-3">Phone Number</div>
                <div class="value">{{ d.phone }}</div>

                <div class="label mt-3">Birthdate</div>
                <div class="value">{{ d.birthdate }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="label">Collector ID</div>
                <div class="value">{{ d.collectorId }}</div>

                <div class="label mt-3">Email Address</div>
                <div class="value">{{ d.email }}</div>

                <div class="label mt-3">Gender</div>
                <div class="value">{{ d.gender }}</div>
              </v-col>
            </v-row>

            <div class="label mt-3">Complete Address:</div>
            <div class="value">{{ d.address }}</div>

            <div class="label mt-3">Assigned Location</div>
            <div class="value">{{ d.location }}</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  data: { type: Object, default: () => ({}) },
  photo: { type: String, default: 'https://i.pravatar.cc/200?img=14' },
})
const emit = defineEmits(['update:modelValue'])
const model = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })
const d = computed(() => props.data || {})

const fullName = computed(() =>
  [d.value.firstName, d.value.middleName, d.value.lastName, d.value.suffix]
    .filter(Boolean)
    .join(' '),
)

const photoSrc = computed(
  () => d.value.picture || props.photo || 'https://i.pravatar.cc/200?img=32',
)
</script>

<style scoped>
.label {
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.6);
}
.value {
  font-weight: 600;
}
</style>
