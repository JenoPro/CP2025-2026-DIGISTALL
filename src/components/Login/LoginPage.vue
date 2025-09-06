<template>
  <v-container fluid class="login-container">
    <v-row class="fill-height" no-gutters>
      <!-- Left Side - Logo and Title -->
      <v-col cols="12" md="8" class="left-section d-flex align-center justify-center">
        <div class="logo-title-section text-center">
          <img src="../../assets/naga-city-logo.png" alt="Naga City Logo" class="city-logo mb-6" />
          <h1 class="main-title mb-2">Naga City Stall Management</h1>
          <h2 class="sub-title mb-4">Web Portal</h2>
          <p class="powered-by">Powered by: DigiStall</p>
        </div>
      </v-col>

      <!-- Right Side - Login Form -->
      <v-col cols="12" md="3" class="right-section d-flex align-center justify-center">
        <v-card class="login-card" elevation="0" width="100%" max-width="400" min-height="600">
          <v-card-text class="pa-6">
            <h3 class="form-title text-center mb-4">Sign In</h3>

            <v-form ref="loginForm" v-model="valid" @submit.prevent="handleLogin">
              <!-- City Selection Dropdown -->
              <v-select v-model="selectedCity" :items="availableCities" label="Select City" :rules="cityRules"
                variant="outlined" class="mb-3" :loading="loadingCities" required prepend-inner-icon="mdi-city"
                @update:model-value="onCityChange">
              </v-select>

              <!-- Branch Selection Dropdown -->
              <v-select v-model="selectedBranch" :items="availableBranches" label="Select Branch" :rules="branchRules"
                variant="outlined" class="mb-3" :loading="loadingBranches" required :disabled="!selectedCity"
                prepend-inner-icon="mdi-domain">
              </v-select>

              <!-- Username Field -->
              <v-text-field v-model="username" label="Username" :rules="usernameRules" variant="outlined" class="mb-3"
                required prepend-inner-icon="mdi-account">
              </v-text-field>

              <!-- Password Field -->
              <v-text-field v-model="password" label="Password" :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules" variant="outlined" class="mb-3" required prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="togglePasswordVisibility">
              </v-text-field>

              <!-- Login Button -->
              <v-btn type="submit" class="login-btn mb-3" block size="large" :loading="loading" :disabled="!valid">
                Login
              </v-btn>

              <!-- Error Message Display -->
              <v-alert v-if="errorMessage" type="error" density="compact" class="error-alert mb-3" closable
                @click:close="clearError">
                {{ errorMessage }}
              </v-alert>

              <!-- Forgot Password -->
              <div class="text-center mb-3">
                <v-btn variant="text" class="forgot-password-btn" size="small" @click="handleForgotPassword">
                  Forgot Password?
                </v-btn>
              </div>

              <!-- Admin Registration Section -->
              <v-divider class="my-3"></v-divider>
              <div class="text-center">
                <p class="text-caption mb-2">Need to register a new admin?</p>
                <RegisterModal v-model="showRegisterModal" @admin-registered="onAdminRegistered" />
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Notification Snackbar -->
    <v-snackbar v-model="showSuccessSnackbar" :timeout="4000" color="success" location="top" variant="elevated">
      <v-icon class="me-2">mdi-check-circle</v-icon>
      {{ successMessage }}

      <template v-slot:actions>
        <v-btn variant="text" @click="showSuccessSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script src="./LoginPage.js"></script>
<style scoped src="./LoginPage.css"></style>