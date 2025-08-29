<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <!-- HEADER -->
      <div class="modal-header">
        <h3 class="modal-title">Complaints Details</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <!-- BODY -->
      <div class="modal-body" v-if="complaints">
        <!-- Top Info Grid -->
        <div class="info-grid">
          <div class="info-card">
            <strong>Complaints ID</strong>
            <p>{{ complaints.id }}</p>
          </div>
          <div class="info-card">
            <strong>Date</strong>
            <p>{{ complaints.date }}</p>
          </div>
          <div class="info-card">
            <strong>Type</strong>
            <p>{{ complaints.type }}</p>
          </div>
          <div class="info-card">
            <strong>Status</strong>
            <p>
              <span :class="getStatusClass(complaints.status)">
                {{ complaints.status.toUpperCase() }}
              </span>
            </p>
          </div>
        </div>

        <!-- Sender -->
        <div class="section-card">
          <div class="avatar">
            {{ complaints.sender ? complaints.sender[0] : "I" }}
          </div>
          <div class="details">
            <span class="name">{{ complaints.sender }}</span>
            <span class="role">Sender</span>
          </div>
        </div>

        <!-- Stallholder -->
        <div class="section-card">
          <div class="avatar">
            {{ complaints.stallholder ? complaints.stallholder[0] : "S" }}
          </div>
          <div class="details">
            <span class="name">{{ complaints.stallholder }}</span>
            <span class="role">Market Stallholder</span>
          </div>
        </div>

        <!-- Notes -->
        <div class="info-card" style="grid-column: span 2; margin-top: 12px;">
          <strong>Notes</strong>
          <p>{{ complaints.notes || "No additional notes." }}</p>
        </div>
      </div>

      <!-- No Data -->
      <div class="modal-body" v-else>
        <p>No complaints data available.</p>
      </div>

      <!-- FOOTER -->
      <div class="modal-footer">
        <button class="modal-button secondary" @click="closeModal">Close</button>
        <button class="modal-button primary">Edit Complaints</button>
      </div>
    </div>
  </div>
</template>

<script src="./ViewComplaints.js"></script>
<style scoped src="./ViewComplaints.css"></style>
