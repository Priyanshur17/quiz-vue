<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useContextStore } from '@/stores/contextStore'

const contextStore = useContextStore()
const router = useRouter()
const loggedUser = ref(JSON.parse(localStorage.getItem('userInfo')))
const open = ref(false)

watch(
  () => contextStore.user,
  (newUser) => {
    loggedUser.value = newUser
  }
)

const handleLogout = () => {
  localStorage.removeItem('userInfo')
  contextStore.setUser(null)
  router.push('/auth')
}
</script>

<template>
  <div class="relative inline-block text-left">
    <!-- Mobile Menu Button -->
    <div class="sm:hidden">
      <button
        type="button"
        @click="open = !open"
        class="inline-flex justify-center items-center gap-x-1.5 rounded-lg bg-teal-600 dark:bg-teal-400 px-4 py-3 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-teal-700 dark:hover:bg-teal-300 focus:outline-none"
      >
        <span class="sr-only">Open options</span>
        <i v-if="open" class="fas fa-times h-5 w-5"></i>
        <i v-else class="fas fa-bars h-5 w-5"></i>
      </button>
    </div>

    <!-- Desktop Menu Button -->
    <div class="hidden sm:block">
      <button
        type="button"
        @click="open = !open"
        class="inline-flex justify-center items-center gap-x-1.5 rounded-lg bg-teal-600 dark:bg-teal-400 px-4 py-3 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-teal-700 dark:hover:bg-teal-300 focus:outline-none"
      >
        <span>Options</span>
        <svg class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- Dropdown Menu -->
    <div
      v-if="open"
      class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-800 rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 focus:outline-none"
      role="menu"
    >
      <!-- User Info -->
      <div
        class="py-2 bg-teal-600 dark:bg-teal-400 text-white dark:text-black rounded-t-md flex items-center gap-2 px-4"
      >
        <i class="fas fa-user-circle h-6 w-6"></i>
        <span class="block text-sm">
          Signed in as {{ loggedUser ? loggedUser.email : 'guest' }}
        </span>
      </div>

      <!-- Dark Mode Toggle -->
      <!-- <div class="py-1 bg-gray-50 dark:bg-gray-800" role="none">
        <span
          @click="contextStore.toggleDarkMode"
          class="flex flex-wrap items-center justify-start gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-700 cursor-pointer"
        >
          <i v-if="contextStore.darkMode" class="fas fa-moon text-lg"></i>
          <i v-else class="fas fa-sun text-lg"></i>
          {{ contextStore.darkMode ? 'Dark Mode' : 'Light Mode' }}
        </span>
      </div> -->

      <!-- Navigation Links -->
      <div class="py-1 bg-gray-50 dark:bg-gray-800" role="none">
        <a
          @click="router.push('/my-quizzes')"
          class="flex flex-wrap items-center justify-start gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-700 cursor-pointer"
        >
          <i class="fas fa-history text-lg"></i>
          My Quizzes
        </a>
        <a
          @click="router.push('/attempted-quizzes')"
          class="flex flex-wrap items-center justify-start gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-700 cursor-pointer"
        >
          <i class="fas fa-history text-lg"></i>
          Attempted Quizzes
        </a>
      </div>

      <!-- Logout -->
      <div class="py-1 bg-gray-50 dark:bg-gray-800 rounded-b-md" role="none">
        <span
          @click="handleLogout"
          class="flex flex-wrap items-center justify-start gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-700 cursor-pointer"
        >
          <i class="fas fa-sign-out-alt text-lg"></i>
          Logout
        </span>
      </div>
    </div>
  </div>
</template>
