<template>
  <v-card elevation="2">
    <v-card-title>
      <div class="d-flex justify-between align-center w-100">
        <h3>All Branches</h3>
      </div>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="branches"
      :loading="loading"
      loading-text="Loading branches..."
      no-data-text="No branches found"
      class="elevation-0"
    >
      <!-- Status Column -->
      <template v-slot:[`item.status`]="{ item }">
        <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
          {{ item.status }}
        </v-chip>
      </template>

      <!-- Manager Status Column -->
      <template v-slot:[`item.manager_status`]="{ item }">
        <div class="d-flex align-center">
          <v-icon
            :color="item.manager_name ? 'success' : 'warning'"
            size="small"
            class="mr-2"
          >
            {{ item.manager_name ? "mdi-check-circle" : "mdi-account-question" }}
          </v-icon>
          <span v-if="item.manager_name" class="text-success">
            {{ item.manager_name }}
          </span>
          <span v-else class="text-warning"> Not Assigned </span>
        </div>
      </template>

      <!-- Actions Column -->
      <template v-slot:[`item.actions`]="{ item }">
        <div class="d-flex gap-1">
          <v-btn
            icon
            size="small"
            color="primary"
            variant="text"
            @click="$emit('assign-manager', item)"
          >
            <v-icon>mdi-account-plus</v-icon>
            <v-tooltip activator="parent" location="top">
              {{ item.manager_name ? "Change Manager" : "Assign Manager" }}
            </v-tooltip>
          </v-btn>

          <v-btn
            icon
            size="small"
            color="info"
            variant="text"
            @click="$emit('edit-branch', item)"
          >
            <v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="top"> Edit Branch </v-tooltip>
          </v-btn>

          <v-btn
            icon
            size="small"
            color="error"
            variant="text"
            @click="$emit('delete-branch', item)"
          >
            <v-icon>mdi-delete</v-icon>
            <v-tooltip activator="parent" location="top"> Delete Branch </v-tooltip>
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "BranchList",
  props: {
    branches: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["refresh", "assign-manager", "edit-branch", "delete-branch"],
  data() {
    return {
      headers: [
        {
          title: "Branch Name",
          key: "branch_name",
          sortable: true,
        },
        {
          title: "Area",
          key: "area",
          sortable: true,
        },
        {
          title: "Location",
          key: "location",
          sortable: true,
        },
        {
          title: "Status",
          key: "status",
          sortable: true,
        },
        {
          title: "Manager",
          key: "manager_status",
          sortable: false,
        },
        {
          title: "Contact",
          key: "contact_number",
          sortable: false,
        },
        {
          title: "Actions",
          key: "actions",
          sortable: false,
          align: "center",
        },
      ],
    };
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case "Active":
          return "success";
        case "Inactive":
          return "error";
        case "Under Construction":
          return "warning";
        case "Maintenance":
          return "info";
        default:
          return "grey";
      }
    },
  },
};
</script>

<style scoped>
.v-data-table {
  border-radius: 0 0 12px 12px;
}

.gap-1 {
  gap: 4px;
}

.text-success {
  color: #4caf50;
}

.text-warning {
  color: #ff9800;
}
</style>
