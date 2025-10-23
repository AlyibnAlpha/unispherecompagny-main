<template>
  <div id="offcanvas-menu" class="edublink-vue-mobile-popup-menu">
    <div class="mobile-menu-overlay" @click="mobileMenuClose('removeClass', 'active')"></div>
    <div class="inner">
      <div class="header-top">
        <div class="logo">
          <router-link to="/">
            <img class="logo-light" src="/favicons.ico" alt="Dark Logo" />
            <img class="logo-dark" src="/favicons.ico" alt="Light Logo" />
          </router-link>
        </div>
        <div class="close-menu">
          <button class="close-button" @click="mobileMenuClose('removeClass', 'active')">
            <i class="icon-73"></i>
          </button>
        </div>
      </div>
      <MobileMenu />
    </div>
  </div>
</template>

<script>
import MobileMenu from './MobileMenu.vue'

export default {
  components: {
    MobileMenu,
  },
  methods: {
    // Off-canvas Mobile Menu Close
    mobileMenuClose(triggerRemoveClass, className) {
      const el = document.querySelector('#offcanvas-menu')
      if (triggerRemoveClass === 'addClass') {
        el.classList.add(className)
      } else {
        el.classList.remove(className)
      }
    },
  },
}
</script>
