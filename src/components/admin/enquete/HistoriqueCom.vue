<script>
import { BCard, BCardBody, BCol, BRow, BPagination, BFormInput } from 'bootstrap-vue-next'
import { onMounted, ref } from 'vue'
import { api } from 'src/boot/axios.js'
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
        const response = await api.get('/participants/dashboard/history/surveys')
        console.log(response.data)

        response.data.forEach((item) => {
          const totalQuestions = item.question_groups?.reduce((sum, group) => {
            return sum + (group.questions?.length || 0)
          }, 0)
          const totaleReponse = item.responses?.reduce((sum, group) => {
            return sum + (group.responseDetails?.length || 0)
          }, 0)

          courses.value.push({
            id: item.id,
            ids: item.survey_participants[0].accessToken,
            title: item.title,
            status: item.status,
            question_groups: totalQuestions,
            survey_participants: totaleReponse,
            description: item.description,
            startDate: getWeekNumber(item.startDate),
          })
        })
      } catch (error) {
        console.log(error)
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
      currentPage: 1,
      totalRows: 1,
      perPage: 6,
      selectedCategories: ref([]),
      colors: [
        { title: 'Enquêtes disponibles', value: 'surveys_available' },
        { title: 'Enquêtes en cours', value: 'surveys_in_progress' },
        { title: 'Enquêtes terminées', value: 'surveys_completed' },
      ],
    }
  },
  components: {
    BCard,
    BCardBody,
    BCol,
    BRow,
    BPagination,
    BFormInput,
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
          this.selectedCategories.includes(item.status) // item.category doit exister

        return matchesQuery && matchesCategory
      })
    },
    paginatedCourses() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage

      return this.filteredCourses.slice(start, end)
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1
    },
  },
  methods: {
    shareCourse(course) {
      const url = `${window.location.origin}/admin/enquetes-avis/${course.ids}`
      const text = `Découvrez ce sondage : ${course.title}`
      //api.post('/api/participants/referral/my-link')
      if (navigator.share) {
        navigator
          .share({
            title: course.title,
            text,
            url,
          })
          .catch((err) => console.log('Partage annulé', err))
      } else {
        navigator.clipboard.writeText(url)
        alert('Lien copié dans le presse-papiers ✅')
      }
    },
  },
}
</script>

<template>
  <div>
    <BRow>
      <BCol lg="12" cols="xl-12">
        <BCard no-body>
          <BCardBody>
            <div>
              <BRow>
                <BCol md="6">
                  <div>
                    <h5>Historique des sondages</h5>
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
              <div v-if="loading" class="text-center my-5">
                <q-spinner-ball color="green" size="50px" />
              </div>
              <div
                v-else-if="Array.isArray(paginatedCourses) && paginatedCourses.length === 0"
                class="text-center py-5"
              >
                <i class="uil uil-folder-open text-muted" style="font-size: 3rem"></i>
                <p class="mt-3 text-muted">Aucune Historique</p>
              </div>
              <BRow style="margin-top: 25px">
                <div class="survey-cards-container">
                  <div v-for="item in paginatedCourses" :key="item.id">
                    <div
                      class="survey-card"
                      @mouseover="item.hover = true"
                      @mouseleave="item.hover = false"
                    >
                      <div class="survey-image">
                        <div v-if="item.startDate" class="survey-badge">
                          {{ item.startDate }} semaine
                        </div>
                        <img src="/images/course/course-type-01-02/sondage.webp" alt="Sondage" />
                      </div>

                      <button class="btn-share" @click="shareCourse(item)">
                        <i class="bi bi-share"></i>
                      </button>

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
                  </div>
                </div>
              </BRow>

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
