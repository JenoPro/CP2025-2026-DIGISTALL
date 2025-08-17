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
      confirmAction: '',
      selectedApplicant: null,
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
  },
}
