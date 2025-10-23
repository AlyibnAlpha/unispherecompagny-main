<script>
import ParticipantCom from '../../../components/admin/enquete/ParticipantCom.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: 'Groupes des Participants',
      items: [
        {
          text: 'Participants',
        },
        {
          text: 'Groupes des Participants',
          active: true,
        },
      ],
    }
  },
  components: {
    ParticipantCom,
    PageHeader,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <ParticipantCom />
</template>
