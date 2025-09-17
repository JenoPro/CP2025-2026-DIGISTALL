<template>
  <v-container fluid class="login-container">
    <v-row class="fill-height" no-gutters>
      <!-- Left Side - Logo and Title -->
      <v-col cols="12" md="8" class="left-section d-flex align-center justify-center">
        <div class="logo-title-section text-center">
          <img
            src="../../assets/naga-city-logo.png"
            alt="Naga City Logo"
            class="city-logo mb-6"
          />
          <h1 class="main-title mb-2">Naga City Stall Management</h1>
          <h2 class="sub-title mb-4">Web Portal</h2>
          <p class="powered-by">Powered by: DigiStall</p>
        </div>
      </v-col>

      <!-- Right Side - Login Form -->
      <v-col cols="12" md="4" class="right-section d-flex align-center justify-center">
        <v-card
          class="login-card"
          elevation="0"
          width="100%"
          max-width="450"
          min-height="600"
        >
          <v-card-text class="pa-6">
            <h3 class="form-title text-center mb-4">System Login</h3>

            <v-form ref="loginForm" v-model="valid" @submit.prevent="handleLogin">
              <!-- Username Field -->
              <v-text-field
                v-model="username"
                label="Username"
                :rules="usernameRules"
                variant="outlined"
                class="mb-3"
                required
                prepend-inner-icon="mdi-account"
                placeholder="Enter your username"
                density="comfortable"
              >
              </v-text-field>

              <!-- Password Field -->
              <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                variant="outlined"
                class="mb-3"
                required
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="togglePasswordVisibility"
                placeholder="Enter your password"
                density="comfortable"
              >
              </v-text-field>

              <!-- Login Button -->
              <v-btn
                type="submit"
                class="login-btn mb-3"
                block
                size="large"
                :loading="loading"
                :disabled="!valid || loading"
                color="primary"
              >
                <v-icon left class="mr-2">mdi-login</v-icon>
                {{ loading ? "Authenticating..." : "Login to Dashboard" }}
              </v-btn>

              <!-- Error Message Display -->
              <v-alert
                v-if="errorMessage"
                type="error"
                density="compact"
                class="error-alert mb-3"
                closable
                @click:close="clearError"
                border="start"
                variant="tonal"
              >
                <template v-slot:prepend>
                  <v-icon>mdi-alert-circle</v-icon>
                </template>
                {{ errorMessage }}
              </v-alert>

              <!-- Success Message Display -->
              <v-alert
                v-if="showSuccessMessage && successMessage"
                type="success"
                density="compact"
                class="success-alert mb-3"
                border="start"
                variant="tonal"
              >
                <template v-slot:prepend>
                  <v-icon>mdi-check-circle</v-icon>
                </template>
                {{ successMessage }}
              </v-alert>

              <!-- Forgot Password -->
              <div class="text-center mb-3">
                <v-btn
                  variant="text"
                  class="forgot-password-btn"
                  size="small"
                  @click="handleForgotPassword"
                  :disabled="loading"
                >
                  <v-icon left small>mdi-help-circle</v-icon>
                  Forgot Password?
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Professional Loading Overlay -->
    <v-overlay v-model="loading" class="loading-overlay" persistent :opacity="0.95">
      <div class="loading-container">
        <v-card class="loading-card pa-8 text-center" elevation="12">
          <div class="loading-content">
            <!-- Animated Logo -->
            <div class="loading-logo-container mb-4">
              <img
                src="../../assets/naga-city-logo.png"
                alt="Loading..."
                class="loading-logo pulse-animation"
              />
            </div>

            <!-- Loading Spinner -->
            <v-progress-circular
              indeterminate
              size="48"
              width="4"
              color="primary"
              class="mb-4"
            />

            <!-- Loading Text -->
            <h3 class="loading-title mb-2">{{ loadingText }}</h3>
            <p class="loading-subtitle mb-4">{{ loadingSubtext }}</p>

            <!-- Loading Progress Dots -->
            <div class="loading-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </v-card>
      </div>
    </v-overlay>

    <!-- Success Notification Snackbar -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      :timeout="4000"
      color="success"
      location="top"
      variant="elevated"
    >
      <v-icon class="me-2">mdi-check-circle</v-icon>
      {{ successMessage }}

      <template v-slot:actions>
        <v-btn variant="text" @click="showSuccessSnackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script src="./LoginPage.js"></script>
<style scoped src="./LoginPage.css"></style>
