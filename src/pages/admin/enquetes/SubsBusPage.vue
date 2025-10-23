<script>
import PageHeader from '../../../components/global/PageHeader.vue'
import SubsBusinessCom from 'src/components/admin/enquete/SubsBusinessCom.vue'

export default {
  data() {
    return {
      title: 'Historiques des subscriptions',
      items: [
        {
          text: 'Mes Subscriptions',
        },
      ],
    }
  },
  components: {
    PageHeader,
    SubsBusinessCom,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <SubsBusinessCom />
</template>
