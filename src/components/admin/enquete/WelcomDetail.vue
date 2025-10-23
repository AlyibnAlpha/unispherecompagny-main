<template>
  <hr />
  <div class="mb-3 text-end">
    <BRow class="d-flex justify-content-between align-items-center">
      <BCol cols="auto"
        ><a href="javascript:void(0)" class="btn btn-link text-muted" @click="$router.back()">
          <i class="uil uil-arrow-left me-1"></i> Retour
        </a></BCol
      >
    </BRow>
  </div>
  <div v-if="loading" class="text-center my-5">
    <q-spinner-ball color="green" size="50px" />
  </div>
  <div
    v-else-if="Array.isArray(questionsList) && questionsList.length === 0"
    class="text-center py-5"
  >
    <i class="uil uil-folder-open text-muted" style="font-size: 3rem"></i>
    <p class="mt-3 text-muted">Aucune donnée ou réessayer</p>
  </div>
  <div v-else>
    <BRow class="align-items-stretch">
      <BCol lg="12" md="8" sm="12" order="2" class="h-100">
        <BRow>
          <BCol lg="12">
            <div id="stat-detail">
              <StatDetailWel :survey="form" />
              <!-- 🔹 Graphique ApexCharts -->
              <BCard class="mb-4">
                <div class="p-3">
                  <apexchart
                    type="bar"
                    height="350"
                    :options="chartOptions"
                    :series="chartSeries"
                  />
                </div>
              </BCard>
            </div>

            <!-- 🔹 Tableau récapitulatif -->
          </BCol>
        </BRow>
      </BCol>
      <BCol lg="12" md="4" sm="12" order="1" class="h-100 border-end d-flex flex-column p-1">
        <BRow class="mb-3">
          <BCol cols="12">
            <div class="text-center mb-4">
              <BCard
                class="shadow-lg border-0 p-1 rounded-4 position-relative overflow-hidden"
                style="transition: transform 0.3s; cursor: pointer"
                @mouseover="
                  (e) => (e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)')
                "
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
                  <div class="mb-3 text-md-start">
                    <h3 class="fw-bold mb-2" style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1)">
                      {{ truncate(form.title, 80) }}
                    </h3>
                    <p
                      class="text-muted mx-auto mx-md-0"
                      style="max-width: 650px; font-size: 0.95rem; line-height: 1.5"
                    >
                      {{ truncate(form.description, 1200) }}
                    </p>
                  </div>
                </div>
              </BCard>
            </div>
          </BCol>
          <BCol cols="12">
            <!-- 🔹 Carte du créateur du sondage BUSINESS -->

            <!-- 🔹 Carte du créateur ADMIN -->
          </BCol>
        </BRow>
      </BCol>
      <BCol lg="12" md="12" sm="12" order="2" class="h-100">
        <BRow>
          <BCol lg="6">
            <BCard class="mb-4" style="height: 400px">
              <div class="p-0">
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
            <BCard class="mb-4" style="height: 400px">
              <div class="p-2">
                <apexchart
                  type="pie"
                  height="370"
                  :options="genderChartOptions"
                  :series="genderChartSeries"
                />
              </div>
            </BCard>
          </BCol>
        </BRow>
      </BCol>
      <BCol cols="12" order="3" class="border-end d-flex flex-column p-1">
        <div id="table-recap">
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
            <div class="p-3 table-responsive">
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
                      <p class="text-muted text-wrap mb-0">{{ quest.description }}</p>
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
import { BRow, BCol, BCard, BCollapse, BTable } from 'bootstrap-vue-next'
import { computed, onMounted, ref } from 'vue'
import ApexCharts from 'vue3-apexcharts'
import StatDetailWel from '../dashboard/components/StatDetailWel.vue'
import dayjs from 'dayjs'
import { api } from 'src/boot/axios'
import { useRoute } from 'vue-router'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCollapse,
    apexchart: ApexCharts,
    StatDetailWel,
    BTable,
  },
  setup() {
    const form = ref([])
    const questionsList = ref([])
    const openCollapse = ref({})
    const selectedAnswers = ref([])
    const isDownloading = ref(false)
    const visibleAnswers = ref({})
    const loading = ref(false)
    const route = useRoute()
    const id = ref(route.params.id)
    const selectedReport = ref([])
    const reportvalid = ref(false)
    const reportvalids = ref(false)
    const reportvalidasmin = ref(false)

    const calculateAge = (birthDate) => {
      if (!birthDate) return null
      const today = dayjs()
      const dob = dayjs(birthDate)
      return today.diff(dob, 'year')
    }

    const gets = async () => {
      try {
        loading.value = true

        let response

        response = await api.get(`/admin/welcome-surveys/${id.value}`)
        form.value = response.data

        const allQuestions = []

        form.value.questionGroups?.forEach((group) => {
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
      } catch (err) {
        console.error(err)
      } finally {
        loading.value = false
      }
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
        toolbar: { show: false },
      },
      xaxis: {
        categories: questionsList.value.map((q) => q.title),
        labels: {
          style: {
            colors: ['#000000'],
            fontSize: '12px',
          },
          formatter: function (val) {
            if (val.length > 20) {
              // 👉 Limite à 20 caractères
              return val.substring(0, 20) + '...'
            }
            return val
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return `${val} réponse${val > 1 ? 's' : ''}`
          },
        },
        x: {
          formatter: function (val) {
            return val // 👉 Ici, on montre le titre complet quand on survole
          },
        },
      },
      title: {
        text: 'Réponses par question',
        align: 'center',
      },
      colors: ['#0d6efd'],
    }))

    /*const downloadReport = async () => {
      try {
        isDownloading.value = true

        // Ouvrir tous les collapses pour inclure tout le contenu
        Object.keys(openCollapse.value).forEach((id) => (openCollapse.value[id] = true))
        await nextTick()
        await new Promise((r) => setTimeout(r, 500)) // attendre rendu

        const pdf = new jsPDF('p', 'mm', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()

        // 1️⃣ Stats + graphiques
        const sections = [
          document.querySelector('#report-content'), // titre et description
          document.querySelector('#stat-detail'), // tes stats principales
          document.querySelector('#table-recap'), // graphique âge
        ]

        for (const section of sections) {
          if (!section) continue

          const canvas = await html2canvas(section, { scale: 2 })
          const img = canvas.toDataURL('image/png')
          const imgHeight = (canvas.height * pdfWidth) / canvas.width

          // Si l'image dépasse la page, ajouter une page
          if (
            pdf.internal.getCurrentPageInfo().pageNumberHeight + imgHeight >
            pdf.internal.pageSize.getHeight()
          ) {
            pdf.addPage()
          }

          pdf.addImage(img, 'PNG', 0, 0, pdfWidth, imgHeight)
          pdf.addPage()
        }

        // 2️⃣ Réponses sélectionnées
        selectedAnswers.value.forEach((sel, idx) => {
          const question = questionsList.value.find((q) => q.id === sel.questionId)

          let yPos = 20 + idx * 40
          if (yPos > pdf.internal.pageSize.getHeight() - 40) {
            pdf.addPage()
            yPos = 20
          }

          // 🔹 Titre question
          pdf.setFillColor(220, 220, 220) // fond gris clair
          pdf.setTextColor(0, 0, 0)
          pdf.setFontSize(12)
          pdf.rect(10, yPos - 5, pdf.internal.pageSize.getWidth() - 20, 10, 'F')
          pdf.text(`Q${question.position}: ${question.title}`, 12, yPos + 2)

          // 🔹 Couleur de fond selon le type de réponse
          const typeColors = {
            text: [240, 248, 255], // bleu clair
            single_choice: [198, 239, 206], // vert clair
            multiple_choice: [255, 229, 204], // orange clair
            file: [255, 235, 238], // rouge clair
          }
          const bg = typeColors[question.type] || [245, 245, 245]
          pdf.setFillColor(...bg)
          // 🔹 Réponse
          pdf.setFontSize(11)
          pdf.setTextColor(50)
          pdf.rect(10, yPos + 8, pdf.internal.pageSize.getWidth() - 20, 15, 'F') // fond réponse
          pdf.text(`Réponse: ${sel.answer.answer}`, 12, yPos + 18, {
            maxWidth: pdf.internal.pageSize.getWidth() - 24,
          })

          // 🔹 Date participant
          pdf.setFontSize(9)
          pdf.setTextColor(120)
          pdf.text(
            `Soumis le: ${new Date(sel.answer.submittedAt).toLocaleDateString('fr-FR')}`,
            12,
            yPos + 26,
          )
        })

        pdf.save('rapport-filtré.pdf')
      } catch (err) {
        console.error(err)
      } finally {
        isDownloading.value = false
      }
    }*/

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
        else if (p.gender === 'F') stats.FEMME++
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
      chart: { type: 'bar', toolbar: { show: false } },
      xaxis: {
        categories: Object.keys(ageGroups.value),
      },
      title: { text: 'Répartition par tranche d’âge' },
      colors: ['#198754'],
    }

    const genderChartSeries = computed(() => Object.values(genderStats.value))
    const genderChartOptions = {
      chart: { type: 'pie', toolbar: { show: false }, width: '100%' },
      labels: Object.keys(genderStats.value),
      legend: {
        position: 'bottom',
      },
      plotOptions: {
        pie: {
          size: 100, // agrandir ou réduire (par défaut ~150-180)
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} participant${val > 1 ? 's' : ''}`,
        },
      },
      title: { text: 'Répartition par genre' },
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
      gets()
    })
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
      loading,
      id,
      selectedReport,
      reportvalid,
      reportvalidasmin,
      reportvalids,
      tableFields,
      participantStats,
    }
  },
  methods: {
    truncate(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    },
  },
}
</script>

<style lang="scss">
.creator-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.creator-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.btn-success {
  background: linear-gradient(135deg, #34c38f, #2ea3f2);
  border: none;
  border-radius: 50px;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(46, 163, 242, 0.3);

  &:hover {
    background: linear-gradient(135deg, #2ea3f2, #34c38f);
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(46, 163, 242, 0.4);
  }

  &:active {
    transform: scale(0.96);
  }
}
.table tbody tr {
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #f9fcff;
    box-shadow: #1f6bad33 0px 4px 8px;
    transform: scale(1.01);
  }
}
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
