<template>
  <v-dialog v-model="isVisible" max-width="500" persistent>
    <v-card>
      <v-card-title class="text-h5 pa-4 bg-success text-white">
        <v-icon class="mr-2" color="white">mdi-check-circle</v-icon>
        Approve Applicant
      </v-card-title>

      <v-card-text class="pa-6">
        <div class="text-center mb-4">
          <v-avatar size="80" color="success" class="mb-3">
            <v-icon size="40" color="white">mdi-account-check</v-icon>
          </v-avatar>
          <h3 class="text-h6 mb-2">{{ applicant?.fullName }}</h3>
          <p class="text-body-2 text-grey-darken-1">{{ applicant?.email }}</p>
        </div>

        <v-divider class="my-4"></v-divider>

        <div class="credentials-info">
          <h4 class="text-subtitle-1 mb-3">Generated Credentials:</h4>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Username"
                :value="credentials.username"
                readonly
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-account"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Password"
                :value="credentials.password"
                readonly
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-lock"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <v-alert type="info" variant="tonal" class="mt-4" icon="mdi-information">
          These credentials will be sent to the applicant's email address.
        </v-alert>

        <div v-if="loading" class="text-center py-4">
          <v-progress-circular
            indeterminate
            color="success"
            size="32"
          ></v-progress-circular>
          <p class="mt-2 text-body-2">{{ loadingMessage }}</p>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4 border-t">
        <v-btn variant="outlined" @click="cancel" :disabled="loading"> Cancel </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          variant="flat"
          @click="approve"
          :loading="loading"
          :disabled="loading"
        >
          <v-icon left>mdi-check</v-icon>
          Approve & Send Credentials
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script src="./ApproveApplicants.js"></script>
<style scoped src="./ApproveApplicants.css"></style>
