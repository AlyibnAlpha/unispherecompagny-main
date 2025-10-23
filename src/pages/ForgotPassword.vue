<template>
  <div id="main-wrapper" class="main-wrapper">
    <section class="account-page-area section-gap-equal">
      <div class="container position-relative">
        <div class="row g-5 align-items-center">
          <div class="col-lg-6">
            <div class="banner-content">
              <h1 class="title">
                <strong>
                  Mots de passse <br />
                  <span class="color-secondary">oubliée?</span></strong
                >
              </h1>
              <p>
                Réinitialisez votre mot de passe en entrant votre adresse email. Nous vous enverrons
                un lien ou un code pour réinitialiser votre mot de passe.
              </p>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="login-form-box">
              <h3 class="title">Mot de passe oubliée</h3>
              <p>
                Vous vous souvenez de votre mot de passe ?
                <router-link to="/login">Connectez-vous</router-link>
              </p>

              <q-form @submit.prevent="handleSubmit">
                <div class="form-group">
                  <label for="forgot-email">Email*</label>
                  <input
                    type="email"
                    v-model="email"
                    id="forgot-email"
                    placeholder="Entrez votre email"
                    required
                  />
                </div>

                <div class="form-group">
                  <button type="submit" class="edu-btn btn-medium">
                    Envoyer le lien <i class="icon-4"></i>
                  </button>
                </div>
              </q-form>
            </div>
          </div>
        </div>

        <!-- Effets décoratifs -->
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
import { ref } from 'vue'
import { useQuasar, Notify } from 'quasar'
import { api } from 'src/boot/axios'

export default {
  components: { MouseMove },
  setup() {
    const email = ref('')
    const $q = useQuasar()

    const handleSubmit = async () => {
      if (!email.value) {
        Notify.create({
          type: 'warning',
          message: 'Veuillez entrer votre adresse email.',
        })
        return
      }

      try {
        $q.loading.show()
        // 🔹 Appel API de réinitialisation (exemple)
        await api.post('/forgot', { email: email.value })

        Notify.create({
          type: 'positive',
          message: 'Un lien de réinitialisation a été envoyé à votre adresse email.',
        })

        email.value = ''
      } catch (error) {
        Notify.create({
          type: 'negative',
          message:
            error.response?.data?.message ||
            'Erreur lors de la réinitialisation. Vérifiez votre email.',
        })
      } finally {
        $q.loading.hide()
      }
    }

    return { email, handleSubmit }
  },
}
</script>

<style>
@import '../css/app.scss';
</style>
