<template>
  <section class="why-choose-area-4 edu-section-gap">
    <div class="container edublink-animated-shape">
      <SectionTitle
        preTitle="Why choose edublink"
        title='Les meuilleurs de <span class="color-secondary">Unisphere compagny</span>'
        alignment="section-center"
      />
      <div class="row g-5">
        <div
          class="col-lg-4"
          data-aos-delay="150"
          data-aos="fade-up"
          data-aos-duration="800"
          v-for="(feature, index) in features"
          :key="index"
        >
          <div class="why-choose-box-3 features-box" :class="feature.colorClass">
            <div class="thumbnail">
              <img :src="'/images/others/' + feature.imgSrc" :alt="feature.title + ' Thumbnail'" />
            </div>
            <div class="content">
              <div class="icon">
                <i :class="feature.iconClass"></i>
              </div>
              <h4 class="title">{{ feature.title }}</h4>
            </div>
          </div>
        </div>
      </div>
      <ul class="shape-group">
        <li class="shape-1" data-aos-delay="500" data-aos="fade" data-aos-duration="200">
          <img class="rotateit" src="/images/about/shape-13.png" alt="shape" />
        </li>
        <MouseMove
          addClassName="shape-2"
          dataDepth="0.85"
          data-aos-delay="500"
          data-aos="fade"
          data-aos-duration="200"
        />
      </ul>
    </div>
  </section>
</template>

<script>
import SectionTitle from '../common/SectionTitle.vue'
import MouseMove from '../animation/MouseMove.vue'

export default {
  components: {
    MouseMove,
    SectionTitle,
  },
  data() {
    return {
      features: [
        {
          title: 'La Haut Qualité des enquêtes',
          iconClass: 'icon-45',
          imgSrc: 'why-choose-03.webp',
          colorClass: 'color-primary-style',
        },
        {
          title: "facilité d'accès",
          iconClass: 'icon-46',
          imgSrc: 'why-choose-04.webp',
          colorClass: 'color-secondary-style',
        },
        {
          title: 'Expertise et professionnalisme',
          iconClass: 'icon-47',
          imgSrc: 'why-choose-05.webp',
          colorClass: 'color-extra08-style',
        },
      ],
    }
  },
}
</script>
