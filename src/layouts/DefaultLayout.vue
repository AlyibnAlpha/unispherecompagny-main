<script>
import { useLayoutStore } from '../stores/layout'
import { LAYOUT_TYPE } from '../app/const'
import Vertical from '../components/layouts/vertical/indexLay.vue'

export default {
  data() {
    return {
      LAYOUT_TYPE,
      layoutStore: useLayoutStore(),
    }
  },
  components: {
    Vertical,
  },
  computed: {
    layoutType() {
      return this.layoutStore.layoutTypecom
    },
    isVertical() {
      return this.layoutType === LAYOUT_TYPE.VERTICAL
    },
  },
  mounted() {
    document.body.classList.remove('authentication-bg')
  },
}
</script>

<style>
@import '../css/assets/scss/app2.scss';
</style>

<template>
  <q-layout>
    <Vertical v-if="isVertical">
      <q-page-container>
        <router-view />
      </q-page-container>
    </Vertical>
  </q-layout>
</template>
