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

<script src="./ChatBox.js"></script>

<style scoped src="./ChatBox.css"></style>
