<template>
  <div class="table-container">
    <div class="table-wrapper">
      <table class="stall-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stallholder in filteredStallholders" :key="stallholder.id">
            <td>{{ stallholder.id }}</td>
            <td class="name-cell">
              <div class="name-wrapper">
                <span>{{ stallholder.fullName }}</span>
              </div>
            </td>
            <td>{{ stallholder.email }}</td>
            <td>{{ stallholder.phone }}</td>
            <td class="address-cell">{{ stallholder.address }}</td>
            <td>
              <span 
                class="status-badge" 
                :class="getStatusClass(stallholder.status)"
              >
                {{ stallholder.status.toUpperCase() }}
              </span>
            </td>
            <td class="actions-cell">
              <button 
                class="action-btn view-btn" 
                @click="viewStallholder(stallholder)"
                title="View Details"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button 
                class="action-btn edit-btn" 
                @click="editStallholder(stallholder)"
                title="Edit"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="m18.5 2.5-5.5 5.5-2-2 5.5-5.5a2.1 2.1 0 0 1 3 3z"></path>
                </svg>
              </button>
              <button 
                class="action-btn delete-btn" 
                @click="deleteStallholder(stallholder)"
                title="Delete"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Empty State -->
      <div v-if="filteredStallholders.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <h3>No stallholders found</h3>
        <p>{{ searchQuery ? 'Try adjusting your search criteria' : 'No stallholders registered yet' }}</p>
      </div>
    </div>
    
    <!-- Pagination -->
    <div class="pagination-wrapper" v-if="totalPages > 1">
      <button 
        class="page-btn" 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        ← Previous
      </button>
      
      <span class="page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      
      <button 
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next →
      </button>
    </div>
    
    <!-- Add Button -->
    <button class="add-btn" @click="addStallholder">
      <svg class="add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  </div>
</template>

<script src="./TableStall.js"></script>
<style scoped src="./TableStall.css"></style>