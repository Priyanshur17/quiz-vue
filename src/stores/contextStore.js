import { defineStore } from 'pinia'
import { ref, watchEffect, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export const useContextStore = defineStore('context', () => {
  const user = ref(null)
  const darkMode = ref(localStorage.getItem('dark-mode') === 'true')
  const router = useRouter()
  const route = useRoute()

  router.isReady().then(() => {
    // <-- Key change: Wrap in router.isReady()
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    user.value = userInfo

    // console.log('Current Route:', route.path)
    // console.log('User Info:', userInfo)

    const isExcludedRoute =
      route.path === '/auth' ||
      route.path.startsWith('/verify-email/') ||
      route.path === '/forgot-password' ||
      route.path.startsWith('/reset-password/')

    // console.log('Is Excluded Route:', isExcludedRoute)

    if (!userInfo && !isExcludedRoute) {
      // console.log('Redirecting to /auth')
      router.push({ path: '/auth', query: { from: route.fullPath } })
    }
  })

  watchEffect(() => {
    // localStorage.setItem('dark-mode', darkMode.value)

    // Update DOM
    if (darkMode.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.style.colorScheme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.colorScheme = 'light'
    }
  })

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
  }

  return {
    user,
    darkMode,
    toggleDarkMode,
    setUser: (newUser) => (user.value = newUser),
  }
})
