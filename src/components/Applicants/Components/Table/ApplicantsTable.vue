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
          <div class="header-cell info-col">More Info</div>
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
          <div class="table-cell info-col">
            <v-btn
              icon
              variant="text"
              size="small"
              color="primary"
              @click="viewMoreInfo(applicant)"
              class="info-btn"
            >
              <v-icon size="20">mdi-information-outline</v-icon>
            </v-btn>
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
        <p class="text-grey-lighten-1">No applicants found</p>
      </div>
    </v-card>

    <!-- More Info Dialog -->
    <v-dialog v-model="showInfoDialog" max-width="900" scrollable>
      <v-card>
        <v-card-title class="text-h5 pa-4 bg-primary text-white">
          <v-icon class="mr-2" color="white">mdi-account-details</v-icon>
          Applicant Details - {{ selectedApplicant?.fullName }}
        </v-card-title>

        <v-card-text class="pa-0">
          <v-tabs v-model="activeTab" color="primary" class="border-b">
            <v-tab value="personal">Personal Information</v-tab>
            <v-tab value="business">Business Information</v-tab>
            <v-tab value="spouse" v-if="selectedApplicant?.spouse"
              >Spouse Information</v-tab
            >
            <v-tab value="documents">Other Information</v-tab>
          </v-tabs>

          <v-tabs-window v-model="activeTab" class="pa-4">
            <!-- Personal Information Tab -->
            <v-tabs-window-item value="personal">
              <div class="info-section">
                <h3 class="section-title">Personal Details</h3>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Full Name:</span>
                      <span class="info-value">{{ selectedApplicant?.fullName }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Email Address:</span>
                      <span class="info-value">{{ selectedApplicant?.email }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Phone Number:</span>
                      <span class="info-value">{{ selectedApplicant?.phoneNumber }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Birth Date:</span>
                      <span class="info-value">{{
                        formatDate(selectedApplicant?.applicant_birthdate)
                      }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Civil Status:</span>
                      <span class="info-value">{{
                        selectedApplicant?.applicant_civil_status
                      }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Educational Attainment:</span>
                      <span class="info-value">{{
                        selectedApplicant?.applicant_educational_attainment
                      }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div class="info-item">
                      <span class="info-label">Address:</span>
                      <span class="info-value">{{ selectedApplicant?.address }}</span>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-tabs-window-item>

            <!-- Business Information Tab -->
            <v-tabs-window-item value="business">
              <div class="info-section" v-if="selectedApplicant?.business_information">
                <h3 class="section-title">Business Details</h3>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Nature of Business:</span>
                      <span class="info-value">{{
                        selectedApplicant.business_information.nature_of_business
                      }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Capitalization:</span>
                      <span class="info-value"
                        >₱{{
                          formatCurrency(
                            selectedApplicant.business_information.capitalization
                          )
                        }}</span
                      >
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Source of Capital:</span>
                      <span class="info-value">{{
                        selectedApplicant.business_information.source_of_capital
                      }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Relative Stall Owner:</span>
                      <span class="info-value">{{
                        selectedApplicant.business_information.relative_stall_owner
                      }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div class="info-item">
                      <span class="info-label">Previous Business Experience:</span>
                      <span class="info-value">{{
                        selectedApplicant.business_information
                          .previous_business_experience
                      }}</span>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-tabs-window-item>

            <!-- Spouse Information Tab -->
            <v-tabs-window-item value="spouse" v-if="selectedApplicant?.spouse">
              <div class="info-section">
                <h3 class="section-title">Spouse Details</h3>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Full Name:</span>
                      <span class="info-value">{{
                        selectedApplicant.spouse.spouse_full_name
                      }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Birth Date:</span>
                      <span class="info-value">{{
                        formatDate(selectedApplicant.spouse.spouse_birthdate)
                      }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Educational Attainment:</span>
                      <span class="info-value">{{
                        selectedApplicant.spouse.spouse_educational_attainment
                      }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Contact Number:</span>
                      <span class="info-value">{{
                        selectedApplicant.spouse.spouse_contact_number
                      }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Occupation:</span>
                      <span class="info-value">{{
                        selectedApplicant.spouse.spouse_occupation
                      }}</span>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-tabs-window-item>

            <!-- Documents/Other Information Tab -->
            <v-tabs-window-item value="documents">
              <div class="info-section" v-if="selectedApplicant?.other_information">
                <h3 class="section-title">Documents & Other Information</h3>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Email Address:</span>
                      <span class="info-value">{{
                        selectedApplicant.other_information.email_address
                      }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Signature:</span>
                      <span class="info-value document-file">
                        <v-icon size="16" class="mr-1">mdi-file-document</v-icon>
                        {{ selectedApplicant.other_information.signature_of_applicant }}
                      </span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">House Sketch:</span>
                      <span class="info-value document-file">
                        <v-icon size="16" class="mr-1">mdi-file-image</v-icon>
                        {{ selectedApplicant.other_information.house_sketch_location }}
                      </span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <span class="info-label">Valid ID:</span>
                      <span class="info-value document-file">
                        <v-icon size="16" class="mr-1">mdi-file-image</v-icon>
                        {{ selectedApplicant.other_information.valid_id }}
                      </span>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>

        <v-card-actions class="pa-4 border-t">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="showInfoDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
          <v-btn variant="text" @click="showConfirmDialog = false">Cancel</v-btn>
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
