<script>
import PageHeader from '../../../components/global/PageHeader.vue'
import AdddRapport from 'src/components/admin/enquete/AdddRapport.vue'

export default {
  data() {
    return {
      title: 'Mes enquêtes',
      items: [
        {
          text: 'Enquêtes',
        },
        {
          text: 'Mes enquêtes',
          active: true,
        },
      ],
    }
  },
  components: {
    PageHeader,
    AdddRapport,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <AdddRapport />
</template>
