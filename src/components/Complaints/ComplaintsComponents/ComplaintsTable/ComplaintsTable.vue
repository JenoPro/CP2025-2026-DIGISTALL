<!-- ComplaintsTable.vue (component) -->
<template>
  <div class="complaints-table-container">
    <div class="complaints-table-wrapper">
      <table class="complaints-table">
        <thead>
          <tr>
            <th>Complaints ID</th>
            <th>Date</th>
            <th>Type</th>
            <th>Sender</th>
            <th>Stallholder</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- ✅ Use paginatedComplaints instead of filteredComplaints -->
          <tr v-for="complaints in paginatedComplaints" :key="complaints.id">
            <td>{{ complaints.id }}</td>
            <td>{{ complaints.date }}</td>
            <td>{{ complaints.type }}</td>
            <td>{{ complaints.sender }}</td>
            <td class="complaints-name-cell">
              <div class="complaints-name-wrapper">
                <div class="complaints-avatar">
                  {{ getInitials(complaints.stallholder) }}
                </div>
                <span>{{ complaints.stallholder }}</span>
              </div>
            </td>
            <td>
              <span
                class="complaints-status-badge"
                :class="getStatusClass(complaints.status)"
              >
                {{ complaints.status.toUpperCase() }}
              </span>
            </td>
            <td class="complaints-actions-cell">
              <button
                class="complaints-action-btn complaints-view-btn"
                @click="viewComplaints(complaints)"
                title="View Details"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button
                class="complaints-action-btn complaints-edit-btn"
                @click="editComplaints(complaints)"
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
      <div v-if="filteredComplaints.length === 0" class="complaints-empty-state">
        <svg class="complaints-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <h3>No complaints records found</h3>
        <p>{{ searchQuery ? 'Try adjusting your search criteria' : 'No complaints records available yet' }}</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="complaints-pagination-wrapper" v-if="totalPages > 1">
      <button
        class="complaints-page-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        ← Previous
      </button>

      <span class="complaints-page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button
        class="complaints-page-btn"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script>
import script from './ComplaintsTable.js'
import './ComplaintsTable.css'
export default script
</script>
