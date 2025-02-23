<script setup>
import { useRouter } from 'vue-router'
import DropdownMenu from '@/components/miscellaneous/DropdownMenu.vue'

import WorldMap from '@/components/map/WorldMap.vue'

const router = useRouter()

const handleCreateQuiz = () => {
  router.push('/create-quiz')
}

const handleJoinQuiz = () => {
  router.push('/join-quiz')
}
</script>

<template>
  <div
    className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900"
  >
    <div
      className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6"
    >
      <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">QuizPlay</h1>
      <DropdownMenu />
    </div>

    <div
      className="w-[90%] max-w-4xl mb-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950"
    >
      <div className="w-full h-[400px] rounded-t-xl overflow-hidden">
        <WorldMap />
      </div>
    </div>
    <div
      className="w-[90%] max-w-4xl mb-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950"
    >
      <div className="p-8 max-sm:p-6">
        <div className="flex flex-wrap justify-center gap-5">
          <button
            className="h-12 w-40 rounded-md bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 transition transform hover:scale-105 text-xl text-white dark:text-black"
            @click="handleCreateQuiz"
          >
            Create a Quiz
          </button>
          <button
            className="h-12 w-40 rounded-md bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300 transition transform hover:scale-105 text-xl text-white dark:text-black"
            @click="handleJoinQuiz"
          >
            Join a Quiz
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
