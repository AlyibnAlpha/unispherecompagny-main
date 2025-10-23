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
          <q-tab class="text-green small-tab" name="encours" label="En cours" />
        </div>
        <div class="col">
          <q-tab class="text-green small-tab" name="clôture" label="Clôture" />
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
              <div class="row g-5">
                <div class="col-lg-12 col-pl--35">
                  <div class="edu-sorting-area">
                    <div class="sorting-left">
                      <h6 class="showing-text" style="font-size: large">
                        Nous avons <span>{{ getItems.length }}</span> Enquête pour vous
                      </h6>
                    </div>
                    <div class="sorting-right">
                      <div class="layout-switcher">
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
                      </div>
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
                      <q-spinner-bars
                        color="success"
                        size="50px"
                        class="q-my-md flex flex-center"
                      />
                    </div>
                  </div>

                  <div v-else>
                    <div v-if="filteredCourses.length === 0" class="col-12 text-center q-mt-lg">
                      <p>Aucune enquête disponible.</p>
                    </div>
                    <div
                      v-else
                      class="edu-course-six-each-item"
                      v-for="course in getItems"
                      :key="course.id"
                    >
                      <CourseTypeSix :course="course" />
                    </div>
                  </div>

                  <div v-if="getPaginateCount > 1">
                    <div class="edublink-vue-pagination">
                      <pagination
                        v-model="currentPage"
                        :per-page="perPage"
                        :records="courses.length"
                        @paginate="paginateClickCallback"
                        :options="paginationOptions"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="clôture">
          <div class="edu-course-area course-area-1">
            <div class="container">
              <div class="row g-5">
                <div class="col-lg-12 col-pl--35">
                  <div class="edu-sorting-area">
                    <div class="sorting-left">
                      <h6 class="showing-text" style="font-size: large">
                        Nous avons <span>{{ getItemss.length }}</span> Enquête pour vous
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
                      <q-spinner-bars
                        color="success"
                        size="50px"
                        class="q-my-md flex flex-center"
                      />
                    </div>
                  </div>

                  <div v-else>
                    <div v-if="filteredCoursess.length === 0" class="col-12 text-center q-mt-lg">
                      <p>Aucune enquête disponible.</p>
                    </div>
                    <div
                      v-else
                      class="edu-course-six-each-item"
                      v-for="course in getItemss"
                      :key="course.id"
                    >
                      <CourseTypeSix :course="course" />
                    </div>
                  </div>

                  <div v-if="getPaginateCounts > 1">
                    <div class="edublink-vue-pagination">
                      <pagination
                        v-model="currentPages"
                        :per-page="perPages"
                        :records="coursess.length"
                        @paginate="paginateClickCallbacks"
                        :options="paginationOptionss"
                      />
                    </div>
                  </div>
                </div>
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
import CourseTypeSix from '../../components/course/CourseTypeSix.vue'

import ScrollToTop from '../../components/footer/ScrollToTop.vue'

import Pagination from 'v-pagination-3'
import { computed, onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'

export default {
  components: {
    HeaderOne,
    BreadCrumbTwo,
    CourseTypeSix,
    FooterOne,
    ScrollToTop,
    Pagination,
  },
  data() {
    const tab = ref('encours')
    const courses = ref([])
    const perPage = ref(5)
    const currentPage = ref(1)
    const coursess = ref([])
    const perPages = ref(5)
    const currentPages = ref(1)
    const search = ref('')
    const loading = ref(true)
    const paginationOptions = ref({
      texts: {
        nextPage: '',
        prevPage: '',
      },
    })
    const paginationOptionss = ref({
      texts: {
        nextPage: '',
        prevPage: '',
      },
    })

    function getWeekNumber(startDate) {
      const start = new Date(startDate)
      const now = new Date()

      // Calculer la différence en millisecondes
      const diffMs = now - start

      // Convertir en semaines
      const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000))

      return diffWeeks
    }
    function getSurveyStatus(startDate, endDate) {
      const now = new Date()
      const start = new Date(startDate)
      const end = new Date(endDate)

      // Calcul de la différence en jours entre startDate et aujourd’hui
      const diffStartDays = Math.floor((now - start) / (1000 * 60 * 60 * 24))

      if (diffStartDays <= 14 && now < end) {
        return 'Nouveau' // moins de 2 semaines depuis le début
      } else if (now >= start && now <= end) {
        return 'En cours' // entre startDate et endDate
      } else if (now > end) {
        return 'Clôturés' // après endDate
      }
      return 'à venir' // si startDate est dans le futur
    }
    const gets = async () => {
      try {
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
    const getPaginateCount = computed(() => {
      return Math.ceil(filteredCourses.value.length / perPage.value)
    })
    const getPaginateCountss = computed(() => {
      return Math.ceil(filteredCourses.value.length / perPages.value)
    })
    const getItems = computed(() => {
      let start = (currentPage.value - 1) * perPage.value
      let end = currentPage.value * perPage.value
      return filteredCourses.value.slice(start, end)
    })
    const getItemss = computed(() => {
      let start = (currentPages.value - 1) * perPages.value
      let end = currentPages.value * perPages.value
      return filteredCoursess.value.slice(start, end)
    })

    const paginateClickCallback = (page) => {
      currentPage.value = Number(page)
    }
    const paginateClickCallbacks = (page) => {
      currentPages.value = Number(page)
    }

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

    onMounted(() => {
      filteredCourses
      filteredCoursess
      gets()
    })
    return {
      tab,
      currentPage,
      perPage,
      getItems,
      getItemss,
      paginateClickCallback,
      paginateClickCallbacks,
      getPaginateCount,
      paginationOptions,
      courses,
      filteredCourses,
      filteredCoursess,
      search,
      loading,
      coursess,
      perPages,
      currentPages,
      paginationOptionss,
      getPaginateCountss,
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
</style>
