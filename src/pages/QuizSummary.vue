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

const averageRating = ref(null)
const starCounts = ref({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
const feedbackMessages = ref(null)
const id = route.params.id
const fetchResult = async () => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${contextStore.user.token}` },
    }
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/summary/${route.params.id}`,
      config
    )
    averageRating.value = data.averageRating
    starCounts.value = data.starCounts
    feedbackMessages.value = data.feedbackMessages.$values.filter(
      (feedback) => feedback.message.trim() !== ''
    )
  } catch (error) {
    // snackbar.value = { text: error.response?.data?.message || 'An error occurred', color: 'red' }
    toast.error(error.response?.data?.message || 'An error occurred')
  }
}

onMounted(() => {
  if (contextStore.user) fetchResult()
})
</script>

<template>
  <div
    className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200"
  >
    <!-- Header -->
    <div
      className="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6"
    >
      <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Summary</h1>
      <DropdownMenu />
    </div>

    <!-- Summary Details -->
    <div
      className="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200"
    >
      <div className="w-full max-w-2xl">
        <div className="w-full flex justify-between items-center gap-5 mb-6">
          <button
            type="button"
            @click="router.push(`/quiz-leaderboard/${id}`)"
            className="h-10 w-28 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black rounded-lg font-semibold cursor-pointer"
          >
            Leaderboard
          </button>
          <button
            type="button"
            @click="router.back()"
            className="w-24 h-10 bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
          >
            Back
          </button>
        </div>

        <!-- Average Rating -->
        <div className="w-full mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Average Rating
          </h2>
          <template v-if="!averageRating">
            <v-progress-circular indeterminate color="grey-darken-2" size="40" class="mx-auto" />
          </template>
          <template v-else>
            <div class="flex items-center p-3 space-x-">
              <v-rating
                v-model="averageRating"
                half-increments
                hover
                color="amber"
                readonly
                size="large"
              />
              <span className="text-2xl text-amber-darken">{{ averageRating }}</span>
            </div>
          </template>

          <!-- Star Counts -->
          <h2 class="text-h5 font-semibold mt-6 mb-4">Star Ratings Breakdown</h2>
          <template v-if="!starCounts">
            <v-progress-circular indeterminate color="grey-darken-2" size="40" class="mx-auto" />
          </template>
          <template v-else>
            <div class="p-3">
              <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="d-flex align-center">
                <v-rating
                  :model-value="star"
                  color="amber"
                  readonly
                  density="compact"
                  size="small"
                  class="mr-2"
                />
                <span class="text-body-1 text-grey-darken-2"
                  >{{ star }} stars: {{ starCounts[star] }}</span
                >
              </div>
            </div>
          </template>
        </div>
        <!-- Feedbacks -->
        <div className="w-full">
          <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Feedbacks</h2>
          <template v-if="!feedbackMessages">
            <v-progress-circular indeterminate color="grey-darken-2" size="40" class="mx-auto" />
          </template>
          <template v-else>
            <div class="max-h-96 p-3 space-y-4 overflow-y-auto no-scrollbar">
              <template v-if="feedbackMessages.length > 0">
                <div
                  v-for="(feedback, index) in feedbackMessages"
                  :key="index"
                  class="mb-3 pa-4"
                  elevation="2"
                >
                  <div
                    key="{index}"
                    className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md dark:shadow-gray-900 text-gray-700 dark:text-gray-200"
                  >
                    <div className="font-semibold text-blue-600 dark:text-blue-400">
                      {{ feedback.user }}
                    </div>
                    <div className="mt-2">{{ feedback.message }}</div>
                  </div>
                </div>
              </template>
              <template v-else>
                <p class="text-body-1 text-grey-darken-2">No feedback available.</p>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
