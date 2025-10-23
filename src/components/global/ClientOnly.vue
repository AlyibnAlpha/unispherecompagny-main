<!-- src/components/ClientOnly.vue -->
<template>
  <slot v-if="mounted" />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})
</script>
