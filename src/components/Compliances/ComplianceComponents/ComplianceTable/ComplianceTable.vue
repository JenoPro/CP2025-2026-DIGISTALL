<!-- ComplianceTable.vue (component) -->
<template>
  <div class="compliance-table-container">
    <div class="compliance-table-wrapper">
      <table class="compliance-table">
        <thead>
          <tr>
            <th>Compliance ID</th>
            <th>Date</th>
            <th>Type</th>
            <th>Inspector</th>
            <th>Stallholder</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- ✅ Use paginatedCompliance instead of filteredCompliance -->
          <tr v-for="compliance in paginatedCompliance" :key="compliance.id">
            <td>{{ compliance.id }}</td>
            <td>{{ compliance.date }}</td>
            <td>{{ compliance.type }}</td>
            <td>{{ compliance.inspector }}</td>
            <td class="compliance-name-cell">
              <div class="compliance-name-wrapper">
                <div class="compliance-avatar">
                  {{ getInitials(compliance.stallholder) }}
                </div>
                <span>{{ compliance.stallholder }}</span>
              </div>
            </td>
            <td>
              <span
                class="compliance-status-badge"
                :class="getStatusClass(compliance.status)"
              >
                {{ compliance.status.toUpperCase() }}
              </span>
            </td>
            <td class="compliance-actions-cell">
              <button
                class="compliance-action-btn compliance-view-btn"
                @click="viewCompliance(compliance)"
                title="View Details"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button
                class="compliance-action-btn compliance-edit-btn"
                @click="editCompliance(compliance)"
                title="Edit"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="m18.5 2.5-5.5 5.5-2-2 5.5-5.5a2.1 2.1 0 0 1 3 3z"></path>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredCompliance.length === 0" class="compliance-empty-state">
        <svg class="compliance-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <h3>No compliance records found</h3>
        <p>{{ searchQuery ? 'Try adjusting your search criteria' : 'No compliance records available yet' }}</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="compliance-pagination-wrapper" v-if="totalPages > 1">
      <button
        class="compliance-page-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        ← Previous
      </button>

      <span class="compliance-page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button
        class="compliance-page-btn"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script>
import script from './ComplianceTable.js'
import './ComplianceTable.css'
export default script
</script>
