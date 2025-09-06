<template>
    <v-dialog v-model="dialog" max-width="600px" persistent>
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="outlined" color="primary" size="small" class="register-btn"
                prepend-icon="mdi-account-plus">
                Register New Admin
            </v-btn>
        </template>

        <v-card class="register-modal">
            <v-card-title class="text-h6 pa-6 bg-primary text-white">
                <div>
                    <div class="d-flex align-center mb-2">
                        <v-icon class="me-3">mdi-account-plus</v-icon>
                        Register New Admin
                    </div>
                    <p class="text-body-2 mb-0 font-weight-light" style="opacity: 0.9;">
                        Please register and select the branch where your location is, then input all required fields to
                        proceed
                        and gain access to your admin dashboard.
                    </p>
                </div>
            </v-card-title>

            <v-card-text class="pa-6">
                <v-form ref="registerForm" v-model="valid" @submit.prevent="handleRegister">
                    <v-row>
                        <!-- City Selection -->
                        <v-col cols="12" md="6">
                            <v-select v-model="selectedCity" :items="availableCities" label="Select City / Location *"
                                :rules="cityRules" variant="outlined" prepend-inner-icon="mdi-city"
                                :loading="loadingCities" required @update:model-value="onCityChange">
                                <template v-slot:append-item>
                                    <v-divider class="mt-2"></v-divider>
                                    <v-list-item @click="showNewCityInput = !showNewCityInput">
                                        <v-list-item-title>
                                            <v-icon class="me-2">mdi-plus</v-icon>
                                            Add New City
                                        </v-list-item-title>
                                    </v-list-item>
                                </template>
                            </v-select>
                        </v-col>

                        <!-- New City Input (conditionally shown) -->
                        <v-col cols="12" v-if="showNewCityInput">
                            <v-text-field v-model="newCityName" label="New City Name *" :rules="newCityRules"
                                variant="outlined" prepend-inner-icon="mdi-city-variant"
                                placeholder="e.g., Iriga City, Camarines Sur" @blur="addNewCity"></v-text-field>
                        </v-col>

                        <!-- Branch Selection -->
                        <v-col cols="12" md="6">
                            <v-select v-model="selectedBranch" :items="availableBranches" label="Select Branch *"
                                :rules="branchRules" variant="outlined" prepend-inner-icon="mdi-domain"
                                :loading="loadingBranches" required :disabled="!selectedCity">
                                <template v-slot:append-item>
                                    <v-divider class="mt-2"></v-divider>
                                    <v-list-item @click="showNewBranchInput = !showNewBranchInput">
                                        <v-list-item-title>
                                            <v-icon class="me-2">mdi-plus</v-icon>
                                            Add New Branch
                                        </v-list-item-title>
                                    </v-list-item>
                                </template>
                            </v-select>
                        </v-col>

                        <!-- New Branch Input (conditionally shown) -->
                        <v-col cols="12" v-if="showNewBranchInput">
                            <v-text-field v-model="newBranchName" label="New Branch Name *" :rules="newBranchRules"
                                variant="outlined" prepend-inner-icon="mdi-office-building"
                                placeholder="e.g., Main Public Market, Central Plaza Market"
                                @blur="addNewBranch"></v-text-field>
                        </v-col>

                        <!-- Personal Information -->
                        <v-col cols="12" md="6">
                            <v-text-field v-model="firstName" label="First Name *" :rules="nameRules" variant="outlined"
                                prepend-inner-icon="mdi-account" required></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="lastName" label="Last Name *" :rules="nameRules" variant="outlined"
                                prepend-inner-icon="mdi-account" required></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field v-model="email" label="Email Address *" :rules="emailRules" variant="outlined"
                                prepend-inner-icon="mdi-email" type="email" required></v-text-field>
                        </v-col>

                        <!-- Login Credentials -->
                        <v-col cols="12">
                            <v-text-field v-model="username" label="Username *" :rules="usernameRules"
                                variant="outlined" prepend-inner-icon="mdi-account-circle" required></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="password" label="Password *"
                                :type="showPassword ? 'text' : 'password'" :rules="passwordRules" variant="outlined"
                                prepend-inner-icon="mdi-lock"
                                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="togglePasswordVisibility" required></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="confirmPassword" label="Confirm Password *"
                                :type="showConfirmPassword ? 'text' : 'password'" :rules="confirmPasswordRules"
                                variant="outlined" prepend-inner-icon="mdi-lock-check"
                                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="toggleConfirmPasswordVisibility" required></v-text-field>
                        </v-col>

                        <!-- Role Selection -->
                        <v-col cols="12">
                            <v-select v-model="role" :items="roleOptions" label="Role *" :rules="roleRules"
                                variant="outlined" prepend-inner-icon="mdi-shield-account" required></v-select>
                        </v-col>
                    </v-row>

                    <!-- Error Message Display -->
                    <v-alert v-if="errorMessage" type="error" density="compact" class="mt-4" closable
                        @click:close="clearError">
                        {{ errorMessage }}
                    </v-alert>

                    <!-- Success Message Display -->
                    <v-alert v-if="successMessage" type="success" density="compact" class="mt-4" closable
                        @click:close="clearSuccess">
                        {{ successMessage }}
                    </v-alert>
                </v-form>
            </v-card-text>

            <v-card-actions class="pa-6 pt-0">
                <v-spacer></v-spacer>
                <v-btn variant="outlined" @click="closeModal" :disabled="loading">
                    Cancel
                </v-btn>
                <v-btn color="primary" :loading="loading" :disabled="!valid" @click="handleRegister">
                    Register Admin
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src="./RegisterModal.js"></script>
<style scoped src="./RegisterModalStyles.css"></style>