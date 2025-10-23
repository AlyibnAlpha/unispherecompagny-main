<template>
  <div>
    <BRow>
      <BCol lg="12">
        <div id="stat-detail">
          <div class="text-center mb-4">
            <BCard
              class="shadow-lg border-0 p-4 rounded-4 position-relative overflow-hidden"
              style="transition: transform 0.3s; cursor: pointer"
              @mouseover="(e) => (e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)')"
              @mouseleave="(e) => (e.currentTarget.style.transform = 'translateY(0) scale(1)')"
            >
              <!-- Dégradé en arrière-plan -->
              <div
                class="position-absolute top-0 start-0 w-100 h-100"
                style="
                  background: linear-gradient(
                    135deg,
                    rgba(0, 123, 255, 0.15),
                    rgba(0, 200, 255, 0.05)
                  );
                  z-index: 0;
                  pointer-events: none;
                "
              ></div>

              <!-- Contenu du card -->
              <div class="position-relative" style="z-index: 1">
                <!-- Titre du sondage avec ombre légère -->
                <div class="mb-3 text-center text-md-start">
                  <h3
                    class="fw-bold mb-2 display-6"
                    style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1)"
                  >
                    <span class="text-primary">Sondage:</span> {{ form.title }}
                  </h3>
                  <p
                    class="text-muted mx-auto mx-md-0"
                    style="max-width: 650px; font-size: 0.95rem; line-height: 1.5"
                  >
                    {{ form.description }}
                  </p>
                </div>

                <!-- Badges de date avec gradient animé -->
                <div
                  class="d-flex justify-content-center justify-content-md-start gap-3 flex-wrap mt-3"
                >
                  <BBadge
                    class="d-flex align-items-center gap-2 py-2 px-3 rounded-pill shadow-sm border border-light text-white"
                    style="
                      background: linear-gradient(90deg, #28a745, #85e085);
                      background-size: 200% 100%;
                      animation: gradientShift 3s ease infinite;
                    "
                  >
                    <i class="bi bi-calendar-event-fill"></i> Début:
                    {{
                      new Date(form.startDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    }}
                  </BBadge>

                  <BBadge
                    class="d-flex align-items-center gap-2 py-2 px-3 rounded-pill shadow-sm border border-light text-white"
                    style="
                      background: linear-gradient(90deg, #dc3545, #ff7f7f);
                      background-size: 200% 100%;
                      animation: gradientShift 3s ease infinite;
                    "
                  >
                    <i class="bi bi-hourglass-split"></i> Fin:
                    {{
                      new Date(form.endDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    }}
                  </BBadge>
                </div>
              </div>
            </BCard>
          </div>
          <StatDetail :survey="form" />
          <!-- 🔹 Graphique ApexCharts -->
          <BCard class="mb-4">
            <div class="p-3">
              <apexchart type="bar" height="350" :options="chartOptions" :series="chartSeries" />
            </div>
          </BCard>
        </div>

        <!-- 🔹 Tableau récapitulatif -->
        <BCard class="mb-4" id="table-recap">
          <BRow>
            <BCol lg="6">
              <BCard class="mb-4">
                <div class="p-3">
                  <apexchart
                    type="bar"
                    height="330"
                    :options="ageChartOptions"
                    :series="ageChartSeries"
                  />
                </div>
              </BCard>
            </BCol>
            <BCol lg="6">
              <BCard class="mb-4">
                <div class="p-3">
                  <apexchart
                    type="pie"
                    height="390"
                    :options="genderChartOptions"
                    :series="genderChartSeries"
                  />
                </div>
              </BCard>
            </BCol>
          </BRow>
        </BCard>
        <div id="table-recap2">
          <BCard class="mb-4">
            <div class="p-3">
              <h5 class="font-size-16 mb-3">Statistiques des suivies participants</h5>
              <BTable
                :items="participantStats"
                :fields="tableFields"
                small
                bordered
                striped
                responsive
              >
                <template #cell(percent)="data">
                  <strong>{{ data.value }}</strong>
                </template>
              </BTable>
            </div>
          </BCard>
          <BCard class="mb-4">
            <div class="p-3">
              <h5 class="font-size-16 mb-3">Résumé des réponses</h5>
              <table class="table table-hover table-bordered align-middle text-center">
                <thead class="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th>Type</th>
                    <th>Total réponses</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="quest in questionsList" :key="'resume-' + quest.id">
                    <td>
                      <strong>{{ quest.position }}</strong>
                    </td>
                    <td class="text-start">{{ quest.title }}</td>
                    <td>
                      <span class="badge bg-info">{{ quest.type }}</span>
                    </td>
                    <td>
                      <span class="badge bg-primary">{{ quest.answers.length }}</span>
                    </td>
                  </tr>
                  <tr class="table-success fw-bold">
                    <td colspan="3" class="text-end">Moyenne par question</td>
                    <td>
                      <span class="badge bg-success">{{ moyenneReponses }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </BCard>
        </div>

        <div id="addproduct-accordion" class="custom-accordion">
          <BCard no-body v-for="quest in questionsList" :key="quest.id">
            <a href="#" class="nav-link" @click.prevent="toggleCollapse(quest.id)">
              <div class="p-4">
                <div class="media align-items-center d-flex justify-content-between">
                  <div class="d-flex">
                    <div class="me-3">
                      <div class="avatar-xs">
                        <div class="avatar-title rounded-circle bg-primary-subtle text-primary">
                          {{ quest.position }}
                        </div>
                      </div>
                    </div>
                    <div class="media-body overflow-hidden">
                      <h5 class="font-size-16 mb-1">{{ quest.title }}</h5>
                      <p class="text-muted text-truncate mb-0">{{ quest.description }}</p>
                    </div>
                  </div>
                  <i
                    :class="[
                      'mdi',
                      openCollapse[quest.id] ? 'mdi-chevron-up' : 'mdi-chevron-down',
                      'accor-down-icon',
                      'font-size-24',
                    ]"
                  ></i>
                </div>
              </div>
            </a>
            <BCollapse v-model="openCollapse[quest.id]">
              <div class="mt-4">
                <!-- Nombre de réponses -->
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                  style="padding-left: 10px; padding-right: 10px"
                >
                  <h6 class="mb-0 text-primary">
                    {{ quest.answers.length }} Réponse<span v-if="quest.answers.length > 1">s</span>
                  </h6>
                  <span
                    :class="
                      quest.type === 'text'
                        ? 'text-success'
                        : quest.type === 'single_choice'
                          ? 'text-primary'
                          : quest.type === 'multiple_choice'
                            ? 'text-info'
                            : quest.type === 'file'
                              ? 'text-warning'
                              : 'text-dark'
                    "
                  >
                    {{ quest.type }}
                  </span>
                </div>

                <!-- Liste des réponses -->
                <div v-if="quest.answers.length > 0" class="d-flex flex-column gap-3">
                  <div
                    v-for="(ans, idx) in getVisibleAnswers(quest)"
                    :key="idx"
                    class="border rounded shadow-sm p-3 bg-light"
                  >
                    <!-- Header de la réponse -->
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <h6 class="mb-0 text-dark">
                        <b>#{{ idx + 1 }}</b> — Participant
                      </h6>
                      <small class="text-muted">
                        📅
                        {{
                          new Date(ans.submittedAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        }}
                      </small>
                    </div>

                    <!-- Contenu de la réponse -->
                    <p class="mb-2">
                      <span v-if="quest.type === 'text'" class="text-secondary">
                        {{ ans.answer }}
                      </span>

                      <span v-else-if="quest.type === 'single_choice'" class="badge bg-primary">
                        {{ getSingleChoiceLabel(quest, ans.answer) }}
                      </span>

                      <span v-else-if="quest.type === 'multiple_choice'">
                        <span
                          v-for="(choice, i) in getMultipleChoiceLabels(quest, ans.answer)"
                          :key="i"
                          class="badge bg-info me-1"
                        >
                          {{ choice }}
                        </span>
                      </span>

                      <span v-else-if="quest.type === 'file'">
                        📎
                        <a href="#" target="_blank" class="text-decoration-none">{{
                          ans.answer
                        }}</a>
                      </span>

                      <span v-else>
                        {{ ans.answer }}
                      </span>
                    </p>

                    <input
                      type="checkbox"
                      v-model="selectedAnswers"
                      :value="{ questionId: quest.id, answer: ans }"
                      class="list-inline product-review-link mb-0"
                    />
                  </div>
                  <div
                    v-if="visibleAnswers[quest.id] < quest.answers.length"
                    class="text-center mt-2"
                  >
                    <button class="btn btn-link p-0" @click="toggleMore(quest.id)">
                      {{ visibleAnswers[quest.id] ? 'Voir moins' : 'Voir plus' }}
                    </button>
                  </div>
                </div>

                <!-- Aucun résultat -->
                <div v-else class="text-muted text-center fst-italic mt-3">
                  🚫 Aucune réponse pour l’instant
                </div>
              </div>
            </BCollapse>
          </BCard>
        </div>
      </BCol>
    </BRow>
  </div>
</template>

<script>
import { BRow, BCol, BCard, BCollapse, BBadge } from 'bootstrap-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import ApexCharts from 'vue3-apexcharts'
import StatDetail from '../dashboard/components/StatDetail.vue'
import dayjs from 'dayjs'

export default {
  props: {
    report: Object,
  },
  components: {
    BRow,
    BCol,
    BCard,
    BCollapse,
    apexchart: ApexCharts,
    StatDetail,

    BBadge,
  },
  setup(props) {
    const form = ref([])
    const questionsList = ref([])
    const openCollapse = ref({})
    const selectedAnswers = ref([])
    const isDownloading = ref(false)
    const visibleAnswers = ref({})

    const calculateAge = (birthDate) => {
      if (!birthDate) return null
      const today = dayjs()
      const dob = dayjs(birthDate)
      return today.diff(dob, 'year')
    }

    const gets = async (survey) => {
      if (!survey) return
      form.value = survey

      const allQuestions = []

      form.value.question_groups?.forEach((group) => {
        group.questions?.forEach((q) => {
          // Récupérer toutes les réponses liées à cette question
          const relatedAnswers = form.value.responses.flatMap((resp) =>
            resp.responseDetails
              .filter((d) => d.question.id === q.id)
              .map((d) => ({
                answer: d.answer,
                submittedAt: d.createdAt,
              })),
          )

          allQuestions.push({
            ...q,
            answers: relatedAnswers,
          })
        })
      })

      questionsList.value = allQuestions.sort((a, b) => a.position - b.position)
      console.log(form.value)
    }

    const toggleCollapse = (id) => {
      openCollapse.value[id] = !openCollapse.value[id]
    }

    const getSingleChoiceLabel = (quest, answer) => {
      const choice = quest.choices.find((c) => c.value === answer)
      return choice ? choice.label : answer
    }

    const getMultipleChoiceLabels = (quest, answer) => {
      const values = answer.split(',').map((a) => a.trim())
      return values.map((val) => {
        const choice = quest.choices.find((c) => c.value === val)
        return choice ? choice.label : val
      })
    }

    const getVisibleAnswers = (quest) => {
      const count = visibleAnswers.value[quest.id] || 5 // par défaut 5 réponses
      return quest.answers.slice(0, count)
    }

    const toggleMore = (quest) => {
      const current = visibleAnswers.value[quest.id] || 5
      visibleAnswers.value[quest.id] = Math.min(current + 5, quest.answers.length)
    }

    const moyenneReponses = computed(() => {
      if (questionsList.value.length === 0) return 0
      let totalResponses = 0
      questionsList.value.forEach((q) => {
        totalResponses += q.answers.length
      })
      return (totalResponses / questionsList.value.length).toFixed(2)
    })

    // 🔹 Data pour le graphique
    const chartSeries = computed(() => [
      {
        name: 'Graphique des réponses',
        data: questionsList.value.map((q) => q.answers.length),
      },
    ])

    const chartOptions = computed(() => ({
      chart: {
        id: 'responses-bar',
        toolbar: { show: true },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: { enabled: true, delay: 150 },
          dynamicAnimation: { enabled: true, speed: 350 },
        },
        dropShadow: {
          enabled: true,
          top: 3,
          left: 2,
          blur: 4,
          opacity: 0.2,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          borderRadius: 6,
        },
      },
      xaxis: {
        categories: questionsList.value.map((q) => q.title),
        labels: {
          rotate: -15,
          style: { fontSize: '13px', fontWeight: 500, colors: '#495057' },
          formatter: (val) => (val.length > 20 ? val.substring(0, 20) + '...' : val),
        },
      },
      yaxis: {
        labels: { style: { fontSize: '13px', fontWeight: 500 } },
        min: 0,
      },
      tooltip: {
        theme: 'dark',
        style: { fontSize: '14px' },
        y: {
          formatter: (val) => `${val} réponse${val > 1 ? 's' : ''}`,
        },
      },
      title: {
        text: 'Réponses par question',
        align: 'center',
        style: { fontSize: '18px', fontWeight: 'bold', color: '#0d6efd' },
      },
      colors: ['#0d6efd'],
      dataLabels: { enabled: true, style: { fontSize: '12px', colors: ['#fff'] } },
    }))

    const participants = computed(() => {
      if (!form.value.responses) return []
      return form.value.responses
        .map((resp) => resp.participantProfile)
        .filter((p) => p && p.birthDate && p.gender) // on garde seulement ceux qui ont profil complet
    })

    // 👉 Répartition par tranches d’âge
    const ageGroups = computed(() => {
      const groups = {
        '18-25': 0,
        '26-35': 0,
        '36-45': 0,
        '46-65': 0,
      }
      participants.value.forEach((p) => {
        const age = calculateAge(p.birthDate)
        if (age >= 18 && age <= 25) groups['18-25']++
        else if (age >= 26 && age <= 35) groups['26-35']++
        else if (age >= 36 && age <= 45) groups['36-45']++
        else if (age >= 46 && age <= 65) groups['46-65']++
      })
      return groups
    })

    // 👉 Répartition par genre
    const genderStats = computed(() => {
      const stats = { HOMME: 0, FEMME: 0, Autre: 0 }
      participants.value.forEach((p) => {
        if (p.gender === 'M') stats.HOMME++
        else if (p.gender === 'F') stats.HOMME++
        else stats.Autre++
      })
      return stats
    })

    // 👉 Series pour ApexCharts
    const ageChartSeries = computed(() => [
      {
        name: 'Participants',
        data: Object.values(ageGroups.value),
      },
    ])
    const ageChartOptions = {
      chart: { type: 'bar', toolbar: { show: false }, stacked: true },
      plotOptions: {
        bar: { horizontal: false, columnWidth: '45%', borderRadius: 6 },
      },
      colors: ['#198754'],
      xaxis: { categories: Object.keys(ageGroups.value) },
      yaxis: { title: { text: 'Nombre de participants' } },
      dataLabels: { enabled: true, style: { colors: ['#fff'] } },
      title: {
        text: 'Répartition par tranche d’âge',
        align: 'center',
        style: { fontWeight: 'bold' },
      },
      grid: { borderColor: '#e0e0e0', strokeDashArray: 4 },
      tooltip: { theme: 'dark' },
    }

    const genderChartSeries = computed(() => Object.values(genderStats.value))
    const genderChartOptions = {
      chart: { type: 'pie', toolbar: { show: true } },
      labels: Object.keys(genderStats.value),
      colors: ['#0d6efd', '#198754', '#ffc107'], // Couleurs harmonisées
      legend: { position: 'bottom', fontSize: '14px', markers: { width: 12, height: 12 } },
      dataLabels: {
        enabled: true,
        formatter: (val, opts) => `${opts.w.globals.labels[opts.seriesIndex]}: ${val.toFixed(0)}%`,
        style: { fontSize: '13px', fontWeight: '500', colors: ['#fff'] },
      },
      title: { text: 'Répartition par genre', align: 'center', style: { fontWeight: 'bold' } },
      tooltip: { theme: 'dark' },
    }

    const tableFields = [
      { key: 'category', label: 'Catégorie', sortable: true },
      { key: 'count', label: 'Nombre', sortable: true },
    ]

    const participantStats = computed(() => {
      const participants = form.value.survey_participants || []

      if (!participants.length) return []

      const stats = {
        totalParticipants: participants.length,
        totalResponded: 0,
        totalNotResponded: 0,
        totalNotified: 0,
        totalNotNotified: 0,
        totalNotStarted: 0,
        totalInProgress: 0,
        totalCompleted: 0,
      }

      participants.forEach((p) => {
        if (p.hasResponded) stats.totalResponded++
        else stats.totalNotResponded++

        if (p.notified) stats.totalNotified++
        else stats.totalNotNotified++

        switch (p.status) {
          case 'not_started':
            stats.totalNotStarted++
            break
          case 'in_progress':
            stats.totalInProgress++
            break
          case 'completed':
            stats.totalCompleted++
            break
        }
      })

      // Retourner sous forme d’array pour BTable
      return [
        { category: 'Total des participants', count: stats.totalParticipants, percent: '100%' },
        {
          category: 'Total répondus',
          count: stats.totalResponded,
        },
        {
          category: 'Total non répondus',
          count: stats.totalNotResponded,
        },
        {
          category: 'Total notifier',
          count: stats.totalNotified,
        },
        {
          category: 'Total non notifier',
          count: stats.totalNotNotified,
        },
        {
          category: 'Total des participants qui ont pas commencés',
          count: stats.totalNotStarted,
        },
        {
          category: 'Total des participants en progressions du sondage',
          count: stats.totalInProgress,
        },
        {
          category: 'Total des participants qui sont complétés',
          count: stats.totalCompleted,
        },
      ]
    })

    onMounted(() => {
      gets(props.report)
    })
    watch(
      () => props.report,
      (newVal) => {
        gets(newVal)
      },
      { deep: true, immediate: true },
    )
    return {
      form,
      questionsList,
      getSingleChoiceLabel,
      getMultipleChoiceLabels,
      moyenneReponses,
      toggleCollapse,
      openCollapse,
      chartSeries,
      chartOptions,

      ageGroups,
      genderStats,
      ageChartSeries,
      ageChartOptions,
      genderChartSeries,
      genderChartOptions,
      selectedAnswers,
      isDownloading,
      getVisibleAnswers,
      toggleMore,
      visibleAnswers,
      participantStats,
      tableFields,
    }
  },
}
</script>
<style lang="scss">
@keyframes gradientShift {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 0%;
  }
  100% {
    background-position: 0% 0%;
  }
}
</style>
