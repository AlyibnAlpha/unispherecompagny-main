<script>
import PageHeader from '../../../components/global/PageHeader.vue'
import AdGestCom from 'src/components/admin/enquete/AdGestCom.vue'

export default {
  data() {
    return {
      title: 'Gestions des Administrateurs',
    }
  },
  components: {
    PageHeader,
    AdGestCom,
  },
}
</script>

<template>
  <PageHeader :title="title" />
  <AdGestCom />
</template>
