<script>
import { BCol, BRow, BPagination } from 'bootstrap-vue-next'
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
    BCol,
    BRow,
    BPagination,
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
  <div class="surveys-modern-container">
    <!-- Header moderne -->
    <div class="surveys-header-modern">
      <div class="header-left">
        <h2 class="surveys-title-modern">
          <i class="bi bi-clock-history me-2"></i>
          Historique des sondages
        </h2>
        <p class="surveys-subtitle">Consultez tous vos sondages terminés</p>
      </div>
      <div class="header-right">
        <div class="search-box-modern">
          <i class="bi bi-search"></i>
          <input
            type="text"
            v-model="searchQuery"
            @input="currentPage = 1"
            placeholder="Rechercher un sondage..."
            class="search-input-modern"
          />
        </div>
      </div>
    </div>
    <!-- Loading -->
    <div v-if="loading" class="loading-modern">
      <q-spinner-ball color="primary" size="60px" />
      <p>Chargement...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="paginatedCourses.length === 0" class="empty-state-modern">
      <i class="bi bi-inbox" style="font-size: 4rem; color: #cbd5e1;"></i>
      <h3>Aucun historique</h3>
      <p>Vous n'avez pas encore terminé de sondages</p>
    </div>

    <!-- Cards grid -->
    <BRow v-else class="mt-4">
      <BCol sm="6" lg="3" v-for="item in paginatedCourses" :key="item.id" class="mb-4">
        <a :href="'/participant/enquetes-avis/' + item.id" class="survey-card-link">
          <div class="survey-card">
            <div class="survey-image-modern">
              <div class="survey-badge">
                <i class="bi bi-clock"></i>
                {{ item.startDate }} semaine{{ item.startDate > 1 ? 's' : '' }}
              </div>
              <div class="survey-icon-large">
                <i class="bi bi-clipboard-check"></i>
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

    <!-- Pagination -->
    <BRow class="mt-4" v-if="courses.length > perPage">
      <BCol lg="12">
        <BPagination
          class="pagination-modern"
          v-model="currentPage"
          :total-rows="filteredCourses.length"
          :per-page="perPage"
          pills
        ></BPagination>
      </BCol>
    </BRow>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../css/participant/surveys.scss';

// Styles spécifiques pour le header
.surveys-modern-container {
  padding: 20px 0;
}

.surveys-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .header-left {
    .surveys-title-modern {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;

      i {
        font-size: 2rem;
      }
    }

    .surveys-subtitle {
      margin: 0;
      opacity: 0.9;
      font-size: 1rem;
    }
  }

  .header-right {
    .search-box-modern {
      position: relative;
      display: flex;
      align-items: center;

      i {
        position: absolute;
        left: 16px;
        font-size: 1.2rem;
        color: #64748b;
      }

      .search-input-modern {
        padding: 12px 16px 12px 48px;
        border: none;
        border-radius: 12px;
        width: 300px;
        font-size: 0.95rem;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          width: 350px;
        }

        &::placeholder {
          color: #94a3b8;
        }

        @media (max-width: 768px) {
          width: 100%;

          &:focus {
            width: 100%;
          }
        }
      }
    }
  }
}

.loading-modern {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;

  p {
    margin-top: 16px;
    font-size: 1.1rem;
  }
}

.empty-state-modern {
  text-align: center;
  padding: 80px 20px;
  color: #64748b;

  h3 {
    margin: 20px 0 8px 0;
    color: #475569;
  }

  p {
    color: #94a3b8;
  }
}

.pagination-modern {
  justify-content: center;
}
</style>
