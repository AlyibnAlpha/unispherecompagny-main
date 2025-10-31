<template>
  <div class="survey-details-page">
    <!-- Header avec logo et retour -->
    <div class="survey-header">
      <div class="logo-section">
        <img src="/icon.png" alt="Logo" />
        <span class="logo-text">Unisphere</span>
      </div>
      <router-link to="/participant/enquetes" class="back-button">
        <i class="bi bi-arrow-left"></i>
        Retour aux enquêtes
      </router-link>
    </div>

    <!-- Hero Section -->
    <div class="survey-hero">
      <div class="hero-content">
        <div class="breadcrumb-simple">
          <router-link to="/">Accueil</router-link>
          <span class="separator">•</span>
          <router-link to="/participant/enquetes">Enquêtes</router-link>
          <span class="separator">•</span>
          <span>Détails</span>
        </div>

        <h1 v-if="loading" class="skeleton skeleton-title"></h1>
        <h1 v-else>{{ courses.title }}</h1>

        <div class="hero-meta">
          <div class="meta-item">
            <i class="bi bi-building"></i>
            <span v-if="loading" class="skeleton skeleton-text" style="width: 120px"></span>
            <span v-else>{{ courses.user.companyName }}</span>
          </div>

          <div class="rating-stars">
            <div class="stars">
              <span v-if="loading" class="skeleton skeleton-text" style="width: 100px"></span>
              <template v-else>
                <i
                  v-for="i in 5"
                  :key="i"
                  class="bi"
                  :class="{
                    'bi-star-fill': i <= Math.floor(courses.rating),
                    'bi-star-half': i - courses.rating > 0 && i - courses.rating <= 0.5,
                    'bi-star': i > courses.rating && i - courses.rating > 0.5,
                  }"
                ></i>
              </template>
            </div>
            <span v-if="!loading">({{ courses.rating.toFixed(1) }})</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="survey-content-grid">
      <!-- Left: Tabs Content -->
      <div class="tabs-survey">
        <div class="tabs-nav">
          <button
            class="tab-button"
            :class="{ active: activeTab === 'overview' }"
            @click="activeTab = 'overview'"
          >
            <i class="bi bi-clipboard-data me-2"></i>
            Enquête
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'stats' }"
            @click="activeTab = 'stats'"
          >
            <i class="bi bi-bar-chart me-2"></i>
            Statistiques
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'author' }"
            @click="activeTab = 'author'"
          >
            <i class="bi bi-person me-2"></i>
            Auteur
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'reviews' }"
            @click="activeTab = 'reviews'"
          >
            <i class="bi bi-star me-2"></i>
            Avis
          </button>
        </div>

        <div class="tab-content">
          <!-- Overview Tab -->
          <div class="tab-pane" :class="{ active: activeTab === 'overview' }">
            <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px">
              Description de l'enquête
            </h3>
            <p style="color: #64748b; line-height: 1.7; margin-bottom: 30px">
              <span v-if="loading" class="skeleton skeleton-text" style="width: 95%"></span>
              <span v-if="loading" class="skeleton skeleton-text" style="width: 85%"></span>
              <span v-else>{{ courses.description }}</span>
            </p>

            <h5 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 16px">
              Questions ({{ courses.question_groups }})
            </h5>
            <p style="color: #64748b; margin-bottom: 20px">
              Les questions suivantes sont posées pour évaluer votre compréhension :
            </p>

            <ul v-if="loading" class="questions-list">
              <li v-for="n in 3" :key="n">
                <span class="skeleton skeleton-text" style="width: 70%"></span>
              </li>
            </ul>

            <ul v-else class="questions-list">
              <li v-for="(q, index) in courses.question" :key="index">
                <i class="bi bi-check-circle-fill"></i>
                <span class="text">{{ q.title }}</span>
              </li>
            </ul>
          </div>

          <!-- Stats Tab -->
          <div class="tab-pane" :class="{ active: activeTab === 'stats' }">
            <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 24px">
              Statistiques
            </h3>
            <div v-if="loading">
              <span class="skeleton skeleton-text" style="width: 100%; height: 200px; display: block"></span>
            </div>
            <div v-else>
              <satChart :dataMonths="responsesPerMonth" />
              <div style="margin-top: 30px">
                <satChart2 :dataGender="responsesByGender" />
              </div>
            </div>
          </div>

          <!-- Author Tab -->
          <div class="tab-pane" :class="{ active: activeTab === 'author' }">
            <div style="display: flex; gap: 20px; align-items: center">
              <img
                src="/icon.png"
                alt="Author"
                style="width: 80px; height: 80px; border-radius: 16px"
              />
              <div>
                <h6 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 6px">
                  <span v-if="loading" class="skeleton skeleton-text" style="width: 150px"></span>
                  <span v-else>{{ courses.user.companyName }}</span>
                </h6>
                <p style="color: #64748b; margin-bottom: 12px">
                  <span v-if="loading" class="skeleton skeleton-text" style="width: 120px"></span>
                  <span v-else>{{ courses.user.firstName }} {{ courses.user.lastName }}</span>
                </p>
                <div style="display: flex; gap: 12px">
                  <a href="#" style="color: #667eea; font-size: 1.2rem"><i class="bi bi-facebook"></i></a>
                  <a href="#" style="color: #667eea; font-size: 1.2rem"><i class="bi bi-twitter"></i></a>
                  <a href="#" style="color: #667eea; font-size: 1.2rem"><i class="bi bi-linkedin"></i></a>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div class="tab-pane" :class="{ active: activeTab === 'reviews' }">
            <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 24px">
              Avis ({{ courses.survey_participants }})
            </h3>

            <div v-if="loading">
              <span class="skeleton skeleton-text" style="width: 100%; height: 100px; display: block"></span>
            </div>

            <div v-else class="comment-list">
              <div class="comment-item" v-for="resp in lastThreeResponses" :key="resp.id">
                <img src="/icon.png" alt="Avatar" class="avatar" />
                <div class="comment-content">
                  <h5>{{ resp.userName }}</h5>
                  <span class="date">{{ new Date(resp.submittedAt).toLocaleDateString() }}</span>
                  <p class="question-text"><strong>Question:</strong> {{ resp.quest }}</p>
                  <p class="answer-text"><strong>Réponse:</strong> {{ resp.answerSummary }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Sidebar -->
      <div class="survey-sidebar-card">
        <img src="/images/course/course-type-01-02/sondage.webp" alt="Survey" class="sidebar-image" />

        <h4>Informations</h4>

        <ul class="info-list">
          <li>
            <span class="label">
              <i class="bi bi-person-circle"></i>
              Auteur
            </span>
            <span class="value">
              <span v-if="loading" class="skeleton skeleton-text" style="width: 80px"></span>
              <span v-else>{{ courses.user.firstName }}</span>
            </span>
          </li>
          <li>
            <span class="label">
              <i class="bi bi-clock"></i>
              Durée
            </span>
            <span class="value">
              <span v-if="loading" class="skeleton skeleton-text" style="width: 60px"></span>
              <span v-else>{{ courses.startDate }} semaines</span>
            </span>
          </li>
          <li>
            <span class="label">
              <i class="bi bi-question-circle"></i>
              Questions
            </span>
            <span class="value">
              <span v-if="loading" class="skeleton skeleton-text" style="width: 40px"></span>
              <span v-else>{{ courses.question_groups }}</span>
            </span>
          </li>
          <li v-if="courses.survey_participants > 0">
            <span class="label">
              <i class="bi bi-people"></i>
              Réponses
            </span>
            <span class="value">
              <span v-if="loading" class="skeleton skeleton-text" style="width: 50px"></span>
              <span v-else>{{ courses.survey_participants }}</span>
            </span>
          </li>
          <li>
            <span class="label">
              <i class="bi bi-translate"></i>
              Langue
            </span>
            <span class="value">
              <span v-if="loading" class="skeleton skeleton-text" style="width: 70px"></span>
              <span v-else>{{ courses.supportedLanguages }}</span>
            </span>
          </li>
        </ul>

        <button v-if="courses.end" @click="log" class="participate-button">
          Participer maintenant
          <i class="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import satChart from 'src/components/chart/satChart.vue'
import satChart2 from 'src/components/chart/satChart2.vue'
import { computed, onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

export default {
  components: {
    satChart,
    satChart2,
  },
  setup() {
    const activeTab = ref('overview')
    const courses = ref({
      title: '',
      status: '',
      question_groups: 0,
      question: [],
      responses: [],
      survey_participants: 0,
      supportedLanguages: '',
      user: {
        companyName: '',
        firstName: '',
        lastName: '',
      },
      description: '',
      startDate: 0,
      rating: 0,
      end: false,
    })
    const loading = ref(true)
    const route = useRoute()
    const com = ref({})
    const authStore = useAuthStore()
    const router = useRouter()

    function getWeekNumber(startDate) {
      const start = new Date(startDate)
      const now = new Date()
      const diffMs = now - start
      const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000))
      return diffWeeks
    }

    function getend(st) {
      const end = new Date(st)
      const now = new Date()
      return now < end
    }

    const gets = async () => {
      try {
        const id = route.params.id
        const response = await api.get('/front/overview')
        const databl = [...response.data.surveys, ...response.data.completed_surveys]
        const found = databl.find((item) => item.slug === id)

        const totalQuestions = found.question_groups?.reduce((sum, group) => {
          return sum + (group.questions?.length || 0)
        }, 0)

        const totaleReponse = found.responses?.reduce((sum, group) => {
          return sum + (group.responseDetails?.length || 0)
        }, 0)

        const questionsList = []
        found.question_groups?.forEach((group) => {
          if (group.questions) {
            group.questions.forEach((q) => questionsList.push(q))
          }
        })

        if (found.user.businessAccount !== null) {
          com.value = {
            companyName: found.user.businessAccount.companyName,
            firstName: found.user.businessAccount.firstName,
            lastName: found.user.businessAccount.lastName,
          }
        } else {
          com.value = {
            companyName: 'Unisphere Company',
            firstName: 'Unisphere',
            lastName: 'Company',
          }
        }

        courses.value = {
          title: found.title,
          status: found.status,
          question_groups: totalQuestions,
          question: questionsList,
          survey_participants: totaleReponse,
          supportedLanguages: found.supportedLanguages[0],
          responses: found.responses,
          user: {
            companyName: com.value.companyName,
            firstName: com.value.firstName,
            lastName: com.value.lastName,
          },
          description: found.description,
          startDate: getWeekNumber(found.startDate),
          rating: totalQuestions > 0 ? Math.min(Math.floor(totaleReponse / 20), 5) : 0,
          end: getend(found.endDate),
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        loading.value = false
      }
    }

    const lastThreeResponses = computed(() => {
      if (!courses.value.responses || courses.value.responses.length === 0) return []

      const filteredResponses = courses.value.responses
        .map((resp) => {
          const nonFileDetails = resp.responseDetails.filter((d) => d.question.type !== 'file')
          return { ...resp, responseDetails: nonFileDetails }
        })
        .filter((resp) => resp.responseDetails.length > 0)

      const lastResponses = filteredResponses.slice(-3).reverse()

      return lastResponses.map((resp) => ({
        id: resp.id,
        userName: 'Participant',
        quest: resp.responseDetails.map((d) => d.question.title).join(', '),
        submittedAt: resp.submittedAt,
        answerSummary: resp.responseDetails.map((d) => d.answer).join(', '),
      }))
    })

    function log() {
      const id = route.params.id
      const role = authStore.roles
      if (role == null) {
        router.push('/login')
      } else {
        router.push({ path: `/admin/enquetes-avis/${id}` }).then(() => {
          window.location.reload()
        })
      }
    }

    const responsesPerMonth = computed(() => {
      const counts = {}
      courses.value.responses.forEach((resp) => {
        const date = new Date(resp.submittedAt)
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' })
        counts[month] = (counts[month] || 0) + 1
      })
      return Object.entries(counts).map(([month, count]) => ({ month, count }))
    })

    const responsesByGender = computed(() => {
      const counts = { male: 0, female: 0, other: 0 }
      courses.value.responses.forEach((resp) => {
        const genderRaw = resp.user?.participantProfile?.gender?.toUpperCase() || 'O'
        let gender = 'other'
        if (genderRaw === 'M') gender = 'male'
        else if (genderRaw === 'F') gender = 'female'
        counts[gender] += 1
      })
      return counts
    })

    onMounted(() => {
      gets()
    })

    return {
      activeTab,
      log,
      courses,
      com,
      lastThreeResponses,
      responsesPerMonth,
      responsesByGender,
      loading,
    }
  },
}
</script>

<style lang="scss">
@import '../../css/survey/survey-details.scss';
</style>
