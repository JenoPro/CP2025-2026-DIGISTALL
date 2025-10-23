<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app>
    <div class="employee-container">
      <!-- Header Section - Simple white header like Applicants -->
      <v-container fluid class="main-content">
        <v-row>
          <v-col cols="12">
            <div class="page-header mb-6">
              <h2 class="text-h4 font-weight-bold">
                <v-icon class="mr-2">mdi-account-group</v-icon>
                Employee Management
              </h2>
              <p class="page-subtitle">Manage employee accounts and permissions</p>
            </div>

            <!-- Stats Cards -->
            <v-row class="mb-6">
              <v-col cols="12" md="4">
                <v-card class="stat-card primary text-center">
                  <v-card-text>
                    <div class="stat-number">{{ totalEmployees }}</div>
                    <div class="stat-label">Total Employees</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card class="stat-card success text-center">
                  <v-card-text>
                    <div class="stat-number">{{ activeEmployees }}</div>
                    <div class="stat-label">Active</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card class="stat-card warning text-center">
                  <v-card-text>
                    <div class="stat-number">{{ inactiveEmployees }}</div>
                    <div class="stat-label">Inactive</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Content Section -->
            <div class="employee-content">
              <!-- Search and Filters -->
              <EmployeeSearch
                v-model:search="searchQuery"
                v-model:statusFilter="statusFilter"
                v-model:permissionFilter="permissionFilter"
                :permission-options="permissionOptions"
                @reset="resetFilters"
              />

              <!-- Employee Table -->
              <EmployeeTable
                :employees="filteredEmployees"
                :loading="loading"
                @edit-employee="editEmployee"
                @manage-permissions="managePermissions"
                @toggle-status="toggleEmployeeStatus"
                @reset-password="resetEmployeePassword"
              />
            </div>

            <!-- Floating Button Container (matching Stalls design) -->
            <div class="floating-button-container">
              <button class="floating-btn" @click="openAddEmployeeDialog">
                <v-icon size="24">mdi-plus</v-icon>
                <div class="ripple-overlay"></div>
              </button>
            </div>

            <!-- Pulse Rings Animation -->
            <div class="pulse-rings">
              <div class="pulse-ring pulse-ring-1"></div>
              <div class="pulse-ring pulse-ring-2"></div>
              <div class="pulse-ring pulse-ring-3"></div>
              <div class="pulse-ring pulse-ring-4"></div>
            </div>

            <!-- Add/Edit Employee Dialog -->
            <AddEmployee
              v-model="employeeDialog"
              :employee="selectedEmployee"
              :is-edit-mode="isEditMode"
              :saving="saving"
              :available-permissions="availablePermissions"
              :selected-permissions="selectedPermissions"
              @save="saveEmployee"
              @close="closeEmployeeDialog"
              @toggle-permission="togglePermission"
            />

            <!-- Manage Permissions Dialog -->
            <ManagePermissions
              v-model="permissionsDialog"
              :employee="selectedEmployee"
              :selected-permissions="selectedPermissions"
              :available-permissions="availablePermissions"
              :saving="saving"
              @save="savePermissions"
              @close="closePermissionsDialog"
              @toggle-permission="togglePermission"
            />

            <!-- Loading Overlay -->
            <v-overlay v-model="loading" class="loading-overlay">
              <v-progress-circular
                indeterminate
                size="64"
                color="primary"
              ></v-progress-circular>
            </v-overlay>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script src="./Employees.js"></script>
<style src="./Employees.css"></style>
