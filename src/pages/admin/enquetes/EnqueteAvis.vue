<script>
import EnqueteavisCom from 'src/components/admin/enquete/EnqueteavisCom.vue'
import ParticipantNavBar from 'src/components/participant/ParticipantNavBar.vue'
import TopBar from 'src/components/layouts/vertical/TopBar.vue'

export default {
  components: {
    EnqueteavisCom,
    ParticipantNavBar,
    TopBar,
  },
}
</script>

<template>
  <div class="participant-dashboard">
    <TopBar />
    <ParticipantNavBar />
    <div class="participant-content">
      <EnqueteavisCom />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../css/participant/dashboard.scss';
</style>
