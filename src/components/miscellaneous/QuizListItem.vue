<script setup>
import { ref } from 'vue'

const props = defineProps({
  id: Number,
  quiz: Object,
  isAuthor: Boolean,
  handleClick: Function,
  handleLock: Function,
})

const isLocked = ref(props.quiz.isLocked)
</script>

<template>
  <div
    class="w-full p-6 rounded-lg flex items-center justify-between gap-6 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg dark:shadow-gray-900 transition-transform duration-300 transform hover:-translate-y-1"
  >
    <div @click="props.handleClick(props.id)" class="flex-1 cursor-pointer">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {{ props.quiz.title }}
      </h1>
      <p class="text-lg text-gray-500 dark:text-gray-400">{{ props.quiz.authorName }}</p>
    </div>
    <button
      v-if="props.isAuthor"
      @click="props.handleLock(props.quiz.id, isLocked, (val) => (isLocked = val))"
      class="px-4 py-2 rounded-lg text-white dark:text-black font-semibold cursor-pointer"
      :class="
        isLocked
          ? 'bg-red-600 dark:bg-red-400 hover:bg-red-700 dark:hover:bg-red-300'
          : 'bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300'
      "
    >
      {{ isLocked ? 'Unlock' : 'Lock' }}
    </button>
    <p
      v-else
      class="px-4 py-2 rounded-lg font-semibold cursor-pointer"
      :class="
        isLocked
          ? 'bg-red-600 dark:bg-red-400 text-white dark:text-black'
          : 'bg-green-600 dark:bg-green-400 text-white dark:text-black'
      "
    >
      {{ isLocked ? 'Locked' : 'Unlocked' }}
    </p>
  </div>
</template>
