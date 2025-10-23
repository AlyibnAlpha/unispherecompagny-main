<template>
  <div class="gap-bottom-equal edu-about-area about-style-2 verify-email-container">
    <div class="container edublink-animated-shape align-items-center">
      <div class="g-5 align-items-center">
        <div class="about-image-gallery">
          <ul class="shape-group">
            <MouseMove addClassName="shape-1" dataDepth="2" imgSrc="/images/about/shape-38.png" />
            <MouseMove addClassName="shape-2" dataDepth="-2" imgSrc="/images/about/shape-37.png" />
            <MouseMove addClassName="shape-3" dataDepth="1.8" imgSrc="/images/about/shape-04.png" />
          </ul>

          <div>
            <div class="q-pa-md flex flex-center column">
              <q-card class="q-pa-xl text-center card-verify">
                <q-card-section>
                  <!-- Icône dynamique -->
                  <div class="icon-wrapper" :class="iconColor">
                    <q-icon :name="iconName" size="72px" color="white" class="pulse" />
                  </div>

                  <!-- Titre -->
                  <div class="text-h5 text-weight-bold q-mt-md text-primary">
                    {{ title }}
                  </div>

                  <!-- Message -->
                  <div class="text-body1 text-center text-grey-8 q-mt-sm" v-if="showCountdown">
                    Redirection vers vos informations de profil dans
                    <span class="countdown">{{ countdown }}</span> secondes...
                  </div>
                  <div class="text-body1 text-grey-8 q-mt-sm" v-else>
                    {{ message }}
                  </div>
                </q-card-section>

                <!-- Bouton (seulement si success) -->
                <q-card-actions align="center" v-if="status === 'success'">
                  <q-btn
                    color="primary"
                    unelevated
                    label="Aller à mon Profil"
                    icon="arrow_forward"
                    class="btn-profile"
                    @click="goProfile"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>
      </div>
      <ul class="shape-group">
        <MouseMove addClassName="shape-1 circle" dataDepth="-2.3" />
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useRegisterStore } from 'src/stores/useRegisterStore'

const router = useRouter()
const auth = useAuthStore()
const store = useRegisterStore()
const countdown = ref(5)
const status = ref(null) // success | invalid_token | already_verified
const title = ref('')
const message = ref('')
const iconName = ref('')
const iconColor = ref('')
const showCountdown = ref(false)

const goProfile = async () => {
  await auth.login({ email: store.conx.ema, password: store.conx.pas })
  const role = auth.roles[0]
  if (role === import.meta.env.VITE_DEFAULT_ROLEP) {
    store.restCom()
    router.push('/infoprofil').then(() => window.location.reload())
  } else if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
    store.restCom()
    router.push('/infoprofilbusiness').then(() => window.location.reload())
  }
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const success = urlParams.get('success')
  const error = urlParams.get('error')

  if (success === 'true') {
    status.value = 'success'
    title.value = 'Email confirmé ✅'
    message.value = ''
    iconName.value = 'check_circle'
    iconColor.value = 'bg-green'
    showCountdown.value = true

    // Démarre le décompte
    const interval = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(interval)
        goProfile()
      }
    }, 1000)
  } else if (error === 'invalid_token') {
    status.value = 'invalid_token'
    title.value = 'Lien invalide ❌'
    message.value = 'Le lien de confirmation est invalide ou expiré.'
    iconName.value = 'error'
    iconColor.value = 'bg-red'
    showCountdown.value = false
  } else if (error === 'already_verified') {
    status.value = 'already_verified'
    title.value = 'Email déjà vérifié ⚠️'
    message.value = 'Votre adresse email a déjà été confirmée.'
    iconName.value = 'info'
    iconColor.value = 'bg-orange'
    showCountdown.value = false
  }
})
</script>

<style scoped>
@import '../css/app.scss';

.verify-email-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f4ff, #e0f7fa);
}

.card-verify {
  max-width: 420px;
  border-radius: 20px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease-in-out;
}

.icon-wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
}
.bg-green {
  background: #4caf50;
}
.bg-red {
  background: #e53935;
}
.bg-orange {
  background: #fb8c00;
}

.pulse {
  animation: pulseAnim 1.5s infinite;
}

.countdown {
  font-weight: bold;
  color: #1976d2;
}

.btn-profile {
  border-radius: 12px;
  padding: 10px 20px;
  transition: all 0.3s ease;
}

.btn-profile:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 16px rgba(25, 118, 210, 0.3);
}

/* Animations */
@keyframes pulseAnim {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
