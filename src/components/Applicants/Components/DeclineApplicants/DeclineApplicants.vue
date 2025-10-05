<template>
  <div>
    <!-- Main Decline Modal -->
    <div v-if="showModal" class="decline-modal-overlay" @click.self="closeModal">
      <div class="decline-modal">
        <!-- Modal Header -->
        <div class="decline-modal-header">
          <h3>Decline Application</h3>
        </div>

        <!-- Modal Body -->
        <div class="decline-modal-body">
          <!-- Applicant Information -->
          <div class="applicant-info" v-if="applicant">
            <h4>Applicant Details</h4>
            <div class="applicant-details">
              <div class="applicant-detail">
                <strong>Name:</strong>
                <span>{{ applicant.fullName }}</span>
              </div>
              <div class="applicant-detail">
                <strong>Email:</strong>
                <span>{{ applicant.email }}</span>
              </div>
              <div class="applicant-detail">
                <strong>Phone:</strong>
                <span>{{ applicant.contactNumber }}</span>
              </div>
              <div class="applicant-detail">
                <strong>Type:</strong>
                <span>{{ applicant.applicationType || 'Stall Applicant' }}</span>
              </div>
            </div>
          </div>

          <!-- Processing State -->
          <div v-if="processing" class="processing-section">
            <div class="processing-icon"></div>
            <div class="processing-message">{{ processingMessage }}</div>
            <div class="processing-details">Please wait while we process the decline...</div>
          </div>

          <!-- Decline Form -->
          <div v-if="!processing && !declined" class="decline-form">
            <div class="form-group">
              <label for="declineReason" class="form-label">
                <strong>Reason for Decline *</strong>
              </label>
              <textarea
                id="declineReason"
                v-model="declineReason"
                class="form-textarea"
                rows="4"
                placeholder="Please provide a clear reason for declining this application..."
                required
              ></textarea>
              <div v-if="reasonError" class="error-message">
                {{ reasonError }}
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-container">
                <input 
                  type="checkbox" 
                  v-model="sendNotification"
                  class="form-checkbox"
                >
                <span class="checkmark"></span>
                Send decline notification email to applicant
              </label>
            </div>
          </div>

          <!-- Success State -->
          <div v-if="declined" class="success-section">
            <div class="decline-icon">✕</div>
            <div class="success-message">
              Application Declined Successfully
            </div>
            
            <div class="decline-summary">
              <h5>Decline Summary</h5>
              <div class="summary-item">
                <span class="summary-label">Applicant:</span>
                <span class="summary-value">{{ applicant.fullName }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Reason:</span>
                <span class="summary-value">{{ declineReason }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Email Sent:</span>
                <span class="summary-value">{{ emailSent ? 'Yes' : 'No' }}</span>
              </div>
            </div>

            <div v-if="emailSent" class="email-status email-success">
              ✓ Decline notification sent to {{ applicant.email }}
            </div>
            <div v-else-if="sendNotification" class="email-status email-warning">
              ⚠ Failed to send decline notification email
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="decline-modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary" 
            @click="closeModal"
            :disabled="processing"
          >
            {{ declined ? 'Close' : 'Cancel' }}
          </button>
          
          <button 
            v-if="!declined" 
            type="button" 
            class="btn btn-danger" 
            @click="declineApplicant"
            :disabled="processing || !declineReason.trim()"
          >
            {{ processing ? 'Processing...' : 'Decline Application' }}
          </button>
          
          <button 
            v-if="declined" 
            type="button" 
            class="btn btn-primary" 
            @click="closeModal"
          >
            Done
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Popup Modal (Like Adding Stall) -->
    <div v-if="showLoadingPopup" class="loading-popup-overlay">
      <div class="loading-popup-card">
        <div class="popup-content">
          <!-- Loading State -->
          <div v-if="popupState === 'loading'" class="popup-state">
            <div class="loading-spinner">
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
            </div>
            <p class="popup-text">{{ loadingMessage }}</p>
          </div>

          <!-- Success State -->
          <div v-else-if="popupState === 'success'" class="popup-state">
            <div class="success-icon">
              <div class="checkmark-circle">
                <div class="checkmark"></div>
              </div>
            </div>
            <h3 class="success-title">Success!</h3>
            <p class="popup-text">{{ successMessage }}</p>
          </div>

          <!-- Error State -->
          <div v-else-if="popupState === 'error'" class="popup-state">
            <div class="error-icon">
              <div class="error-circle">
                <div class="error-x"></div>
              </div>
            </div>
            <h3 class="error-title">Error</h3>
            <p class="popup-text">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./DeclineApplicants.js"></script>
<style src="./DeclineApplicants.css"></style>