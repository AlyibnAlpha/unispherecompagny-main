<template>
  <div id="layout-wrapper">
    <TopBar :type="layout.topbar" :width="layout.layoutWidth" />
    <div class="main-content">
      <div class="page-content">
        <div class="container-fluid">
          <slot />
        </div>
      </div>
      <AppFooter />
    </div>
  </div>
</template>

<script>
import { useLayoutStore } from '../../../stores/layout'
import AppFooter from '../../layouts/common/FooterLay.vue'
import TopBar from '../../layouts/horizontal/TopBar.vue'

export default {
  created() {
    document.body.setAttribute('data-layout', 'horizontal')
    document.body.setAttribute('data-topbar', 'colored')
  },
  components: {
    TopBar,
    AppFooter,
  },
  methods: {
    toggleRightSidebar() {
      document.body.classList.toggle('right-bar-enabled')
    },
    hideRightSidebar() {
      document.body.classList.remove('right-bar-enabled')
    },
  },
  computed: {
    layout() {
      return useLayoutStore() ? useLayoutStore() : {}
    },
  },
}
</script>
<style>
@import '../../../css/assets/scss/app2.scss';
</style>
