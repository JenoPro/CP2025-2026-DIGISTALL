export default {
  name: 'EmployeeTable',
  props: {
    employees: Array,
  },
  emits: ['edit-employee', 'manage-permissions', 'toggle-status', 'reset-password'],

  data() {
    return {
      showActionsDialog: false,
      selectedEmployee: null,
    }
  },

  methods: {
    openActionsPopup(employee) {
      this.selectedEmployee = employee
      this.showActionsDialog = true
    },

    closeActionsDialog() {
      this.showActionsDialog = false
      this.selectedEmployee = null
    },

    handleEdit() {
      this.$emit('edit-employee', this.selectedEmployee)
      this.closeActionsDialog()
    },

    handleManagePermissions() {
      this.$emit('manage-permissions', this.selectedEmployee)
      this.closeActionsDialog()
    },

    handleToggleStatus() {
      this.$emit('toggle-status', this.selectedEmployee)
      this.closeActionsDialog()
    },

    handleResetPassword() {
      this.$emit('reset-password', this.selectedEmployee)
      this.closeActionsDialog()
    },

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
        stalls: 'Stalls',
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
    },
  },
}
