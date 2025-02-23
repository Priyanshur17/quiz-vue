<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const router = useRouter()

const code = ref('')

const handleSubmit = () => {
  if (!code.value) {
    toast.error('Please enter a code')
    return
  }
  router.push(`/start-quiz/${code.value}`)
}
</script>

<template>
  <v-container>
    <v-card class="mx-auto" max-width="400">
      <v-card-text>
        <v-text-field v-model="code" label="Quiz Code" required />
        <v-btn block color="primary" @click="handleSubmit">Join</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>
