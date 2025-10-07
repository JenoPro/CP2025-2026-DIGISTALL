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

      // Loading popup states (like AddAvailableStall)
      showLoadingPopup: false,
      popupState: 'loading', // 'loading', 'success', 'error'
      loadingMessage: 'Declining application...',
      successMessage: 'Application declined successfully!',
      errorMessage: '',
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

      // Reset loading popup states
      this.showLoadingPopup = false
      this.popupState = 'loading'
      this.loadingMessage = 'Declining application...'
      this.successMessage = 'Application declined successfully!'
      this.errorMessage = ''
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

        console.log('🎯 Declining applicant:', this.applicant)
        console.log('📝 Decline reason:', this.declineReason)

        // Step 1: Show loading popup (like AddAvailableStall)
        this.showLoadingPopup = true
        this.popupState = 'loading'
        this.loadingMessage = 'Sending decline notification...'

        // Step 2: Send decline email first if requested
        let emailSuccess = false
        if (this.sendNotification) {
          console.log('📧 Sending decline email to:', this.applicant.email)

          const emailResult = await sendDeclineEmailWithRetry(
            this.applicant.email,
            this.applicant.fullName,
            this.declineReason.trim(),
          )

          this.emailSent = emailResult.success
          emailSuccess = emailResult.success

          if (!emailResult.success) {
            console.warn('⚠️ Email failed but proceeding:', emailResult.message)
          }
        }

        // Step 3: Update loading message for data deletion
        this.loadingMessage = 'Declining applicant and deleting data...'

        // Step 4: Decline applicant via backend (this will delete all data)
        const declineResult = await this.declineApplicantViaBackend(
          this.applicant.applicant_id || this.applicant.id,
          this.declineReason.trim(),
        )

        if (!declineResult.success) {
          throw new Error(declineResult.message || 'Failed to decline applicant')
        }

        console.log('✅ Applicant declined and all data deleted successfully')

        // Step 5: Show success state
        this.popupState = 'success'
        this.successMessage = emailSuccess
          ? 'Application declined and notification sent!'
          : 'Application declined successfully!'

        // Step 6: Auto-close success popup and emit events for realtime updates
        setTimeout(() => {
          this.showLoadingPopup = false
          this.closeModal()

          // Emit events for realtime updates (no refresh needed)
          this.$emit('declined', {
            applicant: this.applicant,
            reason: this.declineReason,
            emailSent: this.emailSent,
            deleted: true,
          })

          // Emit to parent components for immediate list updates
          this.$emit('applicant-deleted', this.applicant.applicant_id || this.applicant.id)
          this.$emit('refresh-data')

          // Show success toast
          if (this.$toast) {
            this.$toast.success(`✅ ${this.applicant.fullName} application declined successfully`)
          }

          console.log('✅ Applicant declined successfully:', {
            applicant: this.applicant.fullName,
            email: this.applicant.email,
            reason: this.declineReason,
            emailSent: this.emailSent,
          })
        }, 2000) // Show success for 2 seconds
      } catch (error) {
        console.error('❌ Error in decline process:', error)

        // Show error state in popup
        this.popupState = 'error'
        this.errorMessage = error.message || 'Failed to decline application'

        // Auto-close error popup
        setTimeout(() => {
          this.showLoadingPopup = false

          if (this.$toast) {
            this.$toast.error(`❌ Failed to decline applicant: ${error.message}`)
          } else {
            alert(`❌ Failed to decline applicant: ${error.message}`)
          }
        }, 3000)
      }
    },

    async updateApplicantStatus(applicantId, status, reason = null) {
      try {
        console.log('📤 Updating applicant status:', { applicantId, status, reason })

        const token =
          sessionStorage.getItem('authToken') ||
          localStorage.getItem('token') ||
          localStorage.getItem('authToken')

        if (!token) {
          throw new Error('Authentication token not found. Please log in again.')
        }

        const updateData = {
          status: status,
        }

        // Add decline reason if declining
        if (status === 'declined' && reason) {
          updateData.decline_reason = reason
        }

        const response = await fetch(`http://localhost:3001/api/applicants/${applicantId}/status`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
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
      } catch (error) {
        console.error('❌ Error updating applicant status:', error)
        return { success: false, message: error.message }
      }
    },

    async declineApplicantViaBackend(applicantId, reason) {
      try {
        console.log('🗑️ Declining applicant via backend:', { applicantId, reason })

        const token =
          sessionStorage.getItem('authToken') ||
          localStorage.getItem('token') ||
          localStorage.getItem('authToken')

        if (!token) {
          throw new Error('Authentication token not found. Please log in again.')
        }

        const response = await fetch(
          `http://localhost:3001/api/applicants/${applicantId}/decline`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              reason: reason,
            }),
          },
        )

        console.log('📡 Decline response:', response.status)

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Your session has expired. Please log in again.')
          } else if (response.status === 403) {
            throw new Error('You do not have permission to decline this applicant.')
          } else if (response.status === 404) {
            throw new Error('Applicant not found.')
          } else if (response.status === 400) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Invalid decline reason.')
          } else {
            throw new Error(`Server error: ${response.status}`)
          }
        }

        const result = await response.json()
        console.log('📦 Decline result:', result)

        if (result.success) {
          return {
            success: true,
            message: 'Applicant declined and all data deleted',
            data: result.data,
          }
        } else {
          throw new Error(result.message || 'Failed to decline applicant')
        }
      } catch (error) {
        console.error('❌ Error declining applicant via backend:', error)
        return { success: false, message: error.message }
      }
    },
  },
}
