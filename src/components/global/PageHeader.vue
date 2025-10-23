<template>
  <BRow>
    <BCol cols="xl-12">
      <div class="page-title-box d-flex align-items-center justify-content-between">
        <h4 class="mb-0">{{ title }}</h4>

        <div class="page-title-right">
          <BBreadcrumb :items="items" class="m-0" />
        </div>
      </div>
    </BCol>
  </BRow>
</template>

<script>
import { BRow, BCol, BBreadcrumb } from 'bootstrap-vue-next'
export default {
  components: {
    BRow,
    BCol,
    BBreadcrumb,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
}
</script>
<style>
@import '../../css/assets/scss/app2.scss';
</style>
