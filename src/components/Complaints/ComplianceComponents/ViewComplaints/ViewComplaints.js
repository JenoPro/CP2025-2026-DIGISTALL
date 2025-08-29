//ViewComplaints.js
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    complaints: {
      type: Object,
      default: null,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    getStatusClass(status) {
      switch (status.toLowerCase()) {
        case "complete":
          return "status-complete";
        case "pending":
          return "status-pending";
        case "incomplete":
          return "status-incomplete";
        default:
          return "";
      }
    },
  },
};


