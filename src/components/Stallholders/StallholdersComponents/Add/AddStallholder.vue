<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-dialog v-model="isVisible" max-width="600px" persistent>
    <v-card class="add-stallholder-modal">
      <!-- Header -->
      <v-card-title class="modal-header">
        <h2 class="modal-title">Add New StallHolder</h2>
        <v-btn 
          icon 
          class="close-btn" 
          @click="closeModal"
        >
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Form Content -->
      <v-card-text class="modal-content">
        <v-form ref="form" v-model="isFormValid">
          <v-row>
            <!-- Full Name -->
            <v-col cols="12" md="6">
              <div class="form-group">
                <label class="form-label">Full Name:</label>
                <v-text-field
                  v-model="formData.fullName"
                  :rules="nameRules"
                  variant="outlined"
                  dense
                  class="form-input"
                  placeholder="Enter full name"
                ></v-text-field>
              </div>
            </v-col>

            <!-- Email Address -->
            <v-col cols="12" md="6">
              <div class="form-group">
                <label class="form-label">Email Address:</label>
                <v-text-field
                  v-model="formData.email"
                  :rules="emailRules"
                  variant="outlined"
                  dense
                  class="form-input"
                  placeholder="Enter email address"
                ></v-text-field>
              </div>
            </v-col>

            <!-- Phone Number -->
            <v-col cols="12" md="6">
              <div class="form-group">
                <label class="form-label">Phone Number:</label>
                <v-text-field
                  v-model="formData.phoneNumber"
                  :rules="phoneRules"
                  variant="outlined"
                  dense
                  class="form-input"
                  placeholder="Enter phone number"
                ></v-text-field>
              </div>
            </v-col>

            <!-- Address -->
            <v-col cols="12" md="6">
              <div class="form-group">
                <label class="form-label">Address:</label>
                <v-text-field
                  v-model="formData.address"
                  :rules="addressRules"
                  variant="outlined"
                  dense
                  class="form-input"
                  placeholder="Enter address"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <!-- Footer with Submit Button -->
      <v-card-actions class="modal-footer">
        <v-btn 
          class="submit-btn"
          :disabled="!isFormValid || isSubmitting"
          :loading="isSubmitting"
          @click="submitForm"
        >
          SUBMIT
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script src="./AddStallholder.js"></script>
<style scoped src="./AddStallholder.css"></style>