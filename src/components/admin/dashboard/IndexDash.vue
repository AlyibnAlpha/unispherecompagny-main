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
