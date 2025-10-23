<template>
  <div class="gap-bottom-equal edu-about-area about-style-2 verify-email-container">
    <div class="container edublink-animated-shape align-items-center">
      <div class="g-5 align-items-center">
        <div class="about-image-gallery">
          <ul class="shape-group">
            <MouseMove
              addClassName="shape-1"
              dataDepth="2"
              imgSrc="/images/about/shape-38.png"
              data-aos-delay="500"
              data-aos="fade"
              data-aos-duration="200"
            />
            <MouseMove
              addClassName="shape-2"
              dataDepth="-2"
              imgSrc="/images/about/shape-37.png"
              data-aos-delay="500"
              data-aos="fade"
              data-aos-duration="200"
            />
            <MouseMove
              addClassName="shape-3"
              dataDepth="1.8"
              imgSrc="/images/about/shape-04.png"
              data-aos-delay="500"
              data-aos="fade"
              data-aos-duration="200"
            />
          </ul>

          <div class="">
            <div class="q-pa-md flex flex-center column">
              <q-card class="q-pa-xl text-center card-verify">
                <q-card-section>
                  <!-- Icône animée -->
                  <div class="icon-wrapper">
                    <q-icon name="mail" size="72px" color="primary" class="pulse" />
                  </div>

                  <!-- Titre -->
                  <div class="text-h5 text-weight-bold q-mt-md">Vérifiez votre email 📧</div>

                  <!-- Texte secondaire -->
                  <div class="text-body2 text-grey-7 q-mt-sm">
                    Nous avons envoyé un lien de confirmation à votre adresse.
                    <br />
                    Cliquez dessus pour activer votre compte.
                  </div>
                </q-card-section>

                <!-- Bouton renvoi mail -->
                <q-card-actions align="center">
                  <q-btn
                    color="primary"
                    unelevated
                    label="Renvoyer l'email"
                    icon="refresh"
                    class="q-mt-md"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>
      </div>
      <ul class="shape-group">
        <MouseMove
          addClassName="shape-1 circle"
          dataDepth="-2.3"
          data-aos-delay="500"
          data-aos="fade"
          data-aos-duration="200"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import MouseMove from 'src/components/animation/MouseMove.vue'
import parallaxAnimation from '/common/parallaxAnimation.js'

export default {
  components: {
    MouseMove,
  },
  mounted() {
    parallaxAnimation()
  },
}
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
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease-in-out;
}

.icon-wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: #eaf2ff;
  border-radius: 50%;
  padding: 16px;
}

.pulse {
  animation: pulseAnim 1.5s infinite;
}

/* Animations */
@keyframes pulseAnim {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
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
