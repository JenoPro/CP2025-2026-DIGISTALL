import EmployeeSearch from "./Components/EmployeeSearch/EmployeeSearch.vue";
import EmployeeTable from "./Components/EmployeeTable/EmployeeTable.vue";
import AddEmployee from "./Components/AddEmployee/AddEmployee.vue";
import ManagePermissions from "./Components/ManagePermissions/ManagePermissions.vue";
import {
  sendEmployeeCredentialsEmailWithRetry,
  sendEmployeePasswordResetEmail,
  generateEmployeePassword,
} from "./Components/emailService.js";

export default {
  name: "EmployeeManagement",
  components: {
    EmployeeSearch,
    EmployeeTable,
    AddEmployee,
    ManagePermissions,
  },
  data() {
    return {
      saving: false,
      searchQuery: "",
      statusFilter: null,
      permissionFilter: null,

      // API Configuration
      apiBaseUrl: "http://localhost:3001/api",

      // Dialog states
      employeeDialog: false,
      permissionsDialog: false,
      isEditMode: false,

      // Selected employee and permissions
      selectedEmployee: null,
      selectedPermissions: [],

      // Filter options
      statusOptions: [
        { title: "All Status", value: null },
        { title: "Active", value: "active" },
        { title: "Inactive", value: "inactive" },
      ],

      permissionOptions: [
        { title: "All Permissions", value: null },
        { title: "Dashboard", value: "dashboard" },
        { title: "Payments", value: "payments" },
        { title: "Applicants", value: "applicants" },
        { title: "Complaints", value: "complaints" },
        { title: "Compliances", value: "compliances" },
        { title: "Vendors", value: "vendors" },
        { title: "Stallholders", value: "stallholders" },
        { title: "Collectors", value: "collectors" },
        { title: "Stalls", value: "stalls" },
      ],

      // Available permissions with detailed info
      availablePermissions: [
        {
          value: "dashboard",
          text: "Dashboard",
          icon: "mdi-view-dashboard",
          color: "primary",
          description: "View main dashboard and analytics",
        },
        {
          value: "payments",
          text: "Payments",
          icon: "mdi-credit-card",
          color: "success",
          description: "Manage payment transactions",
        },
        {
          value: "applicants",
          text: "Applicants",
          icon: "mdi-account-plus",
          color: "info",
          description: "Handle stall applications",
        },
        {
          value: "complaints",
          text: "Complaints",
          icon: "mdi-chart-line",
          color: "warning",
          description: "Manage customer complaints",
        },
        {
          value: "compliances",
          text: "Compliances",
          icon: "mdi-clipboard-check",
          color: "purple",
          description: "Handle compliance monitoring",
        },
        {
          value: "vendors",
          text: "Vendors",
          icon: "mdi-account-group",
          color: "teal",
          description: "Manage vendor accounts",
        },
        {
          value: "stallholders",
          text: "Stallholders",
          icon: "mdi-account-multiple",
          color: "indigo",
          description: "Manage stallholder accounts",
        },
        {
          value: "collectors",
          text: "Collectors",
          icon: "mdi-account-cash",
          color: "orange",
          description: "Manage payment collectors",
        },
        {
          value: "stalls",
          text: "Stalls",
          icon: "mdi-store",
          color: "red",
          description: "Manage stall information and operations",
        },
      ],

      // Employees data (loaded from API)
      employees: [],
    };
  },

  computed: {
    totalEmployees() {
      return this.employees.length;
    },

    activeEmployees() {
      return this.employees.filter((emp) => emp.status === "active").length;
    },

    inactiveEmployees() {
      return this.employees.filter((emp) => emp.status === "inactive").length;
    },

    filteredEmployees() {
      let filtered = this.employees;

      if (this.statusFilter) {
        filtered = filtered.filter((emp) => emp.status === this.statusFilter);
      }

      if (this.permissionFilter) {
        filtered = filtered.filter(
          (emp) => emp.permissions && emp.permissions.includes(this.permissionFilter)
        );
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (emp) =>
            emp.first_name?.toLowerCase().includes(query) ||
            emp.last_name?.toLowerCase().includes(query) ||
            emp.email?.toLowerCase().includes(query) ||
            emp.employee_username?.toLowerCase().includes(query)
        );
      }

      return filtered;
    },
  },

  methods: {
    // API Methods
    async fetchEmployees() {
      try {
        // Get authentication token
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication required. Please login again.");
        }

        console.log("🔑 Fetching employees with authentication...");
        const response = await fetch(`${this.apiBaseUrl}/employees`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("📡 Employees API response status:", response.status);

        if (!response.ok) {
          if (response.status === 401) {
            // Clear session and redirect to login
            sessionStorage.clear();
            this.$router.push("/login");
            throw new Error("Session expired. Please login again.");
          } else if (response.status === 403) {
            throw new Error(
              "Access denied. You do not have permission to view employees."
            );
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          this.employees = data.data || data.employees || [];
          console.log(`✅ Loaded ${this.employees.length} employees`);

          // Provide user feedback based on role
          const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
          if (this.employees.length === 0) {
            if (currentUser.userType === "branch-manager") {
              console.log(
                "ℹ️  No employees found - Branch manager has not created any employees yet"
              );
            } else {
              console.log("ℹ️  No employees found");
            }
          } else {
            if (currentUser.userType === "branch-manager") {
              console.log(
                `ℹ️  Showing ${this.employees.length} employees created by this branch manager`
              );
            }
          }
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        this.$emit(
          "show-snackbar",
          `Failed to load employees: ${error.message}`,
          "error"
        );
      }
    },

    // Employee Dialog Methods
    openAddEmployeeDialog() {
      this.isEditMode = false;
      this.selectedEmployee = null;
      this.selectedPermissions = [];
      this.employeeDialog = true;
    },

    editEmployee(employee) {
      this.isEditMode = true;
      this.selectedEmployee = { ...employee };
      this.selectedPermissions = [...(employee.permissions || [])];
      this.employeeDialog = true;
    },

    closeEmployeeDialog() {
      this.employeeDialog = false;
      this.isEditMode = false;
      this.selectedEmployee = null;
      this.selectedPermissions = [];
    },

    async saveEmployee(employeeData) {
      this.saving = true;

      try {
        // Debug session storage data
        this.debugSessionStorage();

        const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");

        // Debug: Log all available session storage data
        console.log("🔍 Debug - Session Storage Data:");
        console.log("  - currentUser:", currentUser);
        console.log(
          "  - branchManagerId from storage:",
          sessionStorage.getItem("branchManagerId")
        );
        console.log("  - branchId from storage:", sessionStorage.getItem("branchId"));
        console.log("  - user from storage:", sessionStorage.getItem("user"));
        console.log(
          "  - branchManagerData from storage:",
          sessionStorage.getItem("branchManagerData")
        );

        // Get the branch manager ID and branch ID from various possible sources
        const branchManagerId =
          currentUser.branchManagerId ||
          sessionStorage.getItem("branchManagerId") ||
          currentUser.id;

        const branchId =
          currentUser.branchId ||
          currentUser.branch_id ||
          sessionStorage.getItem("branchId") ||
          employeeData.branchId;

        console.log("🔍 Debug - Extracted IDs:");
        console.log("  - branchManagerId:", branchManagerId);
        console.log("  - branchId:", branchId);
        console.log("  - employeeData.branchId:", employeeData.branchId);

        // More flexible validation - allow branchId to be determined later if needed
        if (!branchManagerId) {
          throw new Error("Unable to identify the branch manager. Please login again.");
        }

        // For branch ID, try to get it from branch manager data if not found elsewhere
        let finalBranchId = branchId;
        if (!finalBranchId) {
          const branchManagerData = JSON.parse(
            sessionStorage.getItem("branchManagerData") || "{}"
          );
          finalBranchId = branchManagerData.branchId;
          console.log("🔍 Debug - Trying branchManagerData.branchId:", finalBranchId);
        }

        // If still no branch ID, set a default but warn
        if (!finalBranchId) {
          console.warn("⚠️ Warning: No branch ID found, using default value 1");
          finalBranchId = 1;
        }

        console.log("🏪 Creating employee with branch manager ID:", branchManagerId);
        console.log("🏢 Creating employee for branch ID:", finalBranchId);

        const payload = {
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          email: employeeData.email,
          phoneNumber: employeeData.phoneNumber,
          branchId: parseInt(finalBranchId),
          permissions: this.selectedPermissions,
          createdByManager: parseInt(branchManagerId),
        };

        const url = this.isEditMode
          ? `${this.apiBaseUrl}/employees/${this.selectedEmployee.employee_id}`
          : `${this.apiBaseUrl}/employees`;

        const method = this.isEditMode ? "PUT" : "POST";

        // Get authentication token
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication required. Please login again.");
        }

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.success) {
          if (!this.isEditMode) {
            // Use backend-generated credentials
            const backendCredentials = data.data.credentials;
            console.log(
              "📧 Sending employee credentials email with backend credentials..."
            );
            const emailResult = await sendEmployeeCredentialsEmailWithRetry(
              employeeData.email,
              `${employeeData.firstName} ${employeeData.lastName}`,
              backendCredentials.username,
              backendCredentials.password
            );

            if (emailResult.success) {
              this.$emit(
                "show-snackbar",
                `Employee created successfully! Username: ${backendCredentials.username}, Password: ${backendCredentials.password}. Welcome email sent to ${employeeData.email}`,
                "success",
                10000
              );
            } else {
              this.$emit(
                "show-snackbar",
                `Employee created! Username: ${backendCredentials.username}, Password: ${backendCredentials.password}. Warning: Email failed to send - ${emailResult.message}`,
                "warning",
                12000
              );
            }
          } else {
            this.$emit(
              "show-snackbar",
              this.isEditMode
                ? "Employee updated successfully!"
                : "Employee created successfully!",
              "success"
            );
          }

          this.closeEmployeeDialog();
          await this.fetchEmployees();
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Error saving employee:", error);
        this.$emit("show-snackbar", `Failed to save employee: ${error.message}`, "error");
      } finally {
        this.saving = false;
      }
    },

    // Permission Management
    managePermissions(employee) {
      this.selectedEmployee = employee;
      this.selectedPermissions = [...(employee.permissions || [])];
      this.permissionsDialog = true;
    },

    closePermissionsDialog() {
      this.permissionsDialog = false;
      this.selectedEmployee = null;
      this.selectedPermissions = [];
    },

    togglePermission(permission) {
      const index = this.selectedPermissions.indexOf(permission);
      if (index > -1) {
        this.selectedPermissions.splice(index, 1);
      } else {
        this.selectedPermissions.push(permission);
      }
    },

    async savePermissions() {
      if (!this.selectedEmployee) return;

      this.saving = true;

      try {
        const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");

        // Get the branch manager ID from various possible sources
        const branchManagerId =
          currentUser.branchManagerId ||
          sessionStorage.getItem("branchManagerId") ||
          currentUser.id;

        if (!branchManagerId) {
          throw new Error("Unable to identify the branch manager. Please login again.");
        }

        // Get authentication token
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication required. Please login again.");
        }

        const response = await fetch(
          `${this.apiBaseUrl}/employees/${this.selectedEmployee.employee_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              permissions: this.selectedPermissions,
              updatedBy: parseInt(branchManagerId),
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          this.$emit("show-snackbar", "Permissions updated successfully!", "success");
          this.closePermissionsDialog();
          await this.fetchEmployees();
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Error updating permissions:", error);
        this.$emit(
          "show-snackbar",
          `Failed to update permissions: ${error.message}`,
          "error"
        );
      } finally {
        this.saving = false;
      }
    },

    // Employee Actions
    async toggleEmployeeStatus(employee) {
      const newStatus = employee.status === "active" ? "inactive" : "active";

      try {
        const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");

        // Get the branch manager ID from various possible sources
        const branchManagerId =
          currentUser.branchManagerId ||
          sessionStorage.getItem("branchManagerId") ||
          currentUser.id;

        if (!branchManagerId) {
          throw new Error("Unable to identify the branch manager. Please login again.");
        }

        // Get authentication token
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication required. Please login again.");
        }

        const response = await fetch(
          `${this.apiBaseUrl}/employees/${employee.employee_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              status: newStatus,
              updatedBy: parseInt(branchManagerId),
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          const action = newStatus === "active" ? "activated" : "deactivated";
          this.$emit("show-snackbar", `Employee ${action} successfully!`, "success");
          await this.fetchEmployees();
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Error updating employee status:", error);
        this.$emit("show-snackbar", `Failed to update status: ${error.message}`, "error");
      }
    },

    async resetEmployeePassword(employee) {
      if (
        !confirm(
          `Reset password for ${employee.first_name} ${employee.last_name}? A new password will be generated and sent to their email.`
        )
      ) {
        return;
      }

      try {
        const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");

        // Get the branch manager ID from various possible sources
        const branchManagerId =
          currentUser.branchManagerId ||
          sessionStorage.getItem("branchManagerId") ||
          currentUser.id;

        if (!branchManagerId) {
          throw new Error("Unable to identify the branch manager. Please login again.");
        }

        // Get authentication token
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication required. Please login again.");
        }

        // Generate new password
        const newPassword = generateEmployeePassword();

        const response = await fetch(
          `${this.apiBaseUrl}/employees/${employee.employee_id}/reset-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              resetBy: parseInt(branchManagerId),
              newPassword: newPassword,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          // Send password reset email
          console.log("📧 Sending password reset email...");
          const emailResult = await sendEmployeePasswordResetEmail(
            employee.email,
            `${employee.first_name} ${employee.last_name}`,
            newPassword
          );

          if (emailResult.success) {
            this.$emit(
              "show-snackbar",
              `Password reset successfully! New password: ${newPassword}. Reset notification sent to ${employee.email}`,
              "success",
              8000
            );
          } else {
            this.$emit(
              "show-snackbar",
              `Password reset! New password: ${newPassword}. Warning: Email failed to send - ${emailResult.message}`,
              "warning",
              10000
            );
          }
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        this.$emit(
          "show-snackbar",
          `Failed to reset password: ${error.message}`,
          "error"
        );
      }
    },

    // Utility Methods
    debugSessionStorage() {
      console.log("🔍 === SESSION STORAGE DEBUG ===");
      console.log("All session storage keys:", Object.keys(sessionStorage));
      console.log(
        "authToken:",
        sessionStorage.getItem("authToken") ? "exists" : "missing"
      );
      console.log("user:", sessionStorage.getItem("user"));
      console.log("currentUser:", sessionStorage.getItem("currentUser"));
      console.log("userType:", sessionStorage.getItem("userType"));
      console.log("branchManagerId:", sessionStorage.getItem("branchManagerId"));
      console.log("branchId:", sessionStorage.getItem("branchId"));
      console.log("branchName:", sessionStorage.getItem("branchName"));
      console.log("branchManagerData:", sessionStorage.getItem("branchManagerData"));
      console.log("=== END DEBUG ===");
    },

    resetFilters() {
      this.searchQuery = "";
      this.statusFilter = null;
      this.permissionFilter = null;
    },
  },

  mounted() {
    // Load employees when component is mounted
    this.fetchEmployees();
  },
};
