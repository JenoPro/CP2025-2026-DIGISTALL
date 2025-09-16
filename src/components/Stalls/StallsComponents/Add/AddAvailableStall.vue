<template>
  <div>
    <!-- Add Stall Modal -->
    <v-dialog v-model="showModal" max-width="800px" width="95vw" persistent>
      <v-card>
        <v-card-title>
          <span>Add Stall</span>
          <v-btn icon @click="closeModal" color="white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form ref="form" v-model="valid">
            <v-row dense>
              <!-- Stall Number -->
              <v-col cols="12" sm="6">
                <v-text-field v-model="newStall.stallNumber" :rules="[rules.required]" label="Stall Number"
                  placeholder="e.g., NPM-001, LSM-005" prepend-icon="mdi-numeric" outlined dense persistent-hint
                  hint="Enter unique stall identifier" />
              </v-col>

              <!-- Price -->
              <v-col cols="12" sm="6">
                <v-text-field v-model="newStall.price" :rules="[rules.required, rules.positiveNumber]" label="Price"
                  placeholder="e.g., 2500" prepend-icon="mdi-currency-php" outlined dense persistent-hint
                  hint="Enter monthly rental price" />
              </v-col>

              <!-- Floor -->
              <v-col cols="12" sm="6">
                <v-select v-model="newStall.floorId" :items="floorOptions" :rules="[rules.required]" label="Floor"
                  prepend-icon="mdi-stairs" outlined dense />
              </v-col>

              <!-- Section -->
              <v-col cols="12" sm="6">
                <v-select v-model="newStall.sectionId" :items="sectionOptions" :rules="[rules.required]" label="Section"
                  prepend-icon="mdi-view-grid" outlined dense />
              </v-col>

              <!-- Size -->
              <v-col cols="12" sm="6">
                <v-text-field v-model="newStall.size" :rules="[rules.required, validateSize]" label="Size"
                  placeholder="e.g., 3x2m, 4x3m" prepend-icon="mdi-ruler" outlined dense persistent-hint
                  hint="Use format: 3x2m or 3x2" />
              </v-col>

              <!-- Location - CHANGED TO TEXT FIELD -->
              <v-col cols="12" sm="6">
                <v-text-field v-model="newStall.location" :rules="[rules.required, validateLocation]" label="Location"
                  placeholder="e.g., Main Entrance Area, Food Court Central" prepend-icon="mdi-map-marker" outlined
                  dense persistent-hint hint="Describe the specific location within the building" />
              </v-col>

              <!-- Price Type (Auto-determined) -->
              <v-col cols="12" sm="6">
                <v-text-field :value="newStall.priceType" label="Price Type" prepend-icon="mdi-tag" outlined dense
                  readonly persistent-hint hint="Fixed Price for most locations" />
              </v-col>

              <!-- Image Upload -->
              <v-col cols="12" sm="6">
                <v-file-input v-model="newStall.image" accept="image/*" label="Upload Stall Image"
                  prepend-icon="mdi-image" outlined dense show-size truncate-length="25"
                  hint="Optional: Upload an image of the stall" persistent-hint />
              </v-col>

              <!-- Description -->
              <v-col cols="12">
                <v-textarea v-model="newStall.description" label="Description"
                  placeholder="Describe the stall features, location benefits, accessibility, etc."
                  prepend-icon="mdi-text" outlined rows="3" persistent-hint
                  hint="Optional: Provide detailed description of the stall and its advantages" />
              </v-col>

              <!-- Availability Status -->
              <v-col cols="12">
                <v-switch v-model="newStall.isAvailable" label="Available for Rent" color="success" inset
                  persistent-hint hint="Toggle stall availability status" />
              </v-col>

              <!-- Form Preview (Optional) -->
              <v-col cols="12" v-if="stallNumberPreview || formattedPrice">
                <v-card outlined>
                  <v-card-subtitle>Preview</v-card-subtitle>
                  <v-card-text>
                    <div class="d-flex flex-wrap">
                      <v-chip v-if="stallNumberPreview" small class="ma-1" color="primary" text-color="white">
                        {{ stallNumberPreview }}
                      </v-chip>
                      <v-chip v-if="formattedPrice" small class="ma-1" color="success" text-color="white">
                        {{ formattedPrice }}
                      </v-chip>
                      <v-chip v-if="selectedFloorName" small class="ma-1" color="info" text-color="white">
                        {{ selectedFloorName }}
                      </v-chip>
                      <v-chip v-if="selectedSectionName" small class="ma-1" color="warning" text-color="white">
                        {{ selectedSectionName }}
                      </v-chip>
                      <v-chip v-if="newStall.location" small class="ma-1" color="secondary" text-color="white">
                        {{ newStall.location }}
                      </v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn text class="cancel-btn" @click="closeModal" :disabled="loading">
            Cancel
          </v-btn>
          <v-btn class="add-btn" @click="submitForm" :loading="loading" :disabled="!valid || !isFormValid">
            <v-icon left>mdi-content-save</v-icon>
            Add Stall
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Popup Modal -->
    <v-dialog v-model="showSuccessPopup" max-width="400px" persistent @click:outside="closeSuccessPopup">
      <v-card class="success-popup-card">
        <div class="popup-content">
          <!-- Close Button -->
          <v-btn icon class="close-btn" @click="closeSuccessPopup">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>

          <!-- Loading State -->
          <div v-if="popupState === 'loading'" class="popup-state">
            <div class="loading-spinner">
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
            </div>
            <p class="popup-text">Adding stall...</p>
          </div>

          <!-- Success State -->
          <div v-else-if="popupState === 'success'" class="popup-state">
            <div class="success-icon">
              <div class="checkmark-circle">
                <div class="checkmark"></div>
              </div>
            </div>
            <h3 class="success-title">Success!</h3>
            <p class="popup-text">{{ successMessage }}</p>
          </div>
        </div>
      </v-card>
    </v-dialog>

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
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab color="primary" class="add-stall-btn" :class="{ 'glow-effect': !showModal }"
            @click="openAddStallModal" v-bind="attrs" v-on="on">
            <div class="ripple-overlay"></div>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Add New Stall</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script src="../Add/AddAvailableStall.js"></script>
<style scoped src="../Add/AddAvailableStall.css"></style>