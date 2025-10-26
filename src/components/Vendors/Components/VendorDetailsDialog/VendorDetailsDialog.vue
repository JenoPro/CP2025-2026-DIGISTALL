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

<script src="./VendorDetailsDialog.js"></script>
<style scoped src="./VendorDetailsDialog.css"></style>
