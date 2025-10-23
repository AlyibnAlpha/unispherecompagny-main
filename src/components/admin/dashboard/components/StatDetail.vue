<template>
  <BRow>
    <!-- Carte Questions -->
    <BCol md="6" cols="xl-3">
      <BCard no-body class="stat-card shadow-warning">
        <BCardBody class="d-flex justify-content-between align-items-center p-3">
          <div>
            <h4 class="fw-bold mb-1 fs-5">
              <span data-plugin="counterup">
                <CountToComponent :startVal="0" :endVal="Tq" :duration="2000" />
              </span>
            </h4>
            <span class="card-label"> <i class="bi bi-question-circle me-1"></i>Questions </span>
          </div>
          <div class="float-end mt-2">
            <apexchart
              class="apex-charts"
              dir="ltr"
              width="55"
              height="45"
              :options="chartOptionsQuestions"
              :series="seriesQuestions"
            ></apexchart>
          </div>
        </BCardBody>
      </BCard>
    </BCol>

    <!-- Carte Réponses -->
    <BCol md="6" cols="xl-3">
      <BCard no-body class="stat-card shadow-success">
        <BCardBody class="d-flex justify-content-between align-items-center p-3">
          <div>
            <h4 class="fw-bold mb-1 fs-5">
              <span data-plugin="counterup">
                <CountToComponent :startVal="0" :endVal="Tr" :duration="2000" />
              </span>
            </h4>
            <span class="card-label"> <i class="bi bi-check-circle me-1"></i>Réponses </span>
          </div>
          <div class="float-end mt-2">
            <apexchart
              class="apex-charts"
              dir="ltr"
              width="55"
              height="45"
              :options="chartOptionsResponses"
              :series="seriesResponses"
            ></apexchart>
          </div>
        </BCardBody>
      </BCard>
    </BCol>
  </BRow>
</template>

<script>
import CountToComponent from '../../../../components/common/CountToComponent.vue'
import { BRow, BCol, BCard, BCardBody } from 'bootstrap-vue-next'
import { onMounted, ref, watch } from 'vue'
import ApexCharts from 'vue3-apexcharts'

export default {
  props: {
    survey: Object,
  },
  components: {
    CountToComponent,
    BRow,
    BCol,
    BCard,
    BCardBody,
    apexchart: ApexCharts,
  },
  setup(props) {
    const Tq = ref(0)
    const Tr = ref(0)
    const Tpart = ref(0)
    const form = ref([])

    const gets = async (survey) => {
      if (!survey) return
      form.value = survey
      Tq.value = form.value.question_groups?.reduce(
        (sum, group) => sum + (group.questions?.length || 0),
        0,
      )
      Tr.value = form.value.responses?.reduce((acc, r) => acc + (r.responseDetails?.length || 0), 0)
      Tpart.value = form.value.survey_participants?.length || 0
    }

    onMounted(() => {
      gets(props.survey)
    })

    watch(
      () => props.survey,
      (newVal) => {
        gets(newVal)
      },
      { deep: true, immediate: true },
    )

    // Graphiques pour questions et réponses
    const seriesQuestions = [{ data: [25, 66, 41, 89, 63, 25, 44, 20, 36, 40, 54] }]
    const chartOptionsQuestions = {
      fill: { colors: ['#fff'] },
      chart: { type: 'bar', sparkline: { enabled: true } },
      plotOptions: { bar: { columnWidth: '50%' } },
      tooltip: { theme: 'dark', x: { show: false } },
    }

    const seriesResponses = [{ data: [70, 40, 60, 30, 80, 50, 70] }]
    const chartOptionsResponses = {
      fill: { colors: ['#fff'] },
      chart: { type: 'bar', sparkline: { enabled: true } },
      plotOptions: { bar: { columnWidth: '50%' } },
      tooltip: { theme: 'dark', x: { show: false } },
    }

    return {
      Tq,
      Tr,
      Tpart,
      seriesQuestions,
      chartOptionsQuestions,
      seriesResponses,
      chartOptionsResponses,
    }
  },
}
</script>

<style>
@import '../../../../css/assets/scss/app2.scss';

/* Card style */
.stat-card {
  border-radius: 1rem;
  color: #fff;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Gradient backgrounds */
.shadow-warning {
  background: linear-gradient(135deg, #b2f2fa, #83eefc);
  box-shadow: 0 4px 20px rgba(253, 160, 133, 0.4);
}

.shadow-success {
  background: linear-gradient(135deg, #4edaec, #b2f2fa);
  box-shadow: 0 4px 20px rgba(56, 249, 215, 0.4);
}
</style>
