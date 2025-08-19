export default {
  name: 'CardStallsComponent',
  props: {
    stalls: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  methods: {
    handleModify(stall) {
      console.log('Edit stall:', stall)
      this.$emit('stall-edit', stall)
    },
  },
}
