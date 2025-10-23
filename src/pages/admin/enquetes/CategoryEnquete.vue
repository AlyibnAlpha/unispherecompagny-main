<script>
import CategorySondageCom from 'src/components/admin/enquete/CategorySondageCom.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: 'Catégories des Enquête',
      items: [
        {
          text: 'Catégories',
        },
      ],
    }
  },
  components: {
    CategorySondageCom,
    PageHeader,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <CategorySondageCom />
</template>
