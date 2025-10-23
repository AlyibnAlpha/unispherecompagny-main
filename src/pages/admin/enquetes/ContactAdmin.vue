<script>
import ContactCom from 'src/components/admin/enquete/ContactCom.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: 'Mes Contacts',
      items: [
        {
          text: 'Contacts',
        },
        {
          text: 'Mes Contacts',
          active: true,
        },
      ],
    }
  },
  components: {
    ContactCom,
    PageHeader,
  },
}
</script>

<template>
  <q-layout>
    <q-page-container class="bg-light">
      <q-page>
        <PageHeader :title="title" :items="items" />
        <ContactCom /> </q-page></q-page-container
  ></q-layout>
</template>
