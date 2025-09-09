export default {
  name: 'VendorApplicantsTable',
  props: {
    applicants: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['accept', 'decline'],
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
  },
}
