export default {
  name: 'AuctionRecords',
  props: {
    stallId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      dialog: true,
      activeTab: 'all',
      headers: [
        { title: 'Full Name', key: 'fullName', align: 'start', sortable: true },
        { title: 'Address', key: 'address', align: 'start', sortable: true },
        { title: 'Status', key: 'status', align: 'center' },
        { title: 'Auction Date', key: 'auctionDate', align: 'center', sortable: true },
      ],
      auctionRecords: [],
      loading: false,
    }
  },
  computed: {
    filteredWinners() {
      return this.auctionRecords.filter((record) => record.status === 'Won')
    },
    filteredLosers() {
      return this.auctionRecords.filter((record) => record.status === 'Lost')
    },
  },
  methods: {
    closeDialog() {
      this.dialog = false
      this.$emit('close')
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    },
    async fetchAuctionRecords() {
      if (!this.stallId) return

      this.loading = true
      try {
        // Replace with your actual API call (soon to be implemented)
        // const response = await this.$axios.get(`/api/stalls/${this.stallId}/auction-history`);
        // this.auctionRecords = response.data;

        // Mock data for demonstration.
        this.auctionRecords = [
          {
            id: 1,
            fullName: 'Juan Dela Cruz',
            address: 'Barangay Concepcion Pequeña, Naga City',
            status: 'Won',
            auctionDate: '2025-06-10T09:30:00',
          },
          {
            id: 2,
            fullName: 'Maria Santos',
            address: 'Barangay Triangulo, Naga City',
            status: 'Lost',
            auctionDate: '2025-06-10T09:30:00',
          },
          {
            id: 3,
            fullName: 'Pedro Reyes',
            address: 'Barangay Sabang, Naga City',
            status: 'Lost',
            auctionDate: '2025-06-10T09:30:00',
          },
          {
            id: 4,
            fullName: 'Ana Lopez',
            address: 'Barangay Mabolo, Naga City',
            status: 'Won',
            auctionDate: '2025-05-15T14:00:00',
          },
          {
            id: 5,
            fullName: 'Carlos Mendoza',
            address: 'Barangay Bagumbayan Sur, Naga City',
            status: 'Lost',
            auctionDate: '2025-05-15T14:00:00',
          },
        ]
      } catch (error) {
        console.error('Error fetching auction records:', error)
        // Handle error (show notification, etc.)
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    this.fetchAuctionRecords()
  },
}
