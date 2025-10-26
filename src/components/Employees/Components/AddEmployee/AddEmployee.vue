<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600px"
    persistent
  >
    <v-card class="employee-dialog">
      <v-card-title class="dialog-header">
        <v-icon class="dialog-icon">mdi-account-plus</v-icon>
        <span>{{ isEditMode ? "Edit Employee" : "Add New Employee" }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="dialog-content">
        <v-form ref="form" v-model="formValid">
          <div class="form-row">
            <v-text-field
              v-model="employeeForm.firstName"
              label="First Name"
              :rules="[rules.required]"
              variant="outlined"
              prepend-inner-icon="mdi-account"
              required
            ></v-text-field>

            <v-text-field
              v-model="employeeForm.lastName"
              label="Last Name"
              :rules="[rules.required]"
              variant="outlined"
              prepend-inner-icon="mdi-account"
              required
            ></v-text-field>
          </div>

          <v-text-field
            v-model="employeeForm.email"
            label="Email Address"
            :rules="[rules.required, rules.email]"
            variant="outlined"
            prepend-inner-icon="mdi-email"
            type="email"
            required
          ></v-text-field>

          <v-text-field
            v-model="employeeForm.phoneNumber"
            label="Phone Number"
            :rules="[rules.required, rules.phone]"
            variant="outlined"
            prepend-inner-icon="mdi-phone"
            placeholder="09XXXXXXXXX"
            required
          ></v-text-field>

          <!-- Permissions Selection -->
          <div class="permissions-section">
            <h3 class="section-title">
              <v-icon class="section-icon">mdi-shield-account</v-icon>
              System Permissions
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
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="dialog-actions">
        <v-spacer></v-spacer>

        <!-- Test Email Button (only in development) -->
        <v-btn
          v-if="!isEditMode"
          color="info"
          variant="outlined"
          size="small"
          @click="testEmail"
          :disabled="!employeeForm.email || saving"
        >
          <v-icon left>mdi-email-send</v-icon>
          Test Email
        </v-btn>

        <v-btn color="grey" variant="text" @click="$emit('close')"> Cancel </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="saving"
          :disabled="!formValid"
          @click="handleSave"
        >
          <v-icon left>mdi-content-save</v-icon>
          {{ isEditMode ? "Update Employee" : "Create Employee" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script src="./AddEmployee.js"></script>

<style scoped src="./AddEmployee.css"></style>

