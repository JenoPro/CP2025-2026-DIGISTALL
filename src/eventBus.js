// Simple event bus for global communication between components
// Using a simple object since Vue 2 doesn't have reactive from composition API

class EventBus {
  constructor() {
    this.events = {};
  }

  // Emit an event
  emit(event, data) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    // Notify all listeners
    this.events[event].forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for '${event}':`, error);
      }
    });
  }

  // Listen to an event
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (!this.events[event]) return;
    const index = this.events[event].indexOf(callback);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }
  }

  // Remove all listeners for an event
  offAll(event) {
    if (this.events[event]) {
      this.events[event] = [];
    }
  }
}

// Create and export a single instance
export const eventBus = new EventBus();

// Event names constants for consistency
export const EVENTS = {
  STALL_ADDED: "stall:added",
  STALL_UPDATED: "stall:updated",
  STALL_DELETED: "stall:deleted",
  STALL_TYPES_CHANGED: "stall:types:changed",
};
