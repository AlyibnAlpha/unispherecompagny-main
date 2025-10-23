<template>
  <header class="edu-header header-style-1 header-fullwidth no-topbar">
    <div class="header-mainmenu" :class="{ 'edu-sticky': isSticky }">
      <div class="container-fluid">
        <div class="header-navbar">
          <div class="header-brand">
            <div class="logo">
              <router-link to="/">
                <img class="logo-light" src="/favicons.ico" alt="Dark Logo" style="width: 130px" />
                <img class="logo-dark" src="/favicons.ico" alt="Light Logo" style="width: 130px" />
              </router-link>
            </div>

            <Category />
          </div>
          <div class="header-mainnav">
            <nav class="mainmenu-nav">
              <Navigation />
            </nav>
          </div>
          <div class="header-right">
            <ul class="header-action">
              <li class="search-bar">
                <button class="search-trigger" @click="searchPopUpOpen('addClass', 'open')">
                  <i class="icon-2"></i>
                </button>
              </li>
              <li class="icon search-icon">
                <button class="search-trigger" @click="searchPopUpOpen('addClass', 'open')">
                  <i class="icon-2"></i>
                </button>
              </li>
              <template v-if="!isLoggedIn">
                <li class="header-btn">
                  <router-link to="/login" class="edu-btn btn-medium">
                    <q-icon name="person" size="large" /> Connexion
                  </router-link>
                </li>
                <li class="header-btn">
                  <router-link to="/registre" class="edu-btn btn-medium">
                    <q-icon name="person_add" size="large" /> Inscription
                  </router-link>
                </li>
              </template>

              <template v-else>
                <li class="dropdown">
                  <q-btn flat round icon="person" class="q-ml-sm">
                    <q-menu>
                      <q-list style="min-width: 150px">
                        <q-item
                          clickable
                          v-if="userRole === part"
                          @click="reloadTo('/participant/enquetes-encours')"
                        >
                          <q-item-section>Adminstration</q-item-section>
                        </q-item>
                        <q-item clickable v-if="userRole === bus" @click="reloadTo('/busness')">
                          <q-item-section>Adminstration</q-item-section>
                        </q-item>
                        <q-item clickable v-if="userRole === ad" @click="reloadTo('/admin')">
                          <q-item-section>Adminstration</q-item-section>
                        </q-item>
                        <q-item clickable @click="logout">
                          <q-item-section>Déconnexion</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </li>
              </template>

              <li class="mobile-menu-bar d-block d-xl-none">
                <button class="hamberger-button" @click="mobileMenuOpen('addClass', 'active')">
                  <i class="icon-54"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <SearchPopUp />

    <OffCanvasMobileMenuOne />
  </header>
</template>

<script>
import Navigation from './NavigationHead.vue'
import Category from './CategoryHead.vue'
import OffCanvasMobileMenuOne from './OffCanvasMobileMenuOne.vue'
import SearchPopUp from './SearchPopUp.vue'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'

export default {
  components: {
    Navigation,
    Category,
    OffCanvasMobileMenuOne,
    SearchPopUp,
  },
  data() {
    const part = import.meta.env.VITE_DEFAULT_ROLEP
    const bus = import.meta.env.VITE_DEFAULT_ROLEB
    const ad = import.meta.env.VITE_DEFAULT_ROLEA
    const router = useRouter()

    const reloadTo = (url) => {
      router.push(url).then(() => {
        window.location.reload()
      })
    }
    return {
      reloadTo,
      isSticky: false,
      part,
      bus,
      ad,
    }
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token')
    },
    userRole() {
      const authStore = useAuthStore()
      return authStore.roles[0] || ''
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      let scrollPos = window.scrollY
      if (scrollPos >= 200) {
        this.isSticky = true
      } else {
        this.isSticky = false
      }
    })
  },
  methods: {
    logout() {
      const authStore = useAuthStore()
      authStore.logout()
      this.$router.push('/login').then(() => {
        window.location.reload()
      })
    },
    // Off-canvas Mobile Menu Open
    mobileMenuOpen(addRemoveClass, className) {
      const el = document.querySelector('#offcanvas-menu')
      if (addRemoveClass === 'addClass') {
        el.classList.add(className)
      } else {
        el.classList.remove(className)
      }
    },

    // search popup
    searchPopUpOpen(addRemoveClass, className) {
      const el = document.querySelector('#edu-search-popup')
      if (addRemoveClass === 'addClass') {
        el.classList.add(className)
      } else {
        el.classList.remove(className)
      }
    },
  },
}
</script>
