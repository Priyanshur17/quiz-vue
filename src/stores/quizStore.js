import { defineStore } from 'pinia'

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    quiz: null, // Store the quiz object here
  }),
  actions: {
    setQuiz(quiz) {
      this.quiz = quiz // Action to set the quiz
    },
    clearQuiz() {
      this.quiz = null // Action to clear the quiz
    },
  },
})
