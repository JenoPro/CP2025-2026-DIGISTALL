export default {
  name: 'AuctionTable',
  props: {
    stall: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      headers: [
        { title: 'ID', key: 'id' },
        { title: 'Full Name', key: 'fullName' },
        { title: 'Contact Number', key: 'contactNumber' },
        { title: 'Address', key: 'address' },
        { title: 'Status', key: 'status' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      participants: [
        {
          id: 1,
          fullName: 'Juan Dela Cruz',
          contactNumber: '0917-123-4567',
          address: 'Barangay Concepcion PequeÃ±a, Naga City',
          status: 'Pending',
        },
        {
          id: 2,
          fullName: 'Maria Santos',
          contactNumber: '0928-555-1234',
          address: 'Barangay Triangulo, Naga City',
          status: 'Pending',
        },
        {
          id: 3,
          fullName: 'Pedro Reyes',
          contactNumber: '0939-888-9999',
          address: 'Barangay Sabang, Naga City',
          status: 'Pending',
        },
        {
          id: 4,
          fullName: 'Ana Lopez',
          contactNumber: '0906-222-3344',
          address: 'Barangay Mabolo, Naga City',
          status: 'Pending',
        },
        {
          id: 5,
          fullName: 'Carlos Mendoza',
          contactNumber: '0998-111-7766',
          address: 'Barangay Bagumbayan Sur, Naga City',
          status: 'Pending',
        },
        {
          id: 6,
          fullName: 'Rosa Garcia',
          contactNumber: '0915-444-5678',
          address: 'Barangay Dayangdang, Naga City',
          status: 'Pending',
        },
        {
          id: 7,
          fullName: 'Miguel Torres',
          contactNumber: '0927-777-8899',
          address: 'Barangay Lerma, Naga City',
          status: 'Pending',
        },
        {
          id: 8,
          fullName: 'Elena Villanueva',
          contactNumber: '0945-333-2211',
          address: 'Barangay Magsaysay, Naga City',
          status: 'Pending',
        },
        {
          id: 9,
          fullName: 'Roberto Cruz',
          contactNumber: '0912-666-7788',
          address: 'Barangay San Felipe, Naga City',
          status: 'Pending',
        },
        {
          id: 10,
          fullName: 'Luz Fernandez',
          contactNumber: '0933-999-1122',
          address: 'Barangay Balatas, Naga City',
          status: 'Pending',
        },
      ],
    }
  },
  methods: {
    markAsWon(participant) {
      // Count participants that will be marked as lost
      const pendingParticipants = this.participants.filter(
        (p) => p.id !== participant.id && p.status === 'Pending',
      )
      const lostCount = pendingParticipants.length

      // Set the winner
      participant.status = 'Won'

      // Automatically mark all other participants as 'Lost'
      this.participants.forEach((p) => {
        if (p.id !== participant.id && p.status === 'Pending') {
          p.status = 'Lost'
        }
      })

      // Emit update for the winner
      this.$emit('update-status', { participant, status: 'Won' })

      // Emit a single consolidated update for all lost participants
      if (lostCount > 0) {
        this.$emit('update-status', {
          participant: { fullName: `${lostCount} participant${lostCount > 1 ? 's' : ''}` },
          status: 'Lost',
        })
      }
    },
    closeAuction() {
      this.$emit('close-auction')
    },
  },
}
