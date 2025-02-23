<script setup>
import { ref, onMounted } from 'vue'
import DropdownMenu from '@/components/miscellaneous/DropdownMenu.vue'
import CreateQuizForm from '@/components/quiz/CreateQuizForm.vue'
import { toast } from 'vue3-toastify'

const location = ref(null)

const requestLocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        location.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        // console.log(location.value)
        toast.success('Location access granted!')
      },
      (error) => {
        console.error('Location error:', error.code, error.message)

        if (error.code === 1) {
          toast.error('Location access was denied. Please enable location in browser settings.')
        } else if (error.code === 2) {
          toast.error('Location information is unavailable.')
        } else if (error.code === 3) {
          toast.error('Location request timed out.')
        }
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
    )
  } else {
    toast.error('Geolocation is not supported by your browser')
  }
}

onMounted(() => {
  requestLocation()
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
    <!-- Location Required Message -->
    <div
      v-if="!location"
      class="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-[90%]"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 dark:border-gray-300 mx-auto mb-4"
      ></div>
      <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Location Access Required
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        Please enable location access in your browser settings to create a quiz.
      </p>
      <ul class="text-left text-gray-600 dark:text-gray-300 mb-4 list-disc list-inside">
        <li>Click the lock icon near the address bar.</li>
        <li>Select "Site settings" or "Permissions".</li>
        <li>Find "Location" and set it to "Allow".</li>
        <li>Refresh this page after changing the settings.</li>
      </ul>
    </div>

    <!-- Create Quiz Form -->
    <template v-else>
      <div
        class="w-[90%] max-w-4xl mt-5 py-6 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex items-center justify-between mb-6"
      >
        <h1 class="text-3xl font-bold text-gray-700 dark:text-gray-200">Create Quiz</h1>
        <DropdownMenu />
      </div>

      <div
        class="w-[90%] max-w-4xl min-h-[600px] mb-5 p-16 max-sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200"
      >
        <CreateQuizForm :location="location" />
      </div>
    </template>
  </div>
</template>
