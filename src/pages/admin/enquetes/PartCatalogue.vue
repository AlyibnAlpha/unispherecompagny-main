<script>
import PratCataCom from 'src/components/admin/enquete/PratCataCom.vue'
import ParticipantNavBar from 'src/components/participant/ParticipantNavBar.vue'
import TopBar from 'src/components/layouts/vertical/TopBar.vue'

export default {
  components: {
    PratCataCom,
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
      <PratCataCom />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../css/participant/dashboard.scss';
@import '../../../css/participant/surveys.scss';
</style>
