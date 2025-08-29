<!-- eslint-disable vue/multi-word-component-names -->
    <!-- Compliance.vue -->
<template>
  <v-app>
    <!-- Main Content -->
    <v-main>
      <v-row>
        <v-col cols="12">
          <!-- Page Title -->
          <div class="page-header">
            <h1 class="page-title">{{ pageTitle }}</h1>
          </div>

          <!-- Search Component -->
          <ComplianceSearch @search="handleSearch" />

          <!-- Table Component -->
          <ComplianceTable
            :searchQuery="searchQuery"
            :activeFilter="activeFilter"
            :complianceList="complianceList"
            @view-compliance="handleViewCompliance"
            @edit-compliance="handleEditCompliance"
            @delete-compliance="handleDeleteCompliance"
          />
          <!-- View Compliance Modal -->
          <ViewCompliance
            :isVisible="showViewComplianceModal"
            :compliance="selectedCompliance"
            @close="closeViewComplianceModal"
          />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script src="./Compliance.js"></script>
<style scoped src="./Compliance.css"></style>
