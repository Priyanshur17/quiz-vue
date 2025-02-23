<script setup>
import ChangePassword from '@/components/auth/ChangePassword.vue'
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="w-90 max-w-xl my-5 p-6 rounded-xl shadow-lg">
      <div class="text-center mb-8">
        <h1 class="text-h4 font-bold">Reset Password</h1>
      </div>

      <v-card-text class="mt-8">
        <ChangePassword />
      </v-card-text>
    </v-card>
  </v-container>
</template>
