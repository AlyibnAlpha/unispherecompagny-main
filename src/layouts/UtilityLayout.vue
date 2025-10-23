<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    document.body.classList.add('authentication-bg')
  },
}
</script>
<style>
@import '../css/assets/scss/app2.scss';
</style>
