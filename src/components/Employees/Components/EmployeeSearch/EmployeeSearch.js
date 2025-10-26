export default {
  name: 'EmployeeSearch',
  props: {
    search: String,
    statusFilter: String,
    permissionFilter: String,
    permissionOptions: Array
  },
  emits: ['update:search', 'update:statusFilter', 'update:permissionFilter', 'reset'],
  data() {
    return {
      showFilterPanel: false,
      statusOptions: [
        { title: 'All Status', value: null },
        { title: 'Active', value: 'active' },
        { title: 'Inactive', value: 'inactive' }
      ]
    }
  },
  methods: {
    toggleFilter() {
      this.showFilterPanel = !this.showFilterPanel;
    }
  },
  mounted() {
    // Close filter panel when clicking outside
    document.addEventListener('click', (e) => {
      if (this.$refs.filterContainer && !this.$refs.filterContainer.contains(e.target)) {
        this.showFilterPanel = false;
      }
    });
  }
}
