<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <ProfilACom />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import ProfilACom from 'src/components/admin/profil/ProfilACom.vue'

export default {
  components: {
    ProfilACom,
  },
}
</script>

<style lang="scss">
@import '../../css/assets/scss/app2.scss';
</style>
