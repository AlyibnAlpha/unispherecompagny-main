<script>
import {
  BCard,
  BCardBody,
  BCol,
  BRow,
  BPagination,
  BCollapse,
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
        { title: 'Enquêtes en cours', value: 'surveys_in_progress' },
        { title: 'Enquêtes en Bonus', value: 'welcome_surveys' },
      ],
    }
  },
  components: {
    BCard,
    BCardBody,
    BCol,
    BRow,
    BPagination,
    BCollapse,
    BTabs,
    BFormInput,
    BTab,
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
  <StatPart />
  <div>
    <BRow>
      <BCol lg="3" cols="xl-3">
        <BCard no-body>
          <div class="card-header bg-transparent border-bottom">
            <h5 class="mb-0">Flitre par Categorie</h5>
          </div>

          <div class="custom-accordion">
            <div class="p-4 border-top">
              <div>
                <BCollapse visible id="filterprodductcolor-collapse">
                  <div class="mt-4">
                    <div v-for="(color, index) in colors" :key="index" class="form-check mt-2">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        :id="'productColorCheck' + index"
                        :value="color.value"
                        v-model="selectedCategories"
                      />
                      <label class="form-check-label" :for="'productColorCheck' + index">
                        {{ color.title }}
                      </label>
                    </div>
                  </div>
                </BCollapse>
              </div>
            </div>
          </div>
        </BCard>
      </BCol>

      <BCol lg="9" cols="xl-9">
        <BCard no-body>
          <BCardBody>
            <div>
              <BRow>
                <BCol md="6">
                  <div>
                    <h5>Les Enquêtes en cours</h5>
                  </div>
                </BCol>

                <BCol md="6">
                  <div class="form-inline float-md-end">
                    <div class="search-box ms-2">
                      <div class="position-relative">
                        <BFormInput
                          type="text"
                          v-model="searchQuery"
                          @input="currentPage = 1"
                          class="form-control bg-light border-light rounded"
                          placeholder="Search..."
                        />
                        <i class="mdi mdi-magnify search-icon"></i>
                      </div>
                    </div>
                  </div>
                </BCol>
              </BRow>
              <BTabs nav-class="nav nav-tabs nav-tabs-custom mt-3 mb-2 ecommerce-sortby-list">
                <BTab active title-item-class="tabs-accordions-link">
                  <template v-slot:title>
                    <span class="d-inline-block d-sm-none"> Nouveauté </span>
                    <span class="d-none d-sm-inline-block">Nouveauté</span>
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
                      cols="xl-4"
                      v-for="item in paginatedNew"
                      :key="item.id"
                      style="margin-top: 20px"
                    >
                      <router-link :to="'/admin/enquetes-avis/' + item.id" class="survey-card-link">
                        <div
                          class="survey-card"
                          @mouseover="item.hover = true"
                          @mouseleave="item.hover = false"
                        >
                          <div class="survey-image">
                            <div class="survey-badge">{{ item.startDate }} semaine</div>
                            <img
                              src="/images/course/course-type-01-02/sondage.webp"
                              alt="Sondage"
                            />
                          </div>

                          <div class="survey-content">
                            <h5 class="survey-title">
                              <router-link :to="'/admin/enquetes-avis/' + item.id">
                                {{ item.title }}
                              </router-link>
                            </h5>
                            <p class="survey-description">
                              {{ item.description || 'Aucune description disponible.' }}
                            </p>

                            <div class="survey-stats">
                              <span class="badge bg-primary">
                                <i class="uil-comment-chart-line"></i>
                                {{ item.question_groups }} Questions
                              </span>
                              <span class="badge bg-success">
                                <i class="uil-comment-check"></i>
                                {{ item.survey_participants }} Réponses
                              </span>
                            </div>
                          </div>
                        </div>
                      </router-link>
                    </BCol>
                  </BRow>
                </BTab>
                <BTab title-item-class="tabs-accordions-link">
                  <template v-slot:title>
                    <span class="d-inline-block d-sm-none"> En cours </span>
                    <span class="d-none d-sm-inline-block">En cours</span>
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
                      cols="xl-4"
                      v-for="item in paginatedCourses"
                      :key="item.id"
                      style="margin-top: 20px"
                    >
                      <div
                        class="survey-card"
                        @mouseover="item.hover = true"
                        @mouseleave="item.hover = false"
                      >
                        <div class="survey-image">
                          <div class="survey-badge">{{ item.startDate }} semaine</div>
                          <img src="/images/course/course-type-01-02/sondage.webp" alt="Sondage" />
                        </div>

                        <div class="survey-content">
                          <h5 class="survey-title">
                            <router-link :to="'/admin/enquetes-avis/' + item.slug">
                              {{ item.title }}
                            </router-link>
                          </h5>
                          <p class="survey-description">
                            {{ item.description || 'Aucune description disponible.' }}
                          </p>

                          <div class="survey-stats">
                            <span class="badge bg-primary">
                              <i class="uil-comment-chart-line"></i>
                              {{ item.question_groups }} Questions
                            </span>
                            <span class="badge bg-success">
                              <i class="uil-comment-check"></i>
                              {{ item.survey_participants }} Réponses
                            </span>
                          </div>
                        </div>
                      </div>
                    </BCol>
                  </BRow>
                </BTab>
              </BTabs>

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
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </div>
</template>

<style>
@import '../../../css/assets/scss/app2.scss';
.survey-card-link {
  text-decoration: none;
  color: inherit;
}
.survey-card {
  background: whitesmoke;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.survey-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
  background: linear-gradient(135deg, #e9f0fa, #dce6f7);
}

/* Container responsive */
.survey-cards-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .survey-cards-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .survey-cards-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Carte */
.survey-card {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.survey-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

/* Image */
.survey-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.survey-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.survey-card:hover .survey-image img {
  transform: scale(1.08);
}

/* Badge semaine */
.survey-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: linear-gradient(135deg, #ffc107, #ff9800);
  color: #000;
  padding: 5px 10px;
  font-size: 13px;
  font-weight: bold;
  border-radius: 12px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

/* Bouton partage */
.btn-share {
  position: absolute;
  top: 14px;
  right: 14px;
  background: #25e3fc;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-share:hover {
  background: #0dcaf0;
  transform: rotate(8deg) scale(1.1);
}

/* Contenu */
.survey-content {
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Titre */
.survey-title {
  font-weight: 700;
  margin-bottom: 10px;
  font-size: 1.15rem;
  line-height: 1.4;
}

.survey-title a {
  color: #ff7b00;
  text-decoration: none;
  transition: color 0.2s ease;
}

.survey-title a:hover {
  color: #e86c00;
  text-decoration: underline;
}

/* Description limitée à 2 lignes */
.survey-description {
  font-size: 0.92rem;
  color: #555;
  flex: 1;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2; /* max 2 lignes */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Stats */
.survey-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: auto; /* pousse les stats vers le bas */
}

.survey-stats .badge {
  padding: 6px 10px;
  font-size: 0.8rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
