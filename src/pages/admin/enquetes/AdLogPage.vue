<script>
import AdLogs from 'src/components/admin/enquete/AdLogs.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: 'Vue des actions',
    }
  },
  components: {
    AdLogs,
    PageHeader,
  },
}
</script>

<template>
  <PageHeader :title="title" />
  <AdLogs />
</template>
