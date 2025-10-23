<script>
import AdTranscCom from 'src/components/admin/enquete/AdTranscCom.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: 'Gestion administrative des transactions de points ',
      items: [
        {
          text: 'Transactions',
        },
      ],
    }
  },
  components: {
    AdTranscCom,
    PageHeader,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <AdTranscCom />
</template>
