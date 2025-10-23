<script>
import { nextTick, onMounted, ref } from 'vue'
import { menuItemsA, menuItemsSA, menuItemsB, menuItemsP } from '../../layouts/utils/menu.js'
import MetisMenu from 'metismenujs'
import '../../../../node_modules/metismenujs/dist/metismenujs.css'
import { useAuthStore } from 'src/stores/auth.js'
import { api } from 'src/boot/axios.js'

export default {
  data() {
    const menuItems = ref([])
    const auth = useAuthStore()
    const role = auth.roles[0]
    const link = async () => {
      const response = await api.get('/users/me')
      const user = response.data?.admin?.isSuperAdmin
      if (role == import.meta.env.VITE_DEFAULT_ROLEA && user == true) {
        menuItems.value = menuItemsSA
      } else if (role == import.meta.env.VITE_DEFAULT_ROLEA) {
        menuItems.value = menuItemsA
      } else if (role == import.meta.env.VITE_DEFAULT_ROLEP) {
        menuItems.value = menuItemsP
      } else if (role == import.meta.env.VITE_DEFAULT_ROLEB) {
        menuItems.value = menuItemsB
      }
      await nextTick()
    }
    const reloadTo = () => {
      if (role == import.meta.env.VITE_DEFAULT_ROLEP) {
        return '/participant/enquetes-encours'
      } else if (role == import.meta.env.VITE_DEFAULT_ROLEB) {
        return '/busness'
      } else if (role == import.meta.env.VITE_DEFAULT_ROLEA) {
        return '/admin'
      }
    }
    onMounted(async () => {
      await link()
      nextTick(() => {
        const element = document.getElementById('side-menu')
        if (element) {
          new MetisMenu('#side-menu')
          this._activateMenuDropdown()

          this.$router.afterEach(() => {
            this._activateMenuDropdown()
          })
        }
      })
    })
    return {
      menuItems,
      reloadTo,
    }
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
  },
  watch: {
    type: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case 'dark':
              document.body.setAttribute('data-sidebar', 'dark')
              document.body.removeAttribute('data-topbar')
              document.body.removeAttribute('data-sidebar-size')
              break
            case 'light':
              document.body.setAttribute('data-sidebar', 'light')
              document.body.removeAttribute('data-sidebar-size')
              document.body.classList.remove('vertical-collpsed')
              break
            case 'compact':
              document.body.setAttribute('data-sidebar-size', 'small')
              document.body.setAttribute('data-sidebar', 'dark')
              document.body.classList.remove('vertical-collpsed')
              document.body.removeAttribute('data-topbar', 'dark')
              break
            case 'icon':
              document.body.setAttribute('data-keep-enlarged', 'true')
              document.body.classList.add('vertical-collpsed')
              document.body.setAttribute('data-sidebar', 'dark')
              document.body.removeAttribute('data-topbar', 'dark')
              break
            case 'colored':
              document.body.setAttribute('data-sidebar', 'colored')
              document.body.removeAttribute('data-keep-enlarged')
              document.body.classList.remove('vertical-collpsed')
              document.body.removeAttribute('data-sidebar-size')
              break
            default:
              document.body.setAttribute('data-sidebar', 'dark')
              break
          }
        }
      },
    },
    width: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case 'boxed':
              document.body.setAttribute('data-layout-size', 'boxed')
              break
            case 'fluid':
              document.body.setAttribute('data-layout-mode', 'fluid')
              document.body.removeAttribute('data-layout-size')
              break
            default:
              document.body.setAttribute('data-layout-mode', 'fluid')
              break
          }
        }
      },
    },
  },

  methods: {
    toggleMenu() {
      this.$parent.toggleMenu()
    },
    hasItems(item) {
      return item.subItems !== undefined ? item.subItems.length > 0 : false
    },
    /**
     * remove active and mm-active class
     */
    _removeAllClass(className) {
      const els = document.getElementsByClassName(className)
      while (els[0]) {
        els[0].classList.remove(className)
      }
    },
    _activateMenuDropdown() {
      this._removeAllClass('mm-active')
      this._removeAllClass('mm-show')

      const links = document.getElementsByClassName('side-nav-link-ref')
      let matchingMenuItem = null

      for (let link of links) {
        if (link.getAttribute('href') === window.location.pathname) {
          matchingMenuItem = link
          break
        }
      }

      // fallback si pas trouvé
      if (!matchingMenuItem) {
        const currentPath = window.location.pathname
        for (let link of links) {
          if (currentPath.startsWith(link.pathname)) {
            matchingMenuItem = link
            break
          }
        }
      }

      if (matchingMenuItem) {
        matchingMenuItem.classList.add('active')

        // Monte dynamiquement l'arbre DOM jusqu'à #side-menu
        let parent = matchingMenuItem.parentElement
        while (parent && parent.id !== 'side-menu') {
          if (parent.tagName === 'LI') {
            parent.classList.add('mm-active')
          }
          if (parent.tagName === 'UL') {
            parent.classList.add('mm-show')
          }

          // active aussi les flèches
          const hasArrow = parent.querySelector('.has-arrow')
          if (hasArrow) hasArrow.classList.add('mm-active')

          parent = parent.parentElement
        }
      }
    },
  },
}
</script>

<template>
  <div
    class="vertical-menu"
    style="background: linear-gradient(135deg, #f0f4ff, #e0f7fa); transition: background 0.5s ease"
  >
    <div class="navbar-brand-box">
      <router-link :to="reloadTo()" class="logo logo-dark">
        <span class="logo-sm">
          <img src="/favicons.ico" alt height="20" />
        </span>
        <span class="logo-lg">
          <img src="/favicons.ico" alt height="80" />
        </span>
      </router-link>
      <router-link :to="reloadTo()" class="logo logo-light">
        <span class="logo-sm">
          <img src="/favicons.ico" alt height="20" />
        </span>
        <span class="logo-lg">
          <img src="/favicons.ico" alt height="80" />
        </span>
      </router-link>
    </div>

    <button
      type="button"
      @click="toggleMenu"
      class="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn"
    >
      <i class="bi bi-list"></i>
    </button>

    <div data-simplebar class="sidebar-menu-scroll">
      <div id="sidebar-menu">
        <ul class="metismenu list-unstyled" id="side-menu">
          <template v-for="item in menuItems">
            <li class="menu-title" v-if="item.isTitle" :key="item.id">
              {{ $t(item.label) }}
            </li>
            <li v-if="!item.isTitle && !item.isLayout" :key="item.id">
              <a
                v-if="hasItems(item)"
                href="javascript:void(0);"
                class="is-parent side-nav-link-a-ref has-arrow"
              >
                <i :class="`${item.icon}`" v-if="item.icon"></i>
                <span>{{ $t(item.label) }}</span>
                <span
                  :class="`badge rounded-pill bg-${item.badge.variant} float-end`"
                  v-if="item.badge"
                  >{{ $t(item.badge.text) }}</span
                >
              </a>
              <router-link :to="item.link" v-if="!hasItems(item)" class="side-nav-link-ref">
                <i :class="`${item.icon}`" v-if="item.icon"></i>
                <span class="menu-text">{{ $t(item.label) }}</span>
                <span
                  :class="`badge rounded-pill bg-${item.badge.variant} float-end`"
                  v-if="item.badge"
                  >{{ $t(item.badge.text) }}</span
                >
              </router-link>

              <ul v-if="hasItems(item)" class="sub-menu" aria-expanded="false">
                <li v-for="(subitem, index) of item.subItems" :key="index">
                  <router-link
                    :to="subitem.link"
                    v-if="!hasItems(subitem)"
                    class="side-nav-link-ref"
                    >{{ $t(subitem.label) }}</router-link
                  >
                  <a
                    v-if="hasItems(subitem)"
                    class="side-nav-link-a-ref has-arrow"
                    href="javascript:void(0);"
                    >{{ $t(subitem.label) }}</a
                  >
                  <ul v-if="hasItems(subitem)" class="sub-menu mm-collapse" aria-expanded="false">
                    <li v-for="(subSubitem, index) of subitem.subItems" :key="index">
                      <router-link :to="subSubitem.link" class="side-nav-link-ref">{{
                        $t(subSubitem.label)
                      }}</router-link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
@import '../../../css/assets/scss/app2.scss';
.menu-text {
  display: inline-block;
  max-width: 150px; /* largeur max du texte */
  font-size: 14px; /* taille réduite */
  white-space: nowrap; /* pas de retour à la ligne */
  overflow: hidden; /* cache le texte qui dépasse */
  text-overflow: ellipsis; /* ajoute "..." à la fin */
  vertical-align: middle;
}
metismenu .has-arrow::after {
  font-family: 'bootstrap-icons'; /* si tu utilises Bootstrap Icons */
  content: '\f107'; /* flèche vers le bas */
  float: right;
  margin-top: 3px;
  transition: transform 0.3s ease;
}

/* Flèche vers le haut quand menu actif */
.metismenu .mm-active > a.has-arrow::after {
  transform: rotate(180deg);
}

/* Sous-menu indentation */
.metismenu .sub-menu {
  padding-left: 20px;
}

/* Alignement texte et flèche */
.metismenu li a {
  display: flex;
  align-items: center;
  justify-content: space-between; /* texte à gauche, flèche à droite */
  padding: 8px 15px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
}

/* Item actif */
.metismenu li.mm-active > a {
  background-color: rgba(0, 123, 255, 0.1);
  color: #007bff;
  font-weight: 500;
}
</style>
