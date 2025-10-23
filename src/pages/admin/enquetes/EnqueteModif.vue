<script>
import { BButton } from 'bootstrap-vue-next'
import EnqueteModifCom from 'src/components/admin/enquete/EnqueteModifCom.vue'

export default {
  components: {
    BButton,
    EnqueteModifCom,
  },
}
</script>

<template>
  <BButton variant="primary" @click="$router.back()"> ⬅ Retour </BButton>
  <EnqueteModifCom />
</template>
