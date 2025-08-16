export default {
  name: 'DocumentDetail',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    document: {
      type: Object,
      default: () => ({})
    },
    stallholder: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    
    acceptDocument() {
      if (confirm(`Are you sure you want to accept the ${this.document.name}?`)) {
        console.log('Document accepted:', this.document)
        this.$emit('accept-document', {
          document: this.document,
          stallholder: this.stallholder
        })
        
        // Update local document status
        this.document.status = 'approved'
      }
    },
    
    declineDocument() {
      if (confirm(`Are you sure you want to decline the ${this.document.name}?`)) {
        console.log('Document declined:', this.document)
        this.$emit('decline-document', {
          document: this.document,
          stallholder: this.stallholder
        })
        
        // Update local document status
        this.document.status = 'rejected'
      }
    },
    
    getStatusClass(status) {
      const statusClasses = {
        'complete': 'status-complete',
        'pending': 'status-pending',
        'rejected': 'status-rejected',
        'approved': 'status-approved'
      }
      return statusClasses[status] || 'status-default'
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      
      const date = new Date(dateString)
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }
      return date.toLocaleDateString('en-US', options)
    },
    
    handleEscKey(event) {
      if (event.key === 'Escape' && this.isVisible) {
        this.closeModal()
      }
    }
  },
  
  mounted() {
    // Add escape key listener
    document.addEventListener('keydown', this.handleEscKey)
  },
  
  beforeDestroy() {
    // Remove escape key listener
    document.removeEventListener('keydown', this.handleEscKey)
  }
}