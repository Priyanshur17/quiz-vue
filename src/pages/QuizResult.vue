<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import DropdownMenu from '@/components/miscellaneous/DropdownMenu.vue'
import { useContextStore } from '@/stores/contextStore'
import { toast } from 'vue3-toastify'

const contextStore = useContextStore()
const router = useRouter()
const route = useRoute()

const result = ref(null)

const fetchResult = async () => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${contextStore.user.token}` },
    }
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/result/${route.params.id}`,
      config
    )
    result.value = data.result
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred')
  }
}

onMounted(() => {
  if (contextStore.user) fetchResult()
})
</script>

<template>
  <div
    className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-white dark:text-gray-100"
  >
    <div
      className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6"
    >
      <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Quiz Result</h1>
      <DropdownMenu />
    </div>
    <div
      className="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200"
    >
      <div v-if="result">
        <div class="w-full max-w-md">
          <table
            class="w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg dark:shadow-gray-950 mb-6 overflow-hidden"
          >
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-600">
                <th class="py-2 px-4 text-left">Details</th>
                <th class="py-2 px-4 text-left">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b dark:border-gray-600">
                <td class="py-2 px-4">Total questions</td>
                <td class="py-2 px-4">{{ result.questions.$values.length }}</td>
              </tr>
              <tr class="border-b dark:border-gray-600">
                <td class="py-2 px-4">Attempted questions</td>
                <td class="py-2 px-4">
                  {{
                    result.questions.$values.filter((q) => q.answers.$values.length !== 0).length
                  }}
                </td>
              </tr>
              <tr class="border-b dark:border-gray-600">
                <td class="py-2 px-4">Unattempted questions</td>
                <td class="py-2 px-4">
                  {{
                    result.questions.$values.filter((q) => q.answers.$values.length === 0).length
                  }}
                </td>
              </tr>
              <tr class="border-b dark:border-gray-600">
                <td class="py-2 px-4">Correct answers</td>
                <td class="py-2 px-4">
                  {{ result.questions.$values.filter((q) => q.isCorrect === 'True').length }}
                </td>
              </tr>
              <tr class="border-b dark:border-gray-600">
                <td class="py-2 px-4">Partially Correct answers</td>
                <td class="py-2 px-4">
                  {{ result.questions.$values.filter((q) => q.isCorrect === 'Partial').length }}
                </td>
              </tr>
              <tr>
                <td class="py-2 px-4">Incorrect answers</td>
                <td class="py-2 px-4">
                  {{
                    result.questions.$values.filter(
                      (q) => q.isCorrect === 'False' && q.answers.$values.length !== 0
                    ).length
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          @click="router.push('/')"
          className="w-32 h-12 bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
        >
          Home
        </button>
        <button
          type="button"
          @click="router.push(`/review-result/${result.id}`)"
          className="w-32 h-12 bg-orange-600 dark:bg-orange-400 hover:bg-orange-700 dark:hover:bg-orange-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
        >
          Review
        </button>
        <button
          type="button"
          @click="router.push(`/quiz-summary/${result.quizId}`)"
          className="w-32 h-12 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
        >
          Summary
        </button>
      </div>
    </div>
  </div>
</template>
