<template>
  <div class="search-container">
    <div class="search-wrapper">
      <div class="search-input-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search stallholders..." 
          class="search-input"
          @input="handleSearch"
        />
        <button class="search-button" @click="handleSearch">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>
      
      <div class="filter-buttons">
        <button 
          class="filter-btn"
          :class="{ active: activeFilter === 'all' }"
          @click="setFilter('all')"
        >
          All
        </button>
        <button 
          class="filter-btn"
          :class="{ active: activeFilter === 'active' }"
          @click="setFilter('active')"
        >
          Active
        </button>
        <button 
          class="filter-btn"
          :class="{ active: activeFilter === 'inactive' }"
          @click="setFilter('inactive')"
        >
          Inactive
        </button>
        <button 
          class="filter-btn"
          :class="{ active: activeFilter === 'pending' }"
          @click="setFilter('pending')"
        >
          Pending
        </button>
      </div>
    </div>
  </div>
</template>

<script src="./SearchStall.js"></script>
<style scoped src="./SearchStall.css"></style>