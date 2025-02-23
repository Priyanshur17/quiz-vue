<script setup>
import { ref } from 'vue'
import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'

const isLogin = ref(true)
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div
      class="w-[90%] max-w-xl my-5 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950"
    >
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-700 dark:text-gray-200">Welcome to QuizApp</h1>
      </div>

      <div class="flex flex-col md:flex-row gap-6 justify-center">
        <!-- <v-btn
          :color="isLogin ? 'blue-darken-1' : 'grey-darken-1'"
          variant="flat"
          @click="isLogin = true"
        >
          Sign In
        </v-btn> -->

        <button
          :class="[
            'px-6 py-3 rounded-lg focus:outline-none transition-colors duration-300',
            isLogin
              ? 'bg-blue-600 dark:bg-blue-400 text-white dark:text-black hover:bg-blue-700 dark:hover:bg-blue-500'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600',
          ]"
          @click="isLogin = true"
        >
          Sign In
        </button>
        <button
          :class="[
            'px-6 py-3 rounded-lg focus:outline-none transition-colors duration-300',
            !isLogin
              ? 'bg-blue-600 dark:bg-blue-400 text-white dark:text-black'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600',
          ]"
          @click="isLogin = false"
        >
          Sign Up
        </button>
        <!-- <v-btn
          :color="!isLogin ? 'blue-darken-1' : 'grey-darken-1'"
          variant="flat"
          @click="isLogin = false"
        >
          Sign Up
        </v-btn> -->
      </div>

      <div class="mt-8">
        <Login v-if="isLogin" />
        <Register v-else />
      </div>
    </div>
  </div>
</template>
