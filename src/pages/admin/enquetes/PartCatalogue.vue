<script>
import PageHeader from '../../../components/global/PageHeader.vue'
import PratCataCom from 'src/components/admin/enquete/PratCataCom.vue'

export default {
  data() {
    return {
      title: 'Catalogue',
    }
  },
  components: {
    PageHeader,
    PratCataCom,
  },
}
</script>

<template>
  <PageHeader :title="title" />
  <PratCataCom />
</template>
