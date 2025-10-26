export default {
  name: 'ChatBox',
  props: {
    chatMessages: {
      type: Array,
      default: () => []
    },
    newMessage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localNewMessage: this.newMessage
    }
  },
  watch: {
    newMessage(val) {
      this.localNewMessage = val;
    }
  },
  emits: ['send-message'],
  methods: {
    sendMessage() {
      if (this.localNewMessage.trim()) {
        this.$emit('send-message', this.localNewMessage.trim());
        this.localNewMessage = '';
      }
    }
  }
}
