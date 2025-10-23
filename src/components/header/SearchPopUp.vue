<template>
  <div id="edu-search-popup" class="edu-search-popup">
    <div class="content-wrap" style="display: flex; flex-direction: column; height: 100%">
      <div class="site-logo">
        <router-link to="/">
          <img class="logo-light" src="/favicons.ico" alt="Dark Logo" style="width: 150px" />
          <img class="logo-dark" src="/favicons.ico" alt="Light Logo" style="width: 150px" />
        </router-link>
      </div>
      <div class="close-button">
        <button class="close-trigger" @click="searchPopUpClose('removeClass', 'open')">
          <i class="icon-73"></i>
        </button>
      </div>
      <div class="inner">
        <form class="search-form">
          <input
            type="text"
            v-model="search"
            class="edublink-search-popup-field"
            placeholder="Recherche une enquête..."
          />
          <button class="submit-button"><i class="icon-2"></i></button>
        </form>
      </div>

      <div class="results">
        <div class="courses-grid" v-if="filteredCourses.length">
          <div v-for="course in filteredCourses" :key="course.id" class="course-item">
            <div class="edu-course course-style-4 course-style-8 shadow-sm rounded-lg hover-card">
              <!-- Image -->
              <div class="course-card-modern">
                <div class="image-wrapper">
                  <router-link :to="`/enquete-details/${course.id}`">
                    <img
                      src="/images/course/course-type-01-02/sondage.webp"
                      alt="image"
                      class="course-image"
                    />
                  </router-link>
                  <span class="badge-week">Semaine {{ course.startDate }}</span>
                  <button class="btn-share" @click="shareCourse(course)">
                    <i class="icon-share-alt"></i>
                  </button>
                </div>

                <!-- Content -->
                <div class="card-content">
                  <h5 class="course-title">
                    <router-link :to="`/enquete-details/${course.id}`">{{
                      course.title
                    }}</router-link>
                  </h5>

                  <div class="rating-section">
                    <div class="stars">
                      <span v-for="i in 5" :key="i">
                        <i v-if="i <= Math.floor(course.rating)" class="icon-23 full"></i>
                        <i v-else-if="i - course.rating <= 0.5" class="icon-23 half"></i>
                        <i v-else class="icon-23 empty"></i>
                      </span>
                    </div>
                    <span class="score">{{ course.rating.toFixed(1) }}/5</span>
                  </div>

                  <p class="desc">{{ course.description }}</p>

                  <div class="meta-info">
                    <span><i class="icon-24"></i> {{ course.question_groups }} Questions</span>
                    <span><i class="icon-25"></i> {{ course.survey_participants }} Réponses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Aucun résultat -->
        <div v-else class="text-center mt-4 text-muted">
          🔍 Aucun sondage trouvé pour "<strong>{{ search }}</strong
          >"
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from 'src/boot/axios'
import { computed, onMounted, ref } from 'vue'

export default {
  data() {
    const courses = ref([])
    const search = ref('')
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
      const response = await api.get('/front/overview')
      const databl = [...response.data.surveys, ...response.data.completed_surveys]
      databl.map((item) => {
        const totalQuestions = item.question_groups?.reduce((sum, group) => {
          return sum + (group.questions?.length || 0)
        }, 0)
        const totaleReponse = item.survey_participants?.reduce((sum, group) => {
          return sum + (group.questions?.length || 0)
        }, 0)
        if (item.isPublished === true)
          courses.value.push({
            id: item.slug,
            title: item.title,
            status: item.status,
            question_groups: totalQuestions,
            survey_participants: totaleReponse,
            description: item.description,
            startDate: getWeekNumber(item.startDate),
            rating: totalQuestions > 0 ? Math.min(Math.floor(totaleReponse / 20), 5) : 0,
          })
      })
    }
    onMounted(() => {
      filteredCourses
      gets()
    })

    const filteredCourses = computed(() => {
      if (!search.value) return []
      return courses.value.filter((c) => c.title.toLowerCase().includes(search.value.toLowerCase()))
    })
    return {
      courses,
      search,
      filteredCourses,
    }
  },
  methods: {
    // SearchPopUp Close
    searchPopUpClose(triggerRemoveClass, className) {
      const el = document.querySelector('#edu-search-popup')
      if (triggerRemoveClass === 'addClass') {
        el.classList.add(className)
      } else {
        el.classList.remove(className)
      }
    },
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
/* Conteneur des résultats */
.results {
  max-height: 300px; /* adapte selon ton design */
  overflow-y: auto;
  padding: 15px;
}

/* Grille responsive des cartes */
.results .courses-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 colonnes desktop */
  gap: 20px;
  padding: 0;
  justify-items: center; /* centre les cards */
}

/* Tablette : 2 colonnes */
@media (max-width: 992px) {
  .results .courses-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile : 1 colonne */
@media (max-width: 576px) {
  .results .courses-grid {
    grid-template-columns: 1fr;
  }
}

/* Chaque item de la grille */
.results .course-item {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Card principale */
.edu-course.course-style-4.course-style-8 {
  width: 100%;
  max-width: 320px;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.35s ease;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}
.edu-course.course-style-4.course-style-8:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

/* Image de la card */
.course-card-modern {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: whitesmoke;
  backdrop-filter: blur(12px);
}
.course-image {
  width: 300px;
  height: 160px;
  object-fit: cover;
  transition: transform 0.5s ease;
  border-radius: 12px 12px 0 0;
}
.course-card-modern:hover .course-image {
  transform: scale(1.08);
}

/* Badge semaine */
.badge-week {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #11cb11, #a2fc25);
  color: #fff;
  font-size: 0.75rem;
  padding: 6px 12px;
  border-radius: 50px;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Bouton share */
.btn-share {
  position: absolute;
  top: 12px;
  right: 12px;
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

/* Contenu textuel */
.card-content {
  padding: 12px 15px;
}
.course-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
}
.course-title a {
  text-decoration: none;
  color: #1c1c1c;
}
.course-title a:hover {
  color: #a2fc25;
}

/* Rating */
.rating-section {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.stars {
  margin-right: 8px;
}
.full {
  color: #f5c518;
}
.empty {
  opacity: 0.3;
}
.half {
  color: #f5c518;
  opacity: 0.6;
}
.score {
  font-size: 0.8rem;
  color: #555;
}

/* Description */
.desc {
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 12px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Infos meta */
.meta-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #444;
  font-weight: 500;
}
.meta-info i {
  margin-right: 4px;
  color: #a2fc25;
}
.meta-info span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Animation hover globale */
.hover-card {
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}
.hover-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}
</style>
