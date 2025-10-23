<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="700px"
  >
    <v-card>
      <v-card-title class="dialog-header">
        <v-icon class="dialog-icon">mdi-shield-account</v-icon>
        <span>Manage Permissions</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text v-if="employee">
        <div class="employee-info-header">
          <v-avatar size="48" color="primary">
            <span class="text-white">
              {{ employee.first_name?.charAt(0) }}{{ employee.last_name?.charAt(0) }}
            </span>
          </v-avatar>
          <div class="employee-details">
            <div class="employee-name">
              {{ employee.first_name }} {{ employee.last_name }}
            </div>
            <div class="employee-email">{{ employee.email }}</div>
          </div>
        </div>

        <h3 class="section-title">
          <v-icon class="section-icon">mdi-shield-check</v-icon>
          Available Permissions
        </h3>

        <div class="permissions-grid">
          <div
            v-for="permission in availablePermissions"
            :key="permission.value"
            class="permission-item"
            :class="{ active: isPermissionSelected(permission.value) }"
            @click="$emit('toggle-permission', permission.value)"
          >
            <v-checkbox
              :model-value="isPermissionSelected(permission.value)"
              hide-details
              density="compact"
              :color="permission.color"
            ></v-checkbox>

            <div class="permission-info">
              <v-icon :color="permission.color" class="permission-icon">
                {{ permission.icon }}
              </v-icon>
              <div class="permission-text">
                <div class="permission-title">{{ permission.text }}</div>
                <div class="permission-description">{{ permission.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="dialog-actions">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="$emit('close')"> Cancel </v-btn>
        <v-btn color="primary" variant="flat" :loading="saving" @click="$emit('save')">
          <v-icon left>mdi-content-save</v-icon>
          Save Permissions
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ManagePermissions",
  props: {
    modelValue: Boolean,
    employee: Object,
    selectedPermissions: Array,
    availablePermissions: Array,
    saving: Boolean,
  },
  emits: ["update:modelValue", "save", "close", "toggle-permission"],
  methods: {
    isPermissionSelected(permission) {
      return this.selectedPermissions && this.selectedPermissions.includes(permission);
    },
  },
};
</script>

<style scoped>
.dialog-header {
  background: #1976d2;
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dialog-icon {
  font-size: 1.5rem;
}

.employee-info-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.employee-details {
  flex: 1;
}

.employee-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: #2c3e50;
}

.employee-email {
  font-size: 0.9rem;
  color: #6c757d;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.1rem;
}

.section-icon {
  color: #667eea;
}

.permissions-grid {
  display: grid;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.permission-item:hover {
  border-color: #667eea;
  background-color: #f8f9ff;
}

.permission-item.active {
  border-color: #667eea;
  background-color: #f0f2ff;
}

.permission-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.permission-icon {
  font-size: 1.5rem;
}

.permission-text {
  flex: 1;
}

.permission-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.permission-description {
  font-size: 0.875rem;
  color: #6c757d;
}

.dialog-actions {
  padding: 1rem 2rem 2rem;
}

@media (max-width: 600px) {
  .employee-info-header {
    flex-direction: column;
    text-align: center;
  }

  .permissions-grid {
    max-height: 300px;
  }

  .permission-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
