export default {
  name: 'VendorApplicantsTable',
  props: {
    applicants: {
      type: Array,
      default: () => [],
    },
    applicantType: {
      type: String,
      default: 'Vendor Applicants',
    },
  },
  emits: ['accept', 'decline', 'recheck', 'refresh'],
  data() {
    return {
      showConfirmDialog: false,
      showInfoDialog: false,
      confirmAction: '',
      selectedApplicant: null,
      activeTab: 'personal',
    }
  },
  methods: {
    acceptApplicant(applicant) {
      this.selectedApplicant = applicant
      this.confirmAction = 'accept'
      this.showConfirmDialog = true
    },
    declineApplicant(applicant) {
      this.selectedApplicant = applicant
      this.confirmAction = 'decline'
      this.showConfirmDialog = true
    },
    viewMoreInfo(applicant) {
      this.selectedApplicant = applicant
      this.activeTab = 'personal'
      this.showInfoDialog = true
    },
    confirmActionHandler() {
      if (this.confirmAction === 'accept') {
        this.$emit('accept', this.selectedApplicant)
      } else {
        this.$emit('decline', this.selectedApplicant)
      }
      this.showConfirmDialog = false
      this.selectedApplicant = null
      this.confirmAction = ''
    },
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
    formatCurrency(amount) {
      if (!amount) return '0.00'
      return new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    },
    getStallTypeColor(priceType) {
      switch (priceType) {
        case 'Fixed Price':
          return 'primary'
        case 'Raffle':
          return 'primary'
        case 'Auction':
          return 'primary'
        default:
          return 'primary'
      }
    },
    getApplicationStatusColor(status) {
      switch (status) {
        case 'Approved':
          return 'success'
        case 'Pending':
          return 'warning'
        case 'Under Review':
          return 'info'
        case 'Rejected':
          return 'error'
        case 'Cancelled':
          return 'gray'
        default:
          return 'gray'
      }
    },

    formatStatusDate(date) {
      if (!date) return ''
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }
      return new Date(date).toLocaleDateString('en-US', options)
    },

    getStatusIcon(status) {
      switch (status) {
        case 'Approved':
          return 'mdi-check-circle'
        case 'Rejected':
          return 'mdi-close-circle'
        case 'Under Review':
          return 'mdi-clock-alert-outline'
        case 'Cancelled':
          return 'mdi-cancel'
        case 'Pending':
        default:
          return 'mdi-clock-outline'
      }
    },

    getStatusColor(status) {
      switch (status) {
        case 'Approved':
          return 'success'
        case 'Rejected':
          return 'error'
        case 'Under Review':
          return 'info'
        case 'Cancelled':
          return 'warning'
        case 'Pending':
        default:
          return 'warning'
      }
    },

    getStatusText(status) {
      switch (status) {
        case 'Approved':
          return 'APPROVED'
        case 'Rejected':
          return 'REJECTED'
        case 'Under Review':
          return 'UNDER REVIEW'
        case 'Cancelled':
          return 'CANCELLED'
        case 'Pending':
        default:
          return 'PENDING'
      }
    },

    // Check if application status is processed (not pending)
    isProcessedStatus(status) {
      const processedStatuses = ['Approved', 'Rejected', 'Under Review', 'Cancelled']
      return processedStatuses.includes(status)
    },

    // Handle status badge click for re-check or approve
    handleStatusClick(applicant) {
      if (applicant.application_status === 'Rejected') {
        // Re-check functionality for rejected applicants
        this.$emit('recheck', applicant)
      } else if (applicant.application_status === 'Under Review') {
        // Approve functionality for under review applicants
        this.$emit('accept', applicant)
      }
    },
  },
}
