<template>
  <div class="countdown-timer" :class="{ 'urgent': isUrgent, 'expired': isExpired }">
    <div class="timer-display">
      <div class="time-value">
        <span class="minutes">{{ formattedTime.minutes }}</span>
        <span class="separator">:</span>
        <span class="seconds">{{ formattedTime.seconds }}</span>
      </div>
      <div class="timer-label">
        {{ isExpired ? 'Time\'s Up!' : 'Time Remaining' }}
      </div>
    </div>
    
    <!-- Progress Ring -->
    <div class="timer-progress">
      <svg class="progress-ring" width="80" height="80">
        <circle
          class="progress-ring-background"
          cx="40"
          cy="40"
          r="36"
          fill="transparent"
          stroke="#e0e0e0"
          stroke-width="4"
        />
        <circle
          class="progress-ring-fill"
          cx="40"
          cy="40"
          r="36"
          fill="transparent"
          :stroke="progressColor"
          stroke-width="4"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          transform="rotate(-90 40 40)"
        />
      </svg>
      <div class="progress-content">
        <v-icon 
          :color="isExpired ? 'error' : 'primary'" 
          size="24"
        >
          {{ isExpired ? 'mdi-clock-alert' : 'mdi-clock' }}
        </v-icon>
      </div>
    </div>
    
    <!-- Status Indicators -->
    <div class="timer-status mt-2">
      <v-chip
        v-if="!isActive && !isExpired"
        color="warning"
        size="small"
        variant="flat"
      >
        <v-icon start size="16">mdi-pause</v-icon>
        Paused
      </v-chip>
      <v-chip
        v-else-if="isExpired"
        color="error"
        size="small"
        variant="flat"
      >
        <v-icon start size="16">mdi-stop</v-icon>
        Ended
      </v-chip>
      <v-chip
        v-else-if="isUrgent"
        color="warning"
        size="small"
        variant="flat"
        class="pulse"
      >
        <v-icon start size="16">mdi-alert</v-icon>
        Urgent
      </v-chip>
      <v-chip
        v-else
        color="success"
        size="small"
        variant="flat"
      >
        <v-icon start size="16">mdi-play</v-icon>
        Active
      </v-chip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CountdownTimer',
  props: {
    timeRemaining: {
      type: Number,
      default: 0, // in seconds
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    urgentThreshold: {
      type: Number,
      default: 60, // seconds when timer becomes urgent
    },
    initialTime: {
      type: Number,
      default: 300, // for calculating progress
    },
  },
  data() {
    return {
      circumference: 2 * Math.PI * 36, // radius is 36
    }
  },
  computed: {
    formattedTime() {
      const totalSeconds = Math.max(0, this.timeRemaining)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      
      return {
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
      }
    },
    isExpired() {
      return this.timeRemaining <= 0
    },
    isUrgent() {
      return this.timeRemaining <= this.urgentThreshold && this.timeRemaining > 0
    },
    progressPercentage() {
      if (this.initialTime <= 0) return 0
      return Math.max(0, (this.timeRemaining / this.initialTime) * 100)
    },
    strokeDashoffset() {
      const progress = this.progressPercentage / 100
      return this.circumference * (1 - progress)
    },
    progressColor() {
      if (this.isExpired) return '#f44336' // error red
      if (this.isUrgent) return '#ff9800' // warning orange
      return '#4caf50' // success green
    },
  },
  watch: {
    timeRemaining(newTime, oldTime) {
      // Emit warning when entering urgent state
      if (oldTime > this.urgentThreshold && newTime <= this.urgentThreshold) {
        this.$emit('urgent')
      }
      
      // Emit time up when reaching zero
      if (oldTime > 0 && newTime <= 0) {
        this.$emit('timeUp')
      }
      
      // Emit periodic updates
      this.$emit('timeUpdate', newTime)
    },
  },
  emits: ['timeUp', 'urgent', 'timeUpdate'],
}
</script>

<style scoped>
.countdown-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  position: relative;
}

.timer-display {
  text-align: center;
  margin-bottom: 16px;
}

.time-value {
  font-family: 'Roboto Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
  color: #1976d2;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.timer-display.urgent .time-value {
  color: #ff9800;
  animation: pulse 1s infinite;
}

.timer-display.expired .time-value {
  color: #f44336;
}

.separator {
  opacity: 0.7;
  animation: blink 1s infinite;
}

.timer-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 500;
  color: #666;
  margin-top: 4px;
}

.timer-progress {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-fill {
  transition: stroke-dashoffset 0.3s ease;
}

.progress-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.timer-status {
  text-align: center;
}

/* Urgent state styling */
.countdown-timer.urgent .timer-display {
  animation: shake 0.5s ease-in-out;
}

.countdown-timer.expired .timer-display .time-value {
  color: #f44336 !important;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0.3;
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

.pulse {
  animation: pulse 2s infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .time-value {
    font-size: 1.5rem;
  }
  
  .timer-progress svg {
    width: 60px;
    height: 60px;
  }
  
  .timer-progress .progress-ring-background,
  .timer-progress .progress-ring-fill {
    r: 26;
    cx: 30;
    cy: 30;
  }
  
  .countdown-timer {
    padding: 12px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .time-value,
  .countdown-timer.urgent .timer-display,
  .pulse,
  .separator,
  .progress-ring-fill {
    animation: none !important;
  }
}
</style>