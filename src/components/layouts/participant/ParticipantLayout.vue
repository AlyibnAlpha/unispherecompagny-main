<template>
  <div id="layout-wrapper" class="participant-layout">
    <TopBar />
    <div class="main-content-full">
      <div class="page-content">
        <slot />
      </div>
      <AppFooter />
    </div>
  </div>
</template>

<script>
import TopBar from '../../layouts/vertical/TopBar.vue'
import AppFooter from '../../layouts/common/FooterLay.vue'

export default {
  name: 'ParticipantLayout',
  components: {
    TopBar,
    AppFooter,
  },
  created() {
    document.body.removeAttribute('data-layout')
    document.body.removeAttribute('data-topbar')
    document.body.classList.add('participant-view')
  },
  unmounted() {
    document.body.classList.remove('participant-view')
  },
}
</script>

<style lang="scss">
.participant-layout {
  .main-content-full {
    margin-left: 0 !important;
    min-height: 100vh;
    transition: all 0.3s ease;
  }

  .page-content {
    padding: 0 20px;
    margin-top: 70px;
    max-width: 1600px;
    margin-left: auto;
    margin-right: auto;
  }
}

// Masquer le sidebar pour les participants
body.participant-view {
  .vertical-menu {
    display: none !important;
  }

  .main-content {
    margin-left: 0 !important;
  }

  #sidebar-menu {
    display: none !important;
  }
}

@media (max-width: 992px) {
  .participant-layout {
    .page-content {
      margin-top: 60px;
    }
  }
}
</style>
