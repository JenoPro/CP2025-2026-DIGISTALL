import { computed, reactive, onUnmounted } from 'vue'

export default {
  setup(props, { emit }) {
    const model = computed({
      get: () => props.modelValue,
      set: (v) => emit('update:modelValue', v),
    })

    // Flatten data for easier access
    const d = computed(() => props.data || {})

    // Names
    const fullName = computed(() =>
      [d.value.firstName, d.value.middleName, d.value.lastName, d.value.suffix]
        .filter(Boolean)
        .join(' '),
    )
    const spouseFull = computed(() =>
      [d.value.spouseFirst, d.value.spouseMiddle, d.value.spouseLast].filter(Boolean).join(' '),
    )
    const childFull = computed(() =>
      [d.value.childFirst, d.value.childMiddle, d.value.childLast].filter(Boolean).join(' '),
    )
    const photoSrc = computed(() => props.photo)

    // Document lists (two columns)
    const docListLeft = [
      { key: 'clearance', label: 'Barangay Business Clearance', fallback: 'Clearance.pdf' },
      { key: 'cedula', label: 'Cedula', fallback: 'Cedula.pdf' },
      { key: 'association', label: 'Association Clearance', fallback: 'Association.pdf' },
    ]
    const docListRight = [
      { key: 'votersId', label: "Voter's ID", fallback: 'VotersID.pdf' },
      { key: 'picture', label: '2x2 Picture (White background)', fallback: 'Picture.png' },
      { key: 'healthcard', label: 'Health Card/Yellow Card', fallback: 'healthcard.png' },
    ]

    // --- File helpers (JS-only) ---

    // store blob URLs for File objects so we can revoke later
    const blobUrls = reactive({})

    function toUrl(file) {
      if (!file) return null

      // absolute string URL
      if (typeof file === 'string') {
        try {
          const u = new URL(file)
          return u.href
        } catch {
          // plain filename, not openable without hosting
          return null
        }
      }

      // object with .url property
      if (file && file.url) return file.url

      // File object (from v-file-input)
      if (typeof File !== 'undefined' && file instanceof File) {
        if (!blobUrls[file.name]) blobUrls[file.name] = URL.createObjectURL(file)
        return blobUrls[file.name]
      }

      return null
    }

    function fileName(file, fallback) {
      if (!file) return fallback
      if (typeof file === 'string') {
        const parts = file.split('/')
        return parts[parts.length - 1] || fallback
      }
      return file?.name || fallback
    }

    function downloadFile(file, fallbackName) {
      const url = toUrl(file)
      if (!url) return
      const a = document.createElement('a')
      a.href = url
      const name = typeof file === 'string' ? file.split('/').pop() : file?.name || fallbackName
      a.download = name || fallbackName
      document.body.appendChild(a)
      a.click()
      a.remove()
    }

    function openFile(file) {
      const url = toUrl(file)
      if (!url) return
      window.open(url, '_blank')
    }

    onUnmounted(() => {
      Object.values(blobUrls).forEach((u) => URL.revokeObjectURL(u))
    })

    return {
      model,
      d,
      fullName,
      spouseFull,
      childFull,
      photoSrc,
      docListLeft,
      docListRight,
      toUrl,
      fileName,
      downloadFile,
      openFile
    }
  },
  props: {
    modelValue: { type: Boolean, default: false },
    data: { type: Object, default: () => ({}) }, // full form payload
    photo: { type: String, default: 'https://i.pravatar.cc/200?img=12' },
  },
  emits: ['update:modelValue']
}