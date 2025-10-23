<template>
  <div id="main-wrapper" class="main-wrapper">
    <section class="account-page-area section-gap-equal">
      <div class="container position-relative">
        <div class="row g-5 align-items-center">
          <!-- Texte de présentation -->
          <div class="col-lg-6">
            <div class="banner-content">
              <h1 class="title">
                <strong>
                  Réinitialiser votre <br />
                  <span class="color-secondary"> mot de passe</span></strong
                >
              </h1>
              <p>Choisissez un nouveau mot de passe sécurisé pour accéder à votre compte.</p>
            </div>
          </div>

          <!-- Formulaire -->
          <div class="col-lg-6">
            <div class="login-form-box">
              <h3 class="title">Réinitialiser le mot de passe</h3>
              <p>
                Vous vous souvenez de votre mot de passe ?
                <router-link to="/login">Connectez-vous</router-link>
              </p>

              <q-form @submit.prevent="handleReset">
                <div class="form-group">
                  <label for="new-password">Nouveau mot de passe*</label>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="new-password"
                    v-model="newPassword"
                    placeholder="Entrez votre nouveau mot de passe"
                    required
                  />
                  <span class="password-show" @click.prevent="showPassword = !showPassword">
                    <i :class="showPassword ? 'icon-1' : 'icon-76'"></i>
                  </span>
                </div>

                <div class="form-group">
                  <label for="confirm-password">Confirmez le mot de passe*</label>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="confirm-password"
                    v-model="confirmPassword"
                    placeholder="Confirmez votre mot de passe"
                    required
                  />
                </div>

                <div class="form-group">
                  <button type="submit" class="edu-btn btn-medium">
                    Réinitialiser <i class="icon-4"></i>
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
import { useRoute, useRouter } from 'vue-router'
import { Notify, useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

export default {
  components: { MouseMove },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()

    const newPassword = ref('')
    const confirmPassword = ref('')
    const showPassword = ref(false)

    // 🔹 Token reçu depuis le lien email (ex: /reset-password?token=abc123)
    const token = ref(route.params.id) || ''

    const handleReset = async () => {
      if (!newPassword.value || !confirmPassword.value) {
        Notify.create({ type: 'warning', message: 'Veuillez remplir tous les champs.' })
        return
      }

      if (newPassword.value !== confirmPassword.value) {
        Notify.create({ type: 'warning', message: 'Les mots de passe ne correspondent pas.' })
        return
      }

      try {
        $q.loading.show()

        // 🔹 Appel API pour réinitialiser le mot de passe
        await api.post(`/reset-password/${token.value}`, {
          password: newPassword.value,
        })
        console.log('tpen:', token.value)

        Notify.create({
          type: 'positive',
          message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
        })

        router.push('/login')
      } catch (error) {
        Notify.create({
          type: 'negative',
          message:
            error.response?.data?.message ||
            'Erreur lors de la réinitialisation. Vérifiez le lien ou réessayez.',
        })
      } finally {
        $q.loading.hide()
      }
    }

    return {
      newPassword,
      confirmPassword,
      showPassword,
      handleReset,
    }
  },
}
</script>

<style>
@import '../css/app.scss';
</style>
