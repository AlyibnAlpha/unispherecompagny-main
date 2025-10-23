<template>
  <div>
    <HeaderOne />

    <BreadCrumbThree title="A propos" />

    <AboutThree />

    <FunFact />

    <WhyChoose />

    <FooterOne />

    <ScrollToTop />
  </div>
</template>

<script>
import FooterOne from '../footer/FooterOne.vue'
import BreadCrumbThree from '../common/BreadCrumbThree.vue'
import HeaderOne from '../header/HeaderOne.vue'
import WhyChoose from './WhyChoose.vue'
import FunFact from './FunFact.vue'
import AboutThree from './AboutThree.vue'
import ScrollToTop from '../footer/ScrollToTop.vue'

export default {
  components: {
    HeaderOne,
    BreadCrumbThree,
    FooterOne,
    FunFact,
    WhyChoose,
    AboutThree,
    ScrollToTop,
  },
  head() {
    return {
      title: 'About Us 3',
    }
  },
}
</script>
<style>
.video-area-1 .video-play-btn {
  cursor: pointer;
}
</style>
