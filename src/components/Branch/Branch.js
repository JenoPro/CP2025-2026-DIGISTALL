import axios from 'axios'
import BranchList from './Components/BranchList/BranchList.vue'
import AddBranchDialog from './Components/AddBranch/AddBranchDialog.vue'
import AssignManagerDialog from './Components/AssignManager/AssignManagerDialog.vue'

export default {
  name: 'BranchManagement',
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
      snackbarMessage: '',
      snackbarColor: 'success',
    }
  },
  computed: {
    activeBranches() {
      return this.branches.filter(
        (branch) => branch.status === 'Active' || branch.status === 'active',
      ).length
    },
    managedBranches() {
      return this.branches.filter((branch) => {
        // Check multiple possible field names and values for managed branches
        return (
          branch.manager_assigned === true ||
          branch.manager_assigned === 1 ||
          branch.manager_assigned === '1' ||
          branch.manager_name ||
          branch.manager_id ||
          (branch.manager && branch.manager !== null)
        )
      }).length
    },
    unmanagedBranches() {
      return this.branches.filter((branch) => {
        // Only count branches that truly have NO manager assigned
        // A branch needs a manager if ALL manager indicators are empty/null/false
        const hasNoManagerAssigned =
          branch.manager_assigned === false ||
          branch.manager_assigned === 0 ||
          branch.manager_assigned === '0' ||
          branch.manager_assigned === null ||
          branch.manager_assigned === undefined

        const hasNoManagerName =
          !branch.manager_name ||
          branch.manager_name === null ||
          branch.manager_name === undefined ||
          branch.manager_name.trim() === ''

        const hasNoManagerId =
          !branch.manager_id || branch.manager_id === null || branch.manager_id === undefined

        const hasNoManager =
          !branch.manager || branch.manager === null || branch.manager === undefined

        // Branch needs manager only if ALL manager fields are empty
        return hasNoManagerAssigned && hasNoManagerName && hasNoManagerId && hasNoManager
      }).length
    },
  },
  async mounted() {
    await this.loadBranches()
  },
  methods: {
    async loadBranches() {
      this.loading = true
      try {
        const response = await axios.get('http://localhost:3001/api/admin/branches', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        })

        if (response.data && response.data.success) {
          this.branches = response.data.data || []
          console.log('✅ Branch data loaded from backend:', this.branches)

          // Debug: Log each branch's manager-related fields
          this.branches.forEach((branch, index) => {
            console.log(`Branch ${index + 1} (${branch.branch_name}):`, {
              manager_assigned: branch.manager_assigned,
              manager_name: branch.manager_name,
              manager_id: branch.manager_id,
              manager: branch.manager,
              status: branch.status,
            })
          })
        } else {
          this.branches = []
          console.warn('⚠️ No branch data returned from backend')
        }
      } catch (error) {
        console.error('Error loading branches:', error)
        this.showNotification('Error loading branches', 'error')
      } finally {
        this.loading = false
      }
    },

    onBranchCreated(newBranch) {
      this.branches.unshift(newBranch)
      this.showAddBranchDialog = false
      this.showNotification('Branch created successfully!', 'success')
    },

    openAssignManagerDialog(branch) {
      this.selectedBranch = branch
      this.showAssignManagerDialog = true
    },

    onManagerAssigned(updatedBranch) {
      const index = this.branches.findIndex((b) => b.branch_id === updatedBranch.branch_id)
      if (index !== -1) {
        this.branches.splice(index, 1, updatedBranch)
      }
      this.showAssignManagerDialog = false
      this.showNotification('Manager assigned successfully!', 'success')
    },

    editBranch(branch) {
      // TODO: Implement edit functionality
      console.log('Edit branch:', branch)
      this.showNotification('Edit functionality coming soon', 'info')
    },

    async deleteBranch(branch) {
      if (confirm(`Are you sure you want to delete "${branch.branch_name}"?`)) {
        try {
          await axios.delete(`http://localhost:3001/api/admin/branches/${branch.branch_id}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
            },
          })

          this.branches = this.branches.filter((b) => b.branch_id !== branch.branch_id)
          this.showNotification('Branch deleted successfully!', 'success')
        } catch (error) {
          console.error('Error deleting branch:', error)
          this.showNotification('Error deleting branch', 'error')
        }
      }
    },

    showNotification(message, color = 'success') {
      this.snackbarMessage = message
      this.snackbarColor = color
      this.showSnackbar = true
    },
  },
}
