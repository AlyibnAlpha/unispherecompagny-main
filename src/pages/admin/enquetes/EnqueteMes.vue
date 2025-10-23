<script>
import EnquetemesCom from '../../../components/admin/enquete/EnquetemesCom.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: 'Enquêtes',
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
    EnquetemesCom,
    PageHeader,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <EnquetemesCom />
</template>
