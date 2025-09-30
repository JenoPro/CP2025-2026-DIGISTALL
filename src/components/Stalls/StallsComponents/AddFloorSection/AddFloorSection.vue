<template>
    <div>
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

        <!-- Add Floor/Section Modal -->
        <v-dialog v-model="showModal" max-width="700px" width="95vw" persistent>
            <v-card>
                <v-card-title>
                    <span>Add Floor and Section</span>
                    <v-btn icon class="icon" @click="closeModal" color="white">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text class="pa-6">
                    <v-tabs v-model="activeTab" color="primary" align-tabs="center">
                        <v-tab value="floor">Add Floor</v-tab>
                        <v-tab value="section">Add Section</v-tab>
                    </v-tabs>

                    <v-window v-model="activeTab">
                        <!-- Add Floor Tab -->
                        <v-window-item value="floor">
                            <v-form ref="floorForm" v-model="floorFormValid" class="mt-4">
                                <v-row dense>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="newFloor.floorNumber"
                                            :rules="[rules.required, rules.floorNumber]" label="Floor Number"
                                            placeholder="e.g., 1, 2, 3, G, B1" prepend-icon="mdi-stairs" outlined dense
                                            persistent-hint hint="Enter floor number or identifier" />
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="newFloor.floorName" :rules="[rules.required]"
                                            label="Floor Name" placeholder="e.g., Ground Floor, First Floor"
                                            prepend-icon="mdi-label" outlined dense persistent-hint
                                            hint="Enter descriptive floor name" />
                                    </v-col>

                                    <v-col cols="12">
                                        <v-select v-model="newFloor.status" :items="statusOptions" label="Floor Status"
                                            prepend-icon="mdi-check-circle" outlined dense persistent-hint
                                            hint="Set the current status of the floor" />
                                    </v-col>
                                </v-row>

                                <v-card-actions class="px-0 pt-4">
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" @click="submitFloor" :loading="loading"
                                        :disabled="!floorFormValid">
                                        <v-icon left>mdi-content-save</v-icon>
                                        Add Floor
                                    </v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-window-item>

                        <!-- Add Section Tab -->
                        <v-window-item value="section">
                            <v-form ref="sectionForm" v-model="sectionFormValid" class="mt-4">
                                <v-row dense>
                                    <v-col cols="12" sm="6">
                                        <v-select v-model="newSection.floorId" :items="floorOptions"
                                            label="Select Floor (Optional)" prepend-icon="mdi-stairs" outlined dense
                                            persistent-hint hint="Choose the floor for this section (optional)"
                                            clearable />
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="newSection.sectionName" :rules="[rules.required]"
                                            label="Section Name"
                                            placeholder="e.g., North Wing, Food Court, Entrance Area"
                                            prepend-icon="mdi-view-grid" outlined dense persistent-hint
                                            hint="Enter descriptive section name" />
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-select v-model="newSection.status" :items="statusOptions"
                                            label="Section Status" prepend-icon="mdi-check-circle" outlined dense
                                            persistent-hint hint="Set the current status of the section" />
                                    </v-col>
                                </v-row>

                                <v-card-actions class="px-0 pt-4">
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" @click="submitSection" :loading="loading"
                                        :disabled="!sectionFormValid">
                                        <v-icon left>mdi-content-save</v-icon>
                                        Add Section
                                    </v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-window-item>
                    </v-window>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script src="./AddFloorSection.js"></script>
<style scoped src="./AddFloorSection.css"></style>
