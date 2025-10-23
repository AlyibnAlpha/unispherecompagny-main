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

    <a class="dropdown-item" @click="profil" href="javascript: void(0);">
      <i class="uil uil-user-circle font-size-18 align-middle text-muted me-1"></i>
      <span class="align-middle">{{ $t('navbar.dropdown.marcus.list.profile') }}</span>
    </a>

    <a class="dropdown-item" @click="logout" href="javascript: void(0);">
      <i class="uil uil-sign-out-alt font-size-18 align-middle me-1 text-muted"></i>
      <span class="align-middle">{{ $t('navbar.dropdown.marcus.list.logout') }}</span>
    </a>
  </BDropdown>
</template>

<style>
@import '../../../css/assets/scss/app2.scss';
</style>
