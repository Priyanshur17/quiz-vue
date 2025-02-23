<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { toast } from 'vue3-toastify'


const route = useRoute()
const router = useRouter()


const password = ref('')
const showPassword = ref(false)
const confirmPassword = ref('')
const showConfirmPassword = ref(false)
const loading = ref(false)

const handleSubmit = async () => {
  if (!password.value || !confirmPassword.value) {
    // snackbar.value = { text: 'Please enter all the fields', color: 'red', show: true }
    toast.error('Please enter all the fields')
    return
  }
  if (password.value !== confirmPassword.value) {
    // snackbar.value = { text: 'Passwords do not match', color: 'red', show: true }
    toast.error('Passwords do not match')
    return
  }

  loading.value = true
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/reset-password/${route.params.id}/${route.params.token}`,
      { password: password.value, confirmPassword: confirmPassword.value },
    )
    // snackbar.value = { text: data.message, color: 'green', show: true }
    toast.success(data.message)
    //
    setTimeout(() => router.push('/auth'), 2000)
  } catch (error) {
    // snackbar.value = {
    //   text: error.response?.data?.message || 'An error occurred',
    //   color: 'red',
    //   show: true,
    // }
    toast.error(error.response?.data?.message || 'An error occurred')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container>
    <v-card class="mx-auto" max-width="400">
      <v-card-title>Change Password</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="password"
          label="New Password"
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
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="handleSubmit" :loading="loading"> Save </v-btn>
      </v-card-actions>
    </v-card>
    
  </v-container>
</template>
