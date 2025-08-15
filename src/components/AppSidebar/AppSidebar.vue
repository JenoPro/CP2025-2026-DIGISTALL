<!-- components/AppSidebar.vue -->
<template>
  <div>
    <!-- Collapsed Sidebar -->
    <v-navigation-drawer
      fixed
      permanent
      :width="isExpanded ? 250 : 80"
      class="sidebar"
      @mouseenter="isExpanded = true"
      @mouseleave="isExpanded = false"
    >
      <!-- Logo Section -->
      <div class="logo-section" @click="toggleSidebar">
        <div class="logo-container">
          <img src="../../assets/food-stand.png" alt="Logo" class="logo-icon" />
          <div v-if="isExpanded" class="logo-text">
            <h3>Naga Stall</h3>
          </div>
        </div>
      </div>

      <v-divider class="my-2"></v-divider>

      <!-- Activity Section -->
      <div v-if="isExpanded" class="section-title">Activity</div>

      <!-- Menu Items -->
      <v-list class="pa-0">
        <v-list-item
          v-for="item in menuItems"
          :key="item.id"
          class="sidebar-item"
          :class="{ active: isActiveRoute(item.route), collapsed: !isExpanded }"
          @click="setActiveItem(item.id, item.route)"
        >
          <v-tooltip right :disabled="isExpanded">
            <template v-slot:activator="{ on, attrs }">
              <div class="item-container" v-bind="attrs" v-on="on">
                <v-list-item-icon class="sidebar-icon">
                  <v-icon :color="isActiveRoute(item.route) ? 'white' : 'dark'">{{
                    item.icon
                  }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content v-if="isExpanded">
                  <v-list-item-title class="sidebar-text">{{
                    item.name
                  }}</v-list-item-title>
                </v-list-item-content>
              </div>
            </template>
            <span>{{ item.name }}</span>
          </v-tooltip>
        </v-list-item>

        <!-- More Section -->
        <v-list-item
          v-if="isExpanded"
          class="sidebar-item more-item"
          :class="{ active: showMoreItems }"
          @click="toggleMoreItems"
        >
          <div class="item-container">
            <v-list-item-icon class="sidebar-icon">
              <v-icon
                :class="{ 'rotate-180': showMoreItems }"
                :color="showMoreItems ? 'white' : 'dark'"
              >
                mdi-chevron-down
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="sidebar-text">{{
                showMoreItems ? "Less" : "More"
              }}</v-list-item-title>
            </v-list-item-content>
          </div>
        </v-list-item>

        <!-- Additional Items (when More is expanded) -->
        <div v-if="isExpanded && showMoreItems" class="more-items">
          <v-list-item
            v-for="item in moreItems"
            :key="item.id"
            class="sidebar-item sub-item"
            :class="{ active: isActiveRoute(item.route) }"
            @click="setActiveItem(item.id, item.route)"
          >
            <div class="item-container">
              <v-list-item-icon class="sidebar-icon">
                <v-icon :color="isActiveRoute(item.route) ? 'white' : 'dark'">{{
                  item.icon
                }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="sidebar-text">{{
                  item.name
                }}</v-list-item-title>
              </v-list-item-content>
            </div>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script src="./AppSidebar.js"></script>
<style scoped src="./AppSidebar.css"></style>
