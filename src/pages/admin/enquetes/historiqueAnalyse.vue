<script>
import PageHeader from '../../../components/global/PageHeader.vue'
import HistoriqueCom from 'src/components/admin/enquete/HistoriqueCom.vue'

export default {
  data() {
    return {
      title: 'Historique des analyses',
      items: [
        {
          text: 'Enquetes',
        },
        {
          text: 'historique',
          active: true,
        },
      ],
    }
  },
  components: {
    PageHeader,
    HistoriqueCom,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <HistoriqueCom />
</template>
<style>
@import '../../../css/assets/scss/app2.scss';
</style>
