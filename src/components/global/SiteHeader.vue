<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Dashboard',
    },
  },
}
</script>
<template>
  <q-header>
    <span> {{ title }} | Nuxtjs Responsive Bootstrap 5 Admin Dashboard </span>
  </q-header>
</template>
