<script setup>
import ResetPasswordEmail from '@/components/auth/ResetPasswordEmail.vue'
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="w-90 max-w-xl my-5 p-6 rounded-xl shadow-lg">
      <div class="text-center mb-8">
        <h1 class="text-h4 font-bold">Forgot Password</h1>
      </div>

      <v-card-text class="mt-8">
        <ResetPasswordEmail />
      </v-card-text>
    </v-card>
  </v-container>
</template>
