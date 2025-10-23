<template>
    <div>
        <div class="video-area-1 bg-image--13">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-9">
                        <div class="video-gallery">
                            <div class="thumbnail">
                                <img src="/images/others/video-01.jpg" alt="Thumb">
                                <span class="video-play-btn video-popup-activation" @click.prevent="handleVideoPopup">
                                    <i class="icon-18"></i>
                                </span>
                            </div>
                            <ul class="shape-group">
                                <MouseMove addClassName="shape-1" dataDepth="2" imgSrc="/images/about/shape-37.png" />
                                <MouseMove addClassName="shape-2" dataDepth="-2" imgSrc="/images/faq/shape-04.png" />
                                <MouseMove addClassName="shape-3 shape-light" dataDepth="2"
                                    imgSrc="/images/faq/shape-14.png" />
                                <MouseMove addClassName="shape-3 shape-dark" dataDepth="2"
                                    imgSrc="/images/faq/dark-shape-14.png" />
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- video modal start -->
          <video-modal
            ref="video_modal"
            video-url="https://www.youtube.com/embed/7e90gBu4pas"
          />
        <!-- video modal end -->
    </div>
</template>

<script>
import MouseMove from '../animation/MouseMove.vue';
import VideoModal from '../common/VideoModal.vue';

export default {
    components: {
        MouseMove,
        VideoModal
    },
    data() {
        return {}
    },
    methods: {
        handleVideoPopup() {
            this.$refs.video_modal.playVideo();
        },
    }
}
</script>

<style>
.video-area-1 .video-play-btn {
    cursor: pointer;
}
</style>