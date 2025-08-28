<template>
  <div class="documents-modal-overlay" v-if="isVisible" @click="closeModal">
    <div class="documents-modal" @click.stop>
      <div class="modal-header">
        <h2>{{ stallholder.fullName }}</h2>
        <button class="close-btn" @click="closeModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="stallholder-info">
        <p><strong>Email:</strong> {{ stallholder.email }}</p>
        <p><strong>Phone:</strong> {{ stallholder.phone }}</p>
        <p><strong>Address:</strong> {{ stallholder.address }}</p>
      </div>
      
      <div class="documents-grid">
        <div 
          v-for="document in documents" 
          :key="document.id"
          class="document-card"
          :class="{ 'complete': document.status === 'complete' }"
          @click="viewDocument(document)"
        >
          <div class="document-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
            </svg>
          </div>
          <div class="document-info">
            <h3>{{ document.name }}</h3>
            <span 
              class="document-status" 
              :class="getStatusClass(document.status)"
            >
              {{ document.status.toUpperCase() }}
            </span>
          </div>
          <div class="document-check" v-if="document.status === 'complete'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./DocumentsView.js"></script>
<style scoped src="./DocumentsView.css"></style>