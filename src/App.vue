<script setup>
import { RouterView } from 'vue-router'
import { useContextStore } from './stores/contextStore'

const contextStore = useContextStore()
</script>

<template>
  <RouterView />
</template>
