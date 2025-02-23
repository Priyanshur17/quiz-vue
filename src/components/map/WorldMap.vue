<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'
import { useContextStore } from '@/stores/contextStore'

const contextStore = useContextStore()
const router = useRouter()
const mapContainer = ref(null)
const map = ref(null)
const quizNodes = ref([])
const isLoading = ref(true)
const isContextReady = ref(false)

// Context ready check
onMounted(async () => {
  await router.isReady()

  // Add a small delay to ensure store is populated
  setTimeout(() => {
    if (contextStore.user && contextStore.user.token) {
      // console.log('Context is ready, user token found')
      isContextReady.value = true
    } else {
      // Try to get user info from localStorage directly
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      if (userInfo && userInfo.token) {
        contextStore.setUser(userInfo)
        // console.log('User info loaded from localStorage')
        isContextReady.value = true
      }
    }
  }, 100)
})

// Watch for user changes in context store
watch(
  () => contextStore.user,
  (newUser) => {
    if (newUser && newUser.token) {
      isContextReady.value = true
    }
  }
)

// Map initialization
watch(
  () => [isContextReady.value, contextStore.darkMode],
  ([contextReady]) => {
    if (!contextReady || !mapContainer.value || map.value) return

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

    try {
      // console.log('Initializing map...')
      map.value = new mapboxgl.Map({
        container: mapContainer.value,
        style: contextStore.darkMode
          ? 'mapbox://styles/mapbox/dark-v11'
          : 'mapbox://styles/mapbox/streets-v12',
        center: [77.1025, 28.7041],
        zoom: 4,
        attributionControl: true,
      })

      map.value.addControl(new mapboxgl.NavigationControl(), 'top-right')

      map.value.on('load', () => {
        // console.log('Map loaded successfully')
        fetchQuizNodes()
      })

      map.value.on('error', (e) => {
        console.error('Mapbox error:', e)
      })
    } catch (error) {
      console.error('Map initialization error:', error)
    }
  },
  { immediate: true }
)

const fetchQuizNodes = async () => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${contextStore.user.token}`,
        'Content-type': 'application/json',
      },
    }
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/nodes`,
      config
    )
    quizNodes.value = response.data.nodes
    addMarkers(response.data.nodes)
  } catch (error) {
    console.error('Error fetching quiz nodes:', error)
  }
}

const addMarkers = (nodes) => {
  // Remove existing markers if any
  const markers = document.getElementsByClassName('marker')
  while (markers[0]) {
    markers[0].parentNode.removeChild(markers[0])
  }

  nodes.$values.forEach((node) => {
    const el = document.createElement('div')
    el.className = 'marker'
    // Update marker style to match the example
    el.style.backgroundImage = "url('https://img.icons8.com/office/40/marker.png')"
    el.style.width = '20px'
    el.style.height = '20px'
    el.style.borderRadius = '50%'
    el.style.cursor = 'pointer'
    el.style.backgroundSize = 'cover'

    const popup = new mapboxgl.Popup({
      offset: 25,
      maxWidth: '400px', // Adjusted to accommodate your popup content
    }).setHTML(createPopupContent(node))

    new mapboxgl.Marker(el)
      .setLngLat([node.longitude, node.latitude])
      .setPopup(popup)
      .addTo(map.value)

    popup.on('open', () => {
      const popupElement = document.querySelector('.mapboxgl-popup-content')
      if (popupElement) {
        const quizElements = popupElement.querySelectorAll('.quiz-item > div')
        quizElements.forEach((element) => {
          element.addEventListener('click', () => {
            const quizId = element.getAttribute('data-quiz-id')

            // Add click animation
            element.style.transform = 'scale(0.98)'
            setTimeout(() => {
              element.style.transform = 'scale(1)'
            }, 100)

            // Add loading state
            element.classList.add('opacity-70')
            element.innerHTML += `
              <div class="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            `

            // Navigate after a small delay
            setTimeout(() => {
              router.push(`/start-quiz/${quizId}`)
            }, 300)
          })
        })
      }
    })
  })
}

const createPopupContent = (node) => {
  return `
    <div class="popup-container p-4 min-w-[300px] max-w-[400px]">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-lg font-bold text-gray-800">Available Quizzes</h3>
        <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          ${node.quizzes.$values.length} Quizzes
        </span>
      </div>

      <div class="quiz-list-container max-h-[300px] overflow-y-auto custom-scrollbar">
        <ul class="space-y-3">
          ${node.quizzes.$values
            .map(
              (quiz) => `
              <li class="quiz-item">
                <div class="cursor-pointer border border-gray-200 hover:border-blue-400
                          rounded-lg p-3 transition-all duration-300 hover:shadow-md
                          hover:bg-gray-50 group relative"
                     data-quiz-id="${quiz._id}">
                  <div class="flex flex-col gap-1">
                    <div class="flex justify-between items-start">
                      <span class="font-medium text-gray-800 group-hover:text-blue-600">
                        ${quiz.title}
                      </span>
                      <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        ${quiz.isLocked ? 'Locked' : 'Unlocked'}
                      </span>
                    </div>

                    ${
                      quiz.creator
                        ? `
                      <div class="flex items-center gap-2 mt-1">
                        <div class="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                          <span class="text-xs text-gray-600">
                            ${quiz.creatorName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span class="text-sm text-gray-500">
                          ${quiz.creatorName}
                        </span>
                      </div>
                    `
                        : ''
                    }

                    ${
                      quiz.description
                        ? `
                      <p class="text-sm text-gray-600 mt-2 line-clamp-2">
                        ${quiz.description}
                      </p>
                    `
                        : ''
                    }

                    <div class="flex gap-2 mt-2">
                      <span class="text-xs text-gray-500 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ${quiz.duration || '10'} mins
                      </span>
                      <span class="text-xs text-gray-500 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ${quiz.totalQuestions} questions
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            `
            )
            .join('')}
        </ul>
      </div>
    </div>
  `
}
</script>

<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container" />
  </div>
</template>

<style>
/* Remove the full screen styles */
.map-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-container {
  width: 100%;
  height: 100%;
}

.mapboxgl-popup {
  max-height: 70vh;
  font-family: 'Open Sans', sans-serif;
}

.mapboxgl-popup-content {
  padding: 0;
  border-radius: 8px;
  max-height: calc(70vh - 40px);
  overflow: hidden;
}

/* Keep your existing popup container styles */
.popup-container {
  max-height: inherit;
  display: flex;
  flex-direction: column;
}

.quiz-list-container {
  flex: 1;
  overflow-y: auto;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

/* Add the map styles from the example */
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
