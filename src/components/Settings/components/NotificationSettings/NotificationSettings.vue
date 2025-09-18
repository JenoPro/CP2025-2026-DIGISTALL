<template>
  <v-container class="pa-6">
    <div class="notification-settings">
      <!-- Notification Header -->
      <div class="notification-header mb-6">
        <h3 class="text-h5 font-weight-bold mb-2">Notification Settings</h3>
        <p class="text-subtitle-2 text--secondary">
          Control how and when you receive notifications
        </p>
      </div>

      <!-- Email Notifications -->
      <v-card elevation="2" class="mb-4">
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-3">mdi-email</v-icon>
          Email Notifications
        </v-card-title>
        <v-card-text>
          <div class="notification-item">
            <div class="notification-info">
              <h4 class="text-subtitle-1 font-weight-medium">Email Notifications</h4>
              <p class="text-caption text--secondary">
                Receive notifications via email
              </p>
            </div>
            <v-switch
              v-model="preferences.emailNotifications"
              color="primary"
              inset
              @change="updatePreferences"
            ></v-switch>
          </div>
          
          <v-divider class="my-4"></v-divider>
          
          <div class="notification-item">
            <div class="notification-info">
              <h4 class="text-subtitle-1 font-weight-medium">System Announcements</h4>
              <p class="text-caption text--secondary">
                Important system updates and announcements
              </p>
            </div>
            <v-switch
              v-model="preferences.systemAnnouncements"
              color="primary"
              inset
              @change="updatePreferences"
            ></v-switch>
          </div>
        </v-card-text>
      </v-card>

      <!-- Push Notifications -->
      <v-card elevation="2" class="mb-4">
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-3">mdi-bell</v-icon>
          Push Notifications
        </v-card-title>
        <v-card-text>
          <div class="notification-item">
            <div class="notification-info">
              <h4 class="text-subtitle-1 font-weight-medium">Push Notifications</h4>
              <p class="text-caption text--secondary">
                Receive instant notifications in your browser
              </p>
            </div>
            <v-switch
              v-model="preferences.pushNotifications"
              color="primary"
              inset
              @change="updatePreferences"
            ></v-switch>
          </div>
        </v-card-text>
      </v-card>

      <!-- Stall Management Notifications -->
      <v-card elevation="2" class="mb-4">
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-3">mdi-store</v-icon>
          Stall Management
        </v-card-title>
        <v-card-text>
          <div class="notification-item">
            <div class="notification-info">
              <h4 class="text-subtitle-1 font-weight-medium">Stall Updates</h4>
              <p class="text-caption text--secondary">
                Notifications about stall status changes, new applications, and updates
              </p>
            </div>
            <v-switch
              v-model="preferences.stallUpdates"
              color="primary"
              inset
              @change="updatePreferences"
            ></v-switch>
          </div>
          
          <v-divider class="my-4"></v-divider>
          
          <div class="notification-item">
            <div class="notification-info">
              <h4 class="text-subtitle-1 font-weight-medium">Payment Reminders</h4>
              <p class="text-caption text--secondary">
                Reminders for upcoming payments and due dates
              </p>
            </div>
            <v-switch
              v-model="preferences.paymentReminders"
              color="primary"
              inset
              @change="updatePreferences"
            ></v-switch>
          </div>
        </v-card-text>
      </v-card>

      <!-- Test Notification -->
      <v-card elevation="2">
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-3">mdi-test-tube</v-icon>
          Test Notifications
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 mb-4">
            Send a test notification to verify your settings are working correctly.
          </p>
          <v-btn
            color="primary"
            variant="outlined"
            @click="sendTestNotification"
            :loading="testLoading"
          >
            <v-icon left>mdi-send</v-icon>
            Send Test Notification
          </v-btn>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script src="./NotificationSettings.js"></script>
<style scoped src="./NotificationSettings.css"></style>