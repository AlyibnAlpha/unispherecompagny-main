<script>
import {
  BCol,
  BRow,
  BPagination,
  BTabs,
  BFormInput,
  BTab,
} from 'bootstrap-vue-next'
import StatPart from '../dashboard/components/StatPart.vue'

import { onMounted, ref } from 'vue'
import { api } from 'src/boot/axios.js'
import { Notify } from 'quasar'
/**
 * Products component
 */
export default {
  data() {
    const courses = ref([])
    const loading = ref(false)
    function getWeekNumber(startDate) {
      const start = new Date(startDate)
      const now = new Date()

      // Calculer la différence en millisecondes
      const diffMs = now - start

      // Convertir en semaines
      const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000))

      return diffWeeks
    }
    const gets = async () => {
      try {
        loading.value = true
        api.get('/users/me').then((response) => {
          if (
            response.data.participantProfile?.firstName == '' ||
            response.data.participantProfile?.lastName == '' ||
            response.data.participantProfile?.phone == '' ||
            response.data.participantProfile?.country == '' ||
            response.data.participantProfile?.professionType == '' ||
            response.data.participantProfile?.professionSector == ''
          ) {
            Notify.create({
              type: 'warning',
              message: 'Veillez compléter votre profil avant de participer à une enquête.',
              position: 'top-right',
              timeout: 0, // 🔥 notification persistante
              icon: 'warning', // 🔔 icône d'avertissement
              actions: [
                {
                  label: 'Fermer',
                  color: 'white',
                  handler: () => {
                    /* rien, juste fermer */
                  },
                },
              ],
            })
          }
        })
        const response = await api.get('/participants/dashboard/overview')
        const available = (response.data.surveys_available || []).map((s) => ({
          ...s,
          category: 'surveys_available',
        }))
        const inProgress = (response.data.surveys_in_progress || []).map((s) => ({
          ...s,
          category: 'surveys_in_progress',
        }))
        const completed = (response.data.surveys_completed || []).map((s) => ({
          ...s,
          category: 'surveys_completed',
        }))
        const welcom = (response.data.welcome_surveys || []).map((s) => ({
          ...s,
          category: 'welcome_surveys',
        }))
        const allSurveys = [...available, ...inProgress, ...completed, ...welcom]

        allSurveys.forEach((item) => {
          const totalQuestions = item.question_groups?.reduce((sum, group) => {
            return sum + (group.questions?.length || 0)
          }, 0)
          const totaleReponse = item.responses?.reduce((sum, group) => {
            return sum + (group.responseDetails?.length || 0)
          }, 0)

          courses.value.push({
            id: item.survey_participants[0].accessToken,
            title: item.title,
            status: item.status,
            category: item.category,
            question_groups: totalQuestions,
            survey_participants: totaleReponse,
            description: item.description,
            startDate: getWeekNumber(item.startDate),
          })
        })
        console.log(courses.value)
      } catch (error) {
        console.error(error)
        Notify.create({
          type: 'negative',
          message: 'une erreur est survenue lors du chargement.Veillez réssayer',
        })
      } finally {
        loading.value = false
      }
    }
    onMounted(() => {
      gets()
    })
    return {
      loading,
      courses,
      searchQuery: '',
      currentPageNew: 1,
      currentPage: 1,
      totalRows: 1,
      perPage: 6,
      selectedCategories: ref([]),
      colors: [
        { title: 'Enquêtes disponibles', value: 'surveys_available' },
        { title: 'Enquêtes en Bonus', value: 'welcome_surveys' },
      ],
    }
  },
  components: {
    BRow,
    BCol,
    BPagination,
    BTabs,
    BTab,
    BFormInput,
    StatPart,
  },
  computed: {
    filteredCourses() {
      const query = this.searchQuery.toLowerCase()
      return this.courses.filter((item) => {
        const matchesQuery =
          item.title.toLowerCase().includes(query) ||
          String(item.startDate).toLowerCase().includes(query)

        const matchesCategory =
          this.selectedCategories.length === 0 || // si aucun filtre, tout passe
          this.selectedCategories.includes(item.category) // item.category doit exister

        const notCompleted = item.category !== 'surveys_completed'

        return matchesQuery && matchesCategory && notCompleted
      })
    },
    recentCourses() {
      return this.filteredCourses.filter((item) => item?.startDate <= 2)
    },
    paginatedNew() {
      const start = (this.currentPageNew - 1) * this.perPage
      const end = start + this.perPage
      return this.recentCourses.slice(start, end)
    },
    paginatedCourses() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredCourses.slice(start, end)
    },
  },
  watch: {
    selectedCategories() {
      this.currentPage = 1
    },
    searchQuery() {
      this.currentPage = 1
    },
  },
}
</script>

<template>
  <div class="modern-participant-page">
    <!-- Stats Section -->
    <StatPart />

    <BRow class="mt-4">
      <BCol cols="12">
        <div class="surveys-content-modern">
          <!-- Top Bar: Search + Filters -->
          <div class="top-bar-modern">
            <div class="search-bar-inline">
              <div class="search-icon">
                <i class="bi bi-search"></i>
              </div>
              <BFormInput
                type="text"
                v-model="searchQuery"
                @input="currentPage = 1"
                class="search-input-inline"
                placeholder="Rechercher une enquête..."
              />
            </div>

            <div class="filters-inline">
              <div class="filter-label-inline">
                <i class="bi bi-funnel me-2"></i>
                Filtrer:
              </div>
              <div class="filter-chips">
                <label
                  v-for="(color, index) in colors"
                  :key="index"
                  class="filter-chip"
                  :class="{ active: selectedCategories.includes(color.value) }"
                >
                  <input
                    type="checkbox"
                    :value="color.value"
                    v-model="selectedCategories"
                    class="filter-chip-input"
                  />
                  <span class="filter-chip-text">{{ color.title }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Modern Tabs -->
          <div class="tabs-modern-wrapper">
            <BTabs nav-class="tabs-modern">
              <BTab active>
                <template v-slot:title>
                  <div class="tab-modern-title">
                    <i class="bi bi-stars me-2"></i>
                    <span>Nouveautés</span>
                  </div>
                </template>
                  <BRow>
                    <div v-if="loading" class="text-center my-5">
                      <q-spinner-ball color="green" size="50px" />
                    </div>
                    <div
                      v-else-if="Array.isArray(paginatedNew) && paginatedNew.length === 0"
                      class="text-center py-5"
                    >
                      <i class="uil uil-folder-open text-muted" style="font-size: 3rem"></i>
                      <p class="mt-3 text-muted">Aucune enquête trouvée</p>
                    </div>
                    <BCol
                      v-else
                      sm="6"
                      lg="3"
                      v-for="item in paginatedNew"
                      :key="item.id"
                      class="mb-4"
                    >
                      <a :href="'/participant/enquetes-avis/' + item.id" class="survey-card-link">
                        <div class="survey-card">
                          <div class="survey-image-modern">
                            <div class="survey-badge">
                              <i class="bi bi-clock"></i>
                              {{ item.startDate }} semaine{{ item.startDate > 1 ? 's' : '' }}
                            </div>
                            <div class="survey-icon-large">
                              <i class="bi bi-clipboard-data"></i>
                            </div>
                          </div>

                          <div class="survey-content">
                            <h5 class="survey-title">
                              <a :href="'/participant/enquetes-avis/' + item.id">
                                {{ item.title }}
                              </a>
                            </h5>
                            <p class="survey-description">
                              {{ item.description || 'Aucune description disponible.' }}
                            </p>

                            <div class="survey-stats-modern">
                              <div class="stat-item">
                                <i class="bi bi-question-circle-fill stat-icon"></i>
                                <div class="stat-content">
                                  <div class="stat-number">{{ item.question_groups }}</div>
                                  <div class="stat-label">Questions</div>
                                </div>
                              </div>
                              <div class="stat-item">
                                <i class="bi bi-check-circle-fill stat-icon"></i>
                                <div class="stat-content">
                                  <div class="stat-number">{{ item.survey_participants }}</div>
                                  <div class="stat-label">Réponses</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </BCol>
                  </BRow>
              </BTab>
              <BTab>
                <template v-slot:title>
                  <div class="tab-modern-title">
                    <i class="bi bi-hourglass-split me-2"></i>
                    <span>En cours</span>
                  </div>
                </template>
                  <BRow>
                    <div v-if="loading" class="text-center my-5">
                      <q-spinner-ball color="green" size="50px" />
                    </div>
                    <div
                      v-else-if="Array.isArray(paginatedCourses) && paginatedCourses.length === 0"
                      class="text-center py-5"
                    >
                      <i class="uil uil-folder-open text-muted" style="font-size: 3rem"></i>
                      <p class="mt-3 text-muted">Aucune enquête trouvée</p>
                    </div>
                    <BCol
                      v-else
                      sm="6"
                      lg="3"
                      v-for="item in paginatedCourses"
                      :key="item.id"
                      class="mb-4"
                    >
                      <a :href="'/participant/enquetes-avis/' + item.id" class="survey-card-link">
                        <div class="survey-card">
                          <div class="survey-image-modern">
                            <div class="survey-header-top">
                              <div class="survey-badge">
                                <i class="bi bi-clock"></i>
                                {{ item.startDate }} semaine{{ item.startDate > 1 ? 's' : '' }}
                              </div>
                            </div>
                            <div class="survey-icon-large">
                              <i class="bi bi-clipboard-data"></i>
                            </div>
                          </div>

                          <div class="survey-content">
                            <h5 class="survey-title">
                              <a :href="'/participant/enquetes-avis/' + item.id">
                                {{ item.title }}
                              </a>
                            </h5>
                            <p class="survey-description">
                              {{ item.description || 'Aucune description disponible.' }}
                            </p>

                            <div class="survey-stats-modern">
                              <div class="stat-item">
                                <i class="bi bi-question-circle-fill stat-icon"></i>
                                <div class="stat-content">
                                  <div class="stat-number">{{ item.question_groups }}</div>
                                  <div class="stat-label">Questions</div>
                                </div>
                              </div>
                              <div class="stat-item">
                                <i class="bi bi-check-circle-fill stat-icon"></i>
                                <div class="stat-content">
                                  <div class="stat-number">{{ item.survey_participants }}</div>
                                  <div class="stat-label">Réponses</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </BCol>
                  </BRow>
              </BTab>
            </BTabs>
          </div>

          <BRow class="mt-4">
                <BCol lg="12">
                  <BPagination
                    v-if="courses.length > 0"
                    class="justify-content-end"
                    pills
                    v-model="currentPage"
                    :total-rows="courses.length"
                    :per-page="perPage"
                    aria-controls="my-table"
                  ></BPagination>
                </BCol>
              </BRow>
        </div>
      </BCol>
    </BRow>
  </div>
</template>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
@import '../../../css/modern-cards.scss';
@import 'src/css/participant/surveys.scss';
</style>
