<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import DropdownMenu from '@/components/miscellaneous/DropdownMenu.vue'
import { useContextStore } from '@/stores/contextStore'
import { useQuizStore } from '@/stores/quizStore'
import { toast } from 'vue3-toastify'

const contextStore = useContextStore()
const router = useRouter()
const route = useRoute()
const quizStore = useQuizStore()
const quiz = ref(null)
const loading = ref(false)
const navigateCalled = ref(false)

const fetchQuiz = async () => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${contextStore.user.token}` },
    }
    // console.log(route.params.id)
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/join/${route.params.id}`,
      config
    )
    // console.log(data.quiz)
    quiz.value = data.quiz
    navigateCalled.value = false
  } catch (error) {
    if (!navigateCalled.value) {
      //   snackbar.value = { text: error.response?.data?.message || 'An error occurred', color: 'red' }
      toast.error(error.response?.data?.message || 'An error occurred')
      navigateCalled.value = true
      setTimeout(() => router.replace('/join-quiz'), 1000)
    }
  }
}

onMounted(() => {
  if (contextStore.user) fetchQuiz()
})

const startQuiz = () => {
  loading.value = true
  if (!quiz.value) {
    toast.error('Quiz not found')
    loading.value = false
    return
  }
  if (quiz.value.isLocked) {
    toast.error('Quiz is locked. Please try again later.')
    loading.value = false
    return
  }
  // console.log(quiz.value)
  // router.push({ name: 'PlayQuiz', params: { quiz: quiz.value } })
  quizStore.setQuiz(quiz.value)
  router.push({ name: 'PlayQuiz' })
  loading.value = false
}
</script>

<template>
  <div
    className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900"
  >
    <div
      className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6"
    >
      <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Start Quiz</h1>
      <DropdownMenu />
    </div>

    <!-- Quiz Start Section -->
    <div
      className="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200"
    >
      <div className="w-full max-w-md flex items-center justify-center">
        <template v-if="!quiz">
          <v-progress-circular indeterminate color="grey-darken-2" size="70" />
        </template>
        <template v-else>
          <div className="w-full flex flex-col items-center justify-center gap-8">
            <div
              className="w-full p-6 bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center"
            >
              <div className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                {{ quiz.title }}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                by {{ quiz.name }}
              </div>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
              <button
                type="button"
                @click="startQuiz"
                :class="[
                  'h-12',
                  'w-28',
                  'rounded-md',
                  'transition',
                  'transform',
                  'hover:scale-105',
                  'text-xl',
                  loading
                    ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' // Added cursor-not-allowed
                    : 'bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300 text-white dark:text-black hover:scale-105', // Combined hover scale
                ]"
                :disabled="loading"
              >
                <div v-if="loading" class="animate-spin mr-2">
                  <div class="border-t-4 border-blue-500 border-solid rounded-full h-6 w-6"></div>
                </div>
                <span v-if="!loading">Start</span> <span v-if="loading">Loading...</span>
              </button>
              <button
                type="button"
                @click="router.back()"
                className="h-12 w-28 rounded-md bg-red-600 dark:bg-red-400 hover:bg-red-700 dark:hover:bg-red-300 transition transform hover:scale-105 text-xl text-white dark:text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<!-- <template v-else>
  <div class="w-100 max-w-md text-center">
    <v-card class="pa-6 mb-4 bg-grey-lighten-3 d-flex flex-column align-center">
      <h2 class="text-h5 font-bold">{{ quiz.title }}</h2>
      <p class="text-subtitle-1 mt-2">by {{ quiz.authorId.name }}</p>
    </v-card>

    <div class="d-flex justify-center gap-4">
      <v-btn color="green-darken-1" class="text-h6" :loading="loading" @click="startQuiz">
        Start
      </v-btn>
      <v-btn color="red-darken-1" class="text-h6" @click="router.back()">Cancel</v-btn>
    </div>
  </div>
</template> -->
