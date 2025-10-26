import axios from "axios";

export default {
  name: "AddBranchDialog",
  emits: ["update:modelValue", "branch-created"],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valid: false,
      loading: false,
      formData: {
        branch_name: "",
        area: "",
        location: "",
        address: "",
        contact_number: "",
        email: "",
        status: "Active",
      },
      statusOptions: [
        { title: "Active", value: "Active" },
        { title: "Inactive", value: "Inactive" },
        { title: "Under Construction", value: "Under Construction" },
        { title: "Maintenance", value: "Maintenance" },
      ],
      rules: {
        required: (value) => !!value || "This field is required",
        email: (value) => {
          if (!value) return true;
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return pattern.test(value) || "Enter a valid email address";
        },
      },
    };
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.resetForm();
      }
    },
  },
  methods: {
    resetForm() {
      this.formData = {
        branch_name: "",
        area: "",
        location: "",
        address: "",
        contact_number: "",
        email: "",
        status: "Active",
      };
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },

    closeDialog() {
      this.dialog = false;
    },

    async saveBranch() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) return;

      this.loading = true;
      try {
        const response = await axios.post(
          "http://localhost:3001/api/admin/branches",
          this.formData,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.data && response.data.success) {
          this.$emit("branch-created", response.data.data);
          this.closeDialog();
        }
      } catch (error) {
        console.error("Error creating branch:", error);
        // Handle error - could emit an error event or show a snackbar
      } finally {
        this.loading = false;
      }
    },
  },
};
