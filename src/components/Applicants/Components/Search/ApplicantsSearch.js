export default {
  name: 'ApplicantsSearchFilter',
  emits: ['search', 'filter'],
  data() {
    return {
      searchQuery: '',
      showFilterPanel: false,
      selectedStatus: 'All',
      statusOptions: [
        { title: 'All', value: 'All' },
        { title: 'Pending', value: 'Pending' },
        { title: 'Accepted', value: 'Accepted' },
        { title: 'Rejected', value: 'Rejected' },
      ],
      searchTimeout: null,
    }
  },
  computed: {
    hasActiveFilters() {
      return this.selectedStatus !== 'All' || this.searchQuery.trim() !== ''
    },
  },
  watch: {
    // Watch for search query changes for real-time search
    searchQuery: {
      handler() {
        this.onSearchInput()
      },
      immediate: false,
    },
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleOutsideClick)
    document.addEventListener('keydown', this.handleKeyDown)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
    document.removeEventListener('keydown', this.handleKeyDown)

    // Clear any pending search timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  },
  methods: {
    onSearchInput() {
      // Clear previous timeout to debounce search
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      // Debounce search to avoid too many emissions (reduced to 150ms for more responsive feel)
      this.searchTimeout = setTimeout(() => {
        this.$emit('search', this.searchQuery.trim())
      }, 150)
    },
    toggleFilter() {
      this.showFilterPanel = !this.showFilterPanel
    },
    selectStatus(status) {
      this.selectedStatus = status
      console.log('Status selected:', status)
    },
    applyFilters() {
      const filters = {
        status: this.selectedStatus === 'All' ? null : this.selectedStatus,
        search: this.searchQuery.trim() || null,
      }

      console.log('Applying filters:', filters)
      this.$emit('filter', filters)
      this.showFilterPanel = false
    },
    clearFilters() {
      this.selectedStatus = 'All'
      this.searchQuery = ''

      const filters = {
        status: null,
        search: null,
      }

      console.log('Clearing filters')
      this.$emit('filter', filters)
      this.$emit('search', '')
    },
    handleOutsideClick(event) {
      if (this.$refs.filterContainer && !this.$refs.filterContainer.contains(event.target)) {
        this.showFilterPanel = false
      }
    },
    handleKeyDown(event) {
      // Close on Escape key
      if (event.key === 'Escape' && this.showFilterPanel) {
        this.showFilterPanel = false
      }
    },
  },
}
