<template>
  <v-card class="chat-container" elevation="8">
    <div class="chat-header">
      <v-icon class="mr-2">mdi-chat</v-icon>
      Live Chat
    </div>
    
    <div class="chat-messages" ref="chatMessages">
      <div 
        v-for="message in chatMessages" 
        :key="message.id"
        class="chat-message"
      >
        <div class="chat-user">{{ message.user }}</div>
        <div class="chat-text">{{ message.text }}</div>
      </div>
    </div>
    
    <div class="chat-input">
      <v-row no-gutters align="center">
        <v-col>
          <v-text-field
            v-model="localNewMessage"
            placeholder="Type a message..."
            hide-details
            variant="outlined"
            density="compact"
            @keyup.enter="sendMessage"
          ></v-text-field>
        </v-col>
        <v-col cols="auto">
          <v-btn 
            color="primary" 
            icon
            @click="sendMessage"
            class="ml-2"
          >
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
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
</script>

<style scoped>
.chat-container {
  height: 400px;
  display: flex;
  flex-direction: column;
  border-radius: 8px !important;
}

.chat-header {
  padding: 16px;
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  border-radius: 8px 8px 0 0;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #fafafa;
}

.chat-message {
  margin-bottom: 12px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chat-user {
  font-weight: 600;
  color: #1976d2;
  font-size: 14px;
  margin-bottom: 4px;
}

.chat-text {
  color: #333;
  font-size: 14px;
  line-height: 1.4;
}

.chat-input {
  padding: 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
  border-radius: 0 0 8px 8px;
}

/* Custom scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #1976d2;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #1565c0;
}
</style>