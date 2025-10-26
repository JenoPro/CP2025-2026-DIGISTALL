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
          <div class="header-cell actions-col">Actions</div>
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
            class="table-row"
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

            <div class="table-cell actions-col">
              <div class="action-buttons">
                <v-tooltip text="Edit Employee">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      color="primary"
                      variant="text"
                      @click="$emit('edit-employee', employee)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Manage Permissions">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      color="info"
                      variant="text"
                      @click="$emit('manage-permissions', employee)"
                    >
                      <v-icon>mdi-shield-account</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip
                  :text="employee.status === 'active' ? 'Deactivate' : 'Activate'"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      :color="employee.status === 'active' ? 'warning' : 'success'"
                      variant="text"
                      @click="$emit('toggle-status', employee)"
                    >
                      <v-icon>{{
                        employee.status === "active"
                          ? "mdi-account-off"
                          : "mdi-account-check"
                      }}</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Reset Password">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      color="error"
                      variant="text"
                      @click="$emit('reset-password', employee)"
                    >
                      <v-icon>mdi-key-variant</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

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

