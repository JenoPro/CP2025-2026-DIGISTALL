<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* ========================================== */
/* COMPREHENSIVE GLOBAL THEME SYSTEM */
/* ========================================== */

/* Light Theme Variables */
body.theme-light {
  /* Core Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --text-muted: #adb5bd;
  --border-color: #dee2e6;
  --divider-color: #e9ecef;

  /* Navigation */
  --sidebar-bg: #ffffff;
  --sidebar-text: #333333;
  --sidebar-border: #e0e0e0;
  --sidebar-hover: #f5f5f5;
  --sidebar-active: #e3f2fd;
  --header-bg: #ffffff;
  --header-text: #333333;
  --header-border: #e0e0e0;

  /* Cards & Containers */
  --card-bg: #ffffff;
  --card-border: #e0e0e0;
  --card-shadow: rgba(0, 0, 0, 0.1);

  /* Tables & Lists */
  --table-bg: #ffffff;
  --table-header-bg: #f8f9fa;
  --table-border: #e9ecef;
  --table-hover: #f8f9fa;
  --table-selected: #e3f2fd;
  --table-stripe: #fbfbfb;

  /* Forms */
  --input-bg: #ffffff;
  --input-border: #ced4da;
  --input-focus: #80bdff;
  --input-text: #495057;

  /* Primary Colors */
  --primary-color: #1976d2;
  --primary-light: #e3f2fd;

  /* Status Colors */
  --success-bg: #d4edda;
  --success-text: #155724;
  --warning-bg: #fff3cd;
  --warning-text: #856404;
  --error-bg: #f8d7da;
  --error-text: #721c24;
  --info-bg: #d1ecf1;
  --info-text: #0c5460;
}

/* Dark Theme Variables */
body.theme-dark {
  /* Core Colors */
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --bg-tertiary: #2c2c2c;
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --text-muted: #666666;
  --border-color: #333333;
  --divider-color: #2c2c2c;

  /* Navigation */
  --sidebar-bg: #1e1e1e;
  --sidebar-text: #ffffff;
  --sidebar-border: #333333;
  --sidebar-hover: #2c2c2c;
  --sidebar-active: #1976d2;
  --header-bg: #1e1e1e;
  --header-text: #ffffff;
  --header-border: #333333;

  /* Cards & Containers */
  --card-bg: #1e1e1e;
  --card-border: #333333;
  --card-shadow: rgba(0, 0, 0, 0.3);

  /* Tables & Lists */
  --table-bg: #2c2c2c;
  --table-header-bg: #3c3c3c;
  --table-border: #404040;
  --table-hover: #363636;
  --table-selected: #1976d2;
  --table-stripe: #2a2a2a;

  /* Forms */
  --input-bg: #2c2c2c;
  --input-border: #444444;
  --input-focus: #1976d2;
  --input-text: #ffffff;

  /* Primary Colors */
  --primary-color: #1976d2;
  --primary-light: #1565c0;

  /* Status Colors */
  --success-bg: #1b4332;
  --success-text: #4ade80;
  --warning-bg: #451a03;
  --warning-text: #fbbf24;
  --error-bg: #450a0a;
  --error-text: #f87171;
  --info-bg: #0c4a6e;
  --info-text: #38bdf8;
}

/* ========================================== */
/* GLOBAL COMPONENT THEMING */
/* ========================================== */

/* Base App Container */
.v-application {
  background-color: var(--bg-primary) !important;
  color: var(--text-primary) !important;
}

/* Navigation Components */
.v-navigation-drawer {
  background-color: var(--sidebar-bg) !important;
  color: var(--sidebar-text) !important;
  border-color: var(--sidebar-border) !important;
}

.v-app-bar {
  background-color: var(--header-bg) !important;
  color: var(--header-text) !important;
  border-color: var(--header-border) !important;
}

/* Sidebar Menu Items */
.v-list-item {
  color: var(--sidebar-text) !important;
}

.v-list-item:hover {
  background-color: var(--sidebar-hover) !important;
}

.v-list-item--active {
  background-color: var(--sidebar-active) !important;
}

.v-list-item-title {
  color: var(--sidebar-text) !important;
}

.v-list-item-subtitle {
  color: var(--text-secondary) !important;
}

/* Cards and Containers */
.v-card {
  background-color: var(--card-bg) !important;
  border-color: var(--card-border) !important;
  box-shadow: 0 2px 4px var(--card-shadow) !important;
}

.v-card-title {
  color: var(--text-primary) !important;
}

.v-card-subtitle {
  color: var(--text-secondary) !important;
}

.v-card-text {
  color: var(--text-primary) !important;
}

/* Main Content Area */
.v-main {
  background-color: var(--bg-primary) !important;
}

/* Tables */
.v-data-table {
  background-color: var(--table-bg) !important;
  color: var(--text-primary) !important;
}

.v-data-table__wrapper {
  background-color: var(--table-bg) !important;
}

.v-data-table-header {
  background-color: var(--table-header-bg) !important;
}

.v-data-table-header th {
  color: var(--text-primary) !important;
  border-bottom: 1px solid var(--table-border) !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  font-size: 12px !important;
  letter-spacing: 0.5px !important;
}

.v-data-table tbody tr {
  border-bottom: 1px solid var(--table-border) !important;
  transition: background-color 0.2s ease !important;
}

.v-data-table tbody tr:hover {
  background-color: var(--table-hover) !important;
}

.v-data-table tbody td {
  border-bottom: 1px solid var(--table-border) !important;
}

/* Only change text color for elements that specifically have black text */
.v-data-table tbody td.black-text {
  color: var(--text-primary) !important;
}

/* Table alternating rows for better readability */
.v-data-table tbody tr:nth-child(even) {
  background-color: var(--table-stripe) !important;
}

/* Forms and Inputs */
.v-text-field {
  background-color: var(--input-bg) !important;
}

.v-text-field .v-field__field {
  background-color: var(--input-bg) !important;
  color: var(--input-text) !important;
}

.v-text-field .v-field__outline {
  color: var(--input-border) !important;
}

.v-text-field--focused .v-field__outline {
  color: var(--input-focus) !important;
}

.v-text-field input {
  color: var(--input-text) !important;
}

.v-text-field label {
  color: var(--text-secondary) !important;
}

/* Select Fields */
.v-select {
  background-color: var(--input-bg) !important;
}

.v-select .v-field__field {
  background-color: var(--input-bg) !important;
  color: var(--input-text) !important;
}

.v-select .v-field__outline {
  color: var(--input-border) !important;
}

/* Select Dropdown Menu */
.v-list.v-select__content {
  background-color: var(--card-bg) !important;
  border: 1px solid var(--card-border) !important;
  box-shadow: 0 4px 12px var(--card-shadow) !important;
}

.v-list-item.v-list-item--one-line {
  background-color: var(--card-bg) !important;
  color: var(--text-primary) !important;
}

.v-list-item.v-list-item--one-line:hover {
  background-color: var(--table-hover) !important;
}

.v-list-item--active {
  background-color: var(--primary-light) !important;
  color: var(--primary-color) !important;
}

/* Menu and Overlay items */
.v-overlay .v-list {
  background-color: var(--card-bg) !important;
  border: 1px solid var(--card-border) !important;
  box-shadow: 0 4px 12px var(--card-shadow) !important;
}

.v-menu .v-list {
  background-color: var(--card-bg) !important;
  border: 1px solid var(--card-border) !important;
  box-shadow: 0 4px 12px var(--card-shadow) !important;
}

.v-menu .v-list-item {
  background-color: var(--card-bg) !important;
  color: var(--text-primary) !important;
}

.v-menu .v-list-item:hover {
  background-color: var(--table-hover) !important;
}

/* Buttons */
.v-btn {
  color: var(--text-primary) !important;
}

.v-btn--variant-text {
  color: var(--text-primary) !important;
}

.v-btn--variant-outlined {
  border-color: var(--border-color) !important;
  color: var(--text-primary) !important;
  background-color: var(--card-bg) !important;
}

.v-btn--variant-outlined:hover {
  background-color: var(--table-hover) !important;
}

.v-btn--variant-flat {
  background-color: var(--primary-color) !important;
  color: white !important;
}

/* Filter Button Specific Overrides */
.status-btn {
  background-color: var(--card-bg) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--card-border) !important;
}

.status-btn:hover {
  background-color: var(--table-hover) !important;
}

.status-btn.active,
.status-btn.v-btn--variant-flat {
  background-color: var(--primary-color) !important;
  color: white !important;
  border-color: var(--primary-color) !important;
}

/* Tabs */
.v-tabs {
  background-color: var(--bg-secondary) !important;
}

.v-tab {
  color: var(--text-secondary) !important;
}

.v-tab--selected {
  color: var(--text-primary) !important;
}

.v-tabs-window-item {
  background-color: var(--bg-primary) !important;
  color: var(--text-primary) !important;
}

/* Dialogs and Modals */
.v-dialog .v-card {
  background-color: var(--card-bg) !important;
}

.v-overlay__content {
  background-color: var(--card-bg) !important;
}

/* Dividers */
.v-divider {
  border-color: var(--divider-color) !important;
}

/* Lists */
.v-list {
  background-color: var(--bg-primary) !important;
}

.v-list-item {
  color: var(--text-primary) !important;
}

/* Chips */
.v-chip {
  background-color: var(--bg-tertiary) !important;
  color: var(--text-primary) !important;
}

/* Alerts */
.v-alert.v-alert--variant-tonal {
  background-color: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
}

/* Progress components */
.v-progress-circular,
.v-progress-linear {
  color: var(--text-primary) !important;
}

/* ========================================== */
/* ACCESSIBILITY & USER PREFERENCES */
/* ========================================== */

/* Font size classes for accessibility */
body.font-size-small {
  font-size: 14px;
}

body.font-size-medium {
  font-size: 16px;
}

body.font-size-large {
  font-size: 18px;
}

body.font-size-xl {
  font-size: 20px;
}

/* High contrast mode */
body.high-contrast {
  filter: contrast(150%);
}

/* Reduced motion */
body.reduced-motion * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

/* Compact mode */
body.compact-mode .v-btn {
  min-height: 32px !important;
}

body.compact-mode .v-text-field {
  margin-top: 8px !important;
  margin-bottom: 8px !important;
}

body.compact-mode .v-card {
  padding: 12px !important;
}

/* ========================================== */
/* COMPONENT-SPECIFIC OVERRIDES */
/* ========================================== */

/* Dashboard specific */
.dashboard-container {
  background-color: var(--bg-primary) !important;
}

.dashboard-card {
  background-color: var(--card-bg) !important;
  border: 1px solid var(--card-border) !important;
}

/* Stalls specific */
.stalls-container {
  background-color: var(--bg-primary) !important;
}

.stalls-table {
  background-color: var(--table-bg) !important;
}

/* Header components */
.app-header {
  background-color: var(--header-bg) !important;
  color: var(--header-text) !important;
  border-bottom: 1px solid var(--header-border) !important;
}

.app-header h1,
.app-header h2,
.app-header h3 {
  color: var(--header-text) !important;
}

/* Only change text that is specifically black to white in dark mode */
.text-black {
  color: #000000;
}

body.theme-dark .text-black {
  color: #ffffff !important;
}

/* For content that needs theme-aware text */
.theme-text {
  color: var(--text-primary) !important;
}

.theme-text-secondary {
  color: var(--text-secondary) !important;
}

.theme-text-muted {
  color: var(--text-muted) !important;
}
</style>
