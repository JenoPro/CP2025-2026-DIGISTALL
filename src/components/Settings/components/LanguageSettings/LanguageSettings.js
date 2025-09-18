export default {
  name: 'LanguageSettings',
  props: {
    currentLanguage: {
      type: String,
      required: true,
    },
  },
  methods: {
    selectLanguage(language) {
      this.$emit('update-language', language)
    },
  },
}
