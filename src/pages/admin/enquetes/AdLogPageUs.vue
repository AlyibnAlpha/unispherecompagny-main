<script>
import AdLogsUc from 'src/components/admin/enquete/AdLogsUc.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: 'Vue des actions des utilisateurs',
    }
  },
  components: {
    AdLogsUc,
    PageHeader,
  },
}
</script>

<template>
  <PageHeader :title="title" />
  <AdLogsUc />
</template>
