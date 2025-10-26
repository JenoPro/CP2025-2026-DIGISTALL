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
