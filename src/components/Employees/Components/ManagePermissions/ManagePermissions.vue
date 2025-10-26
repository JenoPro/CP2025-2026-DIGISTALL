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

<script src="./ManagePermissions.js"></script>
<style scoped src="./ManagePermissions.css"></style>
