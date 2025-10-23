<template>
  <div class="testimonial-area-5 gap-lg-bottom-equal">
    <div class="container">
      <div class="row g-lg-5">
        <div class="col-lg-5">
          <div class="testimonial-heading-area">
            <div
              class="section-title section-left"
              data-aos-delay="150"
              data-aos="fade-up"
              data-aos-duration="800"
            >
              <span class="pre-title">Votre avis compte pour nous</span>
              <h2 class="title">
                Aidez-nous à améliorer votre expérience en répondant à cette courte enquête.
              </h2>
              <span class="shape-line"><i class="icon-19"></i></span>
              <p>
                Nous mettons un point d’honneur à offrir une formation de qualité, centrée sur vos
                besoins. Votre retour est essentiel pour nous permettre de mieux comprendre ce que
                vous appréciez, ce qui peut être amélioré, et comment nous pouvons vous accompagner
                encore plus efficacement. Cela ne vous prendra que 2 minutes, mais cela fera une
                grande différence.
              </p>
              <router-link to="/course/courseone" class="edu-btn btn-large"
                >Donnez votre avis<i class="icon-4"></i
              ></router-link>
            </div>
          </div>
        </div>
        <div class="col-lg-7">
          <div>
            <swiper
              class="swiper-testimonial-slider-wrapper testimonial-coverflow position-relative"
              :modules="modules"
              :slidesPerView="1"
              :loop="true"
              :spaceBetween="0"
              :autoplay="{
                delay: 4000,
                disableOnInteraction: false,
              }"
              :coverflowEffect="{ rotate: 0, slideShadows: false, depth: 180, stretch: 80 }"
              :pagination="{ el: '.swiper-pagination', clickable: true }"
              :speed="500"
              :centeredSlides="true"
              :effect="'coverflow'"
              :grabCursor="true"
              :breakpoints="{
                '575': {
                  slidesPerView: 2,
                },
              }"
            >
              <swiper-slide>
                <div class="testimonial-grid">
                  <div class="thumbnail">
                    <img src="/images.jpg" alt="Testimonial" />
                    <span class="qoute-icon"><i class="icon-26"></i></span>
                  </div>
                  <div class="content">
                    <p>
                      J’ai beaucoup apprécié cette l'enquête sur l'environnement. Les explications
                      étaient claires et les réponses pratiques m’ont vraiment aidée a donné mon
                      avis.
                    </p>
                    <div class="rating-icon">
                      <i class="icon-23"></i>
                      <i class="icon-23"></i>
                      <i class="icon-23"></i>
                      <i class="icon-23"></i>
                      <i class="icon-23"></i>
                    </div>
                    <h5 class="title">Mamadou Coulibaly</h5>
                    <span class="subtitle">Etudiant</span>
                  </div>
                </div>
              </swiper-slide>
              <swiper-slide>
                <div class="testimonial-grid">
                  <div class="thumbnail">
                    <img src="/images-2.webp" alt="Testimonial" />
                    <span class="qoute-icon"><i class="icon-26"></i></span>
                  </div>
                  <div class="content">
                    <p>
                      J’ai beaucoup apprécié cette l'enquête sur la technologie. Les explications
                      étaient claires et les réponses pratiques m’ont vraiment aidée a donné mon
                      avis.
                    </p>
                    <div class="rating-icon">
                      <i class="icon-23"></i>
                      <i class="icon-23"></i>
                      <i class="icon-23"></i>
                      <i class="icon-23"></i>
                      <i class="icon-23"></i>
                    </div>
                    <h5 class="title">ALi DIALLO</h5>
                    <span class="subtitle">DEVELOPPEUR</span>
                  </div>
                </div>
              </swiper-slide>
              <swiper-slide>
                <div class="testimonial-grid">
                  <div class="thumbnail">
                    <img src="/images-3.jpg" alt="Testimonial" />
                    <span class="qoute-icon"><i class="icon-26"></i></span>
                  </div>
                  <div class="content">
                    <p>
                      J’ai beaucoup apprécié cette l'enquête sur l'étude. Les explications étaient
                      claires et les réponses pratiques m’ont vraiment aidée a donné mon avis.
                    </p>
                    <div class="rating-icon">
                      <i class="icon-23"></i>
                      <i class="icon-23"></i>
                      <i class="icon-23"></i>
                      <i class="icon-23"></i>
                      <i class="icon-23"></i>
                    </div>
                    <h5 class="title">Djenne Cisse</h5>
                    <span class="subtitle">Professeur</span>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
            <div class="swiper-pagination text-center"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Autoplay, EffectCoverflow, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      modules: [Autoplay, Pagination, EffectCoverflow],
    }
  },
}
</script>

<style lang="scss">
.swiper-testimonial-slider-wrapper {
  .swiper-slide {
    opacity: 0;

    &.swiper-slide-prev,
    &.swiper-slide-next,
    &.swiper-slide-active {
      opacity: 1;
    }
    @media only screen and (max-width: 575px) {
      &.swiper-slide-prev,
      &.swiper-slide-next {
        opacity: 0;
      }
    }
    &.swiper-slide-prev {
      .testimonial-grid {
        margin-left: 36px;
        box-shadow: 70px 0px 50px 0px rgba(26, 46, 85, 0.1);
        padding: 40px 30px 50px;
        @media only screen and (max-width: 1199px) {
          margin-left: 0px;
        }
        @media only screen and (min-width: 768px) and (max-width: 991px) {
          margin-left: 40px;
        }
      }
    }

    &.swiper-slide-next {
      .testimonial-grid {
        margin-left: 40px;
        margin-right: 36px;
        box-shadow: -40px 0px 50px 0px rgba(26, 46, 85, 0.1);
        padding: 40px 30px 50px;
        @media only screen and (max-width: 1199px) {
          margin-left: 0px;
          margin-right: 0px;
        }
        @media only screen and (min-width: 768px) and (max-width: 991px) {
          margin-left: 40px;
        }
      }
    }
  }

  &.testimonial-coverflow {
    .swiper-slide {
      &.swiper-slide-active {
        .testimonial-grid {
          &:before {
            opacity: 0;
          }
        }
      }
    }
  }
}
</style>
