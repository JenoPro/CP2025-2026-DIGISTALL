<template>
  <v-dialog v-model="showModal" max-width="800px" persistent>
    <v-card>
      <!-- Modal Header -->
      <v-card-title class="d-flex flex-column align-start justify-space-between">
        <div class="d-flex align-center w-100 justify-space-between">
          <div class="d-flex align-center">
            <v-icon color="ffffff" class="me-3">mdi-pencil</v-icon>
            <span class="text-h6">Modify Stall</span>
          </div>
          <v-btn icon variant="text" @click="handleClose" size="small">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <!-- Subtitle / Description -->
        <span class="text-subtitle-2" style="color: white">
          You can modify the current stall — edit details or delete it as needed.
        </span>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Modal Body -->
      <v-card-text class="pa-6">
        <v-form ref="editForm" v-model="valid" lazy-validation>
          <v-row>
            <!-- Left Column -->
            <v-col cols="12" md="6">
              <!-- Stall Number -->
              <v-text-field v-model="editForm.stallNumber" label="Stall Number" :rules="rules.stallNumber" required
                variant="outlined" prepend-inner-icon="mdi-numeric"></v-text-field>

              <!-- Price -->
              <v-text-field v-model="editForm.price" label="Price" :rules="rules.price" required variant="outlined"
                prepend-inner-icon="mdi-currency-php" placeholder="1,500 Php / Raffle"></v-text-field>

              <!-- Floor -->
              <v-select v-model="editForm.floor" label="Floor" :items="getFloorOptions()" :rules="rules.floor" required
                variant="outlined" prepend-inner-icon="mdi-floor-plan"></v-select>

              <!-- Section -->
              <v-select v-model="editForm.section" label="Section" :items="getSectionOptions()" :rules="rules.section"
                required variant="outlined" prepend-inner-icon="mdi-store"></v-select>

              <!-- Dimensions -->
              <v-text-field v-model="editForm.dimensions" label="Dimensions" :rules="rules.dimensions" required
                variant="outlined" prepend-inner-icon="mdi-ruler" placeholder="3x3 meters"></v-text-field>
            </v-col>

            <!-- Right Column -->
            <v-col cols="12" md="6">
              <!-- Location -->
              <v-select v-model="editForm.location" label="Location" :items="getLocationOptions()"
                :rules="rules.location" required variant="outlined" prepend-inner-icon="mdi-map-marker"></v-select>

              <!-- Description -->
              <v-textarea v-model="editForm.description" label="Description" :rules="rules.description" required
                variant="outlined" prepend-inner-icon="mdi-text" rows="3" counter="200" maxlength="200"></v-textarea>

              <!-- Image Upload -->
              <v-file-input v-model="selectedImageFile" label="Upload Stall Image" variant="outlined"
                prepend-inner-icon="mdi-camera" accept="image/*" @change="handleImageUpload" :rules="imageRules"
                show-size counter>
                <template v-slot:selection="{ fileNames }">
                  <template v-for="fileName in fileNames" :key="fileName">
                    <v-chip size="small" color="primary" class="me-2">
                      {{ fileName }}
                    </v-chip>
                  </template>
                </template>
              </v-file-input>

              <!-- Image Preview -->
              <div v-if="imagePreview" class="mt-3">
                <v-card class="image-preview" elevation="2">
                  <v-img :src="imagePreview" height="150" cover class="rounded">
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                      </div>
                    </template>
                    <template v-slot:error>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-icon color="error" size="48">mdi-image-broken</v-icon>
                      </div>
                    </template>
                  </v-img>

                  <!-- Remove Image Button -->
                  <v-card-actions class="pa-2">
                    <v-spacer></v-spacer>
                    <v-btn size="small" color="error" variant="text" @click="removeImage">
                      <v-icon size="small">mdi-delete</v-icon>
                      Remove
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </div>

              <!-- Current Image (if editing existing stall) -->
              <div v-else-if="editForm.image && !selectedImageFile" class="mt-3">
                <p class="text-caption text-grey-darken-1 mb-2">Current Image:</p>
                <v-card class="image-preview" elevation="2">
                  <v-img :src="editForm.image" height="150" cover class="rounded">
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                      </div>
                    </template>
                    <template v-slot:error>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-icon color="error" size="48">mdi-image-broken</v-icon>
                      </div>
                    </template>
                  </v-img>
                </v-card>
                <p class="text-caption text-grey mt-1">
                  Upload a new image to replace the current one
                </p>
              </div>

              <!-- Availability Toggle -->
              <v-switch v-model="editForm.isAvailable" label="Available for Rent" color="success" inset
                class="mt-3"></v-switch>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <!-- Modal Footer -->
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <!-- Delete Button (Left Side) -->
        <v-btn class="delete-btn" @click="handleDelete" :disabled="loading">
          <v-icon left>mdi-delete</v-icon>
          Delete Stall
        </v-btn>

        <v-spacer></v-spacer>

        <!-- Cancel and Save Buttons (Right Side) -->
        <v-btn variant="text" color="grey-darken-1" @click="handleClose" :disabled="loading">
          Cancel
        </v-btn>

        <v-btn color="primary" variant="elevated" @click="handleSave" :loading="loading" class="ml-2">
          <v-icon left>mdi-content-save</v-icon>
          Update Stall
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteConfirm" max-width="400px" persistent>
      <v-card>
        <v-card-title class="d-flex align-center text-error">
          <span class="text-h6">Delete Stall</span>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="py-4">
          <p class="text-body-1 mb-3">
            Are you sure you want to delete <strong>{{ editForm.stallNumber }}</strong>?
          </p>

          <v-alert color="error" variant="tonal" density="compact" class="text-caption">
            This action cannot be undone. All associated data will be permanently removed.
          </v-alert>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>

          <v-btn variant="text" color="grey-darken-1" @click="cancelDelete" :disabled="deleteLoading">
            Cancel
          </v-btn>

          <v-btn color="error" variant="elevated" @click="confirmDelete" :loading="deleteLoading" class="ml-2">
            <v-icon left>mdi-delete</v-icon>
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading Overlay -->
    <v-overlay v-if="loading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
  </v-dialog>

  <!-- Success Popup Modal -->
  <v-dialog v-model="showSuccessPopup" max-width="400px" persistent>
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
          <p class="popup-text">Processing...</p>
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
</template>

<script src="./EditStall.js"></script>
<style scoped src="../Edit/EditStall.css"></style>
