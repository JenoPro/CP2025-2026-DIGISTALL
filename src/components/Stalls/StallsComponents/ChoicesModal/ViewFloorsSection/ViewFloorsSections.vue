<template>
    <div>
        <!-- View Floors & Sections Modal -->
        <v-dialog v-model="showModal" max-width="1000px" width="95vw" persistent scrollable>
            <v-card class="view-modal-card">
                <v-card-title class="view-modal-header">
                    <span>Floors & Sections Overview</span>
                    <v-btn icon rounded @click="closeModal" color="white">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text class="pa-0">
                    <!-- Search and Filter Bar -->
                    <div class="search-filter-bar pa-6 pb-4">
                        <v-row>
                            <v-col cols="12" md="8">
                                <v-text-field v-model="searchQuery" label="Search floors or sections..."
                                    prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" clearable
                                    hide-details />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-select v-model="selectedFilter" :items="filterOptions" label="Filter by"
                                    variant="outlined" density="compact" hide-details />
                            </v-col>
                        </v-row>
                    </div>

                    <!-- Content Area -->
                    <div class="content-area" style="max-height: 60vh; overflow-y: auto;">
                        <!-- Loading State -->
                        <div v-if="loading" class="loading-container pa-8">
                            <div class="text-center">
                                <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
                                <p class="mt-4 text-h6">Loading floors and sections...</p>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-else-if="filteredFloors.length === 0" class="empty-state pa-8">
                            <div class="text-center">
                                <v-icon size="120" color="grey lighten-1">mdi-domain-off</v-icon>
                                <h3 class="mt-4 mb-2">No Floors or Sections Found</h3>
                                <p class="text-body-1 grey--text">
                                    {{ searchQuery ? 'No results match your search criteria.' : 'You haven\'t created any floors or sections yet.' }}
                                </p>
                                <v-btn v-if="!searchQuery" color="primary" class="mt-4" @click="goToAddFloorSection">
                                    <v-icon left>mdi-plus</v-icon>
                                    Create First Floor
                                </v-btn>
                            </div>
                        </div>

                        <!-- Floors List -->
                        <div v-else class="floors-list pa-4">
                            <div v-for="floor in filteredFloors" :key="floor.id" class="floor-item mb-4">
                                <v-card class="floor-card" elevation="2">
                                    <v-card-title class="floor-header">
                                        <div class="d-flex align-center justify-space-between w-100">
                                            <div class="d-flex align-center">
                                                <v-icon color="primary" class="mr-3">mdi-domain</v-icon>
                                                <div>
                                                    <h4>{{ floor.name }}</h4>
                                                    <p class="text-caption grey--text mb-0">
                                                        {{ floor.sections?.length || 0 }} sections
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="floor-actions">
                                                <v-btn icon size="small" @click="toggleFloorExpansion(floor.id)"
                                                    :color="expandedFloors.includes(floor.id) ? 'primary' : 'grey'">
                                                    <v-icon>
                                                        {{ expandedFloors.includes(floor.id) ? 'mdi-chevron-up' :
                                                            'mdi-chevron-down' }}
                                                    </v-icon>
                                                </v-btn>
                                            </div>
                                        </div>
                                    </v-card-title>

                                    <!-- Sections List (Expandable) -->
                                    <v-expand-transition>
                                        <div v-show="expandedFloors.includes(floor.id)" class="sections-container">
                                            <v-divider></v-divider>
                                            <div v-if="floor.sections && floor.sections.length > 0"
                                                class="sections-list pa-4">
                                                <h5 class="mb-3 text-subtitle-1">Sections:</h5>
                                                <v-row dense>
                                                    <v-col v-for="section in floor.sections" :key="section.id" cols="12"
                                                        sm="6" md="4">
                                                        <v-card class="section-card" variant="outlined">
                                                            <v-card-text class="pa-3">
                                                                <div class="d-flex align-center">
                                                                    <v-icon color="primary"
                                                                        class="mr-2">mdi-view-grid</v-icon>
                                                                    <div>
                                                                        <p class="font-weight-medium mb-1">{{
                                                                            section.name }}</p>
                                                                        <p class="text-caption grey--text mb-0">
                                                                            {{ section.stall_count || 0 }} stalls
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </v-card-text>
                                                        </v-card>
                                                    </v-col>
                                                </v-row>
                                            </div>
                                            <div v-else class="no-sections pa-4">
                                                <p class="text-center grey--text">No sections in this floor yet.</p>
                                            </div>
                                        </div>
                                    </v-expand-transition>
                                </v-card>
                            </div>
                        </div>
                    </div>
                </v-card-text>

                <v-card-actions class="pa-6">
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="outlined" @click="closeModal">
                        Close
                    </v-btn>
                    <v-btn color="primary" @click="goToAddFloorSection">
                        <v-icon left>mdi-plus</v-icon>
                        Add New
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script src="./ViewFloorsSections.js"></script>
<style scoped src="./ViewFloorsSections.css"></style>
