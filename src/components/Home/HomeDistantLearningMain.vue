<template>
  <div>
    <HeaderOne />
    <TestimonialOne />
    <Categories />
    <DistantAbout />
    <Course />
    <FunFact />
    <TestimonialTwo />
    <!--<Logo />-->
    <FAQ />
    <!--<Blog />-->
    <FooterOne />
    <ScrollToTop />
  </div>
</template>

<script lang="ts">
import FooterOne from '../footer/FooterOne.vue'
import HeaderOne from '../header/HeaderOne.vue'
import TestimonialTwo from '../testimonial/TestimonialTwo.vue'
import TestimonialOne from '../testimonial/TestimonialOne.vue'

import Categories from './CategoriesHome.vue'
import Course from './CourseHome.vue'
import FAQ from './FAQ.vue'

import FunFact from './FunFact.vue'
import ScrollToTop from '../footer/ScrollToTop.vue'
import DistantAbout from './DistantAbout.vue'

export default {
  name: 'app',
  components: {
    Categories,
    Course,
    FAQ,
    FooterOne,
    HeaderOne,
    TestimonialTwo,
    FunFact,
    ScrollToTop,
    DistantAbout,
    TestimonialOne,
  },
}
</script>
