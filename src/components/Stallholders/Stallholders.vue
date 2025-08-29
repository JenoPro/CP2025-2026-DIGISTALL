<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app>
    <div>
      <!-- Main Content -->
      <v-main>
        <v-container fluid class="main-content">
          <v-row>
            <v-col cols="12">
              <!-- Search Component -->
              <SearchStall @search="handleSearch" />

              <!-- Table Component -->
              <TableStall
                :searchQuery="searchQuery"
                :activeFilter="activeFilter"
                @view-stallholder="handleViewStallholder"
                @edit-stallholder="handleEditStallholder"
                @delete-stallholder="handleDeleteStallholder"
                @add-stallholder="handleAddStallholder"
              />

              <!-- Documents View Modal -->
              <DocumentsView
                :isVisible="showDocumentsModal"
                :stallholder="selectedStallholder"
                @close="closeDocumentsModal"
                @view-document="handleViewDocument"
              />

              <!-- Document Detail Modal -->
              <DocumentDetail
                :isVisible="showDocumentDetail"
                :document="selectedDocument"
                :stallholder="selectedStallholder"
                @close="closeDocumentDetail"
                @accept-document="handleAcceptDocument"
                @decline-document="handleDeclineDocument"
              />

              <!-- Add Stallholder Modal -->
              <AddStallholder
                :isVisible="showAddStallholderModal"
                @close="closeAddStallholderModal"
                @add-stallholder="handleAddStallholderSubmit"
                @stallholder-added="handleStallholderAdded"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script src="./Stallholders.js"></script>
<style scoped src="./Stallholders.css"></style>
