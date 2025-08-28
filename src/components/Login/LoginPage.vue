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
      <v-col cols="12" md="3" class="right-section d-flex align-center justify-center">
        <v-card class="login-card" elevation="0" width="100%" max-width="400">
          <v-card-text class="pa-8">
            <h3 class="form-title text-center mb-6">Sign In</h3>

            <v-form ref="loginForm" v-model="valid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="username"
                label="Username"
                :rules="usernameRules"
                variant="outlined"
                class="mb-4"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :rules="passwordRules"
                variant="outlined"
                class="mb-4"
                required
              ></v-text-field>

              <v-btn
                type="submit"
                class="login-btn mb-4"
                block
                size="large"
                :loading="loading"
                :disabled="!valid"
              >
                Login
              </v-btn>

              <div class="text-center">
                <v-btn
                  variant="text"
                  class="forgot-password-btn"
                  @click="handleForgotPassword"
                >
                  Forgot Password?
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./LoginPage.js"></script>
<style scoped src="./LoginPage.css"></style>
