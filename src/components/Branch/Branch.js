import axios from "axios";
import BranchList from "./Components/BranchList/BranchList.vue";
import AddBranchDialog from "./Components/AddBranch/AddBranchDialog.vue";
import AssignManagerDialog from "./Components/AssignManager/AssignManagerDialog.vue";

export default {
  name: "BranchManagement",
  components: {
    BranchList,
    AddBranchDialog,
    AssignManagerDialog,
  },
  data() {
    return {
      branches: [],
      loading: false,
      showAddBranchDialog: false,
      showAssignManagerDialog: false,
      selectedBranch: null,
      showSnackbar: false,
      snackbarMessage: "",
      snackbarColor: "success",
    };
  },
  computed: {
    activeBranches() {
      return this.branches.filter((branch) => branch.status === "Active").length;
    },
    managedBranches() {
      return this.branches.filter((branch) => branch.manager_assigned === true).length;
    },
    unmanagedBranches() {
      return this.branches.filter((branch) => branch.manager_assigned === false).length;
    },
  },
  async mounted() {
    await this.loadBranches();
  },
  methods: {
    async loadBranches() {
      this.loading = true;
      try {
        const response = await axios.get("http://localhost:3001/api/admin/branches", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        });

        if (response.data && response.data.success) {
          this.branches = response.data.data || [];
          console.log("✅ Branch data loaded from backend:", this.branches);
        } else {
          this.branches = [];
          console.warn("⚠️ No branch data returned from backend");
        }
      } catch (error) {
        console.error("Error loading branches:", error);
        this.showNotification("Error loading branches", "error");
      } finally {
        this.loading = false;
      }
    },

    onBranchCreated(newBranch) {
      this.branches.unshift(newBranch);
      this.showAddBranchDialog = false;
      this.showNotification("Branch created successfully!", "success");
    },

    openAssignManagerDialog(branch) {
      this.selectedBranch = branch;
      this.showAssignManagerDialog = true;
    },

    onManagerAssigned(updatedBranch) {
      const index = this.branches.findIndex(
        (b) => b.branch_id === updatedBranch.branch_id
      );
      if (index !== -1) {
        this.branches.splice(index, 1, updatedBranch);
      }
      this.showAssignManagerDialog = false;
      this.showNotification("Manager assigned successfully!", "success");
    },

    editBranch(branch) {
      // TODO: Implement edit functionality
      console.log("Edit branch:", branch);
      this.showNotification("Edit functionality coming soon", "info");
    },

    async deleteBranch(branch) {
      if (confirm(`Are you sure you want to delete "${branch.branch_name}"?`)) {
        try {
          await axios.delete(
            `http://localhost:3001/api/admin/branches/${branch.branch_id}`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
              },
            }
          );

          this.branches = this.branches.filter((b) => b.branch_id !== branch.branch_id);
          this.showNotification("Branch deleted successfully!", "success");
        } catch (error) {
          console.error("Error deleting branch:", error);
          this.showNotification("Error deleting branch", "error");
        }
      }
    },

    showNotification(message, color = "success") {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.showSnackbar = true;
    },
  },
};
