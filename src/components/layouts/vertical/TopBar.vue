<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="d-flex">
        <HederLogo v-if="isParticipantPage" />
      </div>

      <div class="d-flex align-items-center gap-2">
        <!--<LanguageDropdown
          :flag="flag"
          :languages="languages"
          :current_language="current_language"
          @onChange="setLanguage"
        />-->
        <button
          v-if="reg === true"
          @click="reflien"
          class="btn-referral-modern"
        >
          <i class="bi bi-people-fill me-2"></i>
          Parrainage
        </button>
        <q-dialog v-model="ajout" transition-show="scale" transition-hide="fade">
          <q-card class="referral-modal-modern">
            <!-- Header avec gradient -->
            <div class="referral-header">
              <div class="referral-icon-wrapper">
                <i class="bi bi-people-fill"></i>
              </div>
              <h3 class="referral-title">Programme de Parrainage</h3>
              <p class="referral-subtitle">Invitez vos amis et gagnez des récompenses</p>
            </div>

            <!-- Contenu -->
            <div class="referral-content">
              <!-- Instructions -->
              <div class="referral-steps">
                <div class="step-item">
                  <div class="step-number">1</div>
                  <div class="step-text">
                    <h4>Copiez votre lien</h4>
                    <p>Cliquez sur le bouton pour copier votre lien unique</p>
                  </div>
                </div>
                <div class="step-item">
                  <div class="step-number">2</div>
                  <div class="step-text">
                    <h4>Partagez avec vos proches</h4>
                    <p>Envoyez le lien à vos amis et votre famille</p>
                  </div>
                </div>
                <div class="step-item">
                  <div class="step-number">3</div>
                  <div class="step-text">
                    <h4>Gagnez des points</h4>
                    <p>Recevez des points pour chaque inscription réussie</p>
                  </div>
                </div>
              </div>

              <!-- Lien de parrainage -->
              <div class="referral-link-section">
                <label class="referral-link-label">
                  <i class="bi bi-link-45deg me-2"></i>
                  Votre lien de parrainage
                </label>
                <div class="referral-link-input-wrapper">
                  <input
                    type="text"
                    v-model="dat"
                    readonly
                    class="referral-link-input"
                  />
                  <button @click="copyLink" class="btn-copy-link">
                    <i class="bi bi-clipboard-check me-2"></i>
                    Copier
                  </button>
                </div>
              </div>

              <!-- Stats -->
              <div class="referral-stats">
                <div class="stat-box">
                  <i class="bi bi-gift-fill"></i>
                  <div class="stat-info">
                    <span class="stat-value">50</span>
                    <span class="stat-label">Points par parrainage</span>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </q-dialog>

        <button
          type="button"
          class="btn-fullscreen-modern"
          @click="initFullScreen"
          title="Plein écran"
        >
          <i class="uil-minus-path"></i>
        </button>
        <Profile @logoutUser="logoutUser" />
      </div>
    </div>
  </header>
</template>

<script>
import { LanguagesWithFlag } from '../../layouts/utils/topBar.js'
import HederLogo from '../../layouts/common/HeaderLogo.vue'
//import LanguageDropdown from '../../layouts/common/LanguageDropdown.vue'
import Profile from '../../layouts/common/ProfileLay.vue'
import { ref, computed } from 'vue'
import { api } from 'src/boot/axios.js'
import { useRoute } from 'vue-router'

import { useAuthStore } from 'src/stores/auth.js'
import Swal from 'sweetalert2'

export default {
  data() {
    const ajout = ref(false)
    const dat = ref('')
    const reg = ref(false)

    const auth = useAuthStore()

    const getrole = () => {
      const role = auth.roles[0]
      if (role === import.meta.env.VITE_DEFAULT_ROLEP) {
        reg.value = true
      } else {
        reg.value = false
      }
    }
    const reflien = async () => {
      try {
        const responses = await api.get('/participants/referral/my-link')
        dat.value = 'https://api.unispherecompagny.com' + responses.data.referralUrl
        ajout.value = true
      } catch (error) {
        if (error.response) {
          Swal.fire({
            icon: 'error',
            title: 'Accès refusé',
            text:
              error.response.data.message ||
              "Vous n'avez pas la permission d'accéder à cette ressource.",
            showConfirmButton: true,
            background: '#f8f9fa',
            color: '#333',
            width: '400px',
          })
          return
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue. Veuillez réessayer plus tard.',
            showConfirmButton: true,
            background: '#f8f9fa',
            color: '#333',
            width: '400px',
          })
          return
        }
      }
      const responses = await api.get('/participants/referral/my-link')
      dat.value = 'https://api.unispherecompagny.com' + responses.data.referralUrl
      ajout.value = true
    }
    const copyLink = () => {
      navigator.clipboard.writeText(dat.value).then(() => {
        ajout.value = false
        // Petit feedback avec Quasar
        Swal.fire({
          icon: 'success',
          title: 'Lien copié !',
          text: 'Le lien de parrainage a été copié dans votre presse-papiers.',
          showConfirmButton: false,
          position: 'top-end',
          timer: 2000,
          background: '#f8f9fa',
          color: '#333',
          width: '400px',
        })
      })
    }
    return {
      getrole,
      copyLink,
      reflien,
      reg,
      dat,
      ajout,
      languages: LanguagesWithFlag,
      current_language: this.$i18n.locale,
      text: null,
      flag: null,
      value: null,
      config: import.meta.env,
    }
  },
  components: {
    HederLogo,
    //LanguageDropdown,
    Profile,
  },
  setup() {
    const route = useRoute()
    const isParticipantPage = computed(() => route.path.startsWith('/participant'))
    
    return {
      isParticipantPage,
    }
  },
  mounted() {
    this.getrole()
    this.value = this.languages.find((x) => x.language === this.$i18n.locale)
    this.text = this.value.title
    this.flag = this.value.flag
  },
  methods: {
    toggleMenu() {
      this.$parent.toggleMenu()
    },
    setLanguage(data) {
      const { language, country, flag } = data
      this.$i18n.locale = language
      this.current_language = language
      this.text = country
      this.flag = flag
    },
    initFullScreen() {
      document.body.classList.toggle('fullscreen-enable')
      if (
        !document.fullscreenElement &&
        /* alternative standard method */
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen()
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen()
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        }
      }
    },
    logoutUser() {
      const auth = this.config.public.auth
      if (auth === 'firebase') {
        // this.$store.dispatch("auth/logOut");
      } else if (auth === 'fakebackend') {
        // this.$store.dispatch("authfack/logout");
      }
      this.$router.push('/login')
    },
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar()
    },
  },
}
</script>

<style lang="scss">
@import '../../../css/admin/modern-topbar.scss';
@import '../../../css/components/referral-modal.scss';
</style>
