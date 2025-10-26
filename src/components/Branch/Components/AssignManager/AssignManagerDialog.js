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
