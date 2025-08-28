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
                                <v-text-field v-model="newStall.stallNumber" :rules="[rules.required]"
                                    label="Stall Number" placeholder="e.g., 01, 02, 03" prepend-icon="mdi-numeric"
                                    outlined dense persistent-hint
                                    hint="Enter stall number (will be formatted as STALL# XX)" />
                            </v-col>

                            <!-- Price -->
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="newStall.price" :rules="[rules.required]" label="Price"
                                    placeholder="e.g., 1,500 Php / Raffle" prepend-icon="mdi-currency-php" outlined
                                    dense persistent-hint hint="Include currency and type (Raffle/Auction)" />
                            </v-col>

                            <!-- Floor -->
                            <v-col cols="12" sm="6">
                                <v-select v-model="newStall.floor" :items="floorOptions" :rules="[rules.required]"
                                    label="Floor" prepend-icon="mdi-stairs" outlined dense />
                            </v-col>

                            <!-- Section -->
                            <v-col cols="12" sm="6">
                                <v-select v-model="newStall.section" :items="sectionOptions" :rules="[rules.required]"
                                    label="Section" prepend-icon="mdi-view-grid" outlined dense />
                            </v-col>

                            <!-- Dimensions -->
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="newStall.dimensions" :rules="[rules.required]" label="Dimensions"
                                    placeholder="e.g., 3x3 meters" prepend-icon="mdi-ruler" outlined dense />
                            </v-col>

                            <!-- Location -->
                            <v-col cols="12" sm="6">
                                <v-select v-model="newStall.location" :items="locationOptions" :rules="[rules.required]"
                                    label="Location" prepend-icon="mdi-map-marker" outlined dense />
                            </v-col>

                            <!-- Image Upload -->
                            <v-col cols="12" sm="12">
                                <v-file-input v-model="newStall.image" accept="image/*" label="Upload Stall Image"
                                    prepend-icon="mdi-image" outlined dense show-size truncate-length="25" />
                            </v-col>

                            <!-- Description -->
                            <v-col cols="12">
                                <v-textarea v-model="newStall.description" :rules="[rules.required]" label="Description"
                                    placeholder="Describe the stall features, location benefits, etc."
                                    prepend-icon="mdi-text" outlined rows="3" persistent-hint
                                    hint="Provide detailed description of the stall" />
                            </v-col>

                            <!-- Availability Status -->
                            <v-col cols="12">
                                <v-switch v-model="newStall.isAvailable" label="Available for Rent" color="success"
                                    inset />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>

                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn text class="cancel-btn" @click="closeModal" :disabled="loading">
                        Cancel
                    </v-btn>
                    <v-btn class="add-btn" @click="submitForm" :loading="loading" :disabled="!valid">
                        <v-icon left>mdi-content-save</v-icon>
                        Add Stall
                    </v-btn>
                </v-card-actions>
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
