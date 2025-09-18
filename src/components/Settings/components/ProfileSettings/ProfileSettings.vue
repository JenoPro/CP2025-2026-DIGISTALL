<template>
  <v-container class="pa-6">
    <div class="profile-settings">
      <!-- Profile Header -->
      <div class="profile-header mb-6">
        <h3 class="text-h5 font-weight-bold mb-2">Profile Information</h3>
        <p class="text-subtitle-2 text--secondary">
          Update your personal information and account details
        </p>
      </div>

      <!-- Profile Form -->
      <v-form ref="profileForm" v-model="valid" lazy-validation>
        <v-row>
          <!-- Avatar Section -->
          <v-col cols="12" class="text-center mb-4">
            <div class="avatar-section">
              <v-avatar size="120" class="mb-4 avatar-container">
                <v-img
                  v-if="profileData.avatar"
                  :src="profileData.avatar"
                  alt="Profile Picture"
                ></v-img>
                <v-icon v-else size="60" color="grey">mdi-account-circle</v-icon>
              </v-avatar>
              <div>
                <v-btn
                  color="primary"
                  variant="outlined"
                  size="small"
                  @click="$refs.avatarInput.click()"
                >
                  <v-icon left size="small">mdi-camera</v-icon>
                  Change Photo
                </v-btn>
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="handleAvatarChange"
                />
              </div>
            </div>
          </v-col>

          <!-- Username -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="profileData.username"
              label="Username"
              :rules="usernameRules"
              prepend-icon="mdi-account"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>

          <!-- Email -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="profileData.email"
              label="Email Address"
              :rules="emailRules"
              prepend-icon="mdi-email"
              variant="outlined"
              type="email"
              required
            ></v-text-field>
          </v-col>

          <!-- First Name -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="profileData.firstName"
              label="First Name"
              prepend-icon="mdi-account-outline"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <!-- Last Name -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="profileData.lastName"
              label="Last Name"
              prepend-icon="mdi-account-outline"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <!-- Role (Read-only) -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="profileData.role"
              label="Role"
              prepend-icon="mdi-badge-account"
              variant="outlined"
              readonly
              bg-color="grey-lighten-4"
            ></v-text-field>
          </v-col>

          <!-- Branch (Read-only) -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="profileData.branch"
              label="Branch"
              prepend-icon="mdi-domain"
              variant="outlined"
              readonly
              bg-color="grey-lighten-4"
            ></v-text-field>
          </v-col>

          <!-- Action Buttons -->
          <v-col cols="12" class="text-right">
            <v-btn
              color="grey"
              variant="outlined"
              @click="resetForm"
              class="mr-4"
              :disabled="loading"
            >
              Reset
            </v-btn>
            <v-btn
              color="primary"
              variant="elevated"
              @click="saveProfile"
              :loading="loading"
              :disabled="!valid || !hasChanges"
            >
              <v-icon left>mdi-content-save</v-icon>
              Save Changes
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </v-container>
</template>

<script src="./ProfileSettings.js"></script>
<style scoped src="./ProfileSettings.css"></style>