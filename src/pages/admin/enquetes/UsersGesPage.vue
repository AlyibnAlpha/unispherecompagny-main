<script>
import PageHeader from '../../../components/global/PageHeader.vue'
import UsersGestCom from 'src/components/admin/enquete/UsersGestCom.vue'

export default {
  data() {
    return {
      title: 'Gestions des utilisateurs',
    }
  },
  components: {
    PageHeader,
    UsersGestCom,
  },
}
</script>

<template>
  <PageHeader :title="title" />
  <UsersGestCom />
</template>
