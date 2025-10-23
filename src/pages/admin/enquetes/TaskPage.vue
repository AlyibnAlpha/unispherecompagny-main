<script>
import TaskListCom from 'src/components/admin/enquete/TaskListCom.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: 'Mes tâches',
      items: [
        {
          text: 'Tâches',
        },
      ],
    }
  },
  components: {
    TaskListCom,
    PageHeader,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <TaskListCom />
</template>
