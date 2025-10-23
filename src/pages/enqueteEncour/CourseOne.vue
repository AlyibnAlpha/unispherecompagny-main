<template>
  <div id="main-wrapper" class="main-wrapper">
    <HeaderOne />

    <BreadCrumbTwo title="Enquête Disponible" />
    <q-tabs
      v-model="tab"
      narrow-indicator
      class="custom-tabs q-mb-lg shadow-sm rounded-lg"
      active-color="white"
      indicator-color="transparent"
      style="margin-top: 20px"
    >
      <div class="row" style="width: 250px">
        <div class="col">
          <q-tab class="text-green" name="encours" label="En cours" />
        </div>
        <div class="col">
          <q-tab class="text-green" name="terminés" label="Terminés" />
        </div>
      </div>
      <q-tab-panels
        v-model="tab"
        animated
        transition-prev="scale"
        transition-next="scale"
        class="text-green"
      >
        <q-tab-panel name="encours">
          <div class="edu-course-area course-area-1">
            <div class="container">
              <div class="edu-sorting-area">
                <div class="sorting-left">
                  <h6 class="showing-text" style="font-size: large">
                    Nous avons <span>{{ courses.length }}</span> Enquête pour vous
                  </h6>
                </div>
                <div class="sorting-right">
                  <!--<div class="layout-switcher">
                        <label>Grid</label>
                        <ul class="switcher-btn">
                          <li>
                            <router-link to="/enquete/encour-1"
                              ><i class="icon-53"></i
                            ></router-link>
                          </li>
                          <li>
                            <router-link to="/enquete/encour-2" class="active"
                              ><i class="icon-54"></i>
                            </router-link>
                          </li>
                        </ul>
                      </div>-->
                  <div class="edu-sorting">
                    <input
                      type="text"
                      placeholder="recherche"
                      style="border: 1px solid black; background-color: ghostwhite"
                      v-model="search"
                    />
                  </div>
                </div>
              </div>
              <div v-if="loading">
                <div class="col-12 flex flex-center text-center">
                  <q-spinner-ball color="success" size="50px" class="q-my-md flex flex-center" />
                </div>
              </div>

              <div v-else class="row g-5">
                <div v-if="filteredCourses.length === 0" class="col-12 text-center q-mt-lg">
                  <p>Aucune enquête disponible.</p>
                </div>
                <div
                  v-else
                  class="col-md-6 col-lg-4 col-xl-3"
                  v-for="course in filteredCourses"
                  :key="course.id"
                >
                  <CourseTypeOne :course="course" extraClass="course-box-shadow" />
                </div>
              </div>

              <div class="load-more-btn">
                <button
                  class="edu-btn"
                  @click="loadMore"
                  v-if="defaultNumberOfCourses < courses.length"
                >
                  Plus d'enquête <i class="icon-56"></i>
                </button>
              </div>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="terminés">
          <div class="edu-course-area course-area-1">
            <div class="container">
              <div class="edu-sorting-area">
                <div class="sorting-left">
                  <h6 class="showing-text" style="font-size: large">
                    Nous avons <span>{{ coursess.length }}</span> Enquête pour vous
                  </h6>
                </div>
                <div class="sorting-right">
                  <!--<div class="layout-switcher">
                        <label>Grid</label>
                        <ul class="switcher-btn">
                          <li>
                            <router-link to="/enquete/encour-1"
                              ><i class="icon-53"></i
                            ></router-link>
                          </li>
                          <li>
                            <router-link to="/enquete/encour-2" class="active"
                              ><i class="icon-54"></i>
                            </router-link>
                          </li>
                        </ul>
                      </div>-->
                  <div class="edu-sorting">
                    <input
                      type="text"
                      placeholder="recherche"
                      style="border: 1px solid black; background-color: ghostwhite"
                      v-model="search"
                    />
                  </div>
                </div>
              </div>
              <div v-if="loading">
                <div class="col-12 flex flex-center text-center">
                  <q-spinner-ball color="success" size="50px" class="q-my-md flex flex-center" />
                </div>
              </div>

              <div v-else class="row g-5">
                <div v-if="filteredCoursess.length === 0" class="col-12 text-center q-mt-lg">
                  <p>Aucune enquête disponible.</p>
                </div>
                <div
                  v-else
                  class="col-md-6 col-lg-4 col-xl-3"
                  v-for="course in filteredCoursess"
                  :key="course.id"
                >
                  <CourseTypeOne :course="course" extraClass="course-box-shadow" />
                </div>
              </div>

              <div class="load-more-btn">
                <button
                  class="edu-btn"
                  @click="loadMores"
                  v-if="defaultNumberOfCourses < coursess.length"
                >
                  Plus d'enquête <i class="icon-56"></i>
                </button>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-tabs>

    <FooterOne />
    <ScrollToTop />
  </div>
</template>

<script>
import BreadCrumbTwo from '../../components/common/BreadCrumbTwo.vue'
import HeaderOne from '../../components/header/HeaderOne.vue'
import FooterOne from '../../components/footer/FooterOne.vue'
import CourseTypeOne from '../../components/course/CourseTypeOne.vue'
import ScrollToTop from '../../components/footer/ScrollToTop.vue'

import { computed, onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'

export default {
  components: {
    HeaderOne,
    BreadCrumbTwo,
    CourseTypeOne,
    FooterOne,
    ScrollToTop,
  },
  data() {
    const tab = ref('encours')
    const courses = ref([])
    const coursess = ref([])
    const search = ref('')
    const loading = ref(true)
    const defaultNumberOfCourses = ref(6)
    const defaultNumberOfCoursess = ref(6)
    function getWeekNumber(startDate) {
      const start = new Date(startDate)
      const now = new Date()

      // Calculer la différence en millisecondes
      const diffMs = now - start

      // Convertir en semaines
      const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000))

      return diffWeeks
    }
    const loadMore = () => {
      defaultNumberOfCourses.value += 4
    }
    const loadMores = () => {
      defaultNumberOfCoursess.value += 4
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
        response.data.surveys.map((item) => {
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
        response.data.completed_surveys.map((item) => {
          const totalQuestions = item.question_groups?.reduce((sum, group) => {
            return sum + (group.questions?.length || 0)
          }, 0)
          const totaleReponse = item.responses?.reduce((sum, group) => {
            return sum + (group.responseDetails?.length || 0)
          }, 0)
          if (item.isPublished === true)
            coursess.value.push({
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
    const cours = computed(() => {
      return courses.value.slice(0, defaultNumberOfCourses.value)
    })

    onMounted(() => {
      filteredCourses
      filteredCoursess
      gets()
    })
    const filteredCourses = computed(() => {
      if (!search.value) return courses.value
      return courses.value.filter((c) => c.title.toLowerCase().includes(search.value.toLowerCase()))
    })
    const filteredCoursess = computed(() => {
      if (!search.value) return coursess.value
      return coursess.value.filter((c) =>
        c.title.toLowerCase().includes(search.value.toLowerCase()),
      )
    })
    return {
      gets,
      loadMore,
      courses,
      cours,
      defaultNumberOfCourses,
      search,
      filteredCourses,
      filteredCoursess,
      loading,
      coursess,
      tab,
      loadMores,
      defaultNumberOfCoursess,
    }
  },

  head() {
    return {
      title: 'Les Enquête en cours',
    }
  },
}
</script>
<style>
@import '../../css/app.scss';
.custom-tabs {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 6px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.custom-tabs .q-tab {
  flex: 1;
  text-transform: capitalize;
  font-weight: 600;
  font-size: 16px;
  border-radius: 10px;
  transition: all 0.3s ease;
  color: #2e7d32; /* vert foncé */
}

.custom-tabs .q-tab:hover {
  background: rgba(46, 125, 50, 0.08); /* hover léger */
}

.custom-tabs .q-tab--active {
  background: linear-gradient(135deg, #43a047, #66bb6a);
  color: #fff !important;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}
</style>
