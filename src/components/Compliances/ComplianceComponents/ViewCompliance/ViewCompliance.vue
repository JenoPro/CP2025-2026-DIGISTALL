<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <!-- HEADER -->
      <div class="modal-header">
        <h3 class="modal-title">Compliance Details</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <!-- BODY -->
      <div class="modal-body" v-if="compliance">
        <!-- Top Info Grid -->
        <div class="info-grid">
          <div class="info-card">
            <strong>Compliance ID</strong>
            <p>{{ compliance.id }}</p>
          </div>
          <div class="info-card">
            <strong>Date</strong>
            <p>{{ compliance.date }}</p>
          </div>
          <div class="info-card">
            <strong>Type</strong>
            <p>{{ compliance.type }}</p>
          </div>
          <div class="info-card">
            <strong>Status</strong>
            <p>
              <span :class="getStatusClass(compliance.status)">
                {{ compliance.status.toUpperCase() }}
              </span>
            </p>
          </div>
        </div>

        <!-- Inspector -->
        <div class="section-card">
          <div class="avatar">
            {{ compliance.inspector ? compliance.inspector[0] : "I" }}
          </div>
          <div class="details">
            <span class="name">{{ compliance.inspector }}</span>
            <span class="role">Inspector</span>
          </div>
        </div>

        <!-- Stallholder -->
        <div class="section-card">
          <div class="avatar">
            {{ compliance.stallholder ? compliance.stallholder[0] : "S" }}
          </div>
          <div class="details">
            <span class="name">{{ compliance.stallholder }}</span>
            <span class="role">Market Stallholder</span>
          </div>
        </div>

        <!-- Notes -->
        <div class="info-card" style="grid-column: span 2; margin-top: 12px;">
          <strong>Notes</strong>
          <p>{{ compliance.notes || "No additional notes." }}</p>
        </div>
      </div>

      <!-- No Data -->
      <div class="modal-body" v-else>
        <p>No compliance data available.</p>
      </div>

      <!-- FOOTER -->
      <div class="modal-footer">
        <button class="modal-button secondary" @click="closeModal">Close</button>
        <button class="modal-button primary">Edit Compliance</button>
      </div>
    </div>
  </div>
</template>

<script src="./ViewCompliance.js"></script>
<style scoped src="./ViewCompliance.css"></style>
