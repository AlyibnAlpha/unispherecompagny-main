<template>
  <BRow class="g-4">
    <BCol md="6" lg="6" xl="6">
      <div class="stat-card-business stat-warning">
        <div class="stat-icon">
          <i class="bi bi-file-text"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">
            <CountToComponent :startVal="0" :endVal="Tq" :duration="2000" />
          </div>
          <div class="stat-label">Sondages</div>
        </div>
      </div>
    </BCol>

    <BCol md="6" lg="6" xl="6">
      <div class="stat-card-business stat-success">
        <div class="stat-icon">
          <i class="bi bi-check2-square"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">
            <CountToComponent :startVal="0" :endVal="Tr" :duration="2000" />
          </div>
          <div class="stat-label">Réponses</div>
        </div>
      </div>
    </BCol>
  </BRow>
</template>

<script>
import CountToComponent from '../../../../components/common/CountToComponent.vue'
import { BRow, BCol } from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
import { onMounted, ref } from 'vue'

export default {
  components: {
    CountToComponent,
    BRow,
    BCol,
  },
  data() {
    const Tq = ref(0)
    const Tr = ref(0)
    const gets = async () => {
      const response = await api.get('/business/dashboard/overview')
      console.log(response.data)

      Tq.value = response.data.survey_stats.total_surveys
      Tr.value = response.data.survey_stats.total_responses
    }
    onMounted(() => {
      gets()
    })
    return {
      Tq,
      Tr,
    }
  },
}
</script>

<style lang="scss">
@import '../../../../css/business/index.scss';
</style>
