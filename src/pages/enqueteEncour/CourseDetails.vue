<template>
  <div id="main-wrapper" class="main-wrapper">
    <HeaderOne />

    <div class="edu-breadcrumb-area breadcrumb-style-3">
      <div class="container">
        <div class="breadcrumb-inner">
          <ul class="edu-breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/">Acceuille</router-link>
            </li>
            <li class="separator"><i class="icon-angle-right"></i></li>
            <li class="breadcrumb-item">
              <router-link to="/enquete/encour-1">enquête disponibles</router-link>
            </li>
            <li class="separator"><i class="icon-angle-right"></i></li>
            <li class="breadcrumb-item active" aria-current="page">Details d'enquête</li>
          </ul>
          <div class="page-title">
            <h1 class="title">
              <span v-if="loading" class="skeleton skeleton-title"></span>
              <span v-else>{{ courses.title }}</span>
            </h1>
          </div>
          <ul class="course-meta">
            <li>
              <i class="icon-58" v-if="!loading && courses.user"></i>
              <span v-if="loading" class="skeleton skeleton-text" style="width: 120px"></span>
              <span v-else>{{ courses.user.companyName }}</span>
            </li>
            <!--<li><i class="icon-59"></i>la ville</li>-->
            <li class="course-rating">
              <div class="rating">
                <span v-if="loading" class="skeleton skeleton-text" style="width: 80px"></span>
                <!-- Boucle sur 5 étoiles -->
                <span v-else v-for="i in 5" :key="i">
                  <!-- Étoile pleine -->
                  <i v-if="i <= Math.floor(courses.rating)" class="icon-23"></i>

                  <!-- Demi-étoile -->
                  <i v-else-if="i - courses.rating <= 0.5" class="icon-23 half-star"></i>

                  <!-- Étoile vide -->
                  <i v-else class="icon-23 empty-star"></i>
                </span>
              </div>
              <span class="rating-count"
                ><span v-if="loading" class="skeleton skeleton-text" style="width: 50px"></span>
                <span v-else>({{ courses.rating.toFixed(1) }}/notes)</span></span
              >
            </li>
          </ul>
        </div>
      </div>
      <ul class="shape-group">
        <li class="shape-1">
          <span></span>
        </li>
        <MouseMove addClassName="shape-2" dataDepth="2" imgSrc="/images/about/shape-13.png" />
        <MouseMove addClassName="shape-3" dataDepth="-2" imgSrc="/images/about/shape-15.png" />
        <li class="shape-4">
          <span></span>
        </li>
        <li class="shape-5"><img src="/images/about/shape-07.png" alt="shape" /></li>
      </ul>
    </div>

    <section class="edu-section-gap course-details-area">
      <div class="container">
        <div class="row row--30">
          <div class="col-lg-8">
            <div class="course-details-content">
              <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link active"
                    id="overview-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#overview"
                    type="button"
                    role="tab"
                    aria-controls="overview"
                    aria-selected="true"
                  >
                    Enquête
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="carriculam-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#carriculam"
                    type="button"
                    role="tab"
                    aria-controls="carriculam"
                    aria-selected="false"
                  >
                    Statistique
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="instructor-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#instructor"
                    type="button"
                    role="tab"
                    aria-controls="instructor"
                    aria-selected="false"
                  >
                    Auteur
                  </button>
                </li>

                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="review-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#review"
                    type="button"
                    role="tab"
                    aria-controls="review"
                    aria-selected="false"
                  >
                    Reviews
                  </button>
                </li>
              </ul>

              <div class="tab-content" id="myTabContent">
                <div
                  class="tab-pane fade show active"
                  id="overview"
                  role="tabpanel"
                  aria-labelledby="overview-tab"
                >
                  <div class="course-tab-content">
                    <div class="">
                      <h3 class="heading-title">Description de l'enquête</h3>
                      <p>
                        <span
                          v-if="loading"
                          class="skeleton skeleton-text"
                          style="width: 95%"
                        ></span>
                        <span
                          v-if="loading"
                          class="skeleton skeleton-text"
                          style="width: 85%"
                        ></span>
                        <span v-else>{{ courses.description }}</span>
                      </p>
                      <!--
                      <h5 class="title">Obejectif de l'enquête?</h5>
                      <div class="course-overview">
                        <ul class="mb--60">
                          <li>
                            Learn to use Python professionally, learning both Python 2 & Python 3!
                          </li>
                          <li>
                            Build 6 beautiful real-world projects for your portfolio (not boring toy
                            apps)
                          </li>
                          <li>Understand the Theory behind Vue.js and use it in Real Projects</li>
                          <li>Create responsive, accessible, and beautiful layouts</li>
                        </ul>
                      </div>-->

                      <div class="course-curriculam">
                        <div class="course-lesson">
                          <h5 class="title" style="font-size: 20px">
                            <strong>Questions</strong>
                            <div class="badge-list" style="float: right">
                              <span
                                v-if="loading"
                                class="skeleton skeleton-text"
                                style="width: 50px"
                              ></span>
                              <span v-else class="badge badge-primary"
                                >{{ courses.question_groups }} Questions</span
                              >
                            </div>
                          </h5>
                          <p>
                            Les questions suivantes sont posées pour évaluer la compréhension du
                            questionnaire et la capacité à répondre aux questions posées:
                          </p>
                          <ul v-if="loading">
                            <li v-for="n in 3" :key="n">
                              <span class="skeleton skeleton-text" style="width: 70%"></span>
                            </li>
                          </ul>

                          <ul v-else v-for="(q, index) in courses.question" :key="index">
                            <li>
                              <div class="text"><i class="icon-65"></i>{{ q.title }}</div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="tab-pane fade"
                  id="carriculam"
                  role="tabpanel"
                  aria-labelledby="carriculam-tab"
                >
                  <div class="course-tab-content">
                    <div class="course-curriculam">
                      <h3 class="heading-title">Statistique</h3>
                      <div v-if="loading">
                        <span
                          class="skeleton skeleton-text"
                          style="width: 90%; height: 150px; display: block"
                        ></span>
                      </div>
                      <div v-else>
                        <div class="course-lesson">
                          <satChart :dataMonths="responsesPerMonth" />
                        </div>
                        <div class="course-lesson">
                          <satChart2 :dataGender="responsesByGender" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="tab-pane fade"
                  id="instructor"
                  role="tabpanel"
                  aria-labelledby="instructor-tab"
                >
                  <div class="course-tab-content">
                    <div class="course-instructor">
                      <div class="thumbnail">
                        <img src="/icon.png" alt="Author Images" />
                      </div>
                      <div class="author-content">
                        <h6 class="title">
                          <span
                            v-if="loading"
                            class="skeleton skeleton-text"
                            style="width: 120px"
                          ></span>
                          <span v-else>{{ courses.user.companyName }}</span>
                        </h6>
                        <span class="subtitle"
                          ><span
                            v-if="loading"
                            class="skeleton skeleton-text"
                            style="width: 150px"
                          ></span>
                          <span v-else
                            >{{ courses.user.firstName }} {{ courses.user.lastName }}</span
                          ></span
                        >

                        <ul class="social-share">
                          <li>
                            <a href="#"><i class="icon-facebook"></i></a>
                          </li>
                          <li>
                            <a href="#"><i class="icon-twitter"></i></a>
                          </li>
                          <li>
                            <a href="#"><i class="icon-linkedin2"></i></a>
                          </li>
                          <li>
                            <a href="#"><i class="icon-youtube"></i></a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tab-pane fade" id="review" role="tabpanel" aria-labelledby="review-tab">
                  <div class="course-tab-content">
                    <div class="course-review">
                      <h3 class="heading-title">Note de l'enquête</h3>
                      <div class="row g-0 align-items-center">
                        <div class="col-sm-4">
                          <div class="rating-box">
                            <div class="rating-number">{{ courses.rating.toFixed(1) }}</div>
                            <div class="rating">
                              <span v-for="i in 5" :key="i">
                                <!-- Étoile pleine -->
                                <i v-if="i <= Math.floor(courses.rating)" class="icon-23"></i>

                                <!-- Demi-étoile -->
                                <i
                                  v-else-if="i - courses.rating <= 0.5"
                                  class="icon-23 half-star"
                                ></i>

                                <!-- Étoile vide -->
                                <i v-else class="icon-23 empty-star"></i>
                              </span>
                            </div>
                            <span>({{ courses.survey_participants }} Note)</span>
                          </div>
                        </div>
                        <div class="col-sm-8">
                          <div class="review-wrapper">
                            <div class="single-progress-bar" v-for="i in 5" :key="i">
                              <div class="rating-text">{{ i }} <i class="icon-23"></i></div>
                              <div class="progress">
                                <div
                                  class="progress-bar"
                                  role="progressbar"
                                  :style="{ width: getProgress(i) + '%' }"
                                  :aria-valuenow="getProgress(i)"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Start Comment Area  -->
                      <div class="comment-area">
                        <h3 class="heading-title">Avis</h3>
                        <div v-if="loading">
                          <span
                            class="skeleton skeleton-text"
                            style="width: 100%; height: 80px; display: block"
                          ></span>
                        </div>
                        <div v-else class="comment-list-wrapper">
                          <!-- Boucle sur les 3 dernières réponses -->
                          <div class="comment" v-for="resp in lastThreeResponses" :key="resp.id">
                            <div class="thumbnail">
                              <img src="/icon.png" alt="Comment Images" />
                            </div>
                            <div class="comment-content">
                              <h5 class="title">{{ resp.userName }}</h5>
                              <span class="date">{{
                                new Date(resp.submittedAt).toLocaleDateString()
                              }}</span>
                              <span class="date">
                                <strong>Question:</strong> {{ resp.quest }} ?
                              </span>
                              <p><strong>Reponses:</strong> {{ resp.answerSummary }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="course-sidebar-3 sidebar-top-position">
              <div class="edu-course-widget widget-course-summery">
                <div class="inner">
                  <div class="thumbnail">
                    <img src="/images/course/course-type-01-02/sondage.webp" alt="Courses" />
                  </div>
                  <div class="content">
                    <h4 class="widget-title">Enquête:</h4>
                    <ul class="course-item">
                      <li>
                        <span class="label"><i class="icon-62"></i>Auteur:</span>
                        <span class="value"
                          ><span
                            v-if="loading"
                            class="skeleton skeleton-text"
                            style="width: 100px"
                          ></span>
                          <span v-else
                            >{{ courses.user.firstName }} {{ courses.user.lastName }}</span
                          ></span
                        >
                      </li>
                      <li>
                        <span class="label"><i class="icon-61"></i>Durée:</span>
                        <span class="value"
                          ><span
                            v-if="loading"
                            class="skeleton skeleton-text"
                            style="width: 60px"
                          ></span>
                          <span v-else>{{ courses.startDate }} semaines</span></span
                        >
                      </li>
                      <li>
                        <span class="label">
                          <CourseDetailsOne />
                          Questions:
                        </span>
                        <span class="value"
                          ><span
                            v-if="loading"
                            class="skeleton skeleton-text"
                            style="width: 40px"
                          ></span>
                          <span v-else>{{ courses.question_groups }}</span></span
                        >
                      </li>
                      <li v-if="courses.survey_participants > 0">
                        <span class="label"><i class="icon-63"></i>Réponses:</span>
                        <span class="value"
                          ><span
                            v-if="loading"
                            class="skeleton skeleton-text"
                            style="width: 60px"
                          ></span>
                          <span v-else>{{ courses.survey_participants }}</span></span
                        >
                      </li>
                      <li>
                        <span class="label"><i class="icon-59"></i>Language:</span>
                        <span class="value"
                          ><span
                            v-if="loading"
                            class="skeleton skeleton-text"
                            style="width: 80px"
                          ></span>
                          <span v-else>{{ courses.supportedLanguages }}</span></span
                        >
                      </li>
                    </ul>
                    <div v-if="courses.end" class="read-more-btn">
                      <button @click.prevent="log" class="edu-btn">
                        Participer maintenant<i class="icon-4"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FooterOne />
    <ScrollToTop />
  </div>
</template>

<script>
import HeaderOne from '../../components/header/HeaderOne.vue'
import FooterOne from '../../components/footer/FooterOne.vue'
import MouseMove from '../../components/animation/MouseMove.vue'

import CourseDetailsOne from '../../components/svg/CourseDetailsOne.vue'
import ScrollToTop from '../../components/footer/ScrollToTop.vue'
import satChart from 'src/components/chart/satChart.vue'
import satChart2 from 'src/components/chart/satChart2.vue'

import { computed, onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

export default {
  components: {
    HeaderOne,
    MouseMove,
    FooterOne,
    CourseDetailsOne,
    ScrollToTop,
    satChart,
    satChart2,
  },
  setup() {
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

      // Calculer la différence en millisecondes
      const diffMs = now - start

      // Convertir en semaines
      const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000))

      return diffWeeks
    }
    function getend(st) {
      const end = new Date(st)
      const now = new Date()

      if (now < end) {
        return true
      } else {
        false
      }
    }

    const getProgress = (star) => {
      // Chaque "star" correspond à 20 réponses
      const participants = courses.value.survey_participants
      const maxPerStar = 20

      let width = participants - (star - 1) * maxPerStar
      if (width >= maxPerStar) width = 100
      else if (width <= 0) width = 0
      else width = (width / maxPerStar) * 100

      return width
    }

    const gets = async () => {
      try {
        const id = route.params.id
        const response = await api.get('/front/overview')
        const databl = [...response.data.surveys, ...response.data.completed_surveys]
        const found = databl.find((item) => item.slug === id)
        console.log(found)
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
        console.log(found.endDate)
        console.log(courses.value.end)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        loading.value = false
      }
    }

    const lastThreeResponses = computed(() => {
      // Vérifie que responses existe
      if (!courses.value.responses || courses.value.responses.length === 0) return []

      const filteredResponses = courses.value.responses
        .map((resp) => {
          // Filtre les responseDetails pour exclure les fichiers
          const nonFileDetails = resp.responseDetails.filter((d) => d.question.type !== 'file')
          return { ...resp, responseDetails: nonFileDetails }
        })
        // Ne garder que les réponses qui ont encore au moins une question (non-file)
        .filter((resp) => resp.responseDetails.length > 0)

      // Prend les 3 dernières réponses
      const lastResponses = filteredResponses.slice(-3).reverse()

      // Pour chaque réponse, tu peux créer un résumé pour l'affichage
      return lastResponses.map((resp) => ({
        id: resp.id,
        userName: 'Participant',
        quest: resp.responseDetails.map((d) => d.question.title).join(', '),
        submittedAt: resp.submittedAt,
        // Exemple : concatène les réponses pour chaque question
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

      // Transforme en tableau pour Chart.js ou affichage
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
      log,
      courses,
      com,
      getProgress,
      lastThreeResponses,
      responsesPerMonth,
      responsesByGender,
      loading,
    }
  },
  head() {
    return {
      title: 'Course Details',
    }
  },
}
</script>
<style>
@import '../../css/app.scss';
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
.skeleton {
  display: inline-block;
  height: 1em;
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
.skeleton-title {
  width: 60%;
  height: 24px;
}
.skeleton-text {
  width: 100%;
  height: 16px;
  margin: 6px 0;
}
</style>
