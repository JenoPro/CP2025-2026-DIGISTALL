export default {
  name: "ParticipantsList",
  props: {
    participants: {
      type: Array,
      default: () => [],
    },
    itemType: {
      type: String,
      default: "Raffle",
    },
    canSelectWinner: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["select-winner"],
  methods: {
    getStatusColor() {
      return this.participants.length > 0 ? "primary" : "grey";
    },

    getParticipantStatusColor(status) {
      switch (status) {
        case "Winner":
          return "success";
        case "Highest Bidder":
          return "warning";
        case "Participating":
        case "Bidding":
          return "primary";
        default:
          return "grey";
      }
    },

    formatPrice(price) {
      if (!price) return "0";
      return parseFloat(price).toLocaleString();
    },

    formatDateTime(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
