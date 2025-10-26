export default {
  name: "BranchList",
  props: {
    branches: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["refresh", "assign-manager", "edit-branch", "delete-branch"],
  data() {
    return {
      headers: [
        {
          title: "Branch Name",
          key: "branch_name",
          sortable: true,
        },
        {
          title: "Area",
          key: "area",
          sortable: true,
        },
        {
          title: "Location",
          key: "location",
          sortable: true,
        },
        {
          title: "Status",
          key: "status",
          sortable: true,
        },
        {
          title: "Manager",
          key: "manager_status",
          sortable: false,
        },
        {
          title: "Contact",
          key: "contact_number",
          sortable: false,
        },
        {
          title: "Actions",
          key: "actions",
          sortable: false,
          align: "center",
        },
      ],
    };
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case "Active":
          return "success";
        case "Inactive":
          return "error";
        case "Under Construction":
          return "warning";
        case "Maintenance":
          return "info";
        default:
          return "grey";
      }
    },
  },
};
