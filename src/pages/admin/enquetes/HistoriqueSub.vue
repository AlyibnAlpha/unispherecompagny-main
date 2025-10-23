<script>
import PageHeader from '../../../components/global/PageHeader.vue'
import HistoriqueSubCOM from 'src/components/admin/enquete/HistoriqueSubCOM.vue'

export default {
  data() {
    return {
      title: 'Mes historiques de subscriptions',
      items: [
        {
          text: 'Historiques',
        },
        {
          text: 'Subscriptions',
          active: true,
        },
      ],
    }
  },
  components: {
    PageHeader,
    HistoriqueSubCOM,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <HistoriqueSubCOM />
</template>
