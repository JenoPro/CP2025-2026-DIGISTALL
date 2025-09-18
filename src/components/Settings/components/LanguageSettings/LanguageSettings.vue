<template>
  <v-container class="pa-6">
    <div class="language-settings">
      <!-- Language Header -->
      <div class="language-header mb-6">
        <h3 class="text-h5 font-weight-bold mb-2">Language Settings</h3>
        <p class="text-subtitle-2 text--secondary">
          Choose your preferred language for the entire system
        </p>
      </div>

      <!-- Language Selection -->
      <v-card elevation="2" class="mb-6">
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-3">mdi-translate</v-icon>
          Select Language
        </v-card-title>
        <v-card-text>
          <v-row>
            <!-- English -->
            <v-col cols="12" sm="6">
              <v-card
                :class="['language-card', { 'selected': currentLanguage === 'en' }]"
                @click="selectLanguage('en')"
                elevation="1"
              >
                <v-card-text class="text-center pa-6">
                  <div class="flag-container mb-3">
                    <div class="flag flag-us"></div>
                  </div>
                  <h4 class="text-h6 font-weight-bold">English</h4>
                  <p class="text-caption text--secondary">
                    Set English as your system language
                  </p>
                  <v-icon
                    v-if="currentLanguage === 'en'"
                    color="primary"
                    class="mt-2"
                    size="24"
                  >
                    mdi-check-circle
                  </v-icon>
                  <v-icon
                    v-else
                    color="grey"
                    class="mt-2"
                    size="24"
                  >
                    mdi-circle-outline
                  </v-icon>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Filipino -->
            <v-col cols="12" sm="6">
              <v-card
                :class="['language-card', { 'selected': currentLanguage === 'tl' }]"
                @click="selectLanguage('tl')"
                elevation="1"
              >
                <v-card-text class="text-center pa-6">
                  <div class="flag-container mb-3">
                    <div class="flag flag-ph"></div>
                  </div>
                  <h4 class="text-h6 font-weight-bold">Filipino</h4>
                  <p class="text-caption text--secondary">
                    Itakda ang Filipino bilang wika ng sistema
                  </p>
                  <v-icon
                    v-if="currentLanguage === 'tl'"
                    color="primary"
                    class="mt-2"
                    size="24"
                  >
                    mdi-check-circle
                  </v-icon>
                  <v-icon
                    v-else
                    color="grey"
                    class="mt-2"
                    size="24"
                  >
                    mdi-circle-outline
                  </v-icon>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Language Information -->
      <v-card elevation="2">
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-3">mdi-information</v-icon>
          Language Information
        </v-card-title>
        <v-card-text>
          <v-alert
            v-if="currentLanguage === 'en'"
            type="info"
            variant="tonal"
            class="mb-4"
          >
            <div class="d-flex align-center">
              <v-icon class="mr-3">mdi-check</v-icon>
              <div>
                <strong>English is currently selected</strong>
                <br />
                All system interfaces, messages, and content will be displayed in English.
              </div>
            </div>
          </v-alert>

          <v-alert
            v-if="currentLanguage === 'tl'"
            type="info"
            variant="tonal"
            class="mb-4"
          >
            <div class="d-flex align-center">
              <v-icon class="mr-3">mdi-check</v-icon>
              <div>
                <strong>Nakatakda ang Filipino</strong>
                <br />
                Ang lahat ng interface, mensahe, at nilalaman ng sistema ay magiging Filipino.
              </div>
            </div>
          </v-alert>

          <!-- Language Features -->
          <div class="language-features">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">
              {{ currentLanguage === 'en' ? 'What changes with language selection:' : 'Ano ang magbabago sa pagpili ng wika:' }}
            </h4>
            
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-menu</v-icon>
                </template>
                <v-list-item-title>
                  {{ currentLanguage === 'en' ? 'Navigation menus and labels' : 'Mga navigation menu at label' }}
                </v-list-item-title>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-form-textbox</v-icon>
                </template>
                <v-list-item-title>
                  {{ currentLanguage === 'en' ? 'Form fields and buttons' : 'Mga form field at button' }}
                </v-list-item-title>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-message-text</v-icon>
                </template>
                <v-list-item-title>
                  {{ currentLanguage === 'en' ? 'System messages and notifications' : 'Mga system message at notification' }}
                </v-list-item-title>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-help-circle</v-icon>
                </template>
                <v-list-item-title>
                  {{ currentLanguage === 'en' ? 'Help texts and tooltips' : 'Mga help text at tooltip' }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script src="./LanguageSettings.js"></script>
<style scoped src="./LanguageSettings.css"></style>