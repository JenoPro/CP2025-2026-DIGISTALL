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

<script>
import {
  sendEmployeeCredentialsEmailWithRetry,
  generateEmployeeUsername,
  generateEmployeePassword,
} from "../emailService.js";

export default {
  name: "AddEmployee",
  props: {
    modelValue: Boolean,
    employee: Object,
    isEditMode: Boolean,
    saving: Boolean,
    availablePermissions: Array,
    selectedPermissions: Array,
  },
  emits: ["update:modelValue", "save", "close", "toggle-permission"],
  data() {
    return {
      formValid: false,
      employeeForm: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      },
      rules: {
        required: (value) => !!value || "This field is required",
        email: (value) => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return pattern.test(value) || "Invalid email address";
        },
        phone: (value) => {
          const pattern = /^09\d{9}$/;
          return pattern.test(value) || "Phone must be 11 digits starting with 09";
        },
      },
    };
  },
  watch: {
    employee: {
      handler(newEmployee) {
        if (newEmployee && this.isEditMode) {
          this.employeeForm = {
            firstName: newEmployee.first_name || "",
            lastName: newEmployee.last_name || "",
            email: newEmployee.email || "",
            phoneNumber: newEmployee.phone_number || "",
          };
        } else if (!this.isEditMode) {
          this.employeeForm = {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
          };
        }
      },
      immediate: true,
    },
  },
  methods: {
    isPermissionSelected(permission) {
      return this.selectedPermissions && this.selectedPermissions.includes(permission);
    },

    handleSave() {
      if (this.formValid) {
        this.$emit("save", this.employeeForm);
      }
    },

    async testEmail() {
      if (!this.employeeForm.email || !this.employeeForm.firstName) {
        alert("Please fill in at least the first name and email fields before testing.");
        return;
      }

      try {
        console.log("📧 Testing email functionality...");

        // Generate test credentials
        const testUsername = generateEmployeeUsername();
        const testPassword = generateEmployeePassword();

        const employeeName = `${this.employeeForm.firstName} ${
          this.employeeForm.lastName || "Test"
        }`;

        // Send test email
        const result = await sendEmployeeCredentialsEmailWithRetry(
          this.employeeForm.email,
          employeeName,
          testUsername,
          testPassword
        );

        if (result.success) {
          alert(
            `✅ Test email sent successfully!\n\nTest credentials:\nUsername: ${testUsername}\nPassword: ${testPassword}\n\nEmail sent to: ${this.employeeForm.email}`
          );
        } else {
          alert(`❌ Test email failed: ${result.message}`);
        }
      } catch (error) {
        console.error("Test email error:", error);
        alert(`❌ Test email error: ${error.message}`);
      }
    },
  },
};
</script>

<style scoped>
.employee-dialog {
  border-radius: 16px;
}

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

.dialog-content {
  padding: 2rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.permissions-section {
  margin: 2rem 0;
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
  max-height: 300px;
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

.credentials-info {
  margin-top: 2rem;
}

.alert-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.alert-text {
  font-size: 0.875rem;
  opacity: 0.9;
}

.credentials-list {
  margin: 0.75rem 0;
  padding-left: 1rem;
}

.credentials-list li {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.credentials-note {
  margin-top: 0.75rem;
  padding: 0.5rem;
  background: rgba(25, 118, 210, 0.1);
  border-radius: 4px;
  font-size: 0.875rem;
}

.dialog-actions {
  padding: 1rem 2rem 2rem;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
  }

  .permissions-grid {
    max-height: 200px;
  }

  .permission-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
