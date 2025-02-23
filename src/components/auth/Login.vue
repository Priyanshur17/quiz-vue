<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { toast } from 'vue3-toastify'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    toast.error('Please enter all the fields')
    return
  }

  loading.value = true
  try {
    const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`, {
      email: email.value,
      password: password.value,
    })
    localStorage.setItem('userInfo', JSON.stringify(data.user))
    // snackbar.value = { text: 'Login successful', color: 'green', show: true }
    toast.success('Login successful')
    setTimeout(() => router.push(route.query.from || '/'), 1000)
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container>
    <form
      @submit.prevent="handleSubmit"
      class="w-full px-6 py-8 bg-white dark:bg-gray-800 rounded-lg"
    >
      <!-- <v-card-title>Login</v-card-title> -->

      <v-text-field v-model="email" label="Email" type="email" />

      <v-text-field
        v-model="password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
      />

      <v-card-actions>
        <v-btn color="primary" block type="submit" :loading="loading"> Login </v-btn>
      </v-card-actions>
      <div className="mt-2 text-right">
        <a href="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline"
          >Forgot password?</a
        >
      </div>
    </form>
  </v-container>
</template>
<!-- <template>
  <form @submit.prevent="handleSubmit" class="w-full px-6 py-8 bg-white dark:bg-gray-800 rounded-lg">
    <div class="mb-4">
      <label for="email" class="block text-lg font-medium text-gray-700 dark:text-gray-200">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        class="w-full mt-2 p-3 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
        v-model="email"
      />
    </div>
    <div class="mb-4 relative">
      <label for="password" class="block text-lg font-medium text-gray-700 dark:text-gray-200">Password</label>
      <input
        :type="showPassword ? 'text' : 'password'"
        name="password"
        id="password"
        class="w-full mt-2 p-3 pr-11 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
        v-model="password"
      />
      <button
        type="button"
        @click="showPassword = !showPassword"
        class="h-[43%] absolute inset-y-0 right-0 top-9 px-3 flex items-center text-gray-600 dark:text-gray-400"
      >
        <component :is="showPassword ? 'FaEyeSlash' : 'FaEye'" size="22" />
      </button>
      <div class="mt-2 text-right">
        <a href="/forgot-password" class="text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</a>
      </div>
    </div>
    <div class="flex justify-center">
      <button
        type="submit"
        :class="`w-24 h-12 ${loading ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-600 dark:bg-blue-400 text-white dark:text-black hover:bg-blue-700 dark:hover:bg-blue-300'} rounded-lg hover:scale-105 transition-colors duration-300`"
      >
        <component v-if="loading" :is="'ImSpinner2'" size="22" class="mx-auto animate-spin dark:text-white" />
        <span v-else>Login</span>
      </button>
    </div>
    <ToastContainer position="top-right" :theme="darkMode ? 'dark' : 'light'" />
  </form>
</template> -->
