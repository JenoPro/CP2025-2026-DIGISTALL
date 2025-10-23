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
        <div v-if="loading" class="loading-container">
          <v-progress-circular indeterminate size="48" color="primary"></v-progress-circular>
          <p class="loading-text">Loading employees...</p>
        </div>
        
        <div v-else-if="employees.length === 0" class="no-data-container">
          <v-icon size="64" color="grey-lighten-2">mdi-account-off</v-icon>
          <p class="no-data-text">No employees found</p>
        </div>
        
        <div v-else>
          <div v-for="employee in employees" :key="employee.employee_id" class="table-row">
            <div class="table-cell employee-col">
              <div class="employee-info">
                <v-avatar size="32" color="primary">
                  <v-img v-if="employee.avatar" :src="employee.avatar" />
                  <span v-else class="text-white text-caption">
                    {{ employee.first_name?.charAt(0) }}{{ employee.last_name?.charAt(0) }}
                  </span>
                </v-avatar>
                <div class="employee-details">
                  <div class="employee-name">{{ employee.first_name }} {{ employee.last_name }}</div>
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
                
                <v-tooltip :text="employee.status === 'active' ? 'Deactivate' : 'Activate'">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      :color="employee.status === 'active' ? 'warning' : 'success'"
                      variant="text"
                      @click="$emit('toggle-status', employee)"
                    >
                      <v-icon>{{ employee.status === 'active' ? 'mdi-account-off' : 'mdi-account-check' }}</v-icon>
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
          <span class="text-caption">{{ employees.length }} employee{{ employees.length !== 1 ? 's' : '' }} total</span>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'EmployeeTable',
  props: {
    employees: Array,
    loading: Boolean
  },
  emits: ['edit-employee', 'manage-permissions', 'toggle-status', 'reset-password'],

  methods: {
    getStatusColor(status) {
      return status === 'active' ? 'success' : 'warning'
    },
    
    getPermissionText(permission) {
      const permissionLabels = {
        dashboard: 'Dashboard',
        payments: 'Payments',
        applicants: 'Applicants',
        complaints: 'Complaints',
        compliances: 'Compliances',
        vendors: 'Vendors',
        stallholders: 'Stallholders',
        collectors: 'Collectors',
        stalls: 'Stalls'
      }
      return permissionLabels[permission] || permission
    },
    
    formatDate(date) {
      if (!date) return 'Never'
      return new Date(date).toLocaleDateString()
    },
    
    formatTime(date) {
      if (!date) return 'Never'
      return new Date(date).toLocaleTimeString()
    }
  }
}
</script>

<style scoped>
.employee-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  margin: 0;
}

.table-card {
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  margin: 0;
}

.table-header {
  background: #1976d2;
  color: white;
}

.header-row,
.table-row {
  display: grid;
  grid-template-columns: 3fr 1.5fr 1fr 2fr 1.5fr 1.5fr;
  min-height: 60px;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  width: 100%;
}

.table-row {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f5f5f5;
}

.table-row:last-child {
  border-bottom: none;
}

.header-cell,
.table-cell {
  padding: 16px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  word-wrap: break-word;
}

.header-cell {
  font-weight: 600;
  font-size: 14px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.table-cell {
  font-size: 15px;
  color: #2c3e50;
  word-wrap: break-word;
  overflow: hidden;
  text-align: center;
  vertical-align: middle;
}

.employee-col {
  justify-content: flex-start;
}

.username-col,
.status-col,
.login-col,
.actions-col {
  justify-content: center;
}

.permissions-col {
  justify-content: flex-start;
}

.employee-info {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.employee-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
}

.employee-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 15px;
  line-height: 1.3;
}

.employee-email {
  font-size: 13px;
  color: #6c757d;
  line-height: 1.2;
}

.permissions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: flex-start;
  width: 100%;
}

.permission-chip {
  margin: 2px;
  font-size: 11px !important;
}

.action-buttons {
  display: flex;
  gap: 2px;
  justify-content: center;
  flex-wrap: wrap;
}

.login-date {
  font-size: 13px;
  color: #2c3e50;
  font-weight: 500;
}

.login-time {
  font-size: 12px;
  color: #6c757d;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  gap: 1rem;
  grid-column: 1 / -1;
}

.loading-text {
  color: #6c757d;
  margin: 0;
}

.no-data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  gap: 1rem;
  grid-column: 1 / -1;
}

.no-data-text {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
}

.table-footer {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info {
  color: #6c757d;
  font-size: 12px;
}

/* Responsive Design */
@media (min-width: 1400px) {
  .header-row,
  .table-row {
    grid-template-columns: 4fr 2fr 1.2fr 2.5fr 2fr 2fr;
    gap: 12px;
    padding: 0 24px;
  }
}

@media (max-width: 1200px) {
  .header-row,
  .table-row {
    grid-template-columns: 2.5fr 1.3fr 0.9fr 1.8fr 1.3fr 1.4fr;
    gap: 6px;
    padding: 0 12px;
  }
  
  .employee-name {
    font-size: 13px;
  }
  
  .employee-email {
    font-size: 11px;
  }
}

@media (max-width: 992px) {
  .header-row,
  .table-row {
    grid-template-columns: 2fr 1.1fr 0.8fr 1.5fr 1.1fr 1.2fr;
    gap: 4px;
    padding: 0 8px;
  }
  
  .header-cell,
  .table-cell {
    padding: 8px 4px;
    font-size: 12px;
  }
  
  .permission-chip {
    font-size: 9px !important;
  }
}

@media (max-width: 768px) {
  .employee-table {
    overflow-x: auto;
  }
  
  .header-row,
  .table-row {
    min-width: 900px;
    grid-template-columns: 250px 140px 100px 180px 120px 140px;
    gap: 4px;
    padding: 0 8px;
  }
  
  .header-cell,
  .table-cell {
    padding: 6px 3px;
    font-size: 11px;
  }
  
  .employee-info {
    gap: 6px;
  }
  
  .employee-name {
    font-size: 12px;
  }
  
  .employee-email {
    font-size: 10px;
  }
}
</style>