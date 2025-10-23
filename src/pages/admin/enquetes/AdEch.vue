<script>
import AdGestEchReCom from 'src/components/admin/enquete/AdGestEchReCom.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: 'Gestion administrative des échanges de récompenses ',
    }
  },
  components: {
    AdGestEchReCom,
    PageHeader,
  },
}
</script>

<template>
  <PageHeader :title="title" />
  <AdGestEchReCom />
</template>
