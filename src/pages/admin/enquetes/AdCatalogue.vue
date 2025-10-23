<script>
import AdCataCom from 'src/components/admin/enquete/AdCataCom.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: 'Catalogue des récompenses ',
      items: [
        {
          text: 'Catalogue',
        },
      ],
    }
  },
  components: {
    AdCataCom,
    PageHeader,
  },
}
</script>

<template>
  <q-layout>
    <q-page-container class="bg-light">
      <q-page>
        <PageHeader :title="title" :items="items" />
        <AdCataCom />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
