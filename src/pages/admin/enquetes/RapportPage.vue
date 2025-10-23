<script>
import PageHeader from '../../../components/global/PageHeader.vue'
import RapportCom from 'src/components/admin/enquete/RapportCom.vue'

export default {
  data() {
    return {
      title: 'Mes enquêtes',
      items: [
        {
          text: 'Enquêtes',
        },
        {
          text: 'Mes enquêtes',
          active: true,
        },
      ],
    }
  },
  components: {
    PageHeader,
    RapportCom,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <RapportCom />
</template>
