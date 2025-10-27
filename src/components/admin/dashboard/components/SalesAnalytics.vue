<template>
  <div class="modern-analytics">
    <BRow class="g-4">
      <BCol cols="12">
        <!-- Tableau 3 derniers sondages -->
        <div class="modern-table-card">
          <div class="table-header">
            <h4 class="table-title">3 derniers sondages</h4>
            <div class="table-subtitle">Sondages récemment créés</div>
          </div>
          <div class="table-content">
            <BTable
              :items="lastSurveys"
              :fields="fields"
              bordered
              striped
              responsive
              class="modern-table"
            >
              <template #cell(type)="data">
                <div
                  class="badge badge-pill font-size-12"
                  :class="{
                    'bg-soft-warning': data.item.type === 'BUSINESS',
                    'bg-soft-success': data.item.type === 'PUBLIC',
                  }"
                >
                  {{ data.item.type === 'BUSINESS' ? 'Business' : 'Public' }}
                </div>
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
          </div>
        </div>
      </BCol>
    </BRow>
    <BRow class="g-4">
      <BCol cols="xl-6">
        <div class="modern-chart-card">
          <div class="chart-header">
            <h4 class="chart-title">Répartition Sondages</h4>
            <div class="chart-subtitle">Public vs Business</div>
          </div>
          <div class="chart-content">
            <apexchart
              type="pie"
              class="apex-charts"
              dir="ltr"
              height="300"
              :options="pieOptions"
              :series="pieSeries"
            ></apexchart>
          </div>
        </div>
      </BCol>
      <BCol cols="xl-6">
        <div class="modern-chart-card">
          <div class="chart-header">
            <div class="chart-header-content">
              <div class="chart-title-section">
                <h4 class="chart-title">Statistiques</h4>
                <div class="chart-subtitle">Évolution des réponses</div>
              </div>
              <div class="chart-controls">
                <BDropdown variant="white" toggle-class="modern-dropdown-toggle" no-caret>
                  <template v-slot:button-content>
                    <span class="dropdown-label">Période:</span>
                    <span class="dropdown-value">
                      {{ period === 'semaine' ? 'Semaine' : period === 'mois' ? 'Mois' : 'Année' }}
                      <i class="bi bi-chevron-down ms-1"></i>
                    </span>
                  </template>
                  <BDropdownItem @click="setPeriod('semaine')">Semaine</BDropdownItem>
                  <BDropdownItem @click="setPeriod('mois')">Mois</BDropdownItem>
                  <BDropdownItem @click="setPeriod('année')">Année</BDropdownItem>
                </BDropdown>
              </div>
            </div>
            <div class="header-stats">
              <div class="header-stat-item">
                <div class="header-stat-value">
                  <CountToComponent :startVal="0" :endVal="Tquestions" :duration="2000" />
                </div>
                <div class="header-stat-label">Questions</div>
              </div>
              <div class="header-stat-item">
                <div class="header-stat-value">
                  <CountToComponent :startVal="0" :endVal="Trep" :duration="2000" />
                </div>
                <div class="header-stat-label">Réponses</div>
              </div>
            </div>
          </div>

          <div class="chart-content">
            <apexchart
              type="bar"
              class="apex-charts"
              dir="ltr"
              height="250"
              :options="chartOptions"
              :series="series"
            ></apexchart>
          </div>
        </div>
      </BCol>
    </BRow>
  </div>
</template>

<script>
import CountToComponent from '../../../common/CountToComponent.vue'
import { BRow, BCol, BDropdown, BDropdownItem, BTable } from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth'
import { onMounted, ref } from 'vue'
import ApexCharts from 'vue3-apexcharts'

export default {
  components: {
    CountToComponent,
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
      legend: {
        position: 'bottom',
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
        markers: {
          width: 8,
          height: 8,
          radius: 4,
        },
      },
      chart: {
        type: 'pie',
        height: 300,
        background: 'transparent',
        fontFamily: 'Inter, sans-serif',
      },
      colors: ['#10b981', '#f59e0b'],
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          colors: ['#fff'],
        },
      },
      tooltip: {
        theme: 'light',
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: (val) => `${val} sondages`,
        },
      },
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
          chart: {
            type: 'bar',
            height: 250,
            toolbar: { show: false },
            background: 'transparent',
            fontFamily: 'Inter, sans-serif',
          },
          xaxis: {
            categories,
            title: {
              text:
                period.value === 'semaine'
                  ? 'Semaines'
                  : period.value === 'mois'
                    ? 'Mois'
                    : 'Années',
              style: { fontSize: '12px', fontWeight: 600, color: '#64748b' },
            },
            labels: {
              style: {
                fontSize: '11px',
                colors: '#64748b',
              },
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
          },
          yaxis: {
            title: {
              text: 'Nombre de réponses',
              style: { fontSize: '12px', fontWeight: 600, color: '#64748b' },
            },
            labels: {
              style: {
                fontSize: '11px',
                colors: '#64748b',
              },
            },
          },
          plotOptions: {
            bar: {
              columnWidth: '50%',
              borderRadius: 6,
            },
          },
          colors: ['#667eea'],
          fill: { opacity: 0.8 },
          tooltip: {
            theme: 'light',
            style: {
              fontSize: '12px',
            },
            y: {
              formatter: (val) => `${val} réponses`,
            },
          },
          grid: {
            borderColor: '#f1f5f9',
            strokeDashArray: 3,
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

<style lang="scss">
@import '../../../../css/assets/scss/app2.scss';
@import '../../../../css/admin/badges.scss';
@import '../../../../css/admin/dashboard.scss';
</style>
