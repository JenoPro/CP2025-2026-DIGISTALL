import AddAvailableStall from '../../AddAvailableStall/AddAvailableStall.vue'
import AddFloorSection from '../../AddFloorSection/AddFloorSection.vue'
import ViewFloorsSections from '../ViewFloorsSection/ViewFloorsSections.vue'

export default {
  name: 'AddChoiceModal',
  components: {
    AddAvailableStall,
    AddFloorSection,
    ViewFloorsSections,
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      showAddStallModal: false,
      showAddFloorSectionModal: false,
      showViewFloorsSectionsModal: false,
    }
  },
  methods: {
    // Open the choice modal
    openChoiceModal() {
      this.$emit('open-modal')
    },

    // Close the choice modal
    closeModal() {
      this.$emit('close-modal')
    },

    // Handle selection of Add Stall
    selectAddStall() {
      this.closeModal()
      this.showAddStallModal = true
    },

    // Handle selection of Add Floor & Section
    selectAddFloorSection() {
      this.closeModal()
      this.showAddFloorSectionModal = true
    },

    // Handle selection of View Floors & Sections
    selectViewFloorsSections() {
      this.closeModal()
      this.showViewFloorsSectionsModal = true
    },

    // Close Add Stall Modal
    closeAddStallModal() {
      this.showAddStallModal = false
    },

    // Close Add Floor & Section Modal
    closeAddFloorSectionModal() {
      this.showAddFloorSectionModal = false
    },

    // Close View Floors & Sections Modal
    closeViewFloorsSectionsModal() {
      this.showViewFloorsSectionsModal = false
    },

    // Handle stall added event
    handleStallAdded(stallData) {
      this.$emit('stall-added', stallData)
    },

    // Handle floor added event
    handleFloorAdded(floorData) {
      this.$emit('floor-added', floorData)
    },

    // Handle section added event
    handleSectionAdded(sectionData) {
      this.$emit('section-added', sectionData)
    },

    // Handle show message event
    handleShowMessage(messageData) {
      this.$emit('show-message', messageData)
    },

    // Handle refresh stalls event
    handleRefreshStalls() {
      this.$emit('refresh-stalls')
    },

    // Handle refresh data event (for floors/sections)
    handleRefreshData() {
      this.$emit('refresh-data')
    },

    // Handle opening Add Floor Section from View modal
    handleOpenAddFloorSection() {
      this.showViewFloorsSectionsModal = false
      this.showAddFloorSectionModal = true
    },
  },
}
