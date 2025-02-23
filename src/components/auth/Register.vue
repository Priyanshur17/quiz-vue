<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { toast } from 'vue3-toastify'

const router = useRouter()
const snackbar = ref({ show: false, text: '', color: '' })

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

const handleSubmit = async () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    // snackbar.value = { text: 'Please fill all fields', color: 'red', show: true }
    toast.error('Please fill all fields')
    return
  }
  if (password.value !== confirmPassword.value) {
    // snackbar.value = { text: 'Passwords do not match', color: 'red', show: true }
    toast.error('Passwords do not match')
    return
  }

  loading.value = true
  try {
    // console.log(name.value)
    const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`, {
      name: name.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    })
    // snackbar.value = { text: 'Registration successful', color: 'green', show: true }
    toast.success(data.message)

    setTimeout(() => router.push('/auth'), 2000)
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
      <!-- <v-card-title>Register</v-card-title> -->

      <v-text-field v-model="name" label="Name" type="text" />
      <v-text-field v-model="email" label="Email" type="email" />
      <v-text-field
        v-model="password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
      />
      <v-text-field
        v-model="confirmPassword"
        label="Confirm Password"
        :type="showConfirmPassword ? 'text' : 'password'"
        :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showConfirmPassword = !showConfirmPassword"
      />

      <v-card-actions>
        <v-btn color="primary" block type="submit" :loading="loading"> Register </v-btn>
      </v-card-actions>
    </form>
  </v-container>
</template>
