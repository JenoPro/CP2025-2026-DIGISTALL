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
        <circle class="progress-ring-background" cx="40" cy="40" r="36" fill="transparent" stroke="#e0e0e0"
          stroke-width="4" />
        <circle class="progress-ring-fill" cx="40" cy="40" r="36" fill="transparent" :stroke="progressColor"
          stroke-width="4" stroke-linecap="round" :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset" transform="rotate(-90 40 40)" />
      </svg>
      <div class="progress-content">
        <v-icon :color="isExpired ? 'error' : 'primary'" size="24">
          {{ isExpired ? 'mdi-clock-alert' : 'mdi-clock' }}
        </v-icon>
      </div>
    </div>

    <!-- Status Indicators -->
    <div class="timer-status mt-2">
      <v-chip v-if="!isActive && !isExpired" color="warning" size="small" variant="flat">
        <v-icon start size="16">mdi-pause</v-icon>
        Paused
      </v-chip>
      <v-chip v-else-if="isExpired" color="error" size="small" variant="flat">
        <v-icon start size="16">mdi-stop</v-icon>
        Ended
      </v-chip>
      <v-chip v-else-if="isUrgent" color="warning" size="small" variant="flat" class="pulse">
        <v-icon start size="16">mdi-alert</v-icon>
        Urgent
      </v-chip>
      <v-chip v-else color="primary" size="small" variant="flat">
        <v-icon start size="16">mdi-play</v-icon>
        Active
      </v-chip>
    </div>
  </div>
</template>

<script src="./CountdownTimer.js"></script>

<style scoped src="./CountdownTimer.css"></style>
