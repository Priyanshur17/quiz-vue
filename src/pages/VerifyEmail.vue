<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useContextStore } from '@/stores/contextStore'
import { toast } from 'vue3-toastify'

const contextStore = useContextStore()
const router = useRouter()
const route = useRoute()

const loading = ref(false)
const isVerified = ref(false)

const handleSubmit = async () => {
  // console.log('handleSubmit called') // Debugging: Confirm when this function is called
  loading.value = true

  try {
    // console.log('Route Params:', route.params) // Debugging: Log route params
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/verify-email/${route.params.id}/${
      route.params.token
    }`
    // console.log('API URL:', url) // Debugging: Log the full API URL
    localStorage.removeItem('userInfo') // Clear userInfo before verification
    const { data } = await axios.get(url, { headers: { 'Content-Type': 'application/json' } })
    // console.log('API Response:', data) // Debugging: Log API response
    toast.success(data.message)
    isVerified.value = true
    localStorage.setItem('userInfo', JSON.stringify(data.user))
    setTimeout(() => router.push('/auth'), 1000)
  } catch (error) {
    // console.error('Verification Error:', error) // Debugging: Log error
    toast.error(error.response?.data?.message || 'An error occurred')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div
      class="w-[90%] max-w-xl my-5 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950"
    >
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-700 dark:text-gray-200">Email Verification</h1>
      </div>

      <div class="mt-8">
        <form
          method="POST"
          class="w-full px-6 py-8 bg-white dark:bg-gray-800 rounded-lg"
          noValidate
        >
          <div class="flex justify-center">
            <button
              type="button"
              @click="handleSubmit"
              :class="`w-28 h-12 ${
                loading
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black'
              } rounded-lg hover:scale-105 transition-colors duration-300`"
              :disabled="loading"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg
                  class="animate-spin h-5 w-5 text-white dark:text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              <span v-else>
                {{ isVerified ? 'Verified' : 'Not Verified' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
