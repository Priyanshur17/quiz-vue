<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useContextStore } from '@/stores/contextStore'
import { toast } from 'vue3-toastify'

const contextStore = useContextStore()
const router = useRouter()

const title = ref('')
const duration = ref(180)
const questions = ref([{ title: '', options: ['', '', '', ''], answers: [] }])
const currentQuestionIndex = ref(0)
const loading = ref(false)
const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
})
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

const handleChangeTitle = (e) => {
  title.value = e.target.value
}

const handleChangeDuration = (e) => {
  duration.value = e.target.value
}

const handleChangeQuestion = (e) => {
  currentQuestion.value.title = e.target.value
}

const handleChangeOption = (index, value) => {
  currentQuestion.value.options[index] = value
}

const handleChangeAnswer = (index) => {
  const answers = currentQuestion.value.answers
  if (answers.includes(index)) {
    currentQuestion.value.answers = answers.filter((answer) => answer !== index)
  } else {
    currentQuestion.value.answers.push(index)
  }
}

const handleAddOption = () => {
  currentQuestion.value.options.push('')
}

const handleRemoveOption = (index) => {
  currentQuestion.value.options.splice(index, 1)
}

const handleAddQuestion = () => {
  if (
    !currentQuestion.value.title ||
    currentQuestion.value.options.some((opt) => !opt) ||
    currentQuestion.value.answers.length === 0
  ) {
    toast.error('Please fill out all fields before adding a new question')
    return
  }

  questions.value.push({ title: '', options: ['', '', '', ''], answers: [] })
  currentQuestionIndex.value = questions.value.length - 1
}

const handleUpdateQuestion = () => {
  if (
    !currentQuestion.value.title ||
    currentQuestion.value.options.some((opt) => !opt) ||
    currentQuestion.value.answers.length === 0
  ) {
    toast.error('Please fill out all fields to update a question')
    return
  }

  toast.success('Question updated successfully')
}

const handleRemoveQuestion = (index) => {
  questions.value.splice(index, 1)
  if (questions.value.length === 0) {
    questions.value.push({ title: '', options: ['', '', '', ''], answers: [] })
  }
  currentQuestionIndex.value = Math.max(0, currentQuestionIndex.value - 1)
}

const handlePrev = () => {
  currentQuestionIndex.value = Math.max(0, currentQuestionIndex.value - 1)
}

const handleNext = () => {
  currentQuestionIndex.value = Math.min(questions.value.length - 1, currentQuestionIndex.value + 1)
}

const handleSubmit = async () => {
  if (title.value === '') {
    toast.error('Please enter a title')
    return
  }

  if (questions.value.length === 0) {
    toast.error('At least one question is required')
    return
  }

  if (
    questions.value.some(
      (question) =>
        !question.title || question.options.some((opt) => !opt) || question.answers.length === 0
    )
  ) {
    toast.error('Please complete all questions before submitting')
    return
  }

  loading.value = true
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${contextStore.user.token}`,
        'Content-Type': 'application/json',
      },
    }

    // Create the quiz
    // console.log('hi')
    // console.log(props)
    const quizResponse = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/create`,
      { title: title.value, questions: questions.value, duration: duration.value },
      config
    )

    toast.success(quizResponse.data.message)
    // console.log('hi')
    // console.log(props)
    // Check for nearby nodes
    const { latitude, longitude } = props.location
    // console.log(latitude, latitude)
    const checkNodeResponse = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/v1/quiz/nodes?latitude=${latitude}&longitude=${longitude}`,
      config
    )

    const QuizId = quizResponse.data.quiz.id

    if (checkNodeResponse.data.count > 0) {
      // If node exists, add quiz to existing node
      const node_id = checkNodeResponse.data.nodes.$values[0]._id
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/nodes/${node_id}/quiz/${QuizId}`,
        {},
        config
      )
      toast.success('Quiz added to existing node successfully!')
    } else {
      // If node doesn't exist, create a new node
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/quiz/nodes`,
        {
          longitude,
          latitude,
          QuizId,
        },
        config
      )
      toast.success('New node created with quiz successfully!')
    }

    // Redirect to quiz details page
    setTimeout(() => {
      router.push({ path: '/quiz-details', query: { id: quizResponse.data.quiz.id } })
    }, 1000)
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full flex flex-col items-center gap-6 p-4">
    <div class="w-full max-w-2xl">
      <label for="title" class="text-xl text-gray-700 dark:text-gray-200">Title</label>
      <input
        type="text"
        id="title"
        v-model="title"
        class="w-full p-3 mt-2 bg-gray-200 dark:bg-gray-700 rounded-md text-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
        required
      />
    </div>

    <div class="w-full max-w-2xl">
      <label for="duration" class="text-xl text-gray-700 dark:text-gray-200"
        >Duration (minutes)</label
      >
      <input
        type="number"
        id="duration"
        v-model="duration"
        class="w-full p-3 mt-2 bg-gray-200 dark:bg-gray-700 rounded-md text-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
        required
        min="1"
      />
    </div>

    <div class="w-full max-w-2xl">
      <h3 class="text-xl text-gray-700 dark:text-gray-200">
        Question {{ currentQuestionIndex + 1 }}
      </h3>
      <textarea
        v-model="currentQuestion.title"
        class="w-full p-3 mt-2 bg-gray-200 dark:bg-gray-700 rounded-md text-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
        rows="3"
        required
      ></textarea>
    </div>

    <div class="w-full max-w-2xl">
      <h4 class="text-xl text-gray-700 dark:text-gray-200">Options</h4>
      <div
        v-for="(option, index) in currentQuestion.options"
        :key="index"
        class="flex items-center gap-3 mt-2"
      >
        <input
          type="text"
          v-model="currentQuestion.options[index]"
          :placeholder="`Option ${index + 1}`"
          class="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-md text-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
          required
        />
        <input
          type="checkbox"
          class="h-5 w-5 text-blue-500"
          :checked="currentQuestion.answers.includes(index)"
          @change="handleChangeAnswer(index)"
        />
        <button
          v-if="currentQuestion.options.length > 2"
          type="button"
          class="h-10 w-10 bg-red-500 hover:bg-red-600 rounded-full text-white"
          @click="handleRemoveOption(index)"
        >
          <span class="mx-auto">-</span>
        </button>
      </div>
      <button
        type="button"
        class="mt-2 h-12 w-16 bg-green-500 hover:bg-green-600 rounded-md text-xl text-white"
        @click="handleAddOption"
      >
        <span class="mx-auto">+</span>
      </button>
    </div>

    <div class="w-full max-w-2xl flex justify-between">
      <button
        type="button"
        class="h-12 w-24 bg-gray-600 hover:bg-gray-700 rounded-md text-xl text-white disabled:opacity-50"
        @click="handlePrev"
        :disabled="currentQuestionIndex === 0"
      >
        Prev
      </button>
      <button
        type="button"
        class="h-12 w-24 bg-gray-600 hover:bg-gray-700 rounded-md text-xl text-white disabled:opacity-50"
        @click="handleNext"
        :disabled="currentQuestionIndex === questions.length - 1"
      >
        Next
      </button>
    </div>

    <div class="w-full max-w-2xl flex justify-center gap-4">
      <button
        type="button"
        class="h-12 w-40 bg-blue-600 hover:bg-blue-700 rounded-md text-xl text-white"
        @click="handleAddQuestion"
      >
        New
      </button>
      <button
        type="button"
        class="h-12 w-40 bg-yellow-600 hover:bg-yellow-700 rounded-md text-xl text-white"
        @click="handleRemoveQuestion(currentQuestionIndex)"
      >
        Remove
      </button>
    </div>

    <div class="w-full max-w-2xl flex justify-center gap-4">
      <button
        type="submit"
        :class="`h-12 w-40 ${
          loading ? 'bg-gray-200' : 'bg-green-600 hover:bg-green-700 text-white'
        } rounded-md text-xl`"
        @click="handleSubmit"
      >
        {{ loading ? 'Creating...' : 'Create' }}
      </button>
      <button
        type="button"
        class="h-12 w-40 bg-red-600 hover:bg-red-700 rounded-md text-xl text-white"
        @click="router.back()"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
