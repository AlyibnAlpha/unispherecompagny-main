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
        
        <div class="action-group">
          <button
            v-if="reportvalidasmin && reportvalids"
            class="btn-modern btn-success-modern"
            @click="downloadReports"
            :disabled="isDownloading"
          >
            <i v-if="!isDownloading" class="bi bi-download me-2"></i>
            <q-spinner-dots v-else color="white" size="20px" class="me-2" />
            {{ isDownloading ? 'Téléchargement...' : 'Télécharger le rapport' }}
          </button>
          
          <router-link
            v-else-if="reportvalidasmin"
            class="btn-modern btn-primary-modern"
            to="/admin/rapport"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Créer un rapport
          </router-link>

          <button
            v-if="reportvalid"
            class="btn-modern btn-success-modern"
            @click="downloadReports"
            :disabled="isDownloading"
          >
            <i v-if="!isDownloading" class="bi bi-download me-2"></i>
            <q-spinner-dots v-else color="white" size="20px" class="me-2" />
            {{ isDownloading ? 'Téléchargement...' : 'Télécharger' }}
          </button>
        </div>
      </div>

      <!-- Survey Header Card -->
      <div class="survey-header-card">
        <div class="survey-header-content">
          <div class="survey-icon">
            <i class="bi bi-clipboard-data"></i>
          </div>
          <div class="survey-info">
            <div class="title-with-badge">
              <h1 class="survey-title">{{ form.title }}</h1>
              <div
                class="badge badge-pill font-size-12 survey-status-badge"
                :class="{
                  'bg-soft-success': isSurveyActive,
                  'bg-soft-secondary': !isSurveyActive,
                }"
              >
                <i :class="isSurveyActive ? 'bi bi-play-circle' : 'bi bi-check-circle'"></i>
                {{ isSurveyActive ? 'En cours' : 'Terminé' }}
              </div>
            </div>
            <p class="survey-description">{{ form.description }}</p>
            
            <div class="survey-meta">
              <div class="meta-item">
                <i class="bi bi-calendar-check"></i>
                <span>Début: {{ formatDate(form.startDate) }}</span>
              </div>
              <div class="meta-item">
                <i class="bi bi-calendar-x"></i>
                <span>Fin: {{ formatDate(form.endDate) }}</span>
              </div>
              <div class="meta-item" v-if="form.type">
                <i class="bi bi-tag"></i>
                <span>Type: {{ form.type }}</span>
              </div>
              <div class="meta-item" v-if="form.category && form.category.name">
                <i class="bi bi-folder"></i>
                <span>Catégorie: {{ form.category.name }}</span>
              </div>
              <div
                class="badge badge-pill font-size-12"
                :class="{
                  'bg-soft-primary': form.status === 'draft',
                  'bg-soft-success': form.status === 'published',
                  'bg-soft-warning': form.status === 'archived',
                  'bg-soft-secondary': form.status === 'review',
                  'bg-soft-danger': form.status === 'closed',
                }"
              >
                {{ form.status }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Two Column Layout: Creator Left, Stats Right -->
      <div class="two-column-layout">
        <!-- Left Column: Creator Card -->
        <div v-if="form.user" class="creator-card-modern-large">
        <div class="creator-header">
          <div class="creator-header-left">
            <i class="bi bi-person-badge"></i>
            <h3>Créateur de l'enquête</h3>
          </div>
          <span class="role-badge">{{ getCreatorRole(form.user) }}</span>
        </div>
        <div class="creator-content">
          <img
            :src="getAvatarUrl(form.user)"
            alt="Avatar"
            class="creator-avatar"
          />
          <div class="creator-info">
            <h4 class="creator-name">{{ getCreatorName(form.user) }}</h4>
            <div class="creator-details">
              <div class="detail-item" v-if="form.user.email">
                <i class="bi bi-envelope"></i>
                <span>{{ form.user.email }}</span>
              </div>
              <div class="detail-item" v-if="getCreatorCompany(form.user)">
                <i class="bi bi-building"></i>
                <span>{{ getCreatorCompany(form.user) }}</span>
              </div>
              <div class="detail-item" v-if="getCreatorPhone(form.user)">
                <i class="bi bi-telephone"></i>
                <span>{{ getCreatorPhone(form.user) }}</span>
              </div>
              <div class="detail-item">
                <i class="bi bi-calendar-event"></i>
                <span>Créé le {{ formatDate(form.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

        <!-- Right Column: Stats Grid -->
        <div class="stats-grid-compact">
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

    <!-- Hidden element for PDF export -->
    <div ref="statDetail" style="position: absolute; top: 0; left: -9999px; width: 210mm; padding: 20px">
      <TeleDetail v-if="selectedReport" :report="selectedReport" />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, nextTick } from 'vue'
import ApexCharts from 'vue3-apexcharts'
import dayjs from 'dayjs'
import { api } from 'src/boot/axios'
import { useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import TeleDetail from '../../enquete/TeleDetail.vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import autoTable from 'jspdf-autotable'

export default {
  components: {
    apexchart: ApexCharts,
    TeleDetail,
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
    const auth = useAuthStore()
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
        const role = auth.roles[0]

        let response
        if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          response = await api.get(`/admin/surveys/${id.value}`)
          form.value = response.data
          const responses = await api.get('/admin/reports')
          const reportedSurveyIds = responses.data.map((r) => r.survey.id)

          const endDate = new Date(form.value.endDate)
          const now = new Date() // date courante
          if (endDate <= now) {
            if (form.value.isPublished) {
              if (reportedSurveyIds.includes(form.value.id)) {
                reportvalids.value = true
              }
              reportvalidasmin.value = true
            }
          }
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          response = await api.get(`/surveys/${id.value}`)
          form.value = response.data
          const responses = await api.get('/reports')
          const reportedSurveyIds = responses.data.map((r) => r.survey.id)

          const endDate = new Date(form.value.endDate) // date de fin du sondage
          const now = new Date() // date courante
          if (endDate <= now) {
            if (form.value.isPublished) {
              if (reportedSurveyIds.includes(form.value.id)) {
                reportvalid.value = true
              }
            }
          }
        }

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

    // 🔹 Vérifier si le sondage est en cours
    const isSurveyActive = computed(() => {
      if (!form.value.endDate) return false
      const now = new Date()
      const endDate = new Date(form.value.endDate)
      return now <= endDate
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

    const downloadReports = async () => {
      try {
        isDownloading.value = true

        // 1️⃣ Charger le rapport complet
        const role = auth.roles[0]
        let data
        if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          data = await api.get(`/admin/surveys/${id.value}`)
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          data = await api.get(`/surveys/${id.value}`)
        }

        selectedReport.value = data.data

        // 2️⃣ Ouvrir tous les collapses
        if (openCollapse.value) {
          Object.keys(openCollapse.value).forEach((id) => (openCollapse.value[id] = true))
        }

        // 3️⃣ Attendre rendu complet
        await nextTick()
        await new Promise((r) => setTimeout(r, 800))

        // 4️⃣ Initialiser le PDF
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()

        // Fonction header/footer
        const addHeaderFooter = () => {
          const page = pdf.internal.getNumberOfPages()
          pdf.setFontSize(9)
          pdf.setTextColor(120)
          pdf.text(data.data.title, 14, 10)
          pdf.text(`Page ${page}`, pdfWidth - 20, pageHeight - 10)
        }

        // 5️⃣ Page de garde
        pdf.setFillColor(41, 128, 185) // bandeau bleu
        pdf.rect(0, 0, pdfWidth, 40, 'F')
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(20)
        pdf.text(data.data.title, pdfWidth / 2, 25, { align: 'center' })

        pdf.setTextColor(80)
        pdf.setFontSize(12)

        // 6️⃣ Capturer sections (stats, graphiques...)
        const sections = [
          document.querySelector('#report-title'),
          document.querySelector('#stat-detail'),
          document.querySelector('#table-recap'),
          document.querySelector('#table-recap2'),
        ]
        for (const section of sections) {
          if (!section) continue
          const canvas = await html2canvas(section, { scale: 2, useCORS: true, logging: false })
          const imgData = canvas.toDataURL('image/png')
          const imgHeight = (canvas.height * pdfWidth) / canvas.width
          pdf.addImage(imgData, 'PNG', 0, 15, pdfWidth, imgHeight)
          addHeaderFooter()
          pdf.addPage()
        }

        // 7️⃣ Préparer toutes les questions + réponses
        const allQuestions = []
        data.data.question_groups.forEach((group) => {
          group.questions.forEach((q) => {
            const answers = data.data.responses.flatMap((resp) =>
              resp.responseDetails
                .filter((d) => d.question.id === q.id)
                .map((d) => ({
                  answer: d.answer,
                  submittedAt: resp.submittedAt,
                })),
            )
            allQuestions.push({ ...q, answers })
          })
        })

        const groupall = allQuestions.sort((a, b) => a.position - b.position)

        // 8️⃣ Boucler sur les questions
        let yPos = 30
        for (const question of groupall) {
          // Couleurs par type
          const questionColors = {
            text: [41, 128, 185], // bleu
            single_choice: [39, 174, 96], // vert
            multiple_choice: [243, 156, 18], // orange
            file: [192, 57, 43], // rouge
          }
          const qc = questionColors[question.type] || [120, 120, 120]

          // Titre question
          if (yPos > pageHeight - 40) {
            addHeaderFooter()
            pdf.addPage()
            yPos = 30
          }
          pdf.setFillColor(...qc)
          pdf.setTextColor(255, 255, 255)
          pdf.rect(10, yPos - 6, pdfWidth - 20, 12, 'F')
          pdf.setFontSize(12)
          pdf.text(`Q${question.position}: ${question.title}`, 12, yPos + 2)
          yPos += 16

          // Réponses
          if (question.answers.length === 0) {
            pdf.setFontSize(11)
            pdf.setTextColor(120)
            pdf.text(' Aucune réponse', 12, yPos)
            yPos += 12
          } else {
            for (const ans of question.answers) {
              if (yPos > pageHeight - 40) {
                addHeaderFooter()
                pdf.addPage()
                yPos = 30
              }

              // Encadré réponse
              pdf.setDrawColor(200)
              pdf.roundedRect(10, yPos, pdfWidth - 20, 20, 3, 3, 'S')
              pdf.setFontSize(11)
              pdf.setTextColor(50)

              // Texte selon type
              let answerText = ''
              if (question.type === 'single_choice') {
                answerText = getSingleChoiceLabel(question, ans.answer)
              } else if (question.type === 'multiple_choice') {
                answerText = getMultipleChoiceLabels(question, ans.answer).join(', ')
              } else {
                answerText = ans.answer
              }

              // Afficher réponse
              pdf.text(`Reponses: ${answerText}`, 14, yPos + 8, { maxWidth: pdfWidth - 30 })

              // Date à droite
              pdf.setFontSize(9)
              pdf.setTextColor(120)
              pdf.text(
                ` ${new Date(ans.submittedAt).toLocaleDateString('fr-FR')}`,
                pdfWidth - 60,
                yPos + 8,
              )

              yPos += 25
            }
          }
          pdf.setDrawColor(200)
          pdf.setLineWidth(0.3)
          pdf.line(10, yPos, pdfWidth - 10, yPos)
          yPos += 10
        }

        // 9️⃣ Tableau récapitulatif final
        addHeaderFooter()
        pdf.addPage()
        autoTable(pdf, {
          head: [['Type de question', 'Nombre de réponses']],
          body: [
            ['Texte', groupall.filter((q) => q.type === 'text').length],
            ['Choix unique', groupall.filter((q) => q.type === 'single_choice').length],
            ['Choix multiple', groupall.filter((q) => q.type === 'multiple_choice').length],
            ['Fichier', groupall.filter((q) => q.type === 'file').length],
          ],
          startY: 40,
          styles: { halign: 'center' },
          headStyles: { fillColor: [41, 128, 185] },
        })

        // 🔟 Sauvegarder le PDF
        pdf.save(`rapport_${data.data.title}.pdf`)
      } catch (err) {
        console.error('Erreur export PDF :', err)
      } finally {
        isDownloading.value = false
      }
    }

    // Helper functions
    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    }

    const getAvatarUrl = (user) => {
      const name = getCreatorName(user)
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    }

    const getCreatorName = (user) => {
      if (user.businessAccount) {
        return `${user.businessAccount.firstName} ${user.businessAccount.lastName}`
      } else if (user.admin) {
        return `${user.admin.firstName} ${user.admin.lastName}`
      }
      return 'Utilisateur'
    }

    const getCreatorCompany = (user) => {
      return user.businessAccount?.companyName || null
    }

    const getCreatorPhone = (user) => {
      return user.businessAccount?.phone || user.admin?.phone || null
    }

    const getCreatorRole = (user) => {
      if (user.businessAccount) {
        return 'Business'
      } else if (user.admin) {
        return 'Admin'
      }
      return 'User'
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
      isSurveyActive,
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
      downloadReports,
      selectedReport,
      reportvalid,
      reportvalidasmin,
      reportvalids,
      tableFields,
      participantStats,
      formatDate,
      getAvatarUrl,
      getCreatorName,
      getCreatorCompany,
      getCreatorPhone,
      getCreatorRole,
      getTypeLabel,
    }
  },
}
</script>

<style lang="scss">
@import '../../../../css/ultra-modern-detail.scss';
@import '../../../../css/admin/badges.scss';
</style>
