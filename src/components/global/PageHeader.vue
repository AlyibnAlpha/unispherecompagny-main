<template>
  <BRow>
    <BCol cols="12">
      <div class="modern-page-header">
        <div class="page-header-left">
          <div class="page-icon">
            <i class="bi bi-speedometer2"></i>
          </div>
          <h2 class="page-header-title">{{ title }}</h2>
        </div>

        <div class="page-header-right">
          <BBreadcrumb :items="items" class="modern-breadcrumb" />
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

<style lang="scss">
@import '../../css/assets/scss/app2.scss';
@import '../../css/admin/dashboard.scss';
</style>
