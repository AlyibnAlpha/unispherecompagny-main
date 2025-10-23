<template>
  <BRow>
    <BCol cols="12">
      <!-- Tableau 3 derniers sondages -->
      <BRow class="mt-2">
        <BCol cols="12">
          <BCard no-body>
            <BCardBody>
              <h4 class="card-title mb-4 text-success">3 derniers sondages</h4>
              <BTable :items="lastSurveys" :fields="fields" bordered striped responsive>
                <template #cell(type)="data">
                  <span
                    class="badge"
                    :class="data.item.type === 'BUSINESS' ? 'bg-warning' : 'bg-success'"
                  >
                    {{ data.item.type === 'BUSINESS' ? 'Business' : 'Public' }}
                  </span>
                </template>
                <template #cell(startDate)="data">
                  {{ new Date(data.item.startDate).toLocaleDateString() }}
                </template>
                <template #cell(endDate)="data">
                  {{ new Date(data.item.endDate).toLocaleDateString() }}
                </template>
                <template #cell(status)="data">
                  <div
                    class="badge badge-pill font-size-12"
                    :class="{
                      'bg-soft-primary': data.item.status === 'draft',
                      'bg-soft-success': data.item.status === 'published',
                      'bg-soft-warning': data.item.status === 'archived',
                      'bg-soft-secondary': data.item.status === 'review',
                      'bg-soft-danger': data.item.status === 'closed',
                    }"
                  >
                    {{ data.item.status }}
                  </div>
                </template>
              </BTable>
            </BCardBody>
          </BCard>
        </BCol>
      </BRow>
    </BCol>
  </BRow>
  <BRow>
    <BCol cols="xl-6">
      <BCard no-body>
        <BCardBody>
          <h4 class="card-title mb-4">Répartition Sondages Public vs Business</h4>
          <div class="mt-3 d-flex flex-wrap">
            <!-- Camembert répartition Public vs Business -->
            <div class="flex-fill mt-5" style="min-width: 300px; flex: 1">
              <apexchart
                type="pie"
                class="apex-charts"
                dir="ltr"
                height="339"
                :options="pieOptions"
                :series="pieSeries"
              ></apexchart>
            </div></div
        ></BCardBody>
      </BCard>
    </BCol>
    <BCol cols="xl-6">
      <BCard no-body>
        <BCardBody>
          <!-- Dropdown tri -->
          <div class="float-end">
            <BDropdown variant="white" toggle-class="text-reset p-0" no-caret>
              <template v-slot:button-content>
                <span class="font-weight-semibold">Trié:</span>
                <span class="text-muted">
                  par...
                  <i class="mdi mdi-chevron-down ms-1"></i>
                </span>
              </template>
              <BDropdownItem @click="setPeriod('semaine')">Semaine</BDropdownItem>
              <BDropdownItem @click="setPeriod('mois')">Mois</BDropdownItem>
              <BDropdownItem @click="setPeriod('année')">Année</BDropdownItem>
            </BDropdown>
          </div>

          <h4 class="card-title mb-4">Statistique</h4>

          <div class="mt-1">
            <ul class="list-inline main-chart mb-0">
              <li class="list-inline-item chart-border-left me-0 border-0">
                <h3 class="text-primary d-flex align-items-end">
                  <CountToComponent :startVal="0" :endVal="Tquestions" :duration="2000" />
                  <span class="text-muted d-inline-block font-size-15 ms-2">Questions</span>
                </h3>
              </li>
              <li class="list-inline-item chart-border-left me-0">
                <h3 class="d-flex align-items-end">
                  <CountToComponent :startVal="0" :endVal="Trep" :duration="2000" />
                  <span class="text-muted d-inline-block font-size-15 ms-2">Réponses</span>
                </h3>
              </li>
            </ul>
          </div>

          <div class="mt-3">
            <apexchart
              type="bar"
              class="apex-charts"
              dir="ltr"
              height="339"
              :options="chartOptions"
              :series="series"
            ></apexchart>
          </div>
        </BCardBody>
      </BCard>
    </BCol>
  </BRow>
</template>

<script>
import CountToComponent from '../../../common/CountToComponent.vue'
import { BRow, BCard, BCardBody, BCol, BDropdown, BDropdownItem, BTable } from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth'
import { onMounted, ref } from 'vue'
import ApexCharts from 'vue3-apexcharts'

export default {
  components: {
    CountToComponent,
    BCard,
    BCardBody,
    BCol,
    BDropdown,
    BDropdownItem,
    BRow,
    apexchart: ApexCharts,
    BTable,
  },
  setup() {
    const auth = useAuthStore()
    const Trep = ref(0)
    const Tquestions = ref(0)
    const series = ref([])
    const chartOptions = ref({})
    const orderData = ref([])
    const period = ref('mois')
    const pieSeries = ref([0, 0]) // [Public, Business]
    const pieOptions = ref({
      labels: ['Sondages Public', 'Sondages Business'],
      legend: { position: 'bottom' },
      chart: { type: 'pie', height: 339 },
      colors: ['#28a745', '#FFC107'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 300 },
            legend: { position: 'bottom' },
          },
        },
      ],
    })
    const lastSurveys = ref([])
    const fields = [
      { key: 'title', label: 'Sondage' },
      { key: 'type', label: 'Type' },
      { key: 'startDate', label: 'Date de début' },
      { key: 'endDate', label: 'Date de fin' },
      { key: 'status', label: 'Statut' },
    ]

    // Fonction fiable pour calculer le numéro de semaine ISO
    const getWeekNumber = (d) => {
      const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
      date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
      const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
      const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7)
      return weekNo
    }

    // Grouper les réponses selon le type de période
    const groupResponses = (surveys, type = 'mois') => {
      const grouped = {}

      surveys.forEach((survey) => {
        survey.responses?.forEach((resp) => {
          resp.responseDetails?.forEach((detail) => {
            const date = new Date(detail.createdAt)
            if (isNaN(date.getTime())) return // sécurité si date invalide

            let key = ''
            let label = ''

            if (type === 'semaine') {
              const week = getWeekNumber(date)
              key = `${date.getFullYear()}-${week}`
              label = `Semaine ${week}/${date.getFullYear()}`
            } else if (type === 'mois') {
              const month = String(date.getMonth() + 1).padStart(2, '0')
              key = `${date.getFullYear()}-${month}`
              label = `${month}/${date.getFullYear()}`
            } else if (type === 'année') {
              key = `${date.getFullYear()}`
              label = `${date.getFullYear()}`
            }

            if (!grouped[key]) grouped[key] = { value: 0, label }
            grouped[key].value += 1 // chaque réponse individuelle compte pour 1
          })
        })
      })

      const sortedKeys = Object.keys(grouped).sort()
      const categories = sortedKeys.map((k) => grouped[k].label)
      const values = sortedKeys.map((k) => grouped[k].value)

      return { categories, values }
    }

    const camembert = () => {
      let publicCount = 0
      let businessCount = 0
      orderData.value.surveys?.forEach((survey) => {
        if (survey.type === 'BUSINESS') businessCount++
        else publicCount++
      })

      pieSeries.value = [publicCount, businessCount]
    }

    // Charger les données et mettre à jour le chart
    const gets = async () => {
      const role = auth.roles[0]
      let response
      if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
        response = await api.get('/admin/dashboard/overview')
        orderData.value = response.data

        Trep.value = response.data.surveys.reduce((total, survey) => {
          return (
            total +
            (survey.responses
              ? survey.responses.reduce((acc, r) => acc + (r.responseDetails?.length || 0), 0)
              : 0)
          )
        }, 0)

        let qCount = 0
        response.data.surveys.forEach((survey) => {
          survey.question_groups.forEach((group) => {
            qCount += group.questions.length
          })
        })
        Tquestions.value = qCount

        const allResponses = response.data.surveys
        const { categories, values } = groupResponses(allResponses, period.value)

        series.value = [{ name: 'Réponses', type: 'column', data: values }]

        chartOptions.value = {
          chart: { type: 'bar', height: 339, toolbar: { show: false } },
          xaxis: {
            categories,
            title: {
              text:
                period.value === 'semaine'
                  ? 'Semaines'
                  : period.value === 'mois'
                    ? 'Mois'
                    : 'Années',
              style: { fontSize: '14px', fontWeight: 'bold', color: '#555' },
            },
          },
          yaxis: {
            title: {
              text: 'Nombre de réponses',
              style: { fontSize: '14px', fontWeight: 'bold', color: '#555' },
            },
          },
          plotOptions: { bar: { columnWidth: '30%' } },
          colors: ['#5b73e8'],
          fill: { opacity: 0.85 },
          title: {
            text: `Réponses par ${period.value}`,
            align: 'center',
            style: { fontSize: '16px', fontWeight: 'bold', color: '#333' },
          },
        }
        camembert()
        lastSurveys.value = response.data.surveys
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
          .slice(0, 3)
      } else if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
        response = await api.get('/business/dashboard/overview')
        orderData.value = response.data

        Trep.value = response.data.survey_stats.total_responses

        let qCount = 0
        response.data.surveys.forEach((survey) => {
          survey.question_groups.forEach((group) => {
            qCount += group.questions.length
          })
        })
        Tquestions.value = qCount

        const allResponses = response.data.surveys.flatMap((s) => s.responses)
        const { categories, values } = groupResponses(allResponses, period.value)

        series.value = [{ name: 'Réponses', type: 'column', data: values }]

        chartOptions.value = {
          chart: { type: 'bar', height: 339, toolbar: { show: false } },
          xaxis: {
            categories,
            title: {
              text:
                period.value === 'semaine'
                  ? 'Semaines'
                  : period.value === 'mois'
                    ? 'Mois'
                    : 'Années',
              style: { fontSize: '14px', fontWeight: 'bold', color: '#555' },
            },
          },
          yaxis: {
            title: {
              text: 'Nombre de réponses',
              style: { fontSize: '14px', fontWeight: 'bold', color: '#555' },
            },
          },
          plotOptions: { bar: { columnWidth: '30%' } },
          colors: ['#5b73e8'],
          fill: { opacity: 0.85 },
          title: {
            text: `Réponses par ${period.value}`,
            align: 'center',
            style: { fontSize: '16px', fontWeight: 'bold', color: '#333' },
          },
        }
        camembert()
        lastSurveys.value = response.data.surveys
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
          .slice(0, 3)
      }
    }

    const setPeriod = (newPeriod) => {
      period.value = newPeriod
      gets()
    }

    onMounted(() => {
      gets()
    })

    return {
      camembert,
      Trep,
      Tquestions,
      series,
      chartOptions,
      period,
      setPeriod,
      gets,
      pieOptions,
      pieSeries,
      lastSurveys,
      fields,
    }
  },
}
</script>

<style>
@import '../../../../css/assets/scss/app2.scss';
</style>
