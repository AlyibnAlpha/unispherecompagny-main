<script>
import { BDropdown } from 'bootstrap-vue-next'
import { LocalStorage } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { ref } from 'vue'
export default {
  setup() {
    const nom = ref('')
    nom.value = LocalStorage.getItem('nom')
    return {
      nom,
    }
  },
  components: {
    BDropdown,
  },
  methods: {
    logout() {
      const authStore = useAuthStore()
      authStore.logout()
      this.$router.push('/').then(() => {
        window.location.reload()
      })
    },
    profil() {
      const authStore = useAuthStore()
      const role = authStore.roles[0]
      if (role === import.meta.env.VITE_DEFAULT_ROLEP) {
        this.$router.push('/participant/profil')
      } else if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
        this.$router.push('/bussines/profil')
      } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
        this.$router.push('/admin/profil')
      }
    },
  },
}
</script>

<template>
  <BDropdown
    class="d-inline-block"
    toggle-class="header-item"
    right
    variant="white"
    menu-class="dropdown-menu-end"
    no-caret
  >
    <template #button-content>
      <i
        class="uil uil-user-circle rounded-circle header-profile-user font-size-18 align-middle text-muted me-1"
      ></i>

      <span class="d-none d-xl-inline-block ms-1 fw-medium font-size-15">{{ nom }}</span>
      <i class="uil-angle-down d-none d-xl-inline-block font-size-15"></i>
    </template>

    <a class="dropdown-item profile-dropdown-item" @click="profil" href="javascript: void(0);">
      <i class="uil uil-user-circle"></i>
      <span>{{ $t('navbar.dropdown.marcus.list.profile') }}</span>
    </a>

    <a class="dropdown-item profile-dropdown-item" @click="logout" href="javascript: void(0);">
      <i class="uil uil-sign-out-alt"></i>
      <span>{{ $t('navbar.dropdown.marcus.list.logout') }}</span>
    </a>
  </BDropdown>
</template>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';

// Bouton du dropdown profile moderne
.header-item {
  background: white !important;
  border: 2px solid #e2e8f0 !important;
  border-radius: 12px !important;
  padding: 8px 16px !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;

  &:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08) !important;
    border-color: #667eea !important;
  }

  &:active {
    transform: translateY(0) !important;
  }

  i {
    color: #667eea !important;
  }

  span {
    color: #1e293b !important;
    font-weight: 600 !important;
  }
}

.profile-dropdown-item {
  display: flex !important;
  align-items: center;
  gap: 12px;
  
  &::before {
    display: none !important;
  }
  
  i {
    font-size: 1.2rem;
    color: #667eea;
    flex-shrink: 0;
    transition: color 0.2s ease;
  }
  
  span {
    flex: 1;
  }

  &:hover {
    i {
      color: white !important;
    }
  }
}
</style>
