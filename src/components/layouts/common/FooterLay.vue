<template>
  <footer class="footer">
    <BContainer fluid>
      <BRow class="justify-content-between">
        <BCol sm="6" class="text-start">{{ new Date().getFullYear() }} © U.C</BCol>
        <BCol sm="6">
          <div class="text-sm-end d-none d-sm-block">Unisphere compagny.</div>
        </BCol>
      </BRow>
    </BContainer>
  </footer>
</template>

<script>
/**
 * Footer component
 */
import { BContainer, BRow, BCol } from 'bootstrap-vue-next'
export default {
  name: 'AppFooter',
  components: {
    BContainer,
    BRow,
    BCol,
  },
}
</script>

<style>
@import '../../../css/assets/scss/app2.scss';
</style>
