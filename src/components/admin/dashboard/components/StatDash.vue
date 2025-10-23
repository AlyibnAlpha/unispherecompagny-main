<template>
  <BRow>
    <BCol md="12" order="1" cols="xl-12">
      <BRow>
        <BCol md="3" cols="xl-3">
          <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
            <BCardBody class="d-flex justify-content-between align-items-center p-4 bg-light">
              <div>
                <div class="d-flex align-items-center mb-2">
                  <i class="bi bi-file-text text-warning fs-3 me-2"></i>

                  <h4 class="fw-bold mb-0 fs-2">
                    <CountToComponent :startVal="0" :endVal="Tsur" :duration="2000" />
                  </h4>
                </div>

                <span
                  class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                  >Sondanges</span
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
                  <i class="bi bi-check2-square text-success fs-3 me-2"></i>
                  <h4 class="fw-bold mb-0 fs-2">
                    <CountToComponent :startVal="0" :endVal="Tsuracive" :duration="2000" />
                  </h4>
                </div>

                <span
                  class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                  >Sondages Publie</span
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
                  <i class="bi bi-pencil-square text-success fs-3 me-2"></i>
                  <h4 class="fw-bold mb-0 fs-2">
                    <CountToComponent :startVal="0" :endVal="Trep" :duration="2000" />
                  </h4>
                </div>
                <span
                  class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                  >Réponses</span
                >
              </div>
            </BCardBody>
          </BCard>
        </BCol>

        <BCol md="3" cols="xl-3">
          <BCard no-body class="shadow-sm rounded-4 stat-card shadow-danger">
            <BCardBody class="d-flex justify-content-between align-items-center p-4 bg-light">
              <div>
                <div class="d-flex align-items-center mb-2">
                  <i class="bi bi-ui-checks-grid text-danger fs-3 me-2"></i>
                  <h4 class="fw-bold mb-0 fs-2">
                    <CountToComponent :startVal="0" :endVal="ttask" :duration="2000" />
                  </h4>
                </div>

                <span class="badge bg-danger-subtle text-danger fw-semibold px-3 py-1 rounded-pill"
                  >Tâches</span
                >
              </div>
            </BCardBody>
          </BCard>
        </BCol>
      </BRow>
      <BRow>
        <BCol md="3" cols="xl-3">
          <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
            <BCardBody class="d-flex justify-content-between align-items-center p-4 bg-light">
              <div>
                <div class="d-flex align-items-center mb-2">
                  <i class="bi bi-building text-warning fs-3 me-2"></i>
                  <h4 class="fw-bold mb-0 fs-2">
                    <CountToComponent :startVal="0" :endVal="Tbusniness" :duration="2000" />
                  </h4>
                </div>

                <span
                  class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                  >Comptes Business</span
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
                  <i class="bi bi-people text-success fs-3 me-2"></i>
                  <h4 class="fw-bold mb-0 fs-2">
                    <CountToComponent :startVal="0" :endVal="Tparticipant" :duration="2000" />
                  </h4>
                </div>

                <span
                  class="badge bg-success-subtle text-success fw-semibold px-2 py-1 rounded-pill"
                  >Comptes Participants</span
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
                  <i class="bi bi-lightning-charge-fill text-success fs-3 me-2"></i>
                  <h4 class="fw-bold mb-0 fs-2">
                    <CountToComponent :startVal="0" :endVal="Tflashsur" :duration="2000" />
                  </h4>
                </div>
                <span
                  class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                  >Sondages Flash</span
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
                    <CountToComponent :startVal="0" :endVal="recompom" :duration="2000" />
                  </h4>
                </div>

                <span
                  class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                  >Points Distribués</span
                >
              </div>
            </BCardBody>
          </BCard>
        </BCol>
      </BRow>
    </BCol>
    <BCol md="12" cols="xl-12" order="2">
      <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
        <BCardBody class="p-0 bg-light" style="height: 400px">
          <div class="h-100 w-100 p-3">
            <h5 class="fw-semibold mb-3">Sondages par Catégories</h5>
            <apexchart
              type="bar"
              height="90%"
              width="100%"
              :options="categoryOptionsBar"
              :series="categorySeriesBar"
            />
          </div>
        </BCardBody>
      </BCard>
    </BCol>
    <BCol md="6" cols="xl-6" order="3">
      <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning" style="height: 300px">
        <BCardBody class="d-flex p-4 bg-light">
          <div>
            <h5 class="fw-semibold mb-3">Classement - Top 5 Sondages</h5>
            <apexchart
              type="bar"
              height="170"
              :options="leaderOptions"
              :series="leaderSeries"
            ></apexchart>
          </div>
        </BCardBody>
      </BCard>
    </BCol>
    <BCol md="6" cols="xl-6" order="4">
      <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning" style="height: 300px">
        <BCardBody class="d-flex p-4 bg-light">
          <div>
            <h5 class="fw-semibold mb-3">Classement - Top 5 Participants</h5>
            <div
              v-if="Array.isArray(topParticipants) && topParticipants.length === 0"
              class="text-center py-4"
            >
              <i class="uil uil-folder-open text-muted" style="font-size: 3rem"></i>
              <p class="mt-3 text-muted">Aucune données</p>
            </div>
            <apexchart
              v-else
              type="bar"
              height="90%"
              width="100%"
              :options="leaderOptionsParticipants"
              :series="leaderSeriesParticipants"
              class="px-5"
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
import { api } from 'src/boot/axios'
import { onMounted, ref } from 'vue'
import ApexCharts from 'vue3-apexcharts'
export default {
  components: {
    CountToComponent,
    BRow,
    BCol,
    BCard,
    BCardBody,
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
        height: '90%', // 👈 Ajoute ceci
        width: '100%',
      },
      plotOptions: {
        bar: {
          borderRadius: 3,
          horizontal: false,
          columnWidth: '50%',
          distributed: true, // chaque barre a sa couleur
        },
      },
      colors: ['#42A5F5', '#FF6384', '#FFC107', '#28A745', '#8E44AD'],
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: '14px',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Nombre de Sondages',
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} Sondages`,
        },
      },
      legend: { show: false },
    })
    const leaderOptions = ref({
      chart: { type: 'bar', toolbar: { show: false }, height: '90%', width: '100%' },
      plotOptions: { bar: { borderRadius: 3, horizontal: true, barHeight: '60%' } },
      dataLabels: { enabled: true },
      xaxis: { categories: [] },
      colors: [],
      tooltip: { y: {} },
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
        colors: topSurveys.value.map((s) => (s.type === 'BUSINESS' ? '#FFC107' : '#28a745')),
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
        height: '90%',
        width: '100%',
      },
      plotOptions: {
        bar: {
          horizontal: false, // ✅ Barres horizontales
          barHeight: '60%',
          borderRadius: 5,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val}`, // affiche le nombre sur la barre
        style: {
          fontSize: '13px',
          colors: ['#fff'],
        },
      },
      xaxis: {
        title: {
          text: 'Participants', // ✅ Axe X = réponses
          style: { fontWeight: 600 },
        },
        labels: {
          style: {
            fontSize: '13px',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Nombre de points', // ✅ Axe Y = noms
          style: { fontWeight: 600 },
        },
        labels: {
          style: {
            fontSize: '10px',
          },
        },
      },
      colors: ['#007bff'],
      tooltip: {
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
