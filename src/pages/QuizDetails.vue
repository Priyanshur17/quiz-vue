<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DropdownMenu from '@/components/miscellaneous/DropdownMenu.vue'
import { toast } from 'vue3-toastify'

const router = useRouter()
const route = useRoute()

const id = ref(null)

onMounted(() => {
  if (!route.query.id) {
    router.push('/create-quiz')
    return
  }
  id.value = route.query.id
})

const copyToClipboard = () => {
  navigator.clipboard.writeText(id.value)

  toast.success('Copied to clipboard')
}
</script>

<template>
  <div
    className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900"
  >
    <div
      className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6"
    >
      <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Details</h1>
      <DropdownMenu />
    </div>
    <div
      className="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center"
    >
      <div className="w-full flex justify-between items-center gap-5 mb-6">
        <button
          className="w-24 h-10 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
          @click="router.push('/')"
        >
          Back
        </button>
      </div>
      <label htmlFor="code" className="text-xl text-gray-700 dark:text-gray-200 mb-6"
        >Use this code to join the quiz</label
      >
      <input
        type="text"
        id="code"
        readOnly
        className="w-full max-w-md bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-center text-2xl font-semibold text-gray-800 dark:text-gray-200 shadow-inner mb-6"
        v-model="id"
      />
      <div className="w-full max-w-md flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          @click="copyToClipboard"
          className="px-6 py-3 bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300 text-white dark:text-black text-lg font-medium rounded-lg shadow dark:shadow-gray-800 transition duration-300"
        >
          Copy
        </button>
        <button
          type="button"
          @click="router.push(`/view-quiz/${id}`)"
          className="px-6 py-3 bg-orange-600 dark:bg-orange-400 hover:bg-orange-700 dark:hover:bg-orange-300 text-white dark:text-black text-lg font-medium rounded-lg shadow dark:shadow-gray-800 transition duration-300"
        >
          View
        </button>
        <button
          type="button"
          @click="router.push(`/quiz-summary/${id}`)"
          className="px-6 py-3 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black text-lg font-medium rounded-lg shadow dark:shadow-gray-800 transition duration-300"
        >
          Summary
        </button>
      </div>
    </div>
  </div>
</template>
