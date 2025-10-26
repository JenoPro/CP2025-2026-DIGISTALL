export default {
  name: 'ManagePermissions',
  props: {
    modelValue: Boolean,
    employee: Object,
    selectedPermissions: Array,
    availablePermissions: Array,
    saving: Boolean,
  },
  emits: ['update:modelValue', 'save', 'close', 'toggle-permission'],
  methods: {
    isPermissionSelected(permission) {
      return this.selectedPermissions && this.selectedPermissions.includes(permission)
    },
  },
}
