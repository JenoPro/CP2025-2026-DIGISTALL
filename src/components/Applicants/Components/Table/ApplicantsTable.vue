<template>
  <div class="applicants-table">
    <v-card elevation="1" class="table-card">
      <!-- Custom Table Header -->
      <div class="table-header">
        <div class="header-row">
          <div class="header-cell id-col">ID</div>
          <div class="header-cell name-col">Full Name</div>
          <div class="header-cell email-col">Email Address</div>
          <div class="header-cell phone-col">Phone Number</div>
          <div class="header-cell address-col">Address</div>
          <div class="header-cell action-col">Action</div>
        </div>
      </div>

      <!-- Table Body -->
      <div class="table-body">
        <div v-for="applicant in applicants" :key="applicant.id" class="table-row">
          <div class="table-cell id-col">
            {{ applicant.id }}
          </div>
          <div class="table-cell name-col">
            {{ applicant.fullName }}
          </div>
          <div class="table-cell email-col">
            {{ applicant.email }}
          </div>
          <div class="table-cell phone-col">
            {{ applicant.phoneNumber }}
          </div>
          <div class="table-cell address-col">
            <div class="address-text">
              {{ applicant.address }}
            </div>
          </div>
          <div class="table-cell action-col">
            <div class="action-buttons">
              <v-btn
                variant="flat"
                color="success"
                size="small"
                class="mr-2 accept-btn"
                @click="acceptApplicant(applicant)"
              >
                ACCEPT
              </v-btn>
              <v-btn
                variant="flat"
                color="error"
                size="small"
                class="decline-btn"
                @click="declineApplicant(applicant)"
              >
                DECLINE
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="applicants.length === 0" class="empty-state">
        <v-icon size="48" color="grey-lighten-1" class="mb-3">
          mdi-account-group-outline
        </v-icon>
        <p class="text-grey-lighten-1">No vendor applicants found</p>
      </div>
    </v-card>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="showConfirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          {{ confirmAction === "accept" ? "Accept" : "Decline" }} Applicant
        </v-card-title>
        <v-card-text>
          Are you sure you want to {{ confirmAction }}
          <strong>{{ selectedApplicant?.fullName }}</strong
          >?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showConfirmDialog = false"> Cancel </v-btn>
          <v-btn
            :color="confirmAction === 'accept' ? 'success' : 'error'"
            variant="flat"
            @click="confirmActionHandler"
          >
            {{ confirmAction === "accept" ? "Accept" : "Decline" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script src="./ApplicantsTable.js"></script>
<style scoped src="./ApplicantsTable.css"></style>
