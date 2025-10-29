<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="branch-management">
    <!-- Loading Overlay -->
    <v-overlay v-if="loading" contained>
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
      <div class="text-h6 mt-4">Loading branches...</div>
    </v-overlay>

    <!-- Main Content -->
    <div v-if="!loading">
      <!-- Header Section -->
      <v-card class="header-card mb-6" elevation="2">
        <v-card-text>
          <div>
            <h2 class="text-h4 font-weight-bold primary--text">Branch Management</h2>
            <p class="text-subtitle-1 text--secondary mt-2">
              Manage branches and assign branch managers across locations
            </p>
          </div>
        </v-card-text>
      </v-card>

      <!-- Stats Cards -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="2" class="stats-card">
            <v-card-text class="text-center">
              <v-icon size="48" color="primary" class="mb-3">mdi-domain</v-icon>
              <h3 class="text-h4 font-weight-bold">{{ branches.length }}</h3>
              <p class="text-subtitle-2 text--secondary">Total Branches</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="2" class="stats-card">
            <v-card-text class="text-center">
              <v-icon size="48" color="primary" class="mb-3">mdi-check-circle</v-icon>
              <h3 class="text-h4 font-weight-bold">{{ activeBranches }}</h3>
              <p class="text-subtitle-2 text--secondary">Active Branches</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="2" class="stats-card">
            <v-card-text class="text-center">
              <v-icon size="48" color="info" class="mb-3">mdi-account-tie</v-icon>
              <h3 class="text-h4 font-weight-bold">{{ managedBranches }}</h3>
              <p class="text-subtitle-2 text--secondary">Managed Branches</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="2" class="stats-card">
            <v-card-text class="text-center">
              <v-icon size="48" color="warning" class="mb-3">mdi-account-question</v-icon>
              <h3 class="text-h4 font-weight-bold">{{ unmanagedBranches }}</h3>
              <p class="text-subtitle-2 text--secondary">Need Manager</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Branch List -->
      <BranchList
        :branches="branches"
        :loading="loading"
        @refresh="loadBranches"
        @assign-manager="openAssignManagerDialog"
        @edit-branch="editBranch"
        @delete-branch="deleteBranch"
      />
    </div>

    <!-- Floating Action Button (exactly like Stalls component) -->
    <!-- Pulse rings for ambient effect -->
    <div class="pulse-rings" v-if="!showAddBranchDialog">
      <div class="pulse-ring pulse-ring-1"></div>
      <div class="pulse-ring pulse-ring-2"></div>
      <div class="pulse-ring pulse-ring-3"></div>
      <div class="pulse-ring pulse-ring-4"></div>
    </div>

    <!-- Floating Action Button with Tooltip -->
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          color="primary"
          class="fab-add"
          @click="showAddBranchDialog = true"
          v-bind="attrs"
          v-on="on"
        >
          <div class="ripple-overlay"></div>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Add New Branch</span>
    </v-tooltip>

    <!-- Add Branch Dialog -->
    <AddBranchDialog v-model="showAddBranchDialog" @branch-created="onBranchCreated" />

    <!-- Assign Manager Dialog -->
    <AssignManagerDialog
      v-model="showAssignManagerDialog"
      :branch="selectedBranch"
      @manager-assigned="onManagerAssigned"
    />

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" timeout="4000" top>
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn text @click="showSnackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script src="./Branch.js"></script>
<style scoped src="./Branch.css"></style>
