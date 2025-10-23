<script>
import PageHeader from '../../../components/global/PageHeader.vue'
import SubscriptionCom from 'src/components/admin/enquete/SubscriptionCom.vue'

export default {
  data() {
    return {
      title: 'Mes subscriptions',
      items: [
        {
          text: 'Subscriptions',
        },
        {
          text: 'Mes Subscriptions',
          active: true,
        },
      ],
    }
  },
  components: {
    PageHeader,
    SubscriptionCom,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <SubscriptionCom />
</template>
