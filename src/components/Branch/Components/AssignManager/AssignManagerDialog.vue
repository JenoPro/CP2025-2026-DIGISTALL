<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5 primary white--text">
        <v-icon left class="mr-2">mdi-account-plus</v-icon>
        {{ branch?.manager_name ? "Change" : "Assign" }} Branch Manager
      </v-card-title>

      <v-form ref="form" v-model="valid">
        <v-card-text class="pt-4">
          <v-container>
            <!-- Error Alert -->
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mb-4"
              closable
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <!-- Success Alert -->
            <v-alert
              v-if="successMessage"
              type="success"
              variant="tonal"
              class="mb-4"
              closable
              @click:close="successMessage = ''"
            >
              {{ successMessage }}
            </v-alert>

            <!-- Branch Info -->
            <v-row v-if="branch">
              <v-col cols="12">
                <v-card variant="outlined" class="mb-4">
                  <v-card-text>
                    <h4 class="text-h6 mb-2">{{ branch.branch_name }}</h4>
                    <p class="text-body-2 text--secondary mb-1">
                      <v-icon small class="mr-1">mdi-map-marker</v-icon>
                      {{ branch.area }} - {{ branch.location }}
                    </p>
                    <p v-if="branch.manager_name" class="text-body-2 text--secondary">
                      <v-icon small class="mr-1">mdi-account-tie</v-icon>
                      Current Manager: {{ branch.manager_name }}
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Manager Form -->
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.first_name"
                  label="First Name *"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                  placeholder="Enter first name"
                  :disabled="loading"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.last_name"
                  label="Last Name *"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                  placeholder="Enter last name"
                  :disabled="loading"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="formData.manager_username"
                  label="Username *"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-account-circle"
                  placeholder="Enter username"
                  :disabled="loading"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="formData.manager_password"
                  label="Password *"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="[rules.required, rules.minLength]"
                  variant="outlined"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  placeholder="Enter password (min 6 characters)"
                  :disabled="loading"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.email"
                  label="Email Address"
                  :rules="[rules.email]"
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                  placeholder="manager@example.com"
                  :disabled="loading"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.contact_number"
                  label="Contact Number"
                  variant="outlined"
                  prepend-inner-icon="mdi-phone"
                  placeholder="+63 XXX XXX XXXX"
                  :disabled="loading"
                />
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="formData.status"
                  label="Status *"
                  :items="statusOptions"
                  :rules="[rules.required]"
                  variant="outlined"
                  prepend-inner-icon="mdi-check-circle"
                  :disabled="loading"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn color="grey" variant="outlined" @click="closeDialog" :disabled="loading">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="assignManager"
            :loading="loading"
            :disabled="!valid || loading"
          >
            {{ branch?.manager_name ? "Update" : "Assign" }} Manager
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  name: "AssignManagerDialog",
  emits: ["update:modelValue", "manager-assigned"],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    branch: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      valid: false,
      loading: false,
      showPassword: false,
      errorMessage: "",
      successMessage: "",
      formData: {
        first_name: "",
        last_name: "",
        manager_username: "",
        manager_password: "",
        email: "",
        contact_number: "",
        status: "Active",
      },
      statusOptions: [
        { title: "Active", value: "Active" },
        { title: "Inactive", value: "Inactive" },
      ],
      rules: {
        required: (value) => !!value || "This field is required",
        minLength: (value) =>
          !value || value.length >= 6 || "Password must be at least 6 characters",
        email: (value) => {
          if (!value) return true;
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return pattern.test(value) || "Enter a valid email address";
        },
      },
    };
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.resetForm();
      }
    },
  },
  methods: {
    resetForm() {
      this.formData = {
        first_name: "",
        last_name: "",
        manager_username: "",
        manager_password: "",
        email: "",
        contact_number: "",
        status: "Active",
      };
      this.errorMessage = "";
      this.successMessage = "";
      this.showPassword = false;

      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },

    closeDialog() {
      this.dialog = false;
    },

    async assignManager() {
      console.log("🚀 Starting manager assignment process...");

      // Validate form
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        console.log("❌ Form validation failed");
        this.errorMessage = "Please fill in all required fields correctly.";
        return;
      }

      // Clear previous messages
      this.errorMessage = "";
      this.successMessage = "";
      this.loading = true;

      try {
        console.log("📤 Sending request with payload:", {
          ...this.formData,
          branch_id: this.branch.branch_id,
          manager_password: "[HIDDEN]",
        });

        const payload = {
          ...this.formData,
          branch_id: this.branch.branch_id,
        };

        const authToken = sessionStorage.getItem("authToken");
        if (!authToken) {
          throw new Error("No authentication token found. Please log in again.");
        }

        const response = await axios.post(
          "http://localhost:3001/api/branches/branch-managers",
          payload,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            timeout: 10000, // 10 second timeout
          }
        );

        console.log("✅ Server response:", response.data);

        if (response.data && response.data.success) {
          // Update branch with manager info
          const updatedBranch = {
            ...this.branch,
            manager_name: `${this.formData.first_name} ${this.formData.last_name}`,
            manager_assigned: true,
          };

          this.successMessage = response.data.message || "Manager assigned successfully!";

          // Emit success event
          this.$emit("manager-assigned", updatedBranch);

          // Close dialog after a brief delay to show success message
          setTimeout(() => {
            this.closeDialog();
          }, 1500);
        } else {
          throw new Error(response.data?.message || "Unexpected response format");
        }
      } catch (error) {
        console.error("❌ Error assigning manager:", error);

        let errorMsg = "Failed to assign manager. ";

        if (error.response) {
          // Server responded with error status
          console.error("Server error response:", error.response.data);
          errorMsg +=
            error.response.data?.message || `Server error (${error.response.status})`;
        } else if (error.request) {
          // Request was made but no response received
          console.error("Network error:", error.request);
          errorMsg += "Network error. Please check your connection.";
        } else if (error.code === "ECONNABORTED") {
          // Request timeout
          errorMsg += "Request timeout. Please try again.";
        } else {
          // Other errors
          errorMsg += error.message;
        }

        this.errorMessage = errorMsg;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.v-card-title {
  background: linear-gradient(45deg, #1976d2, #1565c0);
}

.white--text {
  color: white !important;
}

.text--secondary {
  color: rgba(0, 0, 0, 0.6) !important;
}
</style>
