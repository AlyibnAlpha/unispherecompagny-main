<script>
import EnquetemesComWel from 'src/components/admin/enquete/EnquetemesComWel.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: 'Enquêtes de Bienvenue',
      items: [
        {
          text: 'Enquêtes',
        },
      ],
    }
  },
  components: {
    EnquetemesComWel,
    PageHeader,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <EnquetemesComWel />
</template>
