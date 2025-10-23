<template>
  <q-layout>
    <q-page-container class="bg-light">
      <q-page>
        <PageHeader :title="title" :items="items" />
        <ProfilACom />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import PageHeader from '../../components/global/PageHeader.vue'
import ProfilACom from 'src/components/admin/profil/ProfilACom.vue'
import 'simplebar'

export default {
  data() {
    return {
      title: 'Profil',
      items: [
        {
          text: 'Profil',
        },
        {
          text: 'Profil utilisateur',
          active: true,
        },
      ],
    }
  },
  components: {
    PageHeader,
    ProfilACom,
  },
}
</script>

<style lang="scss">
@import '../../css/assets/scss/app2.scss';
</style>
