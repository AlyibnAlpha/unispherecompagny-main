<template>
  <BRow>
    <BCol md="3" cols="xl-3">
      <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
        <BCardBody class="d-flex justify-content-between align-items-center p-4 bg-light">
          <div>
            <div class="d-flex align-items-center mb-2">
              <i class="bi bi-file-text text-warning fs-3 me-2"></i>
              <h4 class="fw-bold mb-0 fs-2">
                <span data-plugin="counterup">
                  <CountToComponent :startVal="0" :endVal="Tav" :duration="2000" />
                </span>
              </h4>
            </div>

            <span class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
              >Sondanges disponibles</span
            >
          </div>
        </BCardBody>
      </BCard>
    </BCol>
    <BCol md="3" cols="xl-3">
      <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
        <BCardBody class="d-flex justify-content-between align-items-center p-4 bg-light">
          <div>
            <div class="d-flex align-items-center mb-2">
              <i class="bi bi-file-text text-warning fs-3 me-2"></i>
              <h4 class="fw-bold mb-0 fs-2">
                <span data-plugin="counterup">
                  <CountToComponent :startVal="0" :endVal="Tq" :duration="2000" />
                </span>
              </h4>
            </div>

            <span class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
              >Enquêtes en cours</span
            >
          </div>
        </BCardBody>
      </BCard>
    </BCol>
    <BCol md="3" cols="xl-3">
      <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
        <BCardBody class="d-flex justify-content-between align-items-center p-4 bg-light">
          <div>
            <div class="d-flex align-items-center mb-2">
              <i class="bi bi-file-text text-success fs-3 me-2"></i>
              <h4 class="fw-bold mb-0 fs-2">
                <span data-plugin="counterup">
                  <CountToComponent :startVal="0" :endVal="Tr" :duration="2000" />
                </span>
              </h4>
            </div>

            <span class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
              >Enquêtes completer</span
            >
          </div>
        </BCardBody>
      </BCard>
    </BCol>
    <BCol md="3" cols="xl-3">
      <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
        <BCardBody class="d-flex justify-content-between align-items-center p-4 bg-light">
          <div>
            <div class="d-flex align-items-center mb-2">
              <i class="bi bi-wallet text-success fs-3 me-2"></i>
              <h4 class="fw-bold mb-0 fs-2">
                <span data-plugin="counterup">
                  <CountToComponent :startVal="0" :endVal="Tpoint" :duration="2000" />
                </span>
              </h4>
            </div>

            <span class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
              >Points</span
            >
          </div>
        </BCardBody>
      </BCard>
    </BCol>
  </BRow>
</template>

<script>
import CountToComponent from '../../../../components/common/CountToComponent.vue'
import { BRow, BCol, BCard, BCardBody } from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
import { onMounted, ref } from 'vue'

export default {
  components: {
    CountToComponent,
    BRow,
    BCol,
    BCard,
    BCardBody,
  },
  data() {
    const Tq = ref(0)
    const Tr = ref(0)
    const Tav = ref(0)
    const Tpoint = ref(0)
    const gets = async () => {
      const response = await api.get('/participants/dashboard/overview')
      const resp = await api.get('/participants/points/balance')

      Tpoint.value = resp.data.totalPoints
      Tav.value = response.data.surveys_available?.length || 0
      Tq.value = response.data.stats.total_surveys_in_progress
      Tr.value = response.data.stats.total_surveys_completed
    }
    onMounted(() => {
      gets()
    })
    return {
      Tq,
      Tr,
      Tav,
      Tpoint,
    }
  },
}
</script>

<style lang="scss">
@import '../../../../css/assets/scss/app2.scss';
@import '../../../../css/admin/dashboard.scss';
</style>
