<script>
import { BButton } from 'bootstrap-vue-next'
import EnqueteModifBienCom from 'src/components/admin/enquete/EnqueteModifBienCom.vue'

export default {
  components: {
    BButton,
    EnqueteModifBienCom,
  },
}
</script>

<template>
  <BButton variant="primary" @click="$router.back()"> ⬅ Retour </BButton>
  <EnqueteModifBienCom />
</template>
