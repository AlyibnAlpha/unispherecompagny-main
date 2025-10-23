<template>
  <div class="edu-course-area course-area-2 gap-tb-text bg-lighten03">
    <div class="container">
      <SectionTitle
        preTitle="Popular Enquêtes"
        title="Les Enquêtes en cours"
        alignment="section-center"
      />
      <div class="row g-5">
        <div v-if="loading">
          <div class="col-12 text-center">
            <q-spinner-ball color="success" size="50px" class="q-my-md flex flex-center" />
          </div>
        </div>
        <div
          v-else
          class="col-md-6 col-lg-4"
          data-aos-delay="150"
          data-aos="fade-up"
          data-aos-duration="800"
          v-for="course in courses.slice(0, 3)"
          :key="course.id"
        >
          <div class="edu-course course-style-1 hover-button-bg-white">
            <div class="inner">
              <div class="thumbnail">
                <router-link :to="`/course/course-details/${course.id}`">
                  <img src="/images/course/course-type-01-02/sondage.webp" alt="sondage" />
                </router-link>
                <div class="time-top">
                  <span class="duration"
                    ><i class="icon-61"></i>{{ course.startDate }} Semaine</span
                  >
                </div>
              </div>
              <div class="content">
                <span
                  class="badge"
                  :class="{
                    'bg-success': course.status === 'En cours',
                    'bg-danger': course.status === 'En cours',
                    'bg-danger': course.status === 'Terminé',
                  }"
                  >{{ course.status }}</span
                >
                <h5 class="title" style="font-size: 20px">
                  <router-link :to="`/enquete-details/${course.id}`"
                    ><strong>{{ course.title }}</strong></router-link
                  >
                </h5>
                <div class="course-rating">
                  <div class="rating">
                    <!-- Boucle sur 5 étoiles -->
                    <span v-for="i in 5" :key="i">
                      <!-- Étoile pleine -->
                      <i v-if="i <= Math.floor(course.rating)" class="icon-23"></i>

                      <!-- Demi-étoile -->
                      <i v-else-if="i - course.rating <= 0.5" class="icon-23 half-star"></i>

                      <!-- Étoile vide -->
                      <i v-else class="icon-23 empty-star"></i>
                    </span>
                  </div>
                  <span class="rating-count">({{ course.rating.toFixed(1) }}/notes)</span>
                </div>
                <ul class="course-meta">
                  <li><i class="icon-24"></i>{{ course.question_groups }}/Questions</li>
                  <li><i class="icon-25"></i>{{ course.survey_participants }}/Réponses</li>
                </ul>
              </div>
            </div>
            <div class="course-hover-content-wrapper">
              <button class="wishlist-btn"><i class="icon-22"></i></button>
            </div>
            <button class="btn-share" @click="shareCourse(course)">
              <i class="icon-share-alt"></i>
            </button>
            <router-link :to="`/enquete-details/${course.id}`">
              <div class="course-hover-content">
                <div class="content">
                  <span class="course-level">{{ course.status }}</span>
                  <h5 class="title" style="font-size: 20px">
                    <strong>{{ course.title }}</strong>
                  </h5>
                  <div class="course-rating">
                    <div class="rating">
                      <!-- Boucle sur 5 étoiles -->
                      <span v-for="i in 5" :key="i">
                        <!-- Étoile pleine -->
                        <i v-if="i <= Math.floor(course.rating)" class="icon-23"></i>

                        <!-- Demi-étoile -->
                        <i v-else-if="i - course.rating <= 0.5" class="icon-23 half-star"></i>

                        <!-- Étoile vide -->
                        <i v-else class="icon-23 empty-star"></i>
                      </span>
                    </div>
                    <span class="rating-count">({{ course.rating.toFixed(1) }}/notes)</span>
                  </div>
                  <p class="description-text">{{ truncate(course.description, 100) }}</p>
                  <ul class="course-meta">
                    <li><i class="icon-24"></i>{{ course.question_groups }}/Questions</li>
                    <li><i class="icon-25"></i>{{ course.survey_participants }}/Réponses</li>
                  </ul>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="course-view-all" data-aos-delay="150" data-aos="fade-up" data-aos-duration="1200">
        <router-link to="/enquete/encour-1" class="edu-btn"
          >Plus d'enquêtes...<i class="icon-4"></i
        ></router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from 'src/boot/axios'
import courseItemsMixin from '../../../mixins/courseItemsMixin'
import SectionTitle from '../common/SectionTitle.vue'
import { onMounted, ref } from 'vue'
export default {
  mixins: [courseItemsMixin],
  components: {
    SectionTitle,
  },
  setup() {
    const courses = ref([])
    const loading = ref(true)
    function getWeekNumber(startDate) {
      const start = new Date(startDate)
      const now = new Date()

      // Calculer la différence en millisecondes
      const diffMs = now - start

      // Convertir en semaines
      const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000))

      return diffWeeks
    }
    function truncate(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    }
    function getSurveyStatus(startDate, endDate) {
      const now = new Date()
      const start = new Date(startDate)
      const end = new Date(endDate)

      // Calcul de la différence en jours entre startDate et aujourd’hui
      const diffStartDays = Math.floor((now - start) / (1000 * 60 * 60 * 24))

      if (diffStartDays <= 14 && now < end) {
        return 'En cours' // moins de 2 semaines depuis le début
      } else if (now >= start && now <= end) {
        return 'En cours' // entre startDate et endDate
      } else if (now > end) {
        return 'Terminé' // après endDate
      }
      return 'à venir' // si startDate est dans le futur
    }

    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/front/overview')
        let listsondage
        if (response.data.surveys.length === 0) {
          listsondage = response.data.completed_surveys
        } else {
          listsondage = response.data.surveys
        }
        listsondage.map((item) => {
          const totalQuestions = item.question_groups?.reduce((sum, group) => {
            return sum + (group.questions?.length || 0)
          }, 0)
          const totaleReponse = item.responses?.reduce((sum, group) => {
            return sum + (group.responseDetails?.length || 0)
          }, 0)

          if (item.isPublished === true)
            courses.value.push({
              id: item.slug,
              title: item.title,
              status: getSurveyStatus(item.startDate, item.endDate),
              question_groups: totalQuestions,
              survey_participants: totaleReponse,
              description: item.description,
              startDate: getWeekNumber(item.startDate),
              rating: totalQuestions > 0 ? Math.min(Math.floor(totaleReponse / 20), 5) : 0,
            })
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        loading.value = false
      }
    }
    onMounted(() => {
      gets()
    })
    return {
      gets,
      courses,
      truncate,
      loading,
    }
  },
  methods: {
    shareCourse(course) {
      const url = `${window.location.origin}/enquete-details/${course.id}`
      const text = `Découvrez ce sondage : ${course.title}`

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
<style>
.description-text {
  white-space: normal; /* Permet les retours à la ligne normaux */
  word-wrap: break-word; /* Coupe les mots trop longs si besoin */
  overflow-wrap: break-word; /* Compatibilité */
}
.empty-star {
  opacity: 0.3;
}

/* demi-étoile → effet CSS (moitié remplie) */
.half-star {
  position: relative;
}
.half-star::before {
  content: '\e917'; /* le code unicode de ton icon-23 si c'est une icône perso */
  position: absolute;
  left: 0;
  width: 50%;
  overflow: hidden;
  color: gold; /* couleur étoile remplie */
}
.btn-share {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.btn-share:hover {
  background: #a2fc25;
  color: #fff;
}
.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  text-transform: capitalize;
}

/* Nouveau → vert clair */
.status-badge.nouveau {
  background-color: #d4f7dc; /* vert pastel */
  color: #1b5e20; /* vert foncé pour contraste */
}

/* En cours → jaune clair */
.status-badge.encours {
  background-color: #fff3cd; /* jaune pastel */
  color: #856404; /* jaune foncé/brun */
}

/* Clôturé → rouge clair */
.status-badge.clôturé {
  background-color: #f8d7da; /* rouge pastel */
  color: #721c24; /* rouge foncé */
}

/* À venir → bleu clair */
</style>
