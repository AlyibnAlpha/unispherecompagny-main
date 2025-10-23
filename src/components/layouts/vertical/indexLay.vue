<template>
  <div id="layout-wrapper">
    <TopBar />
    <SideBarComponent class="side-br" :type="layout.leftSidebarType" :width="layout.layoutWidth" />
    <div class="main-content">
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

<style>
@import '../../../css/assets/scss/app2.scss';
</style>
