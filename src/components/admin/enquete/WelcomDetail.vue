<template>
  <div class="modern-detail-wrapper">
    <!-- Loading State -->
    <q-inner-loading v-if="loading" :showing="loading" background-color="rgba(0,0,0,0.1)">
      <q-spinner-ball color="primary" size="60px" />
      <p class="loading-text">Chargement des détails...</p>
    </q-inner-loading>

    <!-- Empty State -->
    <div v-else-if="!form || !form.id" class="empty-state-modern">
      <i class="bi bi-inbox empty-icon"></i>
      <h3>Aucune donnée disponible</h3>
      <p>Impossible de charger les détails de l'enquête</p>
      <button class="btn-modern btn-primary-modern" @click="$router.back()">
        <i class="bi bi-arrow-left me-2"></i>
        Retour
      </button>
    </div>

    <!-- Content -->
    <div v-else class="modern-detail-content">
      <!-- Header Actions -->
      <div class="header-actions">
        <button class="btn-icon btn-back" @click="$router.back()" title="Retour">
          <i class="bi bi-arrow-left"></i>
        </button>
      </div>

      <!-- Survey Header Card -->
      <div class="survey-header-card">
        <div class="survey-header-content">
          <div class="survey-icon">
            <i class="bi bi-clipboard-check"></i>
          </div>
          <div class="survey-info">
            <h1 class="survey-title">{{ form.title }}</h1>
            <p class="survey-description">{{ form.description }}</p>
            
            <div class="survey-meta">
              <div class="meta-item">
                <i class="bi bi-star-fill"></i>
                <span>Enquête de Bienvenue</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon-primary">
            <i class="bi bi-people-fill"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ form.survey_participants?.length || 0 }}</h3>
            <p class="stat-label">Participants</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-success">
            <i class="bi bi-check-circle-fill"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ form.responses?.length || 0 }}</h3>
            <p class="stat-label">Réponses</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-warning">
            <i class="bi bi-question-circle-fill"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ questionsList.length }}</h3>
            <p class="stat-label">Questions</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-info">
            <i class="bi bi-graph-up"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ moyenneReponses }}</h3>
            <p class="stat-label">Moyenne/Question</p>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <h2 class="section-title">
          <i class="bi bi-bar-chart-fill me-2"></i>
          Statistiques et Analyses
        </h2>

        <!-- Main Chart -->
        <div class="chart-card">
          <h3 class="chart-title">Réponses par question</h3>
          <apexchart
            v-if="chartSeries[0].data.length > 0"
            type="bar"
            height="350"
            :options="chartOptions"
            :series="chartSeries"
          />
          <div v-else class="chart-empty">
            <i class="bi bi-graph-down"></i>
            <p>Aucune donnée à afficher</p>
          </div>
        </div>

        <!-- Demographics Charts -->
        <div class="demographics-grid">
          <div class="chart-card">
            <h3 class="chart-title">Répartition par âge</h3>
            <apexchart
              v-if="ageChartSeries[0].data.length > 0"
              type="bar"
              height="300"
              :options="ageChartOptions"
              :series="ageChartSeries"
            />
            <div v-else class="chart-empty">
              <i class="bi bi-person-x"></i>
              <p>Aucune donnée démographique</p>
            </div>
          </div>

          <div class="chart-card">
            <h3 class="chart-title">Répartition par genre</h3>
            <apexchart
              v-if="genderChartSeries.length > 0"
              type="pie"
              height="300"
              :options="genderChartOptions"
              :series="genderChartSeries"
            />
            <div v-else class="chart-empty">
              <i class="bi bi-gender-ambiguous"></i>
              <p>Aucune donnée de genre</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Questions & Answers -->
      <div class="questions-section">
        <h2 class="section-title">
          <i class="bi bi-chat-left-text-fill me-2"></i>
          Questions et Réponses ({{ questionsList.length }})
        </h2>

        <div class="questions-list">
          <div
            v-for="quest in questionsList"
            :key="quest.id"
            class="question-card"
            :class="{ 'question-open': openCollapse[quest.id] }"
          >
            <div class="question-header" @click="toggleCollapse(quest.id)">
              <div class="question-header-left">
                <div class="question-number">{{ quest.position }}</div>
                <div class="question-info">
                  <h4 class="question-title">{{ quest.title }}</h4>
                  <p class="question-description" v-if="quest.description">
                    {{ quest.description }}
                  </p>
                  <div class="question-meta">
                    <span class="question-type" :class="`type-${quest.type}`">
                      {{ getTypeLabel(quest.type) }}
                    </span>
                    <span class="question-count">
                      <i class="bi bi-chat-dots"></i>
                      {{ quest.answers.length }} réponse{{ quest.answers.length > 1 ? 's' : '' }}
                    </span>
                  </div>
                </div>
              </div>
              <button class="collapse-btn">
                <i :class="openCollapse[quest.id] ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
              </button>
            </div>

            <transition name="collapse">
              <div v-if="openCollapse[quest.id]" class="question-answers">
                <div v-if="quest.answers.length > 0" class="answers-list">
                  <div
                    v-for="(ans, idx) in getVisibleAnswers(quest)"
                    :key="idx"
                    class="answer-card"
                  >
                    <div class="answer-header">
                      <div class="answer-participant">
                        <div class="participant-avatar">
                          <i class="bi bi-person-fill"></i>
                        </div>
                        <span>Participant #{{ idx + 1 }}</span>
                      </div>
                      <span class="answer-date">
                        <i class="bi bi-clock"></i>
                        {{ formatDate(ans.submittedAt) }}
                      </span>
                    </div>

                    <div class="answer-content">
                      <span v-if="quest.type === 'text'">{{ ans.answer }}</span>
                      
                      <span v-else-if="quest.type === 'single_choice'" class="badge badge-primary">
                        {{ getSingleChoiceLabel(quest, ans.answer) }}
                      </span>
                      
                      <div v-else-if="quest.type === 'multiple_choice'" class="badges-group">
                        <span
                          v-for="(choice, i) in getMultipleChoiceLabels(quest, ans.answer)"
                          :key="i"
                          class="badge badge-info"
                        >
                          {{ choice }}
                        </span>
                      </div>
                      
                      <a v-else-if="quest.type === 'file'" href="#" class="file-link">
                        <i class="bi bi-file-earmark"></i>
                        {{ ans.answer }}
                      </a>
                      
                      <span v-else>{{ ans.answer }}</span>
                    </div>
                  </div>

                  <button
                    v-if="visibleAnswers[quest.id] < quest.answers.length"
                    class="btn-load-more"
                    @click="toggleMore(quest.id)"
                  >
                    Voir plus de réponses
                    <i class="bi bi-chevron-down ms-2"></i>
                  </button>
                </div>

                <div v-else class="no-answers">
                  <i class="bi bi-inbox"></i>
                  <p>Aucune réponse pour cette question</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import ApexCharts from 'vue3-apexcharts'
import dayjs from 'dayjs'
import { api } from 'src/boot/axios'
import { useRoute } from 'vue-router'

export default {
  components: {
    apexchart: ApexCharts,
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

    // Helper functions
    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    }

    const getTypeLabel = (type) => {
      const types = {
        text: 'Texte libre',
        single_choice: 'Choix unique',
        multiple_choice: 'Choix multiple',
        file: 'Fichier',
      }
      return types[type] || type
    }

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
      formatDate,
      getTypeLabel,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../../css/ultra-modern-detail.scss';
</style>
