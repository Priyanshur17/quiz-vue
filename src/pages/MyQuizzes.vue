<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useContextStore } from '@/stores/contextStore'
import DropdownMenu from '@/components/miscellaneous/DropdownMenu.vue'
import QuizListItem from '@/components/miscellaneous/QuizListItem.vue'
import Skeleton from '@/components/miscellaneous/Skeleton.vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const contextStore = useContextStore()
const router = useRouter()

const quizzes = ref([])
const search = ref('')
const loading = ref(false)

const fetchMyQuizzes = async () => {
  loading.value = true
  try {
    const config = {
      headers: { Authorization: `Bearer ${contextStore.user.token}` },
    }
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/my-quizzes?search=${search.value}`,
      config
    )
    quizzes.value = data.quizzes
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (contextStore.user) fetchMyQuizzes()
})

watch(search, fetchMyQuizzes)

const goToQuizDetails = (id) => {
  router.push({ path: '/quiz-details', query: { id } })
}

const toggleLock = async (id, isLocked, setIsLocked) => {
  try {
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${contextStore.user.token}`,
      },
    }
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/lock`,
      { id },
      config
    )
    setIsLocked(!isLocked)
    toast.success(data.message)
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred')
  }
}
</script>

<template>
  <div
    className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900"
  >
    <div
      className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6"
    >
      <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">My Quizzes</h1>
      <DropdownMenu />
    </div>
    <div
      className="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-start text-gray-700 dark:text-gray-200"
    >
      <div className="w-full flex justify-between items-center gap-5 mb-6">
        <button
          className="w-24 h-10 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
          @click="router.push('/')"
        >
          Back
        </button>
      </div>
      <form className="w-full max-w-xl px-3 mx-auto mb-8">
        <label htmlFor="search" className="sr-only">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="search"
            v-model="search"
            className="block w-full p-4 pl-10 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 hover:focus:ring-indigo-400 dark:focus:border-indigo-600"
            placeholder="Search Quizzes"
          />
        </div>
      </form>
      <div
        className="h-96 w-full max-w-xl p-3 flex flex-col items-center gap-4 overflow-y-auto no-scrollbar"
      >
        <Skeleton v-if="loading" />
        <template v-else>
          <QuizListItem
            v-for="quiz in quizzes.$values"
            :key="quiz.id"
            :id="quiz.id"
            :quiz="quiz"
            :is-author="true"
            :handleClick="goToQuizDetails"
            :handleLock="toggleLock"
          />
          <div
            v-if="!quizzes.$values || quizzes.$values.length === 0"
            className="text-2xl text-gray-700 dark:text-gray-200"
          >
            No quizzes found
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
