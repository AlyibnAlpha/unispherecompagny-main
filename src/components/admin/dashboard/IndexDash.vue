<template>
  <div>
    <Stat />
    <SalesAnalytics />
  </div>
</template>

<script>
import Stat from './components/StatDash.vue'
import SalesAnalytics from './components/SalesAnalytics.vue'

export default {
  components: {
    Stat,
    SalesAnalytics,
  },
}
</script>

<style>
@import '../../../css/assets/scss/app2.scss';
</style>
