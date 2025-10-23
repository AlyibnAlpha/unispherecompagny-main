<template>
  <q-layout>
    <q-page-container class="bg-light">
      <q-page>
        <PageHeader :title="title" :items="items" />
        <ProfilBCom />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import PageHeader from '../../components/global/PageHeader.vue'
import ProfilBCom from 'src/components/admin/profil/ProfilBCom.vue'
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
          text: 'Profil Bussiness',
          active: true,
        },
      ],
    }
  },
  components: {
    PageHeader,
    ProfilBCom,
  },
}
</script>

<style lang="scss">
@import '../../css/assets/scss/app2.scss';
</style>
