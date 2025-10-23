<script>
import AdLeaderCom from 'src/components/admin/enquete/AdLeaderCom.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: 'Système de classement et compétition entre participants',
      items: [
        {
          text: 'Leaderboard',
        },
      ],
    }
  },
  components: {
    AdLeaderCom,
    PageHeader,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <AdLeaderCom />
</template>
