<script>
import EnqueteencourCom from 'src/components/admin/enquete/EnqueteencourCom.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: 'Enquêtes en cours',
      items: [
        {
          text: 'Enquetes',
        },
        {
          text: 'En cours',
          active: true,
        },
      ],
    }
  },
  components: {
    EnqueteencourCom,
    PageHeader,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <EnqueteencourCom />
</template>
<style>
@import '../../../css/assets/scss/app2.scss';
</style>
