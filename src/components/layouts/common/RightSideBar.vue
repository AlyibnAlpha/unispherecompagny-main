<template>
  <div class="right-bar">
    <div data-simplebar class="h-100">
      <div class="rightbar-title px-3 py-4">
        <a href="#" class="right-bar-toggle float-end" @click="hide">
          <i class="mdi mdi-close noti-icon"></i>
        </a>
        <h5 class="m-0">Settings</h5>
      </div>
      <div class="p-3">
        <h6 class="mb-0">Layout</h6>
        <hr class="border-1 border-top border-secondary mt-2" />
        <RadioGroup
          class="right-sidebar-radio-group"
          v-model="layout"
          :options="layoutOptions"
          stacked
        />

        <h6 class="mb-0 mt-4">Layout mode</h6>
        <hr class="border-1 border-top border-secondary mt-2" />
        <RadioGroup
          class="right-sidebar-radio-group"
          v-model="mode"
          :options="layoutModeOptions"
          stacked
        />

        <h6 class="mb-0 mt-4">Width</h6>
        <hr class="border-1 border-top border-secondary mt-2" />
        <RadioGroup
          class="right-sidebar-radio-group"
          v-model="width"
          :options="widthOptions"
          stacked
        />
        <div v-if="layout === 'vertical'">
          <h6 class="mb-0 mt-4">Sidebar</h6>
          <hr class="border-1 border-top border-secondary mt-2" />
          <RadioGroup
            class="right-sidebar-radio-group"
            v-model="sidebarType"
            :options="sideBarTypeOptions"
            stacked
          />
        </div>
        <div v-if="layout === 'horizontal'">
          <h6 class="mb-0 mt-4">Top Bar</h6>
          <hr class="border-1 border-top border-secondary mt-2" />
          <RadioGroup
            class="right-sidebar-radio-group"
            v-model="topbar"
            :options="topBarOptions"
            stacked
          />
        </div>
      </div>
      <hr class="mt-0" />
      <h6 class="text-center mb-0">Choose Layouts</h6>
      <div class="p-4">
        <div class="mb-2">
          <router-link target="_blank" to="//themes.themesbrand.com/minible/vue/v-light/">
            <img src="/images2/layouts/layout-1.jpg" class="img-fluid img-thumbnail" alt />
          </router-link>
        </div>
        <div class="mb-2">
          <router-link target="_blank" to="//themes.themesbrand.com/minible/vue/v-dark/">
            <img src="/images2/layouts/layout-2.jpg" class="img-fluid img-thumbnail" alt />
          </router-link>
        </div>

        <div class="mb-2">
          <router-link target="_blank" to="//themes.themesbrand.com/minible/vue/h-light/">
            <img src="/images2/layouts/layout-3.jpg" class="img-fluid img-thumbnail" alt />
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <div class="rightbar-overlay"></div>
</template>

<script>
import { useLayoutStore } from '../../../stores/layout'
import RadioGroup from '../../common/RadioGroup.vue'
import {
  layoutOptions,
  widthOptions,
  sideBarTypeOptions,
  topBarOptions,
  layoutModeOptions,
} from '../../layouts/utils/rightSideBar'

export default {
  data() {
    return {
      layoutOptions,
      widthOptions,
      sideBarTypeOptions,
      topBarOptions,
      layoutModeOptions,
    }
  },
  components: {
    RadioGroup,
  },
  computed: {
    layoutData() {
      return useLayoutStore() ? useLayoutStore() : {}
    },
    layout: {
      get() {
        return this.layoutData.layoutType
      },
      set(newVal) {
        useLayoutStore().changeLayoutType(newVal)
      },
    },
    width: {
      get() {
        return this.layoutData.layoutWidth
      },
      set(newVal) {
        useLayoutStore().changeLayoutWidth(newVal)
      },
    },
    topbar: {
      get() {
        return this.layoutData.topbar
      },
      set(newVal) {
        useLayoutStore().changeTopBar(newVal)
      },
    },
    sidebarType: {
      get() {
        return this.layoutData.leftSidebarType
      },

      set(newVal) {
        useLayoutStore().changeLeftSideBarType(newVal)
      },
    },
    mode: {
      get() {
        const mode = this.layoutData.mode
        document.body.setAttribute('data-bs-theme', mode)
        return this.layoutData.mode
      },

      set(newVal) {
        useLayoutStore().changeLayoutMode(newVal)
        useLayoutStore().changeLeftSideBarType(newVal)
        useLayoutStore().changeTopBar(newVal)
        document.body.setAttribute('data-bs-theme', newVal)
      },
    },
  },
  mounted() {
    this.addEventListener()
  },
  methods: {
    hide() {
      this.$parent.toggleRightSidebar()
    },
    addEventListener() {
      document.body.addEventListener('click', this.hideRightBar)
    },
    hideRightBar(event) {
      const classes = event.target.classList

      if (classes.contains('rightbar-overlay')) {
        this.$parent.hideRightSidebar()
      }
    },
  },
  beforeUnmount() {
    document.body.removeEventListener('click', this.hideRightBar)
  },
}
</script>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
.right-sidebar-radio-group .form-check {
  margin-bottom: 10px !important;
}
</style>
