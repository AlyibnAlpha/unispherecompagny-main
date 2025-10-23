<template>
  <swiper
    class="swiper-testimonial-slider-wrapper testimonial-coverflow position-relative"
    :modules="modules"
    :slidesPerView="1"
    :loop="true"
    :spaceBetween="0"
    :autoplay="{
      delay: 3000,
      disableOnInteraction: false,
    }"
    :coverflowEffect="{ rotate: 0, slideShadows: false, depth: 180, stretch: 80 }"
    :pagination="{ clickable: true }"
    :speed="500"
    :centeredSlides="true"
    :effect="'coverflow'"
    :grabCursor="true"
    @slideChange="onSlideChange"
  >
    <swiper-slide :keys="slideKey">
      <div class="testimonial-grid">
        <div class="hero-banner hero-style-2 bg-image">
          <div class="container">
            <div class="row row--45 align-items-center">
              <div class="col-lg-6">
                <div class="banner-content" data-aos="flip-left">
                  <h1 class="title">
                    <strong>
                      Opinion <br />
                      <span class="color-secondary">publique</span></strong
                    >
                  </h1>
                  <p>
                    Rejoignez une communauté de personnes qui partagent leurs points de vue sur
                    l'actualité, la politique, le sport, les marques et bien d’autres sujets.
                  </p>
                  <div class="banner-btn">
                    <router-link to="/enquete/encour-1" class="edu-btn"
                      >Rejoindre le panel<i class="icon-4"></i
                    ></router-link>
                  </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="banner-gallery">
                  <div
                    class="thumbnail thumbnail-1"
                    data-aos-delay="600"
                    data-aos="fade-right"
                    data-aos-duration="1000"
                  >
                    <img src="/gril-2-black.webp" alt="Girl Image" loading="lazy" />
                  </div>
                  <div
                    class="thumbnail thumbnail-2"
                    data-aos-delay="500"
                    data-aos="fade-down"
                    data-aos-duration="1000"
                  >
                    <img src="/images/banner/man-1.webp" alt="Girl Image" loading="lazy" />
                  </div>
                  <div
                    class="online-support"
                    data-aos-delay="600"
                    data-aos="fade-right"
                    data-aos-duration="1000"
                  >
                    <div class="inner">
                      <div class="icon">
                        <i class="icon-29"></i>
                      </div>
                      <div class="content">
                        <span class="subtitle">Online Support </span>
                        <h4 class="title"><a href="tel:+0123456789">+223 77 01 00 98</a></h4>
                      </div>
                    </div>
                  </div>
                  <ul class="shape-group">
                    <li
                      class="shape-1"
                      dataDepth="2"
                      data-aos-delay="1000"
                      data-aos="fade"
                      data-aos-duration="1000"
                    >
                      <img src="/fad/shape-13.webp" alt="Shape" loading="lazy" />
                    </li>
                    <li
                      class="shape-1 shape-dark"
                      dataDepth="2"
                      data-aos-delay="1000"
                      data-aos="fade"
                      data-aos-duration="1000"
                    >
                      <img src="/fad/dark-shape-13.webp" alt="Shape" loading="lazy" />
                    </li>

                    <li
                      class="shape-2"
                      dataDepth="-2"
                      data-aos-delay="1000"
                      data-aos="fade"
                      data-aos-duration="1000"
                      imgSrc="/images/faq/shape-12.png"
                    >
                      <img src="/fad/shape-12.webp" alt="Shape" loading="lazy" />
                    </li>

                    <li
                      class="shape-3 shape-light"
                      dataDepth="2"
                      data-aos-delay="1000"
                      data-aos="fade"
                      data-aos-duration="1000"
                    >
                      <img src="/fad/shape-09.webp" alt="Shape" loading="lazy" />
                    </li>
                    <li
                      class="shape-3 shape-dark"
                      dataDepth="2"
                      data-aos-delay="1000"
                      data-aos="fade"
                      data-aos-duration="1000"
                      imgSrc="/images/faq/dark-shape-09.png"
                    >
                      <img src="/fad/shape-09.webp" alt="Shape" loading="lazy" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </swiper-slide>
    <swiper-slide :keys="slideKey1">
      <div class="testimonial-grid">
        <div class="hero-banner hero-style-1 bg-image bg-image--11">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-6">
                <div
                  class="banner-content"
                  data-aos="fade-right"
                  data-aos-offset="300"
                  data-aos-easing="ease-in-sine"
                >
                  <h1 class="title">
                    <strong>
                      Obtenez plus de <span class="color-secondary">2500+</span>
                      <br />Opinions</strong
                    >
                  </h1>
                  <p>
                    Posez des questions et analysez les réponses pour prendre les meilleures
                    décisions stratégiques ou pour bénéficier d’une forte exposition médiatique.
                  </p>
                  <div class="banner-btn">
                    <router-link to="/enquete/encour-1" class="edu-btn">
                      Rejoignez le pannel <i class="icon-4"></i>
                    </router-link>
                  </div>
                  <ul class="shape-group">
                    <li
                      class="shape-1"
                      dataDepth="2"
                      data-aos-delay="1000"
                      data-aos="fade"
                      data-aos-duration="1000"
                    >
                      <img src="/fad/shape-13.webp" alt="Shape" loading="lazy" />
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="banner-thumbnail">
                  <div
                    class="thumbnail"
                    data-aos-delay="500"
                    data-aos="fade-left"
                    data-aos-duration="1000"
                  >
                    <img src="/fad/groupe-afro.webp" alt="Girl Image" loading="lazy" />
                  </div>

                  <ul class="shape-group">
                    <li
                      class="shape-1"
                      data-aos-delay="1000"
                      data-aos="fade"
                      data-aos-duration="1000"
                    >
                      <img src="/images/about/shape-15.png" alt="Shape" loading="lazy" />
                    </li>

                    <li
                      class="shape-4"
                      data-aos-delay="1000"
                      data-aos="fade"
                      data-aos-duration="1000"
                    >
                      <img src="/images/counterup/shape-02.png" alt="Shape" loading="lazy" />
                    </li>

                    <li
                      class="shape-2"
                      dataDepth="-1.5"
                      data-aos-delay="1000"
                      data-aos="fade"
                      data-aos-duration="1000"
                      imgSrc="/images/about/shape-16.png"
                    >
                      <img src="/images/faq/shape-16.png" alt="Shape" loading="lazy" />
                    </li>

                    <li
                      class="shape-5"
                      dataDepth="1.5"
                      data-aos-delay="1000"
                      data-aos="fade"
                      data-aos-duration="1000"
                    >
                      <img src="/images/about/shape-13.png" alt="Shape" loading="lazy" />
                    </li>

                    <li
                      class="shape-6"
                      dataDepth="-2"
                      data-aos-delay="1000"
                      data-aos="fade"
                      data-aos-duration="1000"
                    >
                      <img src="/images/about/shape-18.png" alt="Shape" loading="lazy" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="shape-7">
            <img src="/images/about/h-1-shape-01.png" alt="Shape" loading="lazy" />
          </div>
        </div>
      </div>
    </swiper-slide>
    <swiper-slide :keys="slideKey2">
      <div class="testimonial-grid">
        <div class="hero-banner hero-style-4 bg-image bg-image--18">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-lg-8">
                <div class="banner-content" data-aos="zoom-in">
                  <h1 class="title"><strong>Cible votre audience</strong></h1>
                  <p>
                    Nos outils et nos données vous aident à identifier et à définir votre audience
                    cible, puis à dresser un portrait de ce qui les caractérise avec une granularité
                    unique. Découvrez-en davantage sur votre audience et re-contactez les groupes
                    cibles avec des questions supplémentaires spécialement conçues pour vous.
                  </p>
                  <div class="banner-btn">
                    <router-link to="/enquete/encour-1" class="edu-btn"
                      >Demander plus d'info <i class="icon-4"></i
                    ></router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="banner-gallery">
            <div
              class="thumbnail thumbnail-1"
              data-aos-delay="500"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <img src="/images/banner/téléchargement.jpeg" alt="Girl Image" loading="lazy" />
            </div>
            <div
              class="thumbnail thumbnail-2"
              data-aos-delay="500"
              data-aos="fade-down"
              data-aos-duration="1000"
            >
              <img src="/images/banner/tec.jpeg" alt="Girl Image" loading="lazy" />
            </div>
            <div
              class="thumbnail thumbnail-3"
              data-aos-delay="500"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <img src="/images/banner/girl-6.webp" alt="Girl Image" loading="lazy" />
            </div>
            <div
              class="online-support"
              data-aos-delay="600"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <div class="inner">
                <div class="icon">
                  <i class="icon-29"></i>
                </div>
                <div class="content">
                  <span class="subtitle">Online Support </span>
                  <h4 class="title"><a href="tel:++22377010098">+223 77 01 00 98</a></h4>
                </div>
              </div>
            </div>
          </div>

          <ul class="shape-group">
            <li
              class="shape-1"
              dataDepth="2"
              data-aos-delay="1000"
              data-aos="fade"
              data-aos-duration="1000"
            >
              <img src="/images/others/shape-17.png" alt="Shape" loading="lazy" />
            </li>
            <li
              class="shape-2"
              dataDepth="-2"
              data-aos-delay="1000"
              data-aos="fade"
              data-aos-duration="1000"
            >
              <img src="/images/others/shape-03.png" alt="Shape" loading="lazy" />
            </li>
            <li
              class="shape-3"
              dataDepth="2"
              data-aos-delay="1000"
              data-aos="fade"
              data-aos-duration="1000"
            >
              <img src="/images/others/shape-09.png" alt="Shape" loading="lazy" />
            </li>
            <li
              class="shape-4"
              dataDepth="-2"
              data-aos-delay="1000"
              data-aos="fade"
              data-aos-duration="1000"
              imgSrc="/images/others/shape-15.png"
            >
              <img src="/images/others/shape-15.png" alt="Shape" loading="lazy" />
            </li>
            <li
              class="shape-5"
              dataDepth="-2"
              data-aos-delay="1000"
              data-aos="fade"
              data-aos-duration="1000"
            >
              <img src="/images/others/shape-16.png" alt="Shape" loading="lazy" />
            </li>
            <li
              class="shape-6"
              dataDepth="2"
              data-aos-delay="1000"
              data-aos="fade"
              data-aos-duration="1000"
            >
              <img src="/images/faq/shape-12.png" alt="Shape" loading="lazy" />
            </li>
            <li
              class="shape-7"
              dataDepth="-2"
              data-aos-delay="1000"
              data-aos="fade"
              data-aos-duration="1000"
            >
              <img src="/images/others/shape-17.png" alt="Shape" loading="lazy" />
            </li>
          </ul>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script>
import AOS from 'aos'
import { Autoplay, EffectCoverflow, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'

export default {
  components: {
    Swiper,
    SwiperSlide,
  },

  mounted() {
    AOS.init({ duration: 800, once: false, observer: true, observeParents: true })
  },
  data() {
    return {
      slideKey: 0,
      slideKey1: 0,
      slideKey2: 0,
    }
  },
  methods: {
    onSlideChange() {
      this.slideKey++
      this.slideKey1++
      this.slideKey2++
      this.$nextTick(() => {
        AOS.refreshHard()
      })
    },
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
        margin-left: 26px;
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
.hero-banner.hero-style-2 .banner-gallery .shape-group li.shape-1-for-dark {
  top: -58px;
  right: 125px;
  visibility: hidden;
}

.dark-mode .hero-banner.hero-style-2 .banner-gallery .shape-group li.shape-1-for-dark {
  visibility: visible;
}

.dark-mode .hero-banner.hero-style-2 .banner-gallery .shape-group li.shape-1.for-light {
  visibility: hidden;
}

.hero-style-1 .banner-thumbnail .shape-group li.shape-3.circle-shape span {
  width: 41px;
  height: 41px;
  background: var(--color-tertiary);
  border-radius: 100%;
}
</style>
