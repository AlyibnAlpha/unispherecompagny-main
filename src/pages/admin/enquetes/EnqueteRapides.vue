<script>
import EnquetemesComFalsh from 'src/components/admin/enquete/EnquetemesComFalsh.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

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
    EnquetemesComFalsh,
    PageHeader,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <EnquetemesComFalsh />
</template>
