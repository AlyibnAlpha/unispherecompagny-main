<template>
  <q-layout>
    <q-page-container class="bg-light">
      <q-page class="business-dashboard">
        <PageHeader :title="title" :items="items" />
        <Dashbuss />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import PageHeader from '../../components/global/PageHeader.vue'
import Dashbuss from '../../components/admin/dashboard/IndexBuss.vue'
import 'simplebar'

export default {
  data() {
    return {
      title: 'Dashboard',
      items: [
        {
          text: 'Bussness',
        },
        {
          text: 'Dashboard',
          active: true,
        },
      ],
    }
  },
  components: {
    Dashbuss,
    PageHeader,
  },
}
</script>
