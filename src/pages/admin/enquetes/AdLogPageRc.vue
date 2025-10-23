<script>
import AdLogsRc from 'src/components/admin/enquete/AdLogsRc.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: 'Vue des actions récents dans ces 24 heures',
    }
  },
  components: {
    AdLogsRc,
    PageHeader,
  },
}
</script>

<template>
  <PageHeader :title="title" />
  <AdLogsRc />
</template>
