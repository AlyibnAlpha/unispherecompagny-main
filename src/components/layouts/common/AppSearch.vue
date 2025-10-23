<template>
  <BForm class="app-search d-none d-lg-block">
    <div class="position-relative">
      <input type="text" class="form-control" :placeholder="$t('navbar.search.text')" />
      <span class="uil-search" />
    </div>
  </BForm>
</template>

<script>
import { BForm } from 'bootstrap-vue-next'
export default {
  components: {
    BForm,
  },
}
</script>

<style>
@import '../../../css/assets/scss/app2.scss';
</style>
