<script>
import PageHeader from '../../../components/global/PageHeader.vue'
import PratTransCom from 'src/components/admin/enquete/PratTransCom.vue'

export default {
  data() {
    return {
      title: 'Statisque & transactions',
    }
  },
  components: {
    PageHeader,
    PratTransCom,
  },
}
</script>

<template>
  <PageHeader :title="title" />
  <PratTransCom />
</template>
