<template>
  <div id="main-wrapper" class="main-wrapper">
    <HeaderOne />

    <BreadCrumbTwo :title="`${name}`" />

    <div class="edu-course-area course-area-1 gap-tb-text">
      <div class="container">
        <div class="edu-sorting-area">
          <div class="sorting-left">
            <h6 class="showing-text" style="font-size: large">
              Nous avons <span>{{ courses.length }}</span> enquête pour vous
            </h6>
          </div>
          <div class="sorting-right">
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

        <div v-else class="row">
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
          <button class="edu-btn" @click="loadMore" v-if="defaultNumberOfCourses < courses.length">
            Plus d'enquête <i class="icon-56"></i>
          </button>
        </div>
      </div>
    </div>

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

import { computed, onMounted, ref, watch } from 'vue'
import { api } from 'src/boot/axios'
import { useRoute } from 'vue-router'

export default {
  components: {
    HeaderOne,
    BreadCrumbTwo,
    CourseTypeOne,
    FooterOne,
    ScrollToTop,
  },
  data() {
    const courses = ref([])
    const search = ref('')
    const loading = ref(true)
    const route = useRoute()
    const name = ref(route.params.id)
    const defaultNumberOfCourses = ref(6)
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
        const databl = [...response.data.surveys, ...response.data.completed_surveys]

        const found = databl.filter((item) => {
          const categoryName = item.category?.name?.trim().toLowerCase()
          const searchName = name.value.trim().toLowerCase()
          return categoryName === searchName
        })
        console.log(found)
        found.map((item) => {
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
    const cours = computed(() => {
      return courses.value.slice(0, defaultNumberOfCourses.value)
    })

    onMounted(() => {
      filteredCourses
      gets()
    })
    const filteredCourses = computed(() => {
      if (!search.value) return courses.value
      return courses.value.filter((c) => c.title.toLowerCase().includes(search.value.toLowerCase()))
    })
    watch(
      () => route.params.id,
      (newId) => {
        name.value = newId
        courses.value = [] // reset
        gets() // recharge les enquêtes
      },
    )
    return {
      gets,
      loadMore,
      courses,
      cours,
      defaultNumberOfCourses,
      search,
      filteredCourses,
      loading,
      name,
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
