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
const questionNumber = ref(0)

const fetchReviewResult = async () => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${contextStore.user.token}` },
    }
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/review-result/${route.params.id}`,
      config
    )
    result.value = data.result
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred')
  }
}

onMounted(() => {
  if (contextStore.user) fetchReviewResult()
})

const handlePrev = () => {
  if (questionNumber.value > 0) questionNumber.value--
}

const handleNext = () => {
  if (questionNumber.value < result.value.questions.$values.length - 1) questionNumber.value++
}

const getOptionStyle = (optionIndex, correctAnswerIndexes, selectedAnswerIndexes) => {
  if (selectedAnswerIndexes.includes(optionIndex)) {
    return correctAnswerIndexes.includes(optionIndex)
      ? 'bg-green-500 text-white dark:text-black'
      : 'bg-red-300 dark:bg-red-700'
  }
  return correctAnswerIndexes.includes(optionIndex)
    ? 'bg-green-300 dark:bg-green-700 text-black dark:text-white'
    : 'bg-white dark:bg-gray-800 text-black dark:text-white'
}
</script>

<template>
  <div
    className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200"
  >
    <div
      className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6"
    >
      <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Review Result</h1>
      <DropdownMenu />
    </div>
    <div
      class="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200"
    >
      <div v-if="result">
        <div class="w-full flex flex-col justify-between">
          <button
            type="button"
            @click="router.back()"
            class="w-24 h-10 self-end bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
          >
            Back
          </button>
          <div class="mb-6 w-full">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Question {{ questionNumber + 1 }}:
            </h2>
            <p class="text-base text-gray-700 dark:text-gray-200 mb-2">
              {{ result.questions.$values[questionNumber].question.title }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{
                result.questions.$values[questionNumber].question.answers.$values.length === 1
                  ? 'Single answer correct'
                  : 'Multiple answers correct'
              }}
            </p>
          </div>
          <div class="w-full flex flex-col justify-center gap-4 mb-6">
            <div
              v-for="(option, index) in result.questions.$values[questionNumber].question.options
                .$values"
              :key="index"
              :class="`p-4 rounded-md shadow-md dark:shadow-gray-900 ${getOptionStyle(
                index,
                result.questions.$values[questionNumber].question.answers.$values,
                result.questions.$values[questionNumber].answers.$values
              )}`"
            >
              <input
                type="checkbox"
                name="selected_option"
                :id="`option${index + 1}`"
                :value="option"
                :checked="result.questions.$values[questionNumber].answers.$values.includes(index)"
                class="mr-2"
                readonly
              />
              <label :for="`option${index + 1}`">
                {{ option }}
              </label>
            </div>
          </div>
          <div class="w-full flex justify-between mb-4">
            <button
              type="button"
              @click="handlePrev"
              :disabled="questionNumber === 0"
              class="w-24 h-10 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              @click="handleNext"
              :disabled="questionNumber === result.questions.$values.length - 1"
              class="w-24 h-10 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No result available yet or loading failed.</p>
      </div>
    </div>
  </div>
</template>
