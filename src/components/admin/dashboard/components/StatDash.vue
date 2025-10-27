<template>
  <div class="modern-dashboard">
    <BRow class="g-4">
      <BCol md="12" order="1" cols="xl-12">
        <BRow class="g-4">
          <BCol md="3" cols="xl-3">
            <div class="modern-stat-card stat-card-primary">
              <div class="stat-card-content">
                <div class="stat-icon">
                  <i class="bi bi-file-text"></i>
                </div>
                <div class="stat-info">
                  <h3 class="stat-number">
                    <CountToComponent :startVal="0" :endVal="Tsur" :duration="2000" />
                  </h3>
                  <p class="stat-label">Sondages</p>
                </div>
              </div>
              <div class="stat-card-bg"></div>
            </div>
          </BCol>
          <BCol md="3" cols="xl-3">
            <div class="modern-stat-card stat-card-success">
              <div class="stat-card-content">
                <div class="stat-icon">
                  <i class="bi bi-check2-square"></i>
                </div>
                <div class="stat-info">
                  <h3 class="stat-number">
                    <CountToComponent :startVal="0" :endVal="Tsuracive" :duration="2000" />
                  </h3>
                  <p class="stat-label">Sondages Publiés</p>
                </div>
              </div>
              <div class="stat-card-bg"></div>
            </div>
          </BCol>

          <BCol md="3" cols="xl-3">
            <div class="modern-stat-card stat-card-info">
              <div class="stat-card-content">
                <div class="stat-icon">
                  <i class="bi bi-pencil-square"></i>
                </div>
                <div class="stat-info">
                  <h3 class="stat-number">
                    <CountToComponent :startVal="0" :endVal="Trep" :duration="2000" />
                  </h3>
                  <p class="stat-label">Réponses</p>
                </div>
              </div>
              <div class="stat-card-bg"></div>
            </div>
          </BCol>

          <BCol md="3" cols="xl-3">
            <div class="modern-stat-card stat-card-warning">
              <div class="stat-card-content">
                <div class="stat-icon">
                  <i class="bi bi-ui-checks-grid"></i>
                </div>
                <div class="stat-info">
                  <h3 class="stat-number">
                    <CountToComponent :startVal="0" :endVal="ttask" :duration="2000" />
                  </h3>
                  <p class="stat-label">Tâches</p>
                </div>
              </div>
              <div class="stat-card-bg"></div>
            </div>
          </BCol>
        </BRow>
        <BRow class="g-4">
          <BCol md="3" cols="xl-3">
            <div class="modern-stat-card stat-card-secondary">
              <div class="stat-card-content">
                <div class="stat-icon">
                  <i class="bi bi-building"></i>
                </div>
                <div class="stat-info">
                  <h3 class="stat-number">
                    <CountToComponent :startVal="0" :endVal="Tbusniness" :duration="2000" />
                  </h3>
                  <p class="stat-label">Comptes Business</p>
                </div>
              </div>
              <div class="stat-card-bg"></div>
            </div>
          </BCol>
          <BCol md="3" cols="xl-3">
            <div class="modern-stat-card stat-card-purple">
              <div class="stat-card-content">
                <div class="stat-icon">
                  <i class="bi bi-people"></i>
                </div>
                <div class="stat-info">
                  <h3 class="stat-number">
                    <CountToComponent :startVal="0" :endVal="Tparticipant" :duration="2000" />
                  </h3>
                  <p class="stat-label">Comptes Participants</p>
                </div>
              </div>
              <div class="stat-card-bg"></div>
            </div>
          </BCol>

          <BCol md="3" cols="xl-3">
            <div class="modern-stat-card stat-card-orange">
              <div class="stat-card-content">
                <div class="stat-icon">
                  <i class="bi bi-lightning-charge-fill"></i>
                </div>
                <div class="stat-info">
                  <h3 class="stat-number">
                    <CountToComponent :startVal="0" :endVal="Tflashsur" :duration="2000" />
                  </h3>
                  <p class="stat-label">Sondages Flash</p>
                </div>
              </div>
              <div class="stat-card-bg"></div>
            </div>
          </BCol>

          <BCol md="3" cols="xl-3">
            <div class="modern-stat-card stat-card-teal">
              <div class="stat-card-content">
                <div class="stat-icon">
                  <i class="bi bi-gift"></i>
                </div>
                <div class="stat-info">
                  <h3 class="stat-number">
                    <CountToComponent :startVal="0" :endVal="recompom" :duration="2000" />
                  </h3>
                  <p class="stat-label">Points Distribués</p>
                </div>
              </div>
              <div class="stat-card-bg"></div>
            </div>
          </BCol>
        </BRow>
      </BCol>
      <BCol md="12" cols="xl-12" order="2">
        <div class="modern-chart-card">
          <div class="chart-header">
            <h5 class="chart-title">Sondages par Catégories</h5>
            <div class="chart-subtitle">Répartition des sondages par catégorie</div>
          </div>
          <div class="chart-content">
            <apexchart
              type="bar"
              height="350"
              width="100%"
              :options="categoryOptionsBar"
              :series="categorySeriesBar"
            />
          </div>
        </div>
      </BCol>
      <BCol md="6" cols="xl-6" order="3">
        <div class="modern-chart-card chart-small">
          <div class="chart-header">
            <h5 class="chart-title">Top 5 Sondages</h5>
            <div class="chart-subtitle">Sondages les plus populaires</div>
          </div>
          <div class="chart-content">
            <apexchart
              type="bar"
              height="200"
              :options="leaderOptions"
              :series="leaderSeries"
            ></apexchart>
          </div>
        </div>
      </BCol>
      <BCol md="6" cols="xl-6" order="4">
        <div class="modern-chart-card chart-small">
          <div class="chart-header">
            <h5 class="chart-title">Top 5 Participants</h5>
            <div class="chart-subtitle">Participants les plus actifs</div>
          </div>
          <div class="chart-content">
            <div
              v-if="Array.isArray(topParticipants) && topParticipants.length === 0"
              class="empty-state"
            >
              <i class="bi bi-people text-muted"></i>
              <p class="empty-text">Aucune donnée disponible</p>
            </div>
            <apexchart
              v-else
              type="bar"
              height="200"
              width="100%"
              :options="leaderOptionsParticipants"
              :series="leaderSeriesParticipants"
            ></apexchart>
          </div>
        </div>
      </BCol>
    </BRow>
  </div>
</template>

<script>
import CountToComponent from '../../../../components/common/CountToComponent.vue'
import { BRow, BCol } from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
import { onMounted, ref } from 'vue'
import ApexCharts from 'vue3-apexcharts'
export default {
  components: {
    CountToComponent,
    BRow,
    BCol,
    apexchart: ApexCharts,
  },
  data() {
    const Tsur = ref(0)
    const Tsuracive = ref(0)
    const ttask = ref(0)
    const Tbusniness = ref(0)
    const Tparticipant = ref(0)
    const Trep = ref(0)
    const orderData = ref([])
    const Tcontact = ref(0)
    const Tflashsur = ref(0)
    const topSurveys = ref([])
    const leaderSeries = ref([{ data: [] }])
    const recompom = ref(0)
    const categoriesData = ref([])
    const categorySeriesBar = ref([
      {
        name: 'Nombre de Sondages',
        data: [],
      },
    ])

    const categoryOptionsBar = ref({
      chart: {
        type: 'bar',
        toolbar: { show: false },
        height: '100%',
        width: '100%',
        background: 'transparent',
        fontFamily: 'Inter, sans-serif',
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          horizontal: false,
          columnWidth: '60%',
          distributed: true,
        },
      },
      colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: '12px',
            fontWeight: 500,
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
          text: 'Nombre de Sondages',
          style: {
            fontSize: '12px',
            fontWeight: 600,
            color: '#64748b',
          },
        },
        labels: {
          style: {
            fontSize: '11px',
            colors: '#64748b',
          },
        },
      },
      tooltip: {
        theme: 'light',
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: (val) => `${val} Sondages`,
        },
      },
      legend: { show: false },
      grid: {
        borderColor: '#f1f5f9',
        strokeDashArray: 3,
      },
    })
    const leaderOptions = ref({
      chart: {
        type: 'bar',
        toolbar: { show: false },
        height: '100%',
        width: '100%',
        background: 'transparent',
        fontFamily: 'Inter, sans-serif',
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          horizontal: true,
          barHeight: '70%',
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '11px',
          fontWeight: 600,
          colors: ['#fff'],
        },
      },
      xaxis: {
        categories: [],
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
      colors: [],
      tooltip: {
        theme: 'light',
        y: {
          formatter: (val) => `${val} réponses`,
        },
      },
      grid: {
        borderColor: '#f1f5f9',
        strokeDashArray: 3,
      },
    })

    const gets = async () => {
      const response = await api.get('admin/dashboard/overview')
      const responses = await api.get('/admin/points-transactions/stats')
      const responseSS = await api.get('/admin/survey-categories')
      categoriesData.value = responseSS.data.categories
      recompom.value = responses.data.statsBySource?.admin_adjustment?.totalPoints
      orderData.value = response.data
      Tsur.value = response.data.stats.total_surveys
      Tsuracive.value = response.data.stats.active_surveys
      ttask.value = response.data.stats.total_tasks
      Tbusniness.value = response.data.stats.total_business_accounts
      Tparticipant.value = response.data.stats.total_participant_profiles
      Trep.value = response.data.surveys.reduce((total, survey) => {
        return (
          total +
          (survey.responses
            ? survey.responses.reduce((acc, r) => acc + (r.responseDetails?.length || 0), 0)
            : 0)
        )
      }, 0)
      Tcontact.value = response.data.stats.total_contacts
      Tflashsur.value = response.data.stats.total_flash_surveys

      const categoryNames = categoriesData.value.map((cat) => cat.name)
      const categoryCounts = categoriesData.value.map((cat) =>
        Array.isArray(cat.surveys) ? cat.surveys.length : 0,
      )
      categorySeriesBar.value = [{ name: 'Nombre de Sondages', data: categoryCounts }]

      categoryOptionsBar.value = {
        ...categoryOptionsBar.value,
        xaxis: { categories: categoryNames },
      }

      topSurveys.value = orderData.value.surveys
        .map((s) => ({
          ...s,
          responsesCount: s.responses
            ? s.responses.reduce((acc, r) => acc + (r.responseDetails?.length || 0), 0)
            : 0,
        }))
        .sort((a, b) => b.responsesCount - a.responsesCount)
        .slice(0, 5)
      leaderSeries.value = [
        {
          data: topSurveys.value.map((s) => s.responsesCount),
        },
      ]
      const categories = topSurveys.value.map((s) =>
        s.title.length > 20 ? s.title.substring(0, 20) + '...' : s.title,
      )

      leaderOptions.value = {
        ...leaderOptions.value,
        xaxis: {
          ...leaderOptions.value.xaxis,
          categories,
        },
        colors: topSurveys.value.map((s) => (s.type === 'BUSINESS' ? '#f59e0b' : '#10b981')),
        tooltip: {
          y: {
            formatter: (val, { dataPointIndex }) => {
              // Affiche le nombre de réponses + le titre complet
              const fullTitle = topSurveys.value[dataPointIndex].title
              const tre = `${val} réponses<br/><strong>${fullTitle}</strong>`
              return tre.length > 60 ? tre.substring(0, 67) + '...' : tre
            },
          },
          style: {
            fontSize: '11px',
            fontWeight: 'bold',
          },
          fixed: {
            enabled: true,
            position: 'topCenter', // Centre le tooltip par rapport à la barre
            offsetY: -10,
            offsetX: 0,
          },
        },
      }
    }

    const topParticipants = ref([])
    const leaderSeriesParticipants = ref([{ data: [] }])
    const leaderOptionsParticipants = ref({
      chart: {
        type: 'bar',
        toolbar: { show: false },
        height: '100%',
        width: '100%',
        background: 'transparent',
        fontFamily: 'Inter, sans-serif',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          barHeight: '70%',
          borderRadius: 8,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val}`,
        style: {
          fontSize: '11px',
          fontWeight: 600,
          colors: ['#fff'],
        },
      },
      xaxis: {
        title: {
          text: 'Participants',
          style: {
            fontWeight: 600,
            fontSize: '12px',
            color: '#64748b',
          },
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
          text: 'Points',
          style: {
            fontWeight: 600,
            fontSize: '12px',
            color: '#64748b',
          },
        },
        labels: {
          style: {
            fontSize: '10px',
            colors: '#64748b',
          },
        },
      },
      colors: ['#8b5cf6'],
      tooltip: {
        theme: 'light',
        y: {
          formatter: (val, { dataPointIndex }) => {
            const fullName = `${topParticipants.value[dataPointIndex].participant.firstName} ${topParticipants.value[dataPointIndex].participant.lastName}(${
              topParticipants.value[dataPointIndex].participant.user.length === 0
                ? 'aucun'
                : topParticipants.value[dataPointIndex].participant.user[0].email
            })`
            return `${val} points<br/><strong>${fullName}</strong>`
          },
        },
      },
      grid: {
        borderColor: '#f1f5f9',
        strokeDashArray: 3,
      },
    })

    const getParticipantsLeaderboard = async () => {
      const response = await api.get('/admin/leaderboard')
      const participants = response.data.leaderboard || []

      topParticipants.value = participants.sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 5)

      leaderSeriesParticipants.value = [
        {
          data: topParticipants.value.map((p) => p.totalPoints),
        },
      ]

      leaderOptionsParticipants.value = {
        ...leaderOptionsParticipants.value,
        xaxis: {
          categories: topParticipants.value.map((p) =>
            p.participant.firstName.length > 20
              ? p.participant.firstName.substring(0, 20) + '...'
              : p.participant.firstName,
          ),
        },
        tooltip: {
          y: {
            formatter: (val, { dataPointIndex }) => {
              const fullName = `${topParticipants.value[dataPointIndex].participant.firstName} ${topParticipants.value[dataPointIndex].participant.lastName} (${
                topParticipants.value[dataPointIndex].participant.user.length === 0
                  ? 'aucun'
                  : topParticipants.value[dataPointIndex].participant.user[0].email
              })`
              return `${val} points<br/><strong>${fullName}</strong>`
            },
          },
        },
      }
    }

    onMounted(async () => {
      await gets()
      await getParticipantsLeaderboard()
    })
    return {
      categorySeriesBar,
      categoryOptionsBar,
      categoriesData,
      recompom,
      topParticipants,
      leaderSeriesParticipants,
      leaderOptionsParticipants,
      orderData,
      topSurveys,
      leaderSeries,
      leaderOptions,
      Tsur,
      Tsuracive,
      ttask,
      Tbusniness,
      Tparticipant,
      Trep,
      Tcontact,
      Tflashsur,
    }
  },
}
</script>

<style lang="scss">
@import '../../../../css/assets/scss/app2.scss';
@import '../../../../css/admin/dashboard.scss';
</style>
