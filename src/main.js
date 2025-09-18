import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

// Initialize theme on app start
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('userTheme') || 'light'

  if (savedTheme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    vuetify.theme.global.name = prefersDark ? 'dark' : 'light'
  } else {
    vuetify.theme.global.name = savedTheme
  }

  // Apply theme classes to body
  document.body.className = document.body.className.replace(/theme-\w+/g, '')
  document.body.classList.add(`theme-${vuetify.theme.global.name}`)
}

// Initialize language on app start
const initializeLanguage = () => {
  const savedLanguage = localStorage.getItem('userLanguage') || 'en'

  // Apply language class to body
  document.body.className = document.body.className.replace(/lang-\w+/g, '')
  document.body.classList.add(`lang-${savedLanguage}`)
}

// Initialize theme and language
initializeTheme()
initializeLanguage()

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const savedTheme = localStorage.getItem('userTheme')
  if (savedTheme === 'system') {
    initializeTheme()
  }
})

createApp(App).use(router).use(vuetify).mount('#app')
