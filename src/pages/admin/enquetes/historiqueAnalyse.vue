<script>
import HistoriqueCom from 'src/components/admin/enquete/HistoriqueCom.vue'
import ParticipantNavBar from 'src/components/participant/ParticipantNavBar.vue'
import TopBar from 'src/components/layouts/vertical/TopBar.vue'

export default {
  components: {
    HistoriqueCom,
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
      <HistoriqueCom />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../css/participant/dashboard.scss';

// Forcer le topbar à prendre toute la largeur
:deep(#page-topbar) {
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  background: white !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;

  .navbar-header {
    padding-left: 20px !important;
    padding-right: 20px !important;
    margin: 0 !important;
    max-width: 100% !important;
  }
}

.participant-content {
  padding: 0 20px;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
