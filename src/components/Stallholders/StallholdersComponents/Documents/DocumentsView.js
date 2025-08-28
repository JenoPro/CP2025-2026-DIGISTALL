export default {
  name: 'DocumentsView',
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    stallholder: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      documents: [
        {
          id: 1,
          name: 'Award Paper',
          status: 'complete',
          type: 'pdf',
          uploadDate: '2025-03-28',
        },
        {
          id: 2,
          name: 'Lease Contract',
          status: 'complete',
          type: 'pdf',
          uploadDate: '2025-03-25',
        },
        {
          id: 3,
          name: 'MEPO Market Clearance',
          status: 'complete',
          type: 'pdf',
          uploadDate: '2025-03-20',
        },
        {
          id: 4,
          name: 'Barangay Business Clearance',
          status: 'complete',
          type: 'pdf',
          uploadDate: '2025-03-18',
        },
        {
          id: 5,
          name: 'Cedula',
          status: 'complete',
          type: 'pdf',
          uploadDate: '2025-03-15',
        },
        {
          id: 6,
          name: 'Association Clearance',
          status: 'complete',
          type: 'pdf',
          uploadDate: '2025-03-12',
        },
        {
          id: 7,
          name: "Voter's ID",
          status: 'complete',
          type: 'pdf',
          uploadDate: '2025-03-10',
        },
        {
          id: 8,
          name: 'Health Card',
          status: 'complete',
          type: 'pdf',
          uploadDate: '2025-03-08',
        },
      ],
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },

    viewDocument(document) {
      console.log('View document:', document)
      this.$emit('view-document', document)
    },

    getStatusClass(status) {
      const statusClasses = {
        complete: 'status-complete',
        pending: 'status-pending',
        rejected: 'status-rejected',
        approved: 'status-approved',
      }
      return statusClasses[status] || 'status-default'
    },

    handleEscKey(event) {
      if (event.key === 'Escape' && this.isVisible) {
        this.closeModal()
      }
    },
  },

  mounted() {
    // Add escape key listener
    document.addEventListener('keydown', this.handleEscKey)
  },

  beforeDestroy() {
    // Remove escape key listener
    document.removeEventListener('keydown', this.handleEscKey)
  },
}
