<template>
  <div class="employee-table">
    <v-card elevation="1" class="table-card">
      <!-- Custom Table Header -->
      <div class="table-header">
        <div class="header-row">
          <div class="header-cell employee-col">Employee</div>
          <div class="header-cell username-col">Username</div>
          <div class="header-cell status-col">Status</div>
          <div class="header-cell permissions-col">Permissions</div>
          <div class="header-cell login-col">Last Login</div>
        </div>
      </div>

      <!-- Table Body -->
      <div class="table-body">
        <div v-if="employees.length === 0" class="no-data-container">
          <v-icon size="64" color="grey-lighten-2">mdi-account-off</v-icon>
          <p class="no-data-text">No employees found</p>
        </div>

        <div v-else>
          <div
            v-for="employee in employees"
            :key="employee.employee_id"
            class="table-row clickable-row"
            @click="openActionsPopup(employee)"
          >
            <div class="table-cell employee-col">
              <div class="employee-info">
                <v-avatar size="32" color="primary">
                  <v-img v-if="employee.avatar" :src="employee.avatar" />
                  <span v-else class="text-white text-caption">
                    {{ employee.first_name?.charAt(0)
                    }}{{ employee.last_name?.charAt(0) }}
                  </span>
                </v-avatar>
                <div class="employee-details">
                  <div class="employee-name">
                    {{ employee.first_name }} {{ employee.last_name }}
                  </div>
                  <div class="employee-email">{{ employee.email }}</div>
                </div>
              </div>
            </div>

            <div class="table-cell username-col">
              <v-chip size="small" color="primary" variant="outlined">
                {{ employee.employee_username }}
              </v-chip>
            </div>

            <div class="table-cell status-col">
              <v-chip
                :color="getStatusColor(employee.status)"
                size="small"
                variant="flat"
              >
                {{ employee.status }}
              </v-chip>
            </div>

            <div class="table-cell permissions-col">
              <div class="permissions-list">
                <v-chip
                  v-for="permission in (employee.permissions || []).slice(0, 2)"
                  :key="permission"
                  size="x-small"
                  color="info"
                  variant="outlined"
                  class="permission-chip"
                >
                  {{ getPermissionText(permission) }}
                </v-chip>
                <v-chip
                  v-if="(employee.permissions || []).length > 2"
                  size="x-small"
                  color="grey"
                  variant="outlined"
                  class="permission-chip"
                >
                  +{{ (employee.permissions || []).length - 2 }} more
                </v-chip>
              </div>
            </div>

            <div class="table-cell login-col">
              <div v-if="employee.last_login">
                <div class="login-date">{{ formatDate(employee.last_login) }}</div>
                <div class="login-time">{{ formatTime(employee.last_login) }}</div>
              </div>
              <span v-else class="text-grey">Never</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Popup Dialog -->
      <v-dialog v-model="showActionsDialog" max-width="400">
        <v-card class="simple-popup">
          <v-card-title class="simple-popup-header">
            <div class="text-h6">{{ selectedEmployee?.first_name }} {{ selectedEmployee?.last_name }}</div>
            <div class="text-caption text-medium-emphasis">{{ selectedEmployee?.email }}</div>
          </v-card-title>

          <v-card-text class="simple-popup-content">
            <v-btn
              block
              color="rgb(0, 33, 129)"
              variant="flat"
              class="simple-action-btn mb-3"
              @click="handleEdit"
            >
              <v-icon class="me-2">mdi-pencil</v-icon>
              Edit Employee
            </v-btn>

            <v-btn
              block
              color="rgb(0, 33, 129)"
              variant="flat"
              class="simple-action-btn mb-3"
              @click="handleManagePermissions"
            >
              <v-icon class="me-2">mdi-shield-account</v-icon>
              Manage Permissions
            </v-btn>

            <v-btn
              block
              :color="selectedEmployee?.status === 'active' ? 'orange' : 'green'"
              variant="flat"
              class="simple-action-btn mb-3"
              @click="handleToggleStatus"
            >
              <v-icon class="me-2">
                {{ selectedEmployee?.status === 'active' ? 'mdi-account-off' : 'mdi-account-check' }}
              </v-icon>
              {{ selectedEmployee?.status === 'active' ? 'Deactivate' : 'Activate' }} Employee
            </v-btn>

            <v-btn
              block
              color="red"
              variant="flat"
              class="simple-action-btn mb-4"
              @click="handleResetPassword"
            >
              <v-icon class="me-2">mdi-key-variant</v-icon>
              Reset Password
            </v-btn>

            <v-btn
              block
              variant="outlined"
              @click="closeActionsDialog"
            >
              Close
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Pagination Section (if needed) -->
      <div v-if="employees.length > 0" class="table-footer">
        <div class="pagination-info">
          <span class="text-caption"
            >{{ employees.length }} employee{{
              employees.length !== 1 ? "s" : ""
            }}
            total</span
          >
        </div>
      </div>
    </v-card>
  </div>
</template>

<script src="./EmployeeTable.js"></script>

<style scoped src="./EmployeeTable.css"></style>

