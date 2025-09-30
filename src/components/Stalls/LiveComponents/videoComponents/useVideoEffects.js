import { ref, computed } from 'vue'

export function useVideoEffects() {
  // Video Effects State
  const videoStream = ref(null)
  const currentVideoFilter = ref('none')
  const videoFlipHorizontal = ref(false)
  const videoFlipVertical = ref(false)
  const autoFocusEnabled = ref(true)
  const isFullscreen = ref(false)
  const showVideoSettings = ref(false)
  const isLiveActive = ref(false)
  const videoCanvas = ref(null)
  const videoContext = ref(null)

  // Video Filters Configuration
  const videoFilters = ref([
    { name: 'None', value: 'none', icon: 'mdi-filter-off' },
    { name: 'Blur', value: 'blur', icon: 'mdi-blur' },
    { name: 'Brightness', value: 'brightness', icon: 'mdi-brightness-6' },
    { name: 'Contrast', value: 'contrast', icon: 'mdi-contrast-box' },
    { name: 'Grayscale', value: 'grayscale', icon: 'mdi-palette-swatch' },
    { name: 'Sepia', value: 'sepia', icon: 'mdi-image-filter-vintage' },
    { name: 'Saturate', value: 'saturate', icon: 'mdi-palette' },
    { name: 'Hue Rotate', value: 'hue-rotate', icon: 'mdi-rotate-360' },
  ])

  // Computed Properties
  const videoEffects = computed(() => {
    const effects = []
    if (currentVideoFilter.value && currentVideoFilter.value !== 'none') {
      effects.push(currentVideoFilter.value)
    }
    if (videoFlipHorizontal.value) effects.push('flip-horizontal')
    if (videoFlipVertical.value) effects.push('flip-vertical')
    if (autoFocusEnabled.value) effects.push('auto-focus')
    return effects
  })

  // Helper function for messages (to be passed in)
  let handleMessage = () => {}

  const setMessageHandler = (handler) => {
    handleMessage = handler
  }

  // Video Effects Methods
  const toggleVideoSettings = () => {
    showVideoSettings.value = !showVideoSettings.value
  }

  const toggleFullscreen = (videoElement) => {
    const videoContainer = videoElement?.closest('.video-area')
    if (!isFullscreen.value) {
      if (videoContainer?.requestFullscreen) {
        videoContainer.requestFullscreen()
      }
      isFullscreen.value = true
      handleMessage('Entered fullscreen mode', 'info')
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
      isFullscreen.value = false
      handleMessage('Exited fullscreen mode', 'info')
    }
  }

  const toggleAutoFocus = () => {
    autoFocusEnabled.value = !autoFocusEnabled.value
    applyVideoEffects()
    handleMessage(autoFocusEnabled.value ? 'Auto focus enabled' : 'Auto focus disabled', 'info')
  }

  const changeVideoFilter = (filter) => {
    currentVideoFilter.value = filter
    applyVideoEffects()
    const filterName = videoFilters.value.find((f) => f.value === filter)?.name || 'None'
    handleMessage(`Applied ${filterName} filter`, 'info')
  }

  const toggleFlipHorizontal = () => {
    videoFlipHorizontal.value = !videoFlipHorizontal.value
    applyVideoEffects()
    handleMessage(
      `Video ${videoFlipHorizontal.value ? 'flipped horizontally' : 'horizontal flip removed'}`,
      'info',
    )
  }

  const toggleFlipVertical = () => {
    videoFlipVertical.value = !videoFlipVertical.value
    applyVideoEffects()
    handleMessage(
      `Video ${videoFlipVertical.value ? 'flipped vertically' : 'vertical flip removed'}`,
      'info',
    )
  }

  const resetVideoEffects = () => {
    currentVideoFilter.value = 'none'
    videoFlipHorizontal.value = false
    videoFlipVertical.value = false
    autoFocusEnabled.value = false
    applyVideoEffects()
    handleMessage('Video effects reset', 'info')
  }

  const applyVideoEffects = () => {
    if (!isLiveActive.value || !videoStream.value) return
    console.log('Video effects applied via VideoArea component')
  }

  const setupVideoCanvas = () => {
    const canvas = document.createElement('canvas')
    canvas.id = 'video-effects-canvas'
    canvas.style.display = 'none'
    document.body.appendChild(canvas)
    videoCanvas.value = canvas
    videoContext.value = canvas.getContext('2d')
  }

  const switchCamera = async () => {
    if (!isLiveActive.value) return

    handleMessage('Switching camera...', 'info')

    // Toggle between user and environment camera
    const currentConstraints = videoStream.value?.getVideoTracks()[0].getSettings()
    const newFacingMode = currentConstraints?.facingMode === 'user' ? 'environment' : 'user'

    stopLive()

    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            facingMode: newFacingMode,
          },
          audio: true,
        })

        videoStream.value = stream
        isLiveActive.value = true

        // Find video element and set up stream
        const videoElement = document.querySelector('#live-video')
        if (videoElement) {
          videoElement.srcObject = stream
          await videoElement.play()
          handleMessage('Camera switched successfully', 'success')
        } else {
          handleMessage('Video element not found after camera switch', 'error')
        }
      } catch (error) {
        console.error('Failed to switch camera:', error)
        handleMessage('Failed to switch camera', 'error')
      }
    }, 500)
  }

  const startLive = async () => {
    try {
      if (!videoStream.value) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            facingMode: 'user',
          },
          audio: true,
        })
        videoStream.value = stream
      }

      isLiveActive.value = true
      setupVideoCanvas()

      const videoElement = document.querySelector('#live-video')
      if (videoElement && videoStream.value) {
        videoElement.srcObject = videoStream.value
        await videoElement.play()
      }

      handleMessage('Live stream started', 'success')
    } catch (error) {
      console.error('Failed to start live stream:', error)
      handleMessage('Failed to start camera. Please check permissions.', 'error')
    }
  }

  const stopLive = () => {
    if (videoStream.value) {
      videoStream.value.getTracks().forEach((track) => track.stop())
      videoStream.value = null
    }

    isLiveActive.value = false

    const videoElement = document.querySelector('#live-video')
    if (videoElement) {
      videoElement.srcObject = null
    }

    // Clean up canvas
    const canvas = document.getElementById('video-effects-canvas')
    if (canvas) {
      canvas.remove()
    }

    videoCanvas.value = null
    videoContext.value = null

    handleMessage('Live stream stopped', 'info')
  }

  const applyVideoEffect = (effectName) => {
    currentVideoFilter.value = effectName
    applyVideoEffects()
    handleMessage(`Applied ${effectName} effect`, 'info')
  }

  const removeVideoEffect = (effectName) => {
    if (currentVideoFilter.value === effectName) {
      currentVideoFilter.value = 'none'
      applyVideoEffects()
      handleMessage(`Removed ${effectName} effect`, 'info')
    }
  }

  return {
    // State
    videoStream,
    currentVideoFilter,
    videoFlipHorizontal,
    videoFlipVertical,
    autoFocusEnabled,
    isFullscreen,
    showVideoSettings,
    isLiveActive,
    videoCanvas,
    videoContext,
    videoFilters,

    // Computed
    videoEffects,

    // Methods
    setMessageHandler,
    toggleVideoSettings,
    toggleFullscreen,
    toggleAutoFocus,
    changeVideoFilter,
    toggleFlipHorizontal,
    toggleFlipVertical,
    resetVideoEffects,
    applyVideoEffects,
    setupVideoCanvas,
    switchCamera,
    startLive,
    stopLive,
    applyVideoEffect,
    removeVideoEffect,
  }
}
