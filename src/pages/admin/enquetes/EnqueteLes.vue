<script>
import EnqueteencourCom from 'src/components/admin/enquete/EnqueteencourCom.vue'
import ParticipantNavBar from 'src/components/participant/ParticipantNavBar.vue'

export default {
  components: {
    EnqueteencourCom,
    ParticipantNavBar,
  },
}
</script>

<template>
  <div class="participant-dashboard">
    <ParticipantNavBar />
    <div class="participant-content">
      <EnqueteencourCom />
    </div>
  </div>
</template>
<style lang="scss">
@import '../../../css/participant/dashboard.scss';

.participant-content {
  padding: 0 20px;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
