export default {
  name: 'AuctionRecords',
  props: {
    stallId: {
      type: [String, Number],
      required: false,
      default: null,
    },
  },
  data() {
    return {
      dialog: true,
      activeTab: 'all',
      selectedStallId: this.stallId || null,
      headers: [
        { title: 'Full Name', key: 'fullName', align: 'start', sortable: true },
        { title: 'Address', key: 'address', align: 'start', sortable: true },
        { title: 'Status', key: 'status', align: 'center' },
        { title: 'Auction Date', key: 'auctionDate', align: 'center', sortable: true },
      ],
      auctionRecords: [],
      availableStalls: [],
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
    async fetchAvailableStalls() {
      try {
        // Replace with your actual API call (soon to be implemented)
        // const response = await this.$axios.get('/api/stalls');
        // this.availableStalls = response.data;

        // Mock data for available stalls
        this.availableStalls = [
          { id: 1, stallNumber: 'Stall #1', location: 'Section A' },
          { id: 2, stallNumber: 'Stall #2', location: 'Section A' },
          { id: 3, stallNumber: 'Stall #3', location: 'Section B' },
          { id: 4, stallNumber: 'Stall #4', location: 'Section B' },
          { id: 5, stallNumber: 'Stall #5', location: 'Section C' },
        ]
      } catch (error) {
        console.error('Error fetching available stalls:', error)
      }
    },
    onStallChange() {
      if (this.selectedStallId) {
        this.fetchAuctionRecords()
      } else {
        this.auctionRecords = []
      }
    },
    async fetchAuctionRecords() {
      if (!this.selectedStallId) return

      this.loading = true
      try {
        // Replace with your actual API call
        // const response = await this.$axios.get(`/api/stalls/${this.selectedStallId}/auction-history`);
        // this.auctionRecords = response.data;

        // Mock data for demonstration - different data per stall
        const mockDataByStall = {
          1: [
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
          ],
          2: [
            {
              id: 3,
              fullName: 'Pedro Reyes',
              address: 'Barangay Sabang, Naga City',
              status: 'Won',
              auctionDate: '2025-05-15T14:00:00',
            },
            {
              id: 4,
              fullName: 'Ana Lopez',
              address: 'Barangay Mabolo, Naga City',
              status: 'Lost',
              auctionDate: '2025-05-15T14:00:00',
            },
          ],
          3: [
            {
              id: 5,
              fullName: 'Carlos Mendoza',
              address: 'Barangay Bagumbayan Sur, Naga City',
              status: 'Lost',
              auctionDate: '2025-04-20T11:15:00',
            },
            {
              id: 6,
              fullName: 'Rosa Garcia',
              address: 'Barangay Dayangdang, Naga City',
              status: 'Won',
              auctionDate: '2025-04-20T11:15:00',
            },
          ],
          4: [
            {
              id: 7,
              fullName: 'Miguel Torres',
              address: 'Barangay Liboton, Naga City',
              status: 'Won',
              auctionDate: '2025-03-25T16:45:00',
            },
          ],
          5: [
            {
              id: 8,
              fullName: 'Carmen Villareal',
              address: 'Barangay Balatas, Naga City',
              status: 'Lost',
              auctionDate: '2025-07-05T08:00:00',
            },
            {
              id: 9,
              fullName: 'Jose Ramirez',
              address: 'Barangay Carolina, Naga City',
              status: 'Won',
              auctionDate: '2025-07-05T08:00:00',
            },
            {
              id: 10,
              fullName: 'Linda Fernandez',
              address: 'Barangay Igualdad Interior, Naga City',
              status: 'Lost',
              auctionDate: '2025-07-05T08:00:00',
            },
          ],
        }

        this.auctionRecords = mockDataByStall[this.selectedStallId] || []
      } catch (error) {
        console.error('Error fetching auction records:', error)
        // Handle error (show notification, etc.)
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    this.fetchAvailableStalls()
    if (this.selectedStallId) {
      this.fetchAuctionRecords()
    }
  },
  watch: {
    selectedStallId() {
      this.onStallChange()
    },
  },
}
