<template>
  <div id="layout-wrapper" :class="{ 'participant-layout': isParticipant }">
    <TopBar />
    <SideBarComponent 
      v-if="!isParticipant"
      class="side-br" 
      :type="layout.leftSidebarType" 
      :width="layout.layoutWidth" 
    />
    <div class="main-content" :class="{ 'main-content-full': isParticipant }">
      <div class="page-content">
        <BContainer fluid>
          <slot />
        </BContainer>
      </div>
      <AppFooter />
    </div>
  </div>
</template>

<script>
import { useLayoutStore } from '../../../stores/layout'
import TopBar from '../../layouts/vertical/TopBar.vue'
import SideBarComponent from '../../layouts/common/SideBar.vue'
import AppFooter from '../../layouts/common/FooterLay.vue'
import { BContainer } from 'bootstrap-vue-next'

export default {
  name: 'VerticalLay',
  created() {
    document.body.removeAttribute('data-layout')
    document.body.removeAttribute('data-topbar')
  },
  components: {
    TopBar,
    SideBarComponent,
    AppFooter,
    BContainer,
  },
  computed: {
    layout() {
      return useLayoutStore() ? useLayoutStore() : {}
    },
    isParticipant() {
      return this.$route.path.startsWith('/participant')
    },
  },
  methods: {
    toggleRightSidebar() {
      document.body.classList.toggle('right-bar-enabled')
    },
    hideRightSidebar() {
      document.body.classList.remove('right-bar-enabled')
    },
    toggleMenu() {
      document.body.classList.toggle('sidebar-enable')

      if (window.screen.width >= 992) {
        // eslint-disable-next-line no-unused-vars
        this.$router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove('sidebar-enable')
          document.body.classList.remove('vertical-collpsed')
        })
        document.body.classList.toggle('vertical-collpsed')
      } else {
        // eslint-disable-next-line no-unused-vars
        this.$router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove('sidebar-enable')
        })
        document.body.classList.remove('vertical-collpsed')
      }
      this.isMenuCondensed = !this.isMenuCondensed
    },
  },
}
</script>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';

// Styles pour le layout participant (sans sidebar)
.participant-layout {
  // Étendre le topbar sur toute la largeur
  #page-topbar {
    left: 0 !important;
    margin-bottom: 20px;
  }

  // Masquer le bouton menu burger
  .vertical-menu-btn {
    display: none !important;
  }

  // Contenu principal sans marge
  .main-content-full {
    margin-left: 0 !important;
    padding-top: 20px;
  }

  .page-content {
    padding-top: 0;
  }
}
</style>
