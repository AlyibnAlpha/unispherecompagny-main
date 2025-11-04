<template>
  <div class="modern-admin-page">
    <!-- Bouton retour flottant -->
    <router-link class="btn-back-floating" to="/admin/rapport">
      <i class="bi bi-arrow-left"></i>
    </router-link>

    <!-- Carte d'en-tête séparée -->
    <div class="header-card mb-4">
      <div class="section-header-modern">
        <div class="section-title-wrapper">
          <div class="section-icon-modern">
            <i class="bi bi-file-earmark-plus"></i>
          </div>
          <div class="section-title-content">
            <h3 class="section-title-modern">Créer un Rapport</h3>
            <p class="section-subtitle-modern">Générez un rapport détaillé pour votre sondage</p>
          </div>
        </div>
        <button class="btn-create-report" @click="Add">
          <i class="bi bi-check-circle-fill me-2"></i>
          Créer le rapport
        </button>
      </div>
    </div>

    <!-- Section sélection du sondage -->
    <div class="selection-card mb-4">
      <div class="selection-card-header">
        <i class="bi bi-ui-checks me-2"></i>
        <h5 class="selection-card-title">Sélectionnez un sondage</h5>
      </div>
      <div class="selection-card-body">
        <div v-if="isLoadingSurveys" class="text-center py-3">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
          <p class="text-muted mt-2 mb-0">Chargement des sondages...</p>
        </div>
        <Multiselect
          v-else
          v-model="rapport"
          :key="optionl2.length"
          placeholder="Rechercher et sélectionner un sondage..."
          :searchable="true"
          :close-on-select="true"
          :clear-on-select="false"
          :options="optionl2"
          :loading="isLoadingSurveys"
          class="multiselect-modern"
        />
      </div>
    </div>

    <!-- Section contenu du rapport -->
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
          
          <!-- Graphique principal -->
          <div class="modern-chart-card mb-4">
            <div class="chart-card-header">
              <i class="bi bi-bar-chart-fill me-2"></i>
              <h5 class="chart-card-title">Statistiques globales</h5>
            </div>
            <div class="chart-card-body">
              <apexchart type="bar" height="350" :options="chartOptions" :series="chartSeries" />
            </div>
          </div>

          <!-- Graphiques secondaires -->
          <BRow>
            <BCol lg="6">
              <div class="modern-chart-card mb-4">
                <div class="chart-card-header">
                  <i class="bi bi-people-fill me-2"></i>
                  <h5 class="chart-card-title">Répartition par âge</h5>
                </div>
                <div class="chart-card-body">
                  <apexchart
                    type="bar"
                    height="330"
                    :options="ageChartOptions"
                    :series="ageChartSeries"
                  />
                </div>
              </div>
            </BCol>
            <BCol lg="6">
              <div class="modern-chart-card mb-4">
                <div class="chart-card-header">
                  <i class="bi bi-gender-ambiguous me-2"></i>
                  <h5 class="chart-card-title">Répartition par genre</h5>
                </div>
                <div class="chart-card-body">
                  <apexchart
                    type="pie"
                    height="390"
                    :options="genderChartOptions"
                    :series="genderChartSeries"
                  />
                </div>
              </div>
            </BCol>
          </BRow>
        </div>

        <!-- Tableau récapitulatif moderne -->
        <div class="modern-table-card mb-4" id="table-recap">
          <div class="table-card-header">
            <i class="bi bi-table me-2"></i>
            <h5 class="table-card-title">Résumé des réponses</h5>
          </div>
          <div class="table-card-body">
            <div class="table-responsive">
              <table class="modern-table">
                <thead>
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
                      <span class="table-badge table-badge-number">{{ quest.position }}</span>
                    </td>
                    <td class="text-start">{{ quest.title }}</td>
                    <td>
                      <span class="table-badge table-badge-info">{{ quest.type }}</span>
                    </td>
                    <td>
                      <span class="table-badge table-badge-primary">{{ quest.answers.length }}</span>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="table-footer-row">
                    <td colspan="3" class="text-end fw-bold">Moyenne par question</td>
                    <td>
                      <span class="table-badge table-badge-success">{{ moyenneReponses }}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
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
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import ApexCharts from 'vue3-apexcharts'
import StatDetail from '../dashboard/components/StatDetail.vue'
import dayjs from 'dayjs'
import { api } from 'src/boot/axios'
import { useRouter } from 'vue-router'
import Multiselect from '@vueform/multiselect'
import Swal from 'sweetalert2'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCollapse,
    apexchart: ApexCharts,
    StatDetail,
    BBadge,
    Multiselect,
  },
  setup() {
    const rapport = ref(0)
    const form = ref([])
    const questionsList = ref([])
    const openCollapse = ref({})
    const selectedAnswers = ref([])
    const optionl2 = ref([])
    const isDownloading = ref(false)
    const isLoadingSurveys = ref(true)
    const visibleAnswers = ref({})
    const router = useRouter()

    const calculateAge = (birthDate) => {
      if (!birthDate) return null
      const today = dayjs()
      const dob = dayjs(birthDate)
      return today.diff(dob, 'year')
    }
    const getsurveys = async () => {
      try {
        isLoadingSurveys.value = true
        optionl2.value = []
        const response = await api.get(`/admin/surveys`)
        const resp = await api.get('/admin/reports')
        const reportedSurveyIds = resp.data.map((r) => r.survey.id)

        response.data.map((group) => {
          const endDate = new Date(group.endDate) // date de fin du sondage
          const now = new Date() // date courante
          if (endDate <= now) {
            if (group.isPublished) {
              if (!reportedSurveyIds.includes(group.id)) {
                optionl2.value.push({
                  value: group.id,
                  label: group.title,
                })
              }
            }
          }
        })
        
        // Attendre que le DOM soit mis à jour
        await nextTick()
        // Petit délai supplémentaire pour s'assurer que le Multiselect est prêt
        await new Promise(resolve => setTimeout(resolve, 100))
      } finally {
        isLoadingSurveys.value = false
      }
    }
    const gets = async () => {
      const response = await api.get(`/admin/surveys/${rapport.value}`)

      form.value = response.data

      const allQuestions = []

      form.value.question_groups?.forEach((group) => {
        group.questions?.forEach((q) => {
          // Récupérer toutes les réponses liées à cette question
          const relatedAnswers = form.value.responses.flatMap((resp) =>
            resp.responseDetails
              .filter((d) => d.question.id === q.id)
              .map((d) => ({
                ids: d.id,
                numeroquestion: d.question.id,

                answer: d.answer,
                submittedAt: d.createdAtAnswer || d.created_at_answer || resp.submittedAt,
                respondent:
                  resp.user?.businessAccount?.companyName || resp.user?.email || 'Anonyme',
              })),
          )

          allQuestions.push({
            ...q,
            answers: relatedAnswers,
          })
        })
      })

      questionsList.value = allQuestions.sort((a, b) => a.position - b.position)
    }

    const Add = async () => {
      if (!rapport.value) {
        Swal.fire({
          icon: 'warning',
          title: 'Veuillez sélectionner un sondage',
          timer: 2000,
          showConfirmButton: false,
        })
        return
      }

      try {
        const totalResponses = questionsList.value.reduce((acc, q) => acc + q.answers.length, 0)
        const totalParticipants = Math.max(...questionsList.value.map((q) => q.answers.length))
        const payload = {
          survey_id: rapport.value,
          totalResponses: totalResponses,
          totalParticipants: totalParticipants,
          participationRate: moyenneReponses.value,
          repartitionAge: ageGroups.value,
          repartitionGenre: genderStats.value,
          questionStatistics: questionsList.value.map((q) => ({
            id: q.id,
            title: q.title,

            totalReponses: q.answers.length,
          })),
          responseDistribution: questionsList.value.map((q) => q.answers),
        }

        console.log(payload)
        await api.post('/admin/reports/reports', payload)

        Swal.fire({
          icon: 'success',
          title: 'Enregistre avec success',
          showConfirmButton: true,
          timer: 2000,
        }).then(() => {
          router.push('/admin/rapport')
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la création du rapport',
          text: error.response?.data?.message || 'Veuillez réessayer',
          showConfirmButton: true,
        })
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
        toolbar: { show: true },
      },
      xaxis: {
        categories: questionsList.value.map((q) => q.title),
        labels: {
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

    const participants = computed(() => {
      if (!form.value.responses) return []
      return form.value.responses
        .map((resp) => resp.user?.participantProfile)
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
      chart: { type: 'bar' },
      xaxis: {
        categories: Object.keys(ageGroups.value),
      },
      title: { text: 'Répartition par tranche d’âge' },
      colors: ['#198754'],
    }

    const genderChartSeries = computed(() => Object.values(genderStats.value))
    const genderChartOptions = {
      chart: { type: 'pie', toolbar: { show: true } },
      labels: Object.keys(genderStats.value),
      title: { text: 'Répartition par genre' },
    }
    watch(rapport, gets)
    onMounted(() => {
      getsurveys()
    })
    return {
      rapport,
      gets,
      form,
      questionsList,
      getSingleChoiceLabel,
      getMultipleChoiceLabels,
      moyenneReponses,
      toggleCollapse,
      openCollapse,
      chartSeries,
      chartOptions,
      Add,
      ageGroups,
      genderStats,
      ageChartSeries,
      ageChartOptions,
      genderChartSeries,
      genderChartOptions,
      selectedAnswers,
      isDownloading,
      isLoadingSurveys,
      getVisibleAnswers,
      toggleMore,
      visibleAnswers,
      getsurveys,
      optionl2,
    }
  },
}
</script>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';

/* === Page moderne === */
.modern-admin-page {
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* === Carte d'en-tête === */
.header-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 2px solid #f1f5f9;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
}

/* === En-tête de section moderne === */
.section-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  .section-title-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;

    .section-icon-modern {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.8rem;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .section-title-content {
      .section-title-modern {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .section-subtitle-modern {
        font-size: 0.95rem;
        color: #64748b;
        margin: 0;
        font-weight: 500;
      }
    }
  }

  .header-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
}

/* === Bouton Retour Flottant === */
.btn-back-floating {
  position: fixed;
  top: 100px;
  left: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 1000;
  text-decoration: none;

  &:hover {
    background: #667eea;
    border-color: #667eea;
    color: white;
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
  }

  i {
    font-size: 1.3rem;
  }
}

/* === Bouton Créer Rapport === */
.btn-create-report {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #764ba2, #667eea);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  i {
    font-size: 1.2rem;
  }
}

/* === Carte de sélection === */
.selection-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 2px solid #f1f5f9;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
}

.selection-card-header {
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  padding: 1.25rem 1.5rem;
  border-bottom: 2px solid #f1f5f9;
  display: flex;
  align-items: center;

  i {
    color: #667eea;
    font-size: 1.3rem;
  }

  .selection-card-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
}

.selection-card-body {
  padding: 1.5rem;
}

/* === Multiselect moderne === */
.multiselect-modern {
  --ms-border-color: #e2e8f0;
  --ms-border-width: 2px;
  --ms-radius: 12px;
  --ms-py: 0.75rem;
  --ms-px: 1rem;
  --ms-ring-width: 3px;
  --ms-ring-color: rgba(102, 126, 234, 0.1);
  --ms-option-bg-selected: #667eea;
  --ms-option-bg-selected-pointed: #764ba2;
}

/* === Cartes de graphiques modernes === */
.modern-chart-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 2px solid #f1f5f9;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
}

.chart-card-header {
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  padding: 1.25rem 1.5rem;
  border-bottom: 2px solid #f1f5f9;
  display: flex;
  align-items: center;

  i {
    color: #667eea;
    font-size: 1.3rem;
  }

  .chart-card-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
}

.chart-card-body {
  padding: 1.5rem;
}

/* === Carte de tableau moderne === */
.modern-table-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 2px solid #f1f5f9;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
}

.table-card-header {
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  padding: 1.25rem 1.5rem;
  border-bottom: 2px solid #f1f5f9;
  display: flex;
  align-items: center;

  i {
    color: #667eea;
    font-size: 1.3rem;
  }

  .table-card-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
}

.table-card-body {
  padding: 1.5rem;
}

/* === Tableau moderne === */
.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  thead {
    tr {
      background: linear-gradient(135deg, #667eea, #764ba2);

      th {
        padding: 1rem;
        text-align: center;
        font-weight: 700;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: white;
        border: none;

        &:first-child {
          border-top-left-radius: 12px;
        }

        &:last-child {
          border-top-right-radius: 12px;
        }
      }
    }
  }

  tbody {
    tr {
      transition: all 0.2s ease;

      &:hover {
        background: #f8fafc;
      }

      td {
        padding: 1rem;
        text-align: center;
        border-bottom: 1px solid #f1f5f9;
        color: #475569;
      }
    }
  }

  tfoot {
    .table-footer-row {
      background: linear-gradient(135deg, #d1fae5, #a7f3d0);

      td {
        padding: 1rem;
        border: none;
        color: #065f46;
      }
    }
  }
}

.table-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;

  &.table-badge-number {
    background: #f1f5f9;
    color: #475569;
  }

  &.table-badge-info {
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    color: #1e40af;
    border: 1px solid #93c5fd;
  }

  &.table-badge-primary {
    background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
    color: #4338ca;
    border: 1px solid #a5b4fc;
  }

  &.table-badge-success {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #065f46;
    border: 1px solid #6ee7b7;
  }
}

.progress-nav {
  position: relative;
  display: flex;
  align-items: center;
}

.progress {
  width: 100%;
  position: absolute;
  height: 4px;
}

.wizard-steps {
  position: relative;
  z-index: 3;
  width: 100%;

  .wizard-step {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    border: 3px solid;
    display: flex;
    justify-content: center;
    z-index: 9;
    position: relative;
    background: white;
  }
}

.step-arrow-nav {
  .nav-link {
    background: #f3f2ee;
    padding: 4px 0;
    border-radius: 0 !important;
  }
}

.wizard {
  .nav-link:not(.active) {
    color: #f3f2ee;

    .wizard-icon {
      color: #a5a5a5;
    }
  }
}

[data-bs-theme='dark'] {
  .wizard-steps .wizard-step:not(.active) {
    background: var(--bs-input-bg);
  }

  .step-arrow-nav {
    .nav-link:not(.active) {
      background: var(--bs-input-bg);
    }
  }
}
/* === Boutons modernes === */
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

/* === Table améliorée === */
.table tbody tr {
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #f9fcff;
    transform: scale(1.01);
  }
}

/* Icônes d'action */
.list-inline-item a {
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2) rotate(-5deg);
    opacity: 0.8;
  }
}

/* === Dialogues avec animation === */
.q-dialog__inner {
  animation: fadeScale 0.35s ease forwards;
}

@keyframes fadeScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* === Inputs flottants modernes === */
.form-control {
  border-radius: 12px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2ea3f2;
    box-shadow: 0 0 8px rgba(46, 163, 242, 0.4);
    transform: scale(1.01);
  }
}

.bg-gradient {
  background: linear-gradient(135deg, #0d6efd, #6610f2);
}

/* === Champs modernes avec floating label === */
.floating-label {
  position: relative;
}

.form-control-modern {
  border-radius: 12px;
  border: 2px solid #e0e7ff;
  padding: 0.9rem 1rem;
  width: 100%;
  transition: all 0.3s ease;
  background: #fff;
}

.form-control-modern:focus {
  border-color: #10d0f2;
  box-shadow: 0 0 8px rgba(102, 16, 242, 0.25);
  transform: scale(1.01);
}

/* Labels flottants */
.floating-label label {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1rem;
  transition: all 0.3s ease;
  pointer-events: none;
  background: white;
  padding: 0 5px;
}

.form-control-modern:focus + label,
.form-control-modern:not(:placeholder-shown) + label {
  top: -10px;
  left: 10px;
  font-size: 0.8rem;
  color: #10d0f2;
}

/* Multiselect alignement */
.multiselect {
  border-radius: 12px !important;
  border: 2px solid #e0e7ff !important;
  padding: 6px 10px;
  transition: all 0.3s ease;
}
.multiselect:focus-within {
  border-color: #10d0f2 !important;
  box-shadow: 0 0 8px rgba(102, 16, 242, 0.25);
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
