<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5 primary white--text">
        <v-icon left class="mr-2">mdi-domain</v-icon>
        Add New Branch
      </v-card-title>

      <v-form ref="form" v-model="valid">
        <v-card-text class="pt-4">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.branch_name"
                  label="Branch Name *"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-store"
                  placeholder="Enter branch name"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.area"
                  label="Area *"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-map-marker"
                  placeholder="Enter area"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.location"
                  label="Location *"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-crosshairs-gps"
                  placeholder="Enter location"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="formData.address"
                  label="Full Address"
                  variant="outlined"
                  prepend-inner-icon="mdi-home-map-marker"
                  placeholder="Enter complete address"
                  rows="3"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.contact_number"
                  label="Contact Number"
                  variant="outlined"
                  prepend-inner-icon="mdi-phone"
                  placeholder="+63 XXX XXX XXXX"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.email"
                  label="Email Address"
                  :rules="[rules.email]"
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                  placeholder="branch@example.com"
                />
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="formData.status"
                  label="Status *"
                  :items="statusOptions"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-check-circle"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn color="grey" variant="outlined" @click="closeDialog" :disabled="loading">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="saveBranch"
            :loading="loading"
            :disabled="!valid"
          >
            Create Branch
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script src="./AddBranchDialog.js"></script>

<style scoped src="./AddBranchDialog.css"></style>

