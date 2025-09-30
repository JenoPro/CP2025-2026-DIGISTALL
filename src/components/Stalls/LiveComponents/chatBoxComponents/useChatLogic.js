import { ref } from "vue";

export function useChatLogic() {
  // Chat State
  const chatMessages = ref([
    {
      id: 1,
      sender: "John Doe",
      text: "Good luck everyone!",
      timestamp: new Date(),
      isOwn: false,
    },
    {
      id: 2,
      sender: "Jane Smith",
      text: "Excited for this raffle!",
      timestamp: new Date(),
      isOwn: false,
    },
    {
      id: 3,
      sender: "Mike Johnson",
      text: "May the best person win!",
      timestamp: new Date(),
      isOwn: false,
    },
  ]);

  // Message Display State
  const message = ref("");
  const messageType = ref("info");
  const showMessage = ref(false);

  // Helper function for messages (to be passed in)
  let handleMessage = (msg, type = "info") => {
    message.value = msg;
    messageType.value = type;
    showMessage.value = true;
  };

  const setMessageHandler = (handler) => {
    handleMessage = handler;
  };

  // Chat Methods
  const sendMessage = (messageText) => {
    if (messageText && messageText.trim()) {
      const newMsg = {
        id: Date.now(),
        sender: "Admin", // In real app, get from auth
        text: messageText.trim(),
        timestamp: new Date(),
        isOwn: true,
      };
      chatMessages.value.push(newMsg);
      handleMessage("Message sent", "success");
    }
  };

  const addMessage = (sender, text, isOwn = false) => {
    const newMsg = {
      id: Date.now(),
      sender,
      text,
      timestamp: new Date(),
      isOwn,
    };
    chatMessages.value.push(newMsg);
  };

  const clearMessages = () => {
    chatMessages.value = [];
  };

  const getMessagesCount = () => {
    return chatMessages.value.length;
  };

  const getLastMessage = () => {
    return chatMessages.value.length > 0
      ? chatMessages.value[chatMessages.value.length - 1]
      : null;
  };

  return {
    // State
    chatMessages,
    message,
    messageType,
    showMessage,

    // Methods
    setMessageHandler,
    sendMessage,
    addMessage,
    clearMessages,
    getMessagesCount,
    getLastMessage,
    handleMessage,
  };
}
