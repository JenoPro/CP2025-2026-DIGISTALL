export default {
  name: "EmployeeTable",
  props: {
    employees: Array,
  },
  emits: ["edit-employee", "manage-permissions", "toggle-status", "reset-password"],

  methods: {
    getStatusColor(status) {
      return status === "active" ? "success" : "warning";
    },

    getPermissionText(permission) {
      const permissionLabels = {
        dashboard: "Dashboard",
        payments: "Payments",
        applicants: "Applicants",
        complaints: "Complaints",
        compliances: "Compliances",
        vendors: "Vendors",
        stallholders: "Stallholders",
        collectors: "Collectors",
        stalls: "Stalls",
      };
      return permissionLabels[permission] || permission;
    },

    formatDate(date) {
      if (!date) return "Never";
      return new Date(date).toLocaleDateString();
    },

    formatTime(date) {
      if (!date) return "Never";
      return new Date(date).toLocaleTimeString();
    },
  },
};
