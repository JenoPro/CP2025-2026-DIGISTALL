export default {
  name: 'CardStallsComponent',
  // CardStallsComponent file defines a reusable Vue component for displaying your stall cards.
  // if wala ito, hindi mag di-display yung array sa stalls.js
  props: {
    stalls: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  methods: {
    handleEdit(stall) {
      console.log('Edit stall:', stall)
      this.$emit('stall-edit', stall)
    },

    handleDelete(stall) {
      console.log('Delete stall:', stall)
      this.$emit('stall-delete', stall)
    },
  },
}
