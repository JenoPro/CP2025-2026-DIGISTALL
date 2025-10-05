import { sendDeclineEmailWithRetry } from '../emailJS/emailService.js'

export default {
  name: 'DeclineApplicants',
  props: {
    applicant: {
      type: Object,
      default: null,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showModal: false,
      processing: false,
      declined: false,
      emailSent: false,
      declineReason: '',
      sendNotification: true,
      reasonError: '',
      processingMessage: '',
    }
  },
  watch: {
    show(newVal) {
      this.showModal = newVal
      if (newVal) {
        this.resetState()
      }
    },
    declineReason(newVal) {
      if (newVal && newVal.trim().length > 0) {
        this.reasonError = ''
      }
    },
  },
  methods: {
    resetState() {
      this.processing = false
      this.declined = false
      this.emailSent = false
      this.declineReason = ''
      this.sendNotification = true
      this.reasonError = ''
      this.processingMessage = ''
    },

    closeModal() {
      this.showModal = false
      this.$emit('close')
    },

    validateForm() {
      this.reasonError = ''

      if (!this.declineReason || this.declineReason.trim().length === 0) {
        this.reasonError = 'Please provide a reason for declining this application.'
        return false
      }

      if (this.declineReason.trim().length < 10) {
        this.reasonError = 'Please provide a more detailed reason (at least 10 characters).'
        return false
      }

      return true
    },

    async declineApplicant() {
      try {
        // Validate form
        if (!this.validateForm()) {
          return
        }

        this.processing = true
        this.processingMessage = 'Updating database...'

        console.log('🎯 Declining applicant:', this.applicant)
        console.log('📝 Decline reason:', this.declineReason)

        // Update database status to declined
        const updateResult = await this.updateApplicantStatus(
          this.applicant.applicant_id,
          'declined',
          this.declineReason.trim(),
        )

        if (!updateResult.success) {
          throw new Error(updateResult.message || 'Failed to update database')
        }

        // Send decline email if requested
        if (this.sendNotification) {
          this.processingMessage = 'Sending decline notification...'

          const emailResult = await sendDeclineEmailWithRetry(
            this.applicant.email,
            this.applicant.fullName,
            this.declineReason.trim(),
          )

          this.emailSent = emailResult.success

          if (!emailResult.success) {
            console.warn('⚠️ Email failed but proceeding:', emailResult.message)
          }
        }

        this.declined = true
        this.processing = false

        // Show success message
        if (this.$toast) {
          this.$toast.success(`✅ ${this.applicant.fullName} application declined successfully`)
        }

        console.log('✅ Applicant declined successfully:', {
          applicant: this.applicant.fullName,
          email: this.applicant.email,
          reason: this.declineReason,
          emailSent: this.emailSent,
        })

        // Emit success event to parent component
        this.$emit('declined', {
          applicant: this.applicant,
          reason: this.declineReason,
          emailSent: this.emailSent,
        })
      } catch (error) {
        console.error('❌ Unexpected error in declineApplicant:', error)

        this.processing = false

        if (this.$toast) {
          this.$toast.error(`❌ Failed to decline applicant: ${error.message}`)
        } else {
          alert(`❌ Failed to decline applicant: ${error.message}`)
        }
      }
    },

    async updateApplicantStatus(applicantId, status, reason = null) {
      try {
        console.log('📤 Updating applicant status:', { applicantId, status, reason })

        // TEMPORARY: Mock successful response until backend endpoint is implemented
        console.log('⚠️ WARNING: Using mock response - backend endpoint not implemented')
        console.log(
          '📄 See APPLICANT-STATUS-API-REQUIREMENTS.md for backend implementation details',
        )

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return {
          success: true,
          message: 'Status updated successfully (mocked response - backend endpoint needed)',
        }

        // TODO: Uncomment this when backend endpoint is implemented
        /*
        const token = sessionStorage.getItem('authToken') || 
                     localStorage.getItem('token') || 
                     localStorage.getItem('authToken')
        
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.')
        }

        const updateData = {
          status: status
        }

        // Add decline reason if declining
        if (status === 'declined' && reason) {
          updateData.decline_reason = reason
        }

        const response = await fetch(`http://localhost:3001/api/applicants/${applicantId}/status`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        })

        console.log('📡 Status update response:', response.status)

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Your session has expired. Please log in again.')
          } else if (response.status === 403) {
            throw new Error('You do not have permission to update this applicant.')
          } else if (response.status === 404) {
            throw new Error('Applicant not found.')
          } else {
            throw new Error(`Server error: ${response.status}`)
          }
        }

        const result = await response.json()
        console.log('📦 Status update result:', result)

        if (result.success) {
          return { success: true, message: 'Status updated successfully' }
        } else {
          throw new Error(result.message || 'Failed to update status')
        }
        */
      } catch (error) {
        console.error('❌ Error updating applicant status:', error)
        return { success: false, message: error.message }
      }
    },
  },
}
