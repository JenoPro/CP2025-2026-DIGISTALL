<template>
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showModal" max-width="450px" persistent>
        <v-card>
            <v-card-title class="d-flex align-center text-error">
                <v-icon color="error" class="me-3">mdi-delete-alert</v-icon>
                <span class="text-h6">Delete Stall</span>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="py-4">
                <p class="text-body-1 mb-3">
                    Are you sure you want to delete <strong>{{ stallData.stallNumber || stallData.stall_number
                        }}</strong>?
                </p>

                <v-alert color="error" variant="tonal" density="compact" class="text-caption">
                    This action cannot be undone. All associated data will be permanently removed.
                </v-alert>

                <!-- Additional stall details for confirmation -->
                <div v-if="stallData" class="mt-3 pa-3 bg-grey-lighten-5 rounded">
                    <p class="text-caption text-grey-darken-1 mb-1">Stall Details:</p>
                    <p class="text-body-2"><strong>Location:</strong> {{ stallData.location }}</p>
                    <p class="text-body-2"><strong>Floor:</strong> {{ stallData.floor }}</p>
                    <p class="text-body-2"><strong>Section:</strong> {{ stallData.section }}</p>
                    <p class="text-body-2"><strong>Price:</strong> {{ formatPrice(stallData.price) }}</p>
                </div>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>

                <v-btn variant="text" color="grey-darken-1" @click="handleCancel" :disabled="loading">
                    Cancel
                </v-btn>

                <v-btn color="error" variant="elevated" @click="handleConfirmDelete" :loading="loading" class="ml-2">
                    <v-icon left>mdi-delete</v-icon>
                    Delete Stall
                </v-btn>
            </v-card-actions>
        </v-card>
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
                    <p class="popup-text">Deleting stall...</p>
                </div>

                <!-- Success State -->
                <div v-else-if="popupState === 'success'" class="popup-state">
                    <div class="success-icon">
                        <div class="checkmark-circle">
                            <div class="checkmark"></div>
                        </div>
                    </div>
                    <h3 class="success-title">Deleted!</h3>
                    <p class="popup-text">{{ successMessage }}</p>
                </div>
            </div>
        </v-card>
    </v-dialog>
</template>

<script src="./DeleteStall.js"></script>
<style scoped src="./DeleteStall.css"></style>
