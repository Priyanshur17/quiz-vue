<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import DropdownMenu from '@/components/miscellaneous/DropdownMenu.vue'
import { useContextStore } from '@/stores/contextStore'
import { toast } from 'vue3-toastify'

const contextStore = useContextStore()
const router = useRouter()
const route = useRoute()

const rating = ref(null)
const message = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  if (!rating.value) {
    toast.error('Please select a rating')
    return
  }

  loading.value = true
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${contextStore.user.token}`,
        'Content-type': 'application/json',
      },
    }
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/feedback/${route.params.id}`,
      { rating: rating.value, message: message.value },
      config
    )
    rating.value = null
    message.value = ''
    // console.log(data)
    // console.log(data.message)
    // snackbar.value = { text: data.message, color: 'green' }
    toast.success(data.message)
    setTimeout(() => router.replace(`/quiz-result/${route.params.id}`), 1000)
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-white"
  >
    <div
      className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6"
    >
      <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Feedback</h1>
      <DropdownMenu />
    </div>

    <!-- Feedback Form -->
    <div
      className="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200"
    >
      <v-form @submit.prevent="handleSubmit" class="w-100 max-w-md d-flex flex-column align-center">
        <v-rating v-model="rating" color="amber" density="compact" size="large" class="mb-8" />

        <v-textarea
          v-model="message"
          label="Write your feedback here..."
          variant="outlined"
          rows="4"
          class="mb-4"
        />

        <v-btn color="blue-darken-1" class="mt-4" @click="handleSubmit" :loading="loading">
          Submit
        </v-btn>
      </v-form>
    </div>
  </div>
</template>
