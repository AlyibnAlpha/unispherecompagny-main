<script>
import ContactCollaboration from 'src/components/admin/enquete/ContactCollaboration.vue'
import PageHeader from '../../../components/global/PageHeader.vue'

export default {
  data() {
    return {
      title: 'Mes Contacts-collaborations',
      items: [
        {
          text: 'Contacts',
        },
        {
          text: 'Mes Contacts-collaborations',
          active: true,
        },
      ],
    }
  },
  components: {
    ContactCollaboration,
    PageHeader,
  },
}
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <ContactCollaboration />
</template>
