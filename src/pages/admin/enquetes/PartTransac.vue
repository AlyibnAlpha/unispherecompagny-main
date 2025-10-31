<script>
import PratTransCom from 'src/components/admin/enquete/PratTransCom.vue'
import ParticipantNavBar from 'src/components/participant/ParticipantNavBar.vue'
import TopBar from 'src/components/layouts/vertical/TopBar.vue'

export default {
  components: {
    PratTransCom,
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
      <PratTransCom />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../css/participant/dashboard.scss';
@import '../../../css/participant/transactions.scss';
</style>
