<script setup>
import { useRouter } from 'vue-router'
import DropdownMenu from '@/components/miscellaneous/DropdownMenu.vue'

const router = useRouter()
</script>

<template>
  <v-container class="fill-height d-flex flex-column align-center justify-center">
    <!-- Header -->
    <v-card
      class="w-90 max-w-4xl mt-5 py-6 px-8 rounded-xl shadow-lg d-flex align-center justify-space-between"
    >
      <h1 class="text-h4 font-bold">Error Page</h1>
      <DropdownMenu />
    </v-card>

    <!-- Error Content -->
    <v-card
      class="w-90 max-w-4xl min-h-96 mb-5 py-16 px-8 rounded-xl shadow-lg d-flex flex-column align-center justify-center"
    >
      <h1 class="text-h4 mb-6">
        <span class="text-red-darken-2 font-semibold">404</span> Page not found!
      </h1>
      <v-btn
        color="blue-darken-1"
        variant="flat"
        height="48"
        width="128"
        @click="router.replace('/')"
      >
        Home
      </v-btn>
    </v-card>
  </v-container>
</template>
