<template>
    <div class="search-filter-container">
        <div class="search-filter-section">
            <v-row>
                <!-- Search Bar -->
                <v-col cols="12" md="6">
                    <v-text-field v-model="searchQuery" label="Search stalls..." prepend-inner-icon="mdi-magnify"
                        variant="outlined" clearable hide-details class="search-field"
                        placeholder="Search by stall number, location, or description"></v-text-field>
                </v-col>

                <!-- Toggle Filters Button -->
                <v-col cols="12" md="6" class="d-flex align-center justify-end">
                    <v-btn color="primary" variant="outlined" @click="showFilters = !showFilters"
                        prepend-icon="mdi-filter">
                        Filters
                    </v-btn>
                </v-col>
            </v-row>

            <v-expand-transition>
                <div v-if="showFilters">
                    <v-row class="mt-2 align-center">
                        <!-- Floor Filter -->
                        <v-col cols="6" md="2">
                            <v-select v-model="selectedFloor" :items="floorOptions" label="Floor" variant="outlined"
                                clearable hide-details prepend-inner-icon="mdi-floor-plan"></v-select>
                        </v-col>

                        <!-- Section Filter -->
                        <v-col cols="6" md="2">
                            <v-select v-model="selectedSection" :items="sectionOptions" label="Section"
                                variant="outlined" clearable hide-details prepend-inner-icon="mdi-store"></v-select>
                        </v-col>

                        <!-- Location Filter -->
                        <v-col cols="6" md="2">
                            <v-select v-model="selectedLocation" :items="locationOptions" label="Location"
                                variant="outlined" clearable hide-details
                                prepend-inner-icon="mdi-map-marker"></v-select>
                        </v-col>

                        <!-- Price Type Filter -->
                        <v-col cols="6" md="2">
                            <v-select v-model="selectedPriceType" :items="priceTypeOptions" label="Price Type"
                                variant="outlined" clearable hide-details
                                prepend-inner-icon="mdi-currency-php"></v-select>
                        </v-col>

                        <!-- Clear Filters Button on the side -->
                        <v-col cols="6" md="2">
                            <v-btn color="secondary" variant="outlined" @click="clearAllFilters"
                                prepend-icon="mdi-filter-remove" class="clear-filters-btn">
                                Clear Filters
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>
            </v-expand-transition>
        </div>

        <!-- Results Info -->
        <div class="results-info mt-2">
            <v-chip variant="outlined">
                {{ resultCount }} stall{{ resultCount !== 1 ? 's' : '' }} found
            </v-chip>
        </div>
    </div>
</template>

<script src="../SearchAndFilter/SearchAndFilter.js"></script>
<style scoped src="../SearchAndFilter/SearchAndFilterStyle.css"></style>