<template>
  <div class="gap-bottom-equal edu-about-area about-style-2">
    <div class="container edublink-animated-shape">
      <div class="row g-5 align-items-center">
        <div class="col-lg-7">
          <div class="about-image-gallery">
            <img class="main-img-1" src="/equipe.webp" alt="About Image" />
            <div
              class="author-box rellax"
              data-rellax-speed="0.8"
              data-rellax-xs-speed="0.8"
              data-rellax-mobile-speed="0.5"
              data-rellax-tablet-speed="0.5"
            >
              <div class="inner">
                <div class="thumb">
                  <img src="/images/about/shape-03.png" alt="Shape Image" />
                </div>
                <div class="content">
                  <h4 class="title">Miri</h4>
                  <p>Posez vous les bonnes questions dès maintenant.</p>
                </div>
              </div>
            </div>
            <div class="award-status bounce-slide">
              <div class="inner">
                <div class="icon">
                  <i class="icon-30"></i>
                </div>
                <div class="content">
                  <h6 class="title">20K+</h6>
                  <span class="subtitle">AVIS</span>
                </div>
              </div>
            </div>
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
          </div>
        </div>
        <div class="col-lg-5">
          <div class="about-content">
            <SectionTitle
              title="Il s'agit du meilleur moyen d'atteindre votre public"
              alignment="section-left"
              subTitle="Que vous créiez un simple questionnaire ou sondage, que vous cherchiez une alternative à Google Forms ou à Doodle, ou que vous travailliez sur une enquête sophistiquée avec des règles de validation complexes, une logique conditionnelle et une gestion des quotas, nous pouvons vous fournir tous les outils dont vous avez besoin. Ici, vous pouvez tirer profit de ces connaissances et atteindre rapidement vos objectifs d'enquête."
            />
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
import MouseMove from '../animation/MouseMove.vue'
import SectionTitle from '../common/SectionTitle.vue'
import parallaxAnimation from '/common/parallaxAnimation.js'
export default {
  components: {
    SectionTitle,
    MouseMove,
  },
  mounted() {
    parallaxAnimation()
  },
}
</script>
