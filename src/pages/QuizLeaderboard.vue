<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useContextStore } from '@/stores/contextStore'
import DropdownMenu from '@/components/miscellaneous/DropdownMenu.vue'
import { toast } from 'vue3-toastify'
// Add this import
import { AgGridVue } from 'ag-grid-vue3'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule])
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const contextStore = useContextStore()
const router = useRouter()
const route = useRoute()

const isLoading = ref(true) // Add loading state
const isLocked = ref(true)
const leaderboard = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const colDefs = ref([
  { headerName: 'Name', field: 'playerName' },
  { headerName: 'Total Score', field: 'totalScore' },
])
const rowData = ref([])

const fetchResult = async (page = 1) => {
  isLoading.value = true // Set loading to true when fetching
  try {
    const config = {
      headers: { Authorization: `Bearer ${contextStore.user.token}` },
    }
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/leaderboard/${route.params.id}?page=${page}`,
      config
    )
    leaderboard.value = data.leaderboard
    isLocked.value = data.isLocked
    totalPages.value = data.totalPages
    currentPage.value = data.currentPage

    rowData.value = Array.from(data.leaderboard.$values || []).map((item) => ({
      playerName: item.playerName,
      totalScore: item.totalScore,
    }))

    // console.log('rowData:', rowData.value)
    // console.log('colDefs:', colDefs.value)
  } catch (error) {
    console.error(error)
    toast.error(error.response?.data?.message || 'An error occurred')
  } finally {
    isLoading.value = false // Set loading to false after fetch completes
  }
}

onMounted(() => {
  if (contextStore.user) fetchResult(currentPage.value)
})

watch(currentPage, fetchResult)

const handlePreviousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200"
  >
    <!-- Header -->
    <div
      class="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6"
    >
      <h1 class="text-3xl font-bold text-gray-700 dark:text-gray-200">Summary</h1>
      <DropdownMenu />
    </div>

    <!-- Main Content -->
    <div
      class="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200"
    >
      <div v-if="isLoading" class="animate-spin">
        <svg class="w-16 h-16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>

      <div v-else class="w-full max-w-md">
        <div class="w-full flex justify-between items-center gap-5 mb-6">
          <button
            :class="`h-10 w-24 rounded-lg font-semibold cursor-pointer ${
              isLocked
                ? 'bg-red-600 dark:bg-red-400 text-white dark:text-black'
                : 'bg-green-600 dark:bg-green-400 text-white dark:text-black'
            }`"
          >
            {{ isLocked ? 'Locked' : 'Unlocked' }}
          </button>
          <button
            type="button"
            @click="router.back()"
            class="w-24 h-10 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white dark:text-black font-semibold rounded-lg shadow-md dark:shadow-gray-900 transition duration-300"
          >
            Back
          </button>
        </div>

        <div v-if="rowData.length > 0" class="ag-theme-alpine" style="height: 400px; width: 100%">
          <ag-grid-vue
            :rowData="rowData"
            :columnDefs="colDefs"
            :paginationPageSize="10"
            domLayout="autoHeight"
          >
          </ag-grid-vue>
        </div>
        <div v-else class="text-center py-4">No data available</div>

        <div class="flex justify-between items-center mt-4">
          <button
            @click="handlePreviousPage"
            :disabled="currentPage === 1"
            class="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded-lg shadow-md dark:shadow-gray-900 disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            @click="handleNextPage"
            :disabled="currentPage === totalPages"
            class="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded-lg shadow-md dark:shadow-gray-900 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
