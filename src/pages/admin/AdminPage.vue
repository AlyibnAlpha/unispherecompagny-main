<template>
  <q-layout>
    <q-page-container class="bg-light">
      <q-page>
        <PageHeader :title="title" :items="items" />
        <Dashboard />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import PageHeader from '../../components/global/PageHeader.vue'
import Dashboard from '../../components/admin/dashboard/IndexDash.vue'
import 'simplebar'

export default {
  data() {
    return {
      title: 'Dashboard',
    }
  },
  components: {
    Dashboard,
    PageHeader,
  },
}
</script>

<style lang="scss">
@import '../../css/assets/scss/app2.scss';
</style>
