import { ref, computed } from 'vue'

export function useAuctionLogic(type) {
  // Auction/Raffle State
  const participants = ref([])
  const bidders = ref([])
  const selectedWinner = ref(null)
  const showWinnerDialog = ref(false)
  const showParticipantsModal = ref(false)
  const itemType = ref(type || 'Raffle')

  // Helper function for messages (to be passed in)
  let handleMessage = () => {}

  const setMessageHandler = (handler) => {
    handleMessage = handler
  }

  // Computed Properties
  const participantsList = computed(() => {
    return itemType.value === 'Raffle' ? participants.value : bidders.value
  })

  const getCurrentHighestBid = () => {
    if (!bidders.value || bidders.value.length === 0) return 0

    const bidsWithAmount = bidders.value
      .map((bidder) => {
        const bidAmount = bidder.lastBid || bidder.bid_amount || 0
        return { ...bidder, bidAmount }
      })
      .filter((bidder) => bidder.bidAmount > 0)

    if (bidsWithAmount.length === 0) return 0

    return Math.max(...bidsWithAmount.map((bidder) => bidder.bidAmount))
  }

  // Auction/Raffle Methods
  const loadParticipants = async () => {
    try {
      // For now, skip API call and use mock data directly
      // TODO: Uncomment when backend is available
      /*
      const token = localStorage.getItem("token");
      if (token && stallId) {
        const response = await fetch(
          `http://localhost:3000/api/stalls/${stallId}/participants`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // Handle API response here
      }
      */

      // Use mock data for demo
      if (itemType.value === 'Raffle') {
        participants.value = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            entry_date: new Date().toISOString(),
            status: 'Participating',
            contact: '+63 912 345 6789',
            address: '123 Main St, City',
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            entry_date: new Date().toISOString(),
            status: 'Participating',
            contact: '+63 912 345 6790',
            address: '456 Oak Ave, City',
          },
        ]
      } else {
        bidders.value = [
          {
            id: 1,
            name: 'Mike Johnson',
            email: 'mike@example.com',
            lastBid: 1500,
            bid_amount: 1500,
            bid_date: new Date().toISOString(),
            status: 'Highest Bidder',
            contact: '+63 912 345 6791',
            address: '789 Pine St, City',
          },
          {
            id: 2,
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
            lastBid: 1200,
            bid_amount: 1200,
            bid_date: new Date().toISOString(),
            status: 'Bidding',
            contact: '+63 912 345 6792',
            address: '321 Elm St, City',
          },
        ]
      }

      handleMessage('Participants loaded successfully', 'success')
    } catch (error) {
      console.error('Error loading participants:', error)
      handleMessage('Using mock participants - backend not available', 'warning')

      // Fallback data (same as above)
      if (itemType.value === 'Raffle') {
        participants.value = [
          {
            id: 1,
            name: 'Sample Participant',
            email: 'sample@example.com',
            entry_date: new Date().toISOString(),
            status: 'Participating',
            contact: '+63 912 345 6789',
            address: 'Sample Address',
          },
        ]
      } else {
        bidders.value = [
          {
            id: 1,
            name: 'Sample Bidder',
            email: 'bidder@example.com',
            lastBid: 1000,
            bid_amount: 1000,
            bid_date: new Date().toISOString(),
            status: 'Bidding',
            contact: '+63 912 345 6790',
            address: 'Sample Address',
          },
        ]
      }
    }
  }

  const removeParticipant = (participantId) => {
    participants.value = participants.value.filter((p) => p.id !== participantId)
    handleMessage('Participant removed', 'info')
  }

  const removeBidder = (bidderId) => {
    bidders.value = bidders.value.filter((b) => b.id !== bidderId)
    handleMessage('Bidder removed', 'info')
  }

  const selectWinner = () => {
    // For now, just show participants modal
    showParticipantsModal.value = true
  }

  const selectParticipantAsWinner = (participant) => {
    selectedWinner.value = participant
    showWinnerDialog.value = true
  }

  const confirmWinnerSelection = () => {
    if (selectedWinner.value) {
      // Update participant status
      const participantIndex = participants.value.findIndex((p) => p.id === selectedWinner.value.id)
      if (participantIndex !== -1) {
        participants.value[participantIndex].status = 'Winner'
      }

      // Update other participants to "Participant" (not losers)
      participants.value.forEach((p) => {
        if (p.id !== selectedWinner.value.id && p.status !== 'Winner') {
          p.status = 'Participant'
        }
      })

      handleMessage(`${selectedWinner.value.name} has been selected as the winner!`, 'success')
      cancelWinnerSelection()
      showParticipantsModal.value = false

      // TODO: Call API to update database
      // updateWinnerInDatabase(selectedWinner.value)
    }
  }

  const cancelWinnerSelection = () => {
    showWinnerDialog.value = false
    selectedWinner.value = null
  }

  // Utility functions
  const formatPrice = (price) => {
    if (!price) return '0'
    return parseFloat(price).toLocaleString()
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return {
    // State
    participants,
    bidders,
    selectedWinner,
    showWinnerDialog,
    showParticipantsModal,
    itemType,

    // Computed
    participantsList,

    // Methods
    setMessageHandler,
    getCurrentHighestBid,
    loadParticipants,
    removeParticipant,
    removeBidder,
    selectWinner,
    selectParticipantAsWinner,
    confirmWinnerSelection,
    cancelWinnerSelection,
    formatPrice,
    formatDateTime,
  }
}
