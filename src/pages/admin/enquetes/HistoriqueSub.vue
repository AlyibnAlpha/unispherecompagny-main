<script>
import HistoriqueSubCOM from 'src/components/admin/enquete/HistoriqueSubCOM.vue'

export default {
  components: {
    HistoriqueSubCOM,
  },
}
</script>

<template>
  <q-layout>
    <q-page-container class="bg-light">
      <q-page>
        <HistoriqueSubCOM />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
</style>
