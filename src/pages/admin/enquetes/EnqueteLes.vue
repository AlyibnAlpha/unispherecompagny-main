<script>
import EnqueteencourCom from 'src/components/admin/enquete/EnqueteencourCom.vue'
import ParticipantNavBar from 'src/components/participant/ParticipantNavBar.vue'
import TopBar from 'src/components/layouts/vertical/TopBar.vue'

export default {
  components: {
    EnqueteencourCom,
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
      <EnqueteencourCom />
    </div>
  </div>
</template>
<style lang="scss">
@import '../../../css/participant/dashboard.scss';
</style>
