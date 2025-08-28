import CardStallsComponent from '../Stalls/StallsComponents/Card/CardStallsComponent.vue'
import SearchFilter from '../Stalls/StallsComponents/SearchAndFilter/SearchAndFilter.vue'
import AddAvailableStall from '../Stalls/StallsComponents/Add/AddAvailableStall.vue'
import EditStall from '../Stalls/StallsComponents/Edit/EditStall.vue'

import AuctionTable from '../Stalls/AuctionComponents/AuctionTable.vue' // New import for AuctionTable 28/08/25

export default {
  name: 'Stalls',
  components: {
    CardStallsComponent,
    SearchFilter,
    AddAvailableStall,
    EditStall,
    AuctionTable,
  },
  data() {
    return {
      pageTitle: 'Stalls',
      showModal: false,
      showEditModal: false,
      showAuctionModal: false,
      selectedStall: {},
      stallsData: [
        {
          id: 1,
          stallNumber: 'STALL# 01',
          price: '1,500 Php / Raffle',
          floor: '2nd Floor',
          section: 'Grocery Section',
          dimensions: '3x3 meters',
          location: "Naga City People's Mall",
          description:
            'Perfect for grocery business with high foot traffic area. Well-ventilated space with easy access to main entrance.',
          image: 'https://tse3.mm.bing.net/th/id/OIP.B6h1C5jCwEUN1PEbu0exVQHaGB?pid=Api&P=0&h=180',
          isAvailable: true,
        },
        {
          id: 2,
          stallNumber: 'STALL# 02',
          price: '1,500 Php Min. / Auction',
          floor: '2nd Floor',
          section: 'Grocery Section',
          dimensions: '3x3 meters',
          location: 'Satellite Market',
          description:
            'Strategic corner location ideal for various retail businesses. Near restroom facilities and loading area.',
          image:
            'https://www.citybgroup.com/assets/sales/traditional-style-marketing-stall/skipton-3__FillWzEwMDAsNTYzXQ.JPG',
          isAvailable: true,
        },
        {
          id: 3,
          stallNumber: 'STALL# 03',
          price: '1,500 Php / Raffle',
          floor: '2nd Floor',
          section: 'Grocery Section',
          dimensions: '3x3 meters',
          location: "Naga City People's Mall",
          description:
            'Spacious stall with good lighting and electrical outlets. Suitable for fresh produce or packaged goods.',
          image: 'https://i.pinimg.com/originals/b8/7f/96/b87f9661d0f56d6d88c8e1462e4c68a3.jpg',
          isAvailable: true,
        },
        {
          id: 4,
          stallNumber: 'STALL# 04',
          price: '1,500 Php Min. / Auction',
          floor: '2nd Floor',
          section: 'Grocery Section',
          dimensions: '3x3 meters',
          location: 'Satellite Market',
          description:
            'Prime location with excellent visibility. Close to parking area and public transportation routes.',
          image: 'https://i.pinimg.com/originals/60/17/ec/6017ec3acc17f3e0d729d882026f92eb.jpg',
          isAvailable: true,
        },
        {
          id: 5,
          stallNumber: 'STALL# 05',
          price: '1,800 Php / Raffle',
          floor: '1st Floor',
          section: 'Meat Section',
          dimensions: '4x3 meters',
          location: "Naga City People's Mall",
          description:
            'Premium ground floor location with freezer hookups. Perfect for meat vendors with cold storage.',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          isAvailable: true,
        },
        {
          id: 6,
          stallNumber: 'STALL# 06',
          price: '2,000 Php Min. / Auction',
          floor: '1st Floor',
          section: 'Fresh Produce',
          dimensions: '3x4 meters',
          location: 'Satellite Market',
          description:
            'Large corner stall with water access and drainage. Ideal for vegetable and fruit vendors with washing facilities.',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
          isAvailable: true,
        },
      ],
      displayStalls: [],
      // Snackbar for notifications
      snackbar: {
        show: false,
        text: '',
        color: 'success',
      },
    }
  },
  mounted() {
    this.initializeStalls()
  },
  methods: {
    // Initialize stalls page
    initializeStalls() {
      this.displayStalls = [...this.stallsData]
    },

    // edit functions
    handleStallEdit(stall) {
      this.selectedStall = { ...stall }
      this.showEditModal = true
    },

    handleStallUpdated(updatedStall) {
      const index = this.stallsData.findIndex((s) => s.id === updatedStall.id)
      if (index > -1) {
        this.stallsData[index] = { ...updatedStall }
        this.displayStalls = [...this.stallsData]
        this.showMessage('Stall updated successfully!', 'success')
      }
      this.closeEditModal()
    },

    closeEditModal() {
      this.showEditModal = false
      this.selectedStall = {}
    },

    handleStallDeleted(stallId) {
      const index = this.stallsData.findIndex((s) => s.id === stallId)
      if (index > -1) {
        this.stallsData.splice(index, 1)
        this.displayStalls = [...this.stallsData]
        this.showMessage('Stall deleted successfully!', 'success')
      }
    },

    async deleteStallFromServer(stallId) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`Stall ${stallId} deleted from server`)
          resolve()
        }, 500)
      })
    },

    handleFilteredStalls(filtered) {
      this.displayStalls = filtered
    },

    openAddStallModal() {
      this.showModal = true
    },

    closeAddStallModal() {
      this.showModal = false
    },

    handleStallAdded(newStall) {
      const newId = Math.max(...this.stallsData.map((s) => s.id)) + 1
      newStall.id = newId
      this.stallsData.push(newStall)
      this.displayStalls = [...this.stallsData]
      this.showMessage('Stall added successfully!', 'success')
    },

    showMessage(text, color = 'success') {
      this.snackbar = {
        show: true,
        text,
        color,
      }
      setTimeout(() => {
        this.snackbar.show = false
      }, 5000)
    },

    handleEditModalClose() {
      this.closeEditModal()
    },

    handleEditError(errorMessage) {
      this.showMessage(errorMessage, 'error')
    },

    // new handlers for auction & live buttons added by 28/08/25
    handleStallAuction(stall) {
      this.selectedStall = { ...stall }
      this.showAuctionModal = true
    },

    handleCloseAuction() {
      this.showAuctionModal = false
      this.selectedStall = {}
    },

    handleAuctionStatus({ participant, status }) {
      this.showMessage(
        `${participant.fullName} marked as ${status}`,
        status === 'Won' ? 'success' : 'error',
      )
    },

    handleStallLive(stall) {
      this.showMessage(`Live mode activated for ${stall.stallNumber}`, 'info')
    },
  },
}