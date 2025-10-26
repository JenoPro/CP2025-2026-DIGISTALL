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
