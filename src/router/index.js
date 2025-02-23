import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import MyQuizzes from '@/pages/MyQuizzes.vue'
import AttemptedQuizzes from '@/pages/AttemptedQuizzes.vue'
import CreateQuiz from '@/pages/CreateQuiz.vue'
import QuizDetails from '@/pages/QuizDetails.vue'
import ViewQuiz from '@/pages/ViewQuiz.vue'
import JoinQuiz from '@/pages/JoinQuiz.vue'
import StartQuiz from '@/pages/StartQuiz.vue'
import PlayQuiz from '@/pages/PlayQuiz.vue'
import QuizFeedback from '@/pages/QuizFeedback.vue'
import QuizResult from '@/pages/QuizResult.vue'
import ReviewResult from '@/pages/ReviewResult.vue'
import QuizSummary from '@/pages/QuizSummary.vue'
import QuizLeaderboard from '@/pages/QuizLeaderboard.vue'
import Auth from '@/pages/Auth.vue'
import VerifyEmail from '@/pages/VerifyEmail.vue'
import ForgotPassword from '@/pages/ForgotPassword.vue'
import ResetPassword from '@/pages/ResetPassword.vue'
import Error from '@/pages/Error.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/my-quizzes', component: MyQuizzes },
  { path: '/attempted-quizzes', component: AttemptedQuizzes },
  { path: '/create-quiz', component: CreateQuiz },
  { path: '/quiz-details', component: QuizDetails },
  { path: '/view-quiz/:id', component: ViewQuiz },
  { path: '/join-quiz', component: JoinQuiz },
  { path: '/start-quiz/:id', component: StartQuiz },
  { path: '/play-quiz', component: PlayQuiz, name: 'PlayQuiz' },
  { path: '/quiz-feedback/:id', component: QuizFeedback },
  { path: '/quiz-result/:id', component: QuizResult },
  { path: '/review-result/:id', component: ReviewResult },
  { path: '/quiz-summary/:id', component: QuizSummary },
  { path: '/quiz-leaderboard/:id', component: QuizLeaderboard },
  { path: '/auth', component: Auth },
  { path: '/verify-email/:id/:token', component: VerifyEmail },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password/:id/:token', component: ResetPassword },
  { path: '/:pathMatch(.*)*', component: Error },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
