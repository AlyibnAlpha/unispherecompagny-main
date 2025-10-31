<script>
import ProfilCom from 'src/components/admin/profil/ProfilCom.vue'
import ParticipantNavBar from 'src/components/participant/ParticipantNavBar.vue'
import TopBar from 'src/components/layouts/vertical/TopBar.vue'

export default {
  components: {
    ProfilCom,
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
      <ProfilCom />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../css/participant/dashboard.scss';
</style>
