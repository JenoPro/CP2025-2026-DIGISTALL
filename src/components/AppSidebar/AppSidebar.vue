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
          <img src="../../assets/DigiStall-Logo.png" alt="Logo" class="logo-icon" />
          <div v-if="isExpanded" class="logo-text">
            <h3>Digi Stall</h3>
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
              <div class="item-container" v-bind="attrs" v-on="on || {}">
                <v-icon 
                  class="sidebar-icon mr-3"
                  :color="isActiveRoute(item.route) ? 'white' : 'dark'"
                >
                  {{ item.icon }}
                </v-icon>
                <span v-if="isExpanded" class="sidebar-text">
                  {{ item.name }}
                </span>
              </div>
            </template>
            <span>{{ item.name }}</span>
          </v-tooltip>
        </v-list-item>

        <!-- More Section - Show only for branch managers -->
        <v-list-item
          v-if="isExpanded && !isAdmin && !isEmployee"
          class="sidebar-item more-item"
          :class="{ active: showMoreItems }"
          @click="toggleMoreItems"
        >
          <div class="item-container">
            <v-icon
              class="sidebar-icon mr-3"
              :class="{ 'rotate-180': showMoreItems }"
              :color="showMoreItems ? 'white' : 'dark'"
            >
              mdi-chevron-down
            </v-icon>
            <span class="sidebar-text">{{
              showMoreItems ? "Less" : "More"
            }}</span>
          </div>
        </v-list-item>

        <!-- Additional Items (when More is expanded) - Show only for branch managers -->
        <div v-if="isExpanded && showMoreItems && !isAdmin && !isEmployee" class="more-items">
          <div v-for="item in filteredMoreItems" :key="item.id">
            <!-- Regular menu item or item with submenu -->
            <v-list-item
              class="sidebar-item sub-item"
              :class="{
                active: isActiveRoute(item.route),
                'has-submenu': item.hasSubMenu && item.id === 9,
                'submenu-expanded': item.hasSubMenu && item.id === 9 && showStallsSubMenu,
              }"
              @click="setActiveItem(item.id, item.route, item.hasSubMenu)"
            >
              <div class="item-container">
                <v-icon 
                  class="sidebar-icon mr-3" 
                  :color="isActiveRoute(item.route) ? 'white' : 'dark'"
                >
                  {{ item.icon }}
                </v-icon>
                <span class="sidebar-text">
                  {{ item.name }}
                </span>
                <!-- Submenu indicator for Stalls - Only show if there are raffle/auction stalls -->
                <v-icon
                  v-if="
                    item.hasSubMenu &&
                    item.id === 9 &&
                    (availableStallTypes.hasRaffles || availableStallTypes.hasAuctions)
                  "
                  class="submenu-arrow ml-auto"
                  small
                  :class="{ 'rotate-180': showStallsSubMenu }"
                  :color="isActiveRoute(item.route) ? 'white' : 'dark'"
                >
                  mdi-chevron-down
                </v-icon>
              </div>
            </v-list-item>

            <!-- Submenu items for Stalls -->
            <div
              v-if="item.hasSubMenu && item.id === 9 && showStallsSubMenu"
              class="stalls-submenu"
            >
              <v-list-item
                v-for="subItem in filteredStallSubItems"
                :key="subItem.id"
                class="sidebar-item sub-sub-item"
                :class="{ active: isActiveRoute(subItem.route) }"
                @click="setActiveItem(subItem.id, subItem.route)"
              >
                <div class="item-container">
                  <v-icon
                    class="sidebar-icon submenu-icon mr-3"
                    small
                    :color="isActiveRoute(subItem.route) ? 'white' : 'dark'"
                  >
                    {{ subItem.icon }}
                  </v-icon>
                  <span class="sidebar-text submenu-text">
                    {{ subItem.name }}
                  </span>
                </div>
              </v-list-item>
            </div>
          </div>
        </div>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script src="./AppSidebar.js"></script>
<style scoped src="./AppSidebar.css"></style>
