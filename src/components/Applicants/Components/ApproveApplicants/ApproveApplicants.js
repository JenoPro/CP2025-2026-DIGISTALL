import {
  generateUsername,
  generatePassword,
  sendApprovalEmailWithRetry,
} from '../emailJS/emailService.js'

export default {
  name: 'ApproveApplicants',
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
      approved: false,
      emailSent: false,
      credentials: null,
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
  },
  methods: {
    resetState() {
      this.processing = false
      this.approved = false
      this.emailSent = false
      this.credentials = null
      this.processingMessage = ''
    },

    closeModal() {
      this.showModal = false
      this.$emit('close')
    },

    async approveApplicant() {
      try {
        this.processing = true
        this.processingMessage = 'Generating credentials...'

        console.log('🎯 Approving applicant:', this.applicant)

        // Generate credentials for the applicant
        const username = generateUsername()
        const password = generatePassword()

        this.credentials = { username, password }

        console.log(`📝 Approving applicant ${this.applicant.id}:`, {
          email: this.applicant.email,
          name: this.applicant.fullName,
          username,
          password,
        })

        this.processingMessage = 'Updating database...'

        // Update database status to approved
        const updateResult = await this.updateApplicantStatus(
          this.applicant.applicant_id,
          'approved',
          username,
          password,
        )

        if (!updateResult.success) {
          throw new Error(updateResult.message || 'Failed to update database')
        }

        this.processingMessage = 'Sending credentials email...'

        // Send approval email with credentials
        const emailResult = await sendApprovalEmailWithRetry(
          this.applicant.email,
          this.applicant.fullName,
          username,
          password,
        )

        this.emailSent = emailResult.success
        this.approved = true
        this.processing = false

        if (emailResult.success) {
          // Show success message
          if (this.$toast) {
            this.$toast.success(
              `✅ ${this.applicant.fullName} approved and credentials sent to ${this.applicant.email}`,
            )
          }

          console.log('✅ Applicant approved successfully:', {
            applicant: this.applicant.fullName,
            email: this.applicant.email,
            username,
            password,
          })
        } else {
          // Show partial success message
          if (this.$toast) {
            this.$toast.warning(`⚠️ Applicant approved but email failed: ${emailResult.message}`)
          }
        }

        // Emit success event to parent component
        this.$emit('approved', {
          applicant: this.applicant,
          credentials: this.credentials,
          emailSent: this.emailSent,
        })
      } catch (error) {
        console.error('❌ Unexpected error in approveApplicant:', error)

        this.processing = false

        if (this.$toast) {
          this.$toast.error(`❌ Failed to approve applicant: ${error.message}`)
        } else {
          alert(`❌ Failed to approve applicant: ${error.message}`)
        }
      }
    },

    async updateApplicantStatus(applicantId, status, username = null, password = null) {
      try {
        console.log('📤 Updating applicant status:', { applicantId, status, username, password })

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

        // Add credentials if approving
        if (status === 'approved' && username && password) {
          updateData.username = username
          updateData.password = password
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
