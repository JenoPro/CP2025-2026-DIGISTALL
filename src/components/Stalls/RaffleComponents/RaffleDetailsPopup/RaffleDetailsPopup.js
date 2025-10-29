import StallParticipants from "../../StallsComponents/StallParticipants/StallParticipants.vue";

export default {
  name: "RaffleDetailsPopup",
  components: {
    StallParticipants,
  },
  props: {
    showDetailsModal: {
      type: Boolean,
      default: false,
    },
    selectedRaffle: {
      type: Object,
      default: null,
    },
    showParticipantsModal: {
      type: Boolean,
      default: false,
    },
    selectedRaffleForParticipants: {
      type: Object,
      default: null,
    },
  },
  emits: ["close-details-modal", "close-participants-modal"],
  methods: {
    formatPrice(price) {
      return parseFloat(price).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    formatDateTime(dateTime) {
      if (!dateTime) return "N/A";

      const date = new Date(dateTime);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    },
  },
};
