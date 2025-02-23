<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { toast } from 'vue3-toastify'

const router = useRouter()

const email = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  if (!email.value) {
    // snackbar.value = { text: 'Please enter email', color: 'red', show: true }
    toast.error('Please enter email')
    return
  }

  loading.value = true
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/send-reset-password-email`,
      { email: email.value }
    )

    toast.success(data.message)
    setTimeout(() => router.push('/auth'), 1000)
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="w-full px-6 py-8 bg-white dark:bg-gray-800 rounded-lg"
  >
    <div class="mb-4">
      <label for="email" class="block text-lg font-medium text-gray-700 dark:text-gray-200"
        >Email</label
      >
      <input
        type="email"
        id="email"
        v-model="email"
        class="w-full mt-2 p-3 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
    <div class="flex justify-center">
      <button
        type="submit"
        class="w-24 h-12 rounded-lg hover:scale-105 transition-colors duration-300"
        :class="{
          'bg-gray-200 dark:bg-gray-700': loading,
          'bg-blue-600 dark:bg-blue-400 text-white dark:text-black hover:bg-blue-700 dark:hover:bg-blue-300':
            !loading,
        }"
      >
        <span>Submit</span>
      </button>
    </div>
    <ToastContainer position="top-right" :theme="darkMode ? 'dark' : 'light'" />
  </form>
</template>
