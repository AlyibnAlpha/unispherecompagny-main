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

<style>
@import '../../../../css/assets/scss/app2.scss';
.stat-card {
  transition: all 0.4s ease-in-out;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #fdfdfd, #f5f5f5);
  position: relative;
  overflow: hidden;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
}

.shadow-warning:hover {
  border-color: #f1c40f;
  background-color: linear-gradient(135deg, #f8dc9f, #fff3cc);
  box-shadow: 0 0 18px rgba(241, 196, 15, 0.6);
}
.shadow-success:hover {
  border-color: #2ecc71;
  background: linear-gradient(135deg, #2ecc71, #d4f5e6);
  box-shadow: 0 0 18px rgba(46, 204, 113, 0.6);
}
.shadow-danger:hover {
  border-color: #e74c3c;
  background: linear-gradient(135deg, #ffecec, #ffd9d6);
  box-shadow: 0 0 18px rgba(231, 76, 60, 0.6);
}
</style>
