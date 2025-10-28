<template>
  <div id="main-wrapper" class="main-wrapper">
    <section class="account-page-area section-gap-equal">
      <div class="container position-relative">
        <div class="row g-5 align-items-center">
          <div class="col-lg-6">
            <div class="banner-content">
              <h1 class="title">
                <strong>
                  Opinion <br />
                  <span class="color-secondary">publique</span></strong
                >
              </h1>
              <p>
                Nos outils et nos données vous aident à identifier et à définir votre audience
                cible, puis à dresser un portrait de ce qui les caractérise avec une granularité
                unique. Découvrez-en davantage sur votre audience et re-contactez les groupes cibles
                avec des questions supplémentaires spécialement conçues pour vous.
              </p>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="login-form-box">
              <h3 class="title">Connexion</h3>
              <p>
                Vous avez pas un compte?
                <router-link to="/registre">Inscrivez-vous</router-link>
              </p>
              <q-form @submit.prevent="login">
                <div class="form-group">
                  <label for="current-log-email">Email*</label>
                  <input
                    type="email"
                    v-model="email"
                    name="current-log-email"
                    id="current-log-email"
                    placeholder="Email"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="current-log-password">Password*</label>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    name="current-log-password"
                    v-model="password"
                    id="current-log-password"
                    placeholder="Mot de passe"
                    required
                  />
                  <span class="password-show" @click.prevent="showPassword = !showPassword"
                    ><i :class="showPassword ? 'icon-1' : 'icon-76'"></i
                  ></span>
                </div>

                <div class="form-group">
                  <button type="submit" class="edu-btn btn-medium">
                    Connexion <i class="icon-4"></i>
                  </button>
                  <div class="form-group chekbox-area">
                    <div class="edu-form-check"></div>
                    <a href="/mot-de-passe-oublie" class="password-reset">Mot de passe oubliée?</a>
                  </div>
                </div>
              </q-form>
            </div>
          </div>
        </div>
        <ul class="shape-group">
          <MouseMove addClassName="shape-1" dataDepth="2" imgSrc="/images/about/shape-07.png" />
          <MouseMove addClassName="shape-2" dataDepth="-2" imgSrc="/images/about/shape-13.png" />
          <MouseMove addClassName="shape-3" dataDepth="2" imgSrc="/images/counterup/shape-02.png" />
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import MouseMove from '../components/animation/MouseMove.vue'
import { onBeforeUnmount, ref } from 'vue'

import { onMounted } from 'vue'
import { LocalStorage, Notify, useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

export default {
  components: {
    MouseMove,
  },
  head() {
    return {
      title: 'Terms & Condition',
    }
  },
  setup() {
    const tab = ref('Client')
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const authStore = useAuthStore()
    const router = useRouter()

    const lq = useQuasar()
    let timer
    onBeforeUnmount(() => {
      if (timer !== void 0) {
        clearTimeout(timer)
        lq.loading.hide()
      }
    })

    const login = async () => {
      if (!email.value || !password.value) {
        Notify.create({
          type: 'warning',
          message: 'Veuillez entrer votre email et mot de passe.',
        })
        return
      }

      try {
        // Appel à l'API pour la connexion
        lq.loading.show()
        await authStore.login({ email: email.value, password: password.value })

        const role = authStore.roles[0]

        if (role === import.meta.env.VITE_DEFAULT_ROLEP) {
          const resp = await api.get('/users/me')
          LocalStorage.set('nom', resp.data.participantProfile.lastName)
          await router.push('/participant/enquetes-encours').then(() => {
            window.location.reload()
          })
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          const resp = await api.get('/users/me')
          LocalStorage.set('nom', resp.data.businessAccount.lastName)
          await router.push('/busness').then(() => {
            window.location.reload()
          })
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          await router.push('/admin').then(() => {
            window.location.reload()
          })
        } else {
          Notify.create({
            type: 'negative',
            message: 'Compte inexistant.',
          })
          router.push('/registre')
        }
      } catch (error) {
        Notify.create({
          type: 'negative',
          timeout: 3000,
          message:
            error.response?.data?.message ||
            'Erreur de connexion. Veuillez vérifier votre mot de passe ou votre réseau.',
          onDismiss: () => {
            window.location.reload()
          },
        })
        console.error('Erreur brute login:', error)
      } finally {
        lq.loading.hide()
      }
    }

    onMounted(() => {
      // Efface le LocalStorage une seule fois puis recharge la page
      if (!sessionStorage.getItem('__ls_cleared')) {
        LocalStorage.clear()
        sessionStorage.setItem('__ls_cleared', '1')
        window.location.reload()
        return
      }
      // Reset the tab to 'Client' on mount
      showPassword.value = false
    })
    return {
      login,
      showPassword,
      email,
      password,
      tab,
    }
  },
}
</script>
<style>
@import '../css/app.scss';
.btn-green {
  background-color: #31b978;
  color: white;
  border: 5px solid rgba(100, 100, 100, 0);
  border-radius: 75px;
}
</style>
