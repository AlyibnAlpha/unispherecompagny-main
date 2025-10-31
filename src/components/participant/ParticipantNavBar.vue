<script>
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'ParticipantNavBar',
  setup() {
    const router = useRouter()
    const route = useRoute()

    const navItems = [
      {
        label: 'Enquêtes en cours',
        path: '/participant/enquetes-encours',
        icon: 'bi-clipboard-check-fill',
      },
      {
        label: 'Historique',
        path: '/participant/historique',
        icon: 'bi-clock-history',
      },
      {
        label: 'Catalogue',
        path: '/participant/catalogue',
        icon: 'bi-gift-fill',
      },
      {
        label: 'Transactions',
        path: '/participant/transaction',
        icon: 'bi-graph-up-arrow',
      },
      {
        label: 'Mon Profil',
        path: '/participant/profil',
        icon: 'bi-person-circle',
      },
    ]

    const isActive = (path) => {
      return route.path === path
    }

    const navigateTo = (path) => {
      router.push(path)
    }

    return {
      navItems,
      isActive,
      navigateTo,
    }
  },
}
</script>

<template>
  <div class="participant-navbar-wrapper">
    <nav class="participant-navbar">
      <div class="navbar-container">
        <div class="navbar-items">
          <button
            v-for="item in navItems"
            :key="item.path"
            @click="navigateTo(item.path)"
            :class="['navbar-item', { active: isActive(item.path) }]"
          >
            <i :class="['navbar-icon', item.icon]"></i>
            <span class="navbar-label">{{ item.label }}</span>
            <div v-if="isActive(item.path)" class="active-indicator"></div>
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<style lang="scss">
@import '../../css/participant/navbar.scss';

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.3s ease;
}

.dropdown-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
