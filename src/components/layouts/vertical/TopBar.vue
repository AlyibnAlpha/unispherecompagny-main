<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="d-flex">
        <HederLogo />
        <button
          type="button"
          class="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn"
          id="vertical-menu-btn"
          @click="toggleMenu"
        >
          <i class="bi bi-list"></i>
        </button>
      </div>

      <div class="d-flex">
        <!--<LanguageDropdown
          :flag="flag"
          :languages="languages"
          :current_language="current_language"
          @onChange="setLanguage"
        />-->
        <span
          v-if="reg === true"
          class="text-warning fw-bold py-4 px-3 header-item"
          @click="reflien"
          style="cursor: pointer; background: rgba(255, 193, 7, 0.15)"
          >Parrainage</span
        >
        <q-dialog v-model="ajout" transition-show="scale" transition-hide="fade">
          <q-card
            style="
              width: 800px;
              max-width: 90vw;
              height: auto;
              border-radius: 20px;
              overflow: hidden;
            "
            class="shadow-lg"
          >
            <!-- Titre -->
            <q-card-section
              class="q-pa-md text-white flex items-center justify-center"
              style="background: linear-gradient(135deg, #0d6efd, #6610f2)"
            >
              <q-icon name="group_add" size="28px" class="q-mr-sm" />
              <div class="text-h6 text-center">Parrainage</div>
            </q-card-section>

            <!-- Formulaire -->
            <div class="q-pa-lg">
              <BRow>
                <BCol cols="12">
                  <div class="alert alert-info py-2 px-3 rounded-3 small">
                    💡 Pour Parrainer :
                    <ul class="mb-0">
                      <li>Copier le lien ci-dessous</li>
                      <li>Envoyez ce lien a vos proches.</li>
                      <li>Gangez des points.</li>
                    </ul>
                  </div>
                </BCol>
              </BRow>
              <BForm style="margin: 5px 10px">
                <BRow>
                  <BCol cols="12" class="mb-4 floating-label">
                    <!-- Bouton Copier -->

                    <BFormInput
                      id="title"
                      v-model="dat"
                      type="text"
                      class="form-control form-control-modern"
                      placeholder=" "
                      required
                    />
                    <label for="title">Lien</label>
                    <q-btn
                      flat
                      round
                      dense
                      icon="content_copy"
                      color="primary"
                      class="position-absolute"
                      style="top: 50%; right: 10px; transform: translateY(-50%)"
                      @click="copyLink"
                    />
                  </BCol>
                </BRow>
              </BForm>
            </div>
          </q-card>
        </q-dialog>

        <div class="dropdown d-none d-lg-inline-block ms-1">
          <button
            type="button"
            class="btn header-item noti-icon waves-effect"
            data-toggle="fullscreen"
            @click="initFullScreen"
          >
            <i class="uil-minus-path"></i>
          </button>
        </div>
        <Notifications />
        <Profile @logoutUser="logoutUser" />
      </div>
    </div>
  </header>
</template>

<script>
import { LanguagesWithFlag } from '../../layouts/utils/topBar.js'
import HederLogo from '../../layouts/common/HeaderLogo.vue'
//import LanguageDropdown from '../../layouts/common/LanguageDropdown.vue'
import Notifications from '../../layouts/common/NotificationsLay.vue'
import Profile from '../../layouts/common/ProfileLay.vue'
import { ref } from 'vue'
import { BRow, BCol, BForm, BFormInput } from 'bootstrap-vue-next'
import { api } from 'src/boot/axios.js'

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
    BRow,
    BCol,
    BForm,
    BFormInput,
    HederLogo,
    //LanguageDropdown,
    Notifications,
    Profile,
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
<style>
@import '../../../css/assets/scss/app2.scss';
q-dialog__inner {
  animation: fadeScale 0.35s ease forwards;
}

@keyframes fadeScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* === Inputs flottants modernes === */
.form-control {
  border-radius: 12px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2ea3f2;
    box-shadow: 0 0 8px rgba(46, 163, 242, 0.4);
    transform: scale(1.01);
  }
}

.bg-gradient {
  background: linear-gradient(135deg, #0d6efd, #6610f2);
}

/* === Champs modernes avec floating label === */
.floating-label {
  position: relative;
}

.form-control.form-control-modern {
  border-radius: 12px;
  border: 2px solid #e0e7ff;
  padding: 0.9rem 1rem;
  width: 100%;
  transition: all 0.3s ease;
  background: #fff;
}

.form-control.form-control-modern:focus {
  border-color: #10d0f2;
  box-shadow: 0 0 8px rgba(102, 16, 242, 0.25);
  transform: scale(1.01);
}

/* Labels flottants */
.floating-label label {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1rem;
  transition: all 0.3s ease;
  pointer-events: none;
  background: white;
  padding: 0 5px;
}

.form-control-modern:focus + label,
.form-control-modern:not(:placeholder-shown) + label {
  top: -10px;
  left: 10px;
  font-size: 0.8rem;
  color: #10d0f2;
}
</style>

<style lang="scss">
@import '../../../css/admin/modern-topbar.scss';
</style>
