<template>
  <v-container class="pa-6">
    <div class="security-settings">
      <!-- Security Header -->
      <div class="security-header mb-6">
        <h3 class="text-h5 font-weight-bold mb-2">Security Settings</h3>
        <p class="text-subtitle-2 text--secondary">
          Manage your account security and password settings
        </p>
      </div>

      <!-- Change Password -->
      <v-card elevation="2" class="mb-6">
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-3">mdi-lock-reset</v-icon>
          Change Password
        </v-card-title>
        <v-card-text>
          <v-form ref="passwordForm" v-model="passwordValid" lazy-validation>
            <v-row>
              <!-- Current Password -->
              <v-col cols="12">
                <v-text-field
                  v-model="passwordData.currentPassword"
                  label="Current Password"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  :rules="currentPasswordRules"
                  prepend-icon="mdi-lock"
                  :append-inner-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showCurrentPassword = !showCurrentPassword"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>

              <!-- New Password -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="passwordData.newPassword"
                  label="New Password"
                  :type="showNewPassword ? 'text' : 'password'"
                  :rules="newPasswordRules"
                  prepend-icon="mdi-lock-plus"
                  :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showNewPassword = !showNewPassword"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>

              <!-- Confirm New Password -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="passwordData.confirmPassword"
                  label="Confirm New Password"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :rules="confirmPasswordRules"
                  prepend-icon="mdi-lock-check"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Change Password Button -->
            <div class="text-right mt-4">
              <v-btn
                color="primary"
                variant="elevated"
                @click="changePassword"
                :loading="loading"
                :disabled="!passwordValid"
              >
                <v-icon left>mdi-lock-reset</v-icon>
                Change Password
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- Two-Factor Authentication -->
      <v-card elevation="2">
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-3">mdi-two-factor-authentication</v-icon>
          Two-Factor Authentication
        </v-card-title>
        <v-card-text>
          <div class="d-flex align-center justify-space-between">
            <div>
              <h4 class="text-subtitle-1 font-weight-medium">
                Two-Factor Authentication (2FA)
              </h4>
              <p class="text-caption text--secondary">
                Add an extra layer of security to your account
              </p>
            </div>
            <v-chip
              :color="twoFactorEnabled ? 'success' : 'warning'"
              variant="tonal"
            >
              {{ twoFactorEnabled ? 'Enabled' : 'Disabled' }}
            </v-chip>
          </div>
          
          <v-divider class="my-4"></v-divider>
          
          <div class="text-center">
            <v-btn
              v-if="!twoFactorEnabled"
              color="primary"
              variant="elevated"
              @click="enableTwoFactor"
            >
              <v-icon left>mdi-shield-plus</v-icon>
              Enable 2FA
            </v-btn>
            <v-btn
              v-else
              color="warning"
              variant="outlined"
              @click="disableTwoFactor"
            >
              <v-icon left>mdi-shield-minus</v-icon>
              Disable 2FA
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script src="./SecuritySettings.js"></script>
<style scoped src="./SecuritySettings.css"></style>