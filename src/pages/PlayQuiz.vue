<script setup>
import { ref, onMounted, watchEffect, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useContextStore } from '@/stores/contextStore'
import { toast } from 'vue3-toastify'
import { useQuizStore } from '@/stores/quizStore'

const contextStore = useContextStore()
const router = useRouter()
const route = useRoute()
const quizStore = useQuizStore()

const quiz = ref(null)
const timeRemaining = ref(0)
const questionNumber = ref(0)
const selectedOptions = ref([])
const questions = ref([])
const loading = ref(false)

onMounted(() => {
  quiz.value = quizStore.quiz
  // console.log(quiz.value)
  if (!quiz.value) {
    router.push('/join-quiz')
    toast.error('Error in accessing quiz!')
    return
  }
  quizStore.clearQuiz()

  const savedTime = localStorage.getItem('quiz_time_remaining')
  timeRemaining.value = savedTime ? parseInt(savedTime, 10) : quiz.value.duration * 60

  const savedAttemptedQuestions = JSON.parse(localStorage.getItem('attempted_questions'))
  questions.value = savedAttemptedQuestions || []

  const timer = setInterval(() => {
    timeRemaining.value--
    localStorage.setItem('quiz_time_remaining', timeRemaining.value)

    if (timeRemaining.value <= 0) {
      clearInterval(timer)
      handleFinish()
    }
  }, 1000)

  return () => clearInterval(timer)
})

watch(route, (r) => {
  // console.log(r)
})

watchEffect(() => {
  const currentQuestion = questions.value.find(
    (q) => q.questionId === quiz.value.questions.$values[questionNumber.value].id
  )
  selectedOptions.value = currentQuestion ? currentQuestion.answers : []
})

const handleClearSelection = () => {
  questions.value = questions.value.filter(
    (q) => q.questionId !== quiz.value.questions.$values[questionNumber.value].id
  )
  localStorage.setItem('attempted_questions', JSON.stringify(questions.value))
}

const handlePrev = () => {
  if (questionNumber.value > 0) {
    questionNumber.value--
    selectedOptions.value = []
  }
}

const handleNext = () => {
  if (questionNumber.value < quiz.value.questions.$values.length - 1) {
    questionNumber.value++
    selectedOptions.value = []
  }
}

const handleSubmit = () => {
  if (selectedOptions.value.length === 0) {
    toast.error('Please select an option')
    return
  }

  const currentQuestion = quiz.value.questions.$values[questionNumber.value]
  const attemptedQuestion = {
    questionId: currentQuestion.id,
    answers: [...selectedOptions.value],
  }

  questions.value = questions.value.filter((q) => q.questionId !== currentQuestion.id)
  questions.value.push(attemptedQuestion)
  localStorage.setItem('attempted_questions', JSON.stringify(questions.value))
  handleNext()
}

const handleFinish = async () => {
  loading.value = true
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${contextStore.user.token}`,
        'Content-type': 'application/json',
      },
    }
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/attempt`,
      { quizId: quiz.value.id, questions: questions.value },
      config
    )
    localStorage.removeItem('quiz_time_remaining')
    localStorage.removeItem('attempted_questions')
    router.replace(`/quiz-feedback/${data.resultId}`)
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred')
  } finally {
    loading.value = false
  }
}

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  seconds %= 3600
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(
    secs
  ).padStart(2, '0')}`
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200"
  >
    <div
      class="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6"
    >
      <h1 class="text-3xl font-bold text-gray-700 dark:text-gray-200">Play Quiz</h1>
      <div class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Time Remaining:
        <span class="text-red-500 dark:text-red-400">{{ formatTime(timeRemaining) }}</span>
      </div>
    </div>
    <div
      class="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200"
    >
      <div v-if="quiz" class="w-full flex flex-col justify-between">
        <button
          type="button"
          @click="handleFinish"
          :class="`w-24 h-10 ${
            loading
              ? 'bg-gray-200 dark:bg-gray-700'
              : 'bg-red-600 dark:bg-red-400 hover:bg-red-700 dark:hover:bg-red-300 text-white dark:text-black'
          } self-end font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300`"
        >
          <span>Finish</span>
        </button>
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Question {{ questionNumber + 1 }}:
          </h2>
          <p class="text-base text-gray-700 dark:text-gray-200 mb-2">
            {{ quiz.questions.$values[questionNumber].title }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{
              quiz.questions.$values[questionNumber].numberOfAnswers === 1
                ? 'Single answer correct'
                : 'Multiple answers correct'
            }}
          </p>
        </div>
        <div class="w-full flex flex-col justify-center gap-4 mb-6">
          <div
            v-for="(option, index) in quiz.questions.$values[questionNumber].options.$values"
            :key="index"
            :class="`p-4 rounded-md shadow-md dark:shadow-gray-900 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
              selectedOptions.includes(index) ? 'bg-gray-200 dark:bg-gray-600' : ''
            }`"
          >
            <input
              type="checkbox"
              :id="`option${index + 1}`"
              :value="index"
              v-model="selectedOptions"
              class="mr-2"
            />
            <label :for="`option${index + 1}`" class="text-base text-gray-700 dark:text-gray-200">
              {{ option }}
            </label>
          </div>
        </div>
        <div class="w-full flex justify-between mb-4">
          <button
            type="button"
            @click="handlePrev"
            class="w-24 h-10 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300 disabled:opacity-50"
            :disabled="questionNumber === 0"
          >
            Prev
          </button>
          <button
            type="button"
            @click="handleNext"
            class="w-24 h-10 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300 disabled:opacity-50"
            :disabled="questionNumber === quiz.questions.$values.length - 1"
          >
            Next
          </button>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            @click="handleSubmit"
            class="w-full max-w-32 h-10 bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
          >
            Save
          </button>
          <button
            type="button"
            @click="handleClearSelection"
            class="w-full max-w-32 h-10 bg-yellow-600 dark:bg-yellow-400 hover:bg-yellow-700 dark:hover:bg-yellow-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
          >
            Clear
          </button>
        </div>
      </div>
      <div v-else class="text-base text-gray-800 dark:text-gray-200">No questions found!</div>
    </div>
  </div>
</template>
