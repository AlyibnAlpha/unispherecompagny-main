<script>
import EnqueteavisCom from 'src/components/admin/enquete/EnqueteavisCom.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: "Detail de l'enquete",
      items: [
        {
          text: 'ENQUETES en cours',
        },
        {
          text: "Detail de l'enquete",
          active: true,
        },
      ],
    }
  },

  components: {
    PageHeader,
    EnqueteavisCom,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <EnqueteavisCom />
</template>
