<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script setup>
import { onMounted } from 'vue'

import { useAuthStore } from './stores/auth'

onMounted(() => {
  const auth = useAuthStore()
  auth.fetchUser()
})
</script>
