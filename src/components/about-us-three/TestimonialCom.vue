<template>
    <section>
        <div class="testimonial-area-6 gap-bottom-equal">
            <div class="container edublink-animated-shape">
                <div class="row row--40">
                    <div class="col-lg-6">
                        <SectionTitle preTitle='Testimonials' title='What Our Students <br> Have To Say'
                            alignment='section-left' />

                        <div class="about-3-testimonial-wrapper">
                            <swiper class="testimonial-activation-5 swiper" :modules="modules" :slidesPerView="1"
                                :loop="true" :spaceBetween="0" :autoplay="{
                                    delay: 3000,
                                    disableOnInteraction: true,
                                }" :speed="1000" :grabCursor="true"
                                :pagination="{ el: '.swiper-pagination', clickable: true, type: 'bullets' }">
                                <swiper-slide>
                                    <div class="testimonial-slide testimonial-style-3">
                                        <div class="content">
                                            <div class="rating-icon">
                                                <i class="icon-23"></i>
                                                <i class="icon-23"></i>
                                                <i class="icon-23"></i>
                                                <i class="icon-23"></i>
                                                <i class="icon-23"></i>
                                            </div>
                                            <p>“Lorem ipsum dolor amet consectur elit adicing elit sed do umod tempor ux
                                                incididunt enim ad minim veniam quis sit nosrud citation laboris nisiste
                                                aliquip comodo perspiatix une omnis iste natus error sit voluptatem
                                                accusantium dolore que laudantum”.</p>
                                            <div class="author-info">
                                                <div class="thumb">
                                                    <img src="/images/testimonial/testimonial-01.png" alt="Testimonial">
                                                </div>
                                                <div class="info">
                                                    <h5 class="title">Haley Bennet</h5>
                                                    <span class="subtitle">Designer</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </swiper-slide>
                                <swiper-slide>
                                    <div class="testimonial-slide testimonial-style-3">
                                        <div class="content">
                                            <div class="rating-icon">
                                                <i class="icon-23"></i>
                                                <i class="icon-23"></i>
                                                <i class="icon-23"></i>
                                                <i class="icon-23"></i>
                                                <i class="icon-23"></i>
                                            </div>
                                            <p>“Lorem ipsum dolor amet consectur elit adicing elit sed do umod tempor ux
                                                incididunt enim ad minim veniam quis sit nosrud citation laboris nisiste
                                                aliquip comodo perspiatix une omnis iste natus error sit voluptatem
                                                accusantium dolore que laudantum”.</p>
                                            <div class="author-info">
                                                <div class="thumb">
                                                    <img src="/images/testimonial/testimonial-02.png" alt="Testimonial">
                                                </div>
                                                <div class="info">
                                                    <h5 class="title">Richard Gere</h5>
                                                    <span class="subtitle">Designer</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </swiper-slide>
                                <swiper-slide>
                                    <div class="testimonial-slide testimonial-style-3">
                                        <div class="content">
                                            <div class="rating-icon">
                                                <i class="icon-23"></i>
                                                <i class="icon-23"></i>
                                                <i class="icon-23"></i>
                                                <i class="icon-23"></i>
                                                <i class="icon-23"></i>
                                            </div>
                                            <p>“Lorem ipsum dolor amet consectur elit adicing elit sed do umod tempor ux
                                                incididunt enim ad minim veniam quis sit nosrud citation laboris nisiste
                                                aliquip comodo perspiatix une omnis iste natus error sit voluptatem
                                                accusantium dolore que laudantum”.</p>
                                            <div class="author-info">
                                                <div class="thumb">
                                                    <img src="/images/testimonial/testimonial-03.png" alt="Testimonial">
                                                </div>
                                                <div class="info">
                                                    <h5 class="title">Megan Foxx</h5>
                                                    <span class="subtitle">Designer</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </swiper-slide>
                            </swiper>
                            <div class="swiper-pagination"></div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="video-gallery video-gallery-5" data-aos-delay="150" data-aos="fade-left"
                            data-aos-duration="800">
                            <div class="thumbnail">
                                <img src="/images/others/video-03.webp" alt="Thumb">
                                <span class="video-play-btn video-popup-activation" @click.prevent="handleVideoPopup">
                                    <i class="icon-18"></i>
                                </span>
                            </div>
                            <div class="content">
                                <h4 class="title">Take a Video Tour to Learn Intro of Campus</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <ul class="shape-group">
                    <MouseMove addClassName="shape-2" dataDepth="2" data-aos-delay="200" data-aos="fade"
                        data-aos-duration="1000" imgSrc="/images/about/shape-25.png" />
                    <MouseMove addClassName="shape-3" dataDepth="-1" data-aos-delay="200" data-aos="fade"
                        data-aos-duration="1000" />
                </ul>
            </div>
            <ul class="shape-group">
                <li class="shape-1" data-aos-delay="200" data-aos="fade" data-aos-duration="1000">
                    <img class="rotateit" src="/images/about/shape-13.png" alt="Shape">
                </li>
            </ul>
        </div>
        <!-- video modal start -->
        <video-modal ref="video_modal" video-url="https://www.youtube.com/embed/7e90gBu4pas" />
        <!-- video modal end -->
    </section>
</template>

<script>
import MouseMove from '../animation/MouseMove.vue';
import VideoModal from '../common/VideoModal.vue';
import SectionTitle from '../common/SectionTitle.vue';
import { Autoplay, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from "swiper/vue";

export default {
    components: {
        MouseMove,
        SectionTitle,
        VideoModal,
        Swiper,
        SwiperSlide
    },
    setup() {
        return {
            modules: [Autoplay, Pagination],
        }
    },
    methods: {
        handleVideoPopup() {
            this.$refs.video_modal.playVideo();
        },
    }
}
</script>

<style lang="scss">
.testimonial-area-6 {
    .about-3-testimonial-wrapper {
        .swiper-pagination {
            text-align: right;
            margin-top: -45px;
        }
    }
}
</style>