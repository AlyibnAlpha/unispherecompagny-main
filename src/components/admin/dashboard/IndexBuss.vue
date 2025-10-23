<template>
  <div>
    <StatB />
    <SalesAnalyticsB />
  </div>
</template>

<script>
import StatB from './components/StatBuss.vue'
import SalesAnalyticsB from './components/SalesAnalytics.vue'

export default {
  components: {
    StatB,
    SalesAnalyticsB,
  },
}
</script>

<style>
@import '../../../css/assets/scss/app2.scss';
</style>
