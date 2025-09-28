<template>
  <div>
    <!-- Choice Modal - Increased Width for Three Cards -->
    <v-dialog v-model="showModal" max-width="1200px" width="95vw" persistent>
      <v-card class="choice-modal-card">
        <v-card-title class="choice-modal-header">
          <span>What would you like to add?</span>
          <v-btn icon @click="closeModal" color="white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-8">
          <v-row dense>
            <!-- Add Stall Card -->
            <v-col cols="12" sm="6" md="4">
              <v-card
                class="choice-card stall-card"
                :class="{ 'choice-card-hover': !loading }"
                @click="!loading && selectAddStall()"
                :disabled="loading"
                elevation="4"
                role="button"
                :aria-label="'Add a new stall'"
                tabindex="0"
                @keydown.enter="!loading && selectAddStall()"
                @keydown.space="!loading && selectAddStall()"
              >
                <div class="choice-card-content">
                  <div class="choice-icon-container stall-icon">
                    <v-icon size="40" color="white">mdi-store</v-icon>
                  </div>
                  <h3 class="choice-title">Add Stall</h3>
                  <p class="choice-description">
                    Add a new stall to an existing floor and section. Configure stall
                    details, pricing, and availability.
                  </p>
                  <div class="choice-features">
                    <div class="feature-item">
                      <v-icon size="16" color="#1976d2">mdi-check-circle</v-icon>
                      <span>Stall Configuration</span>
                    </div>
                    <div class="feature-item">
                      <v-icon size="16" color="#1976d2">mdi-check-circle</v-icon>
                      <span>Price & Size Setup</span>
                    </div>
                    <div class="feature-item">
                      <v-icon size="16" color="#1976d2">mdi-check-circle</v-icon>
                      <span>Location Assignment</span>
                    </div>
                  </div>
                </div>
                <div class="choice-card-overlay">
                  <v-btn
                    color="primary"
                    class="choice-btn"
                    :loading="loading"
                    :disabled="loading"
                  >
                    <v-icon left>mdi-store-plus</v-icon>
                    Add Stall
                  </v-btn>
                </div>
              </v-card>
            </v-col>

            <!-- Add Floor & Section Card -->
            <v-col cols="12" sm="6" md="4">
              <v-card
                class="choice-card floor-section-card"
                :class="{ 'choice-card-hover': !loading }"
                @click="!loading && selectAddFloorSection()"
                :disabled="loading"
                elevation="4"
                role="button"
                :aria-label="'Add floor and section'"
                tabindex="0"
                @keydown.enter="!loading && selectAddFloorSection()"
                @keydown.space="!loading && selectAddFloorSection()"
              >
                <div class="choice-card-content">
                  <div class="choice-icon-container floor-section-icon">
                    <v-icon size="40" color="white">mdi-domain</v-icon>
                  </div>
                  <h3 class="choice-title">Add Floor & Section</h3>
                  <p class="choice-description">
                    Create new floors and sections first. This should be done before
                    adding stalls to organize your marketplace.
                  </p>
                  <div class="choice-features">
                    <div class="feature-item">
                      <v-icon size="16" color="#4caf50">mdi-check-circle</v-icon>
                      <span>Floor Management</span>
                    </div>
                    <div class="feature-item">
                      <v-icon size="16" color="#4caf50">mdi-check-circle</v-icon>
                      <span>Section Organization</span>
                    </div>
                    <div class="feature-item">
                      <v-icon size="16" color="#4caf50">mdi-check-circle</v-icon>
                      <span>Capacity Planning</span>
                    </div>
                  </div>
                </div>
                <div class="choice-card-overlay">
                  <v-btn
                    color="success"
                    class="choice-btn"
                    :loading="loading"
                    :disabled="loading"
                  >
                    <v-icon left>mdi-domain-plus</v-icon>
                    Add Floor & Section
                  </v-btn>
                </div>
              </v-card>
            </v-col>

            <!-- View Floors & Sections Card -->
            <v-col cols="12" sm="6" md="4">
              <v-card
                class="choice-card view-card"
                :class="{ 'choice-card-hover': !loading }"
                @click="!loading && selectViewFloorsSections()"
                :disabled="loading"
                elevation="4"
                role="button"
                :aria-label="'View existing floors and sections'"
                tabindex="0"
                @keydown.enter="!loading && selectViewFloorsSections()"
                @keydown.space="!loading && selectViewFloorsSections()"
              >
                <div class="choice-card-content">
                  <div class="choice-icon-container view-icon">
                    <v-icon size="40" color="white">mdi-view-list</v-icon>
                  </div>
                  <h3 class="choice-title">View Floors & Sections</h3>
                  <p class="choice-description">
                    Browse and manage your existing floors and sections. View details and
                    organization of your marketplace structure.
                  </p>
                  <div class="choice-features">
                    <div class="feature-item">
                      <v-icon size="16" color="#1976d2">mdi-check-circle</v-icon>
                      <span>Browse Structure</span>
                    </div>
                    <div class="feature-item">
                      <v-icon size="16" color="#1976d2">mdi-check-circle</v-icon>
                      <span>View Details</span>
                    </div>
                    <div class="feature-item">
                      <v-icon size="16" color="#1976d2">mdi-check-circle</v-icon>
                      <span>Manage Layout</span>
                    </div>
                  </div>
                </div>
                <div class="choice-card-overlay">
                  <v-btn
                    color="primary"
                    class="choice-btn"
                    :loading="loading"
                    :disabled="loading"
                  >
                    <v-icon left>mdi-eye</v-icon>
                    View Structure
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Helper Text  -->
          <v-row class="mt-6">
            <v-col cols="12">
              <v-alert variant="tonal" class="helper-alert" density="compact">
                <div class="d-flex align-center">
                  <div>
                    <strong>Tip:</strong> Create floors and sections first, then add
                    stalls to them. This ensures proper organization of your marketplace
                    structure.
                  </div>
                </div>
              </v-alert>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Add Stall Modal -->
    <AddAvailableStall
      :showModal="showAddStallModal"
      @close-modal="closeAddStallModal"
      @stall-added="handleStallAdded"
      @show-message="handleShowMessage"
      @refresh-stalls="handleRefreshStalls"
    />

    <!-- Add Floor & Section Modal -->
    <AddFloorSection
      :showModal="showAddFloorSectionModal"
      @close-modal="closeAddFloorSectionModal"
      @floor-added="handleFloorAdded"
      @section-added="handleSectionAdded"
      @show-message="handleShowMessage"
      @refresh-data="handleRefreshData"
    />

    <!-- View Floors & Sections Modal -->
    <ViewFloorsSections
      :showModal="showViewFloorsSectionsModal"
      @close-modal="closeViewFloorsSectionsModal"
      @show-message="handleShowMessage"
      @refresh-data="handleRefreshData"
      @open-add-floor-section="handleOpenAddFloorSection"
    />

    <!-- Floating Button Container -->
    <div class="floating-button-container">
      <!-- Pulse rings for ambient effect -->
      <div class="pulse-rings" v-if="!showModal">
        <div class="pulse-ring pulse-ring-1"></div>
        <div class="pulse-ring pulse-ring-2"></div>
        <div class="pulse-ring pulse-ring-3"></div>
        <div class="pulse-ring pulse-ring-4"></div>
      </div>

      <!-- Floating Action Button with Tooltip -->
      <v-tooltip location="left">
        <template v-slot:activator="{ props }">
          <v-btn
            fab
            color="primary"
            class="add-btn"
            :class="{ 'glow-effect': !showModal }"
            @click="openChoiceModal"
            v-bind="props"
            :aria-label="'Add or View Stalls, Floors & Sections'"
            role="button"
          >
            <div class="ripple-overlay"></div>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Add or View Stalls, Floors & Sections</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script src="./AddChoiceModal.js"></script>
<style scoped src="./AddChoiceModal.css"></style>
