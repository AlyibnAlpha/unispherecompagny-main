<template>
  <div class="step-form-container">
    <p class="text-muted mb-4" style="font-size: 0.9375rem;">Vérifiez et publiez votre enquête</p>
    
    <q-inner-loading v-if="loading" :showing="loading" background-color="rgba(0,0,0,0.4)">
      <q-spinner-bars color="green" size="50px" />
    </q-inner-loading>
    <div v-else>
      <div v-if="orderData" class="finalization-card">
        <!-- Header avec titre et description -->
        <div class="finalization-header">
          <div class="header-icon">
            <i class="bi bi-clipboard-check-fill"></i>
          </div>
          <h2 class="header-title">{{ orderData.title }}</h2>
          <p class="header-description">
            {{ orderData.description }}
          </p>
          
          <!-- Badges de dates -->
          <div class="dates-badges">
            <div class="date-badge start-badge">
              <i class="bi bi-calendar-check"></i>
              <span class="date-badge-label">Début:</span>
              <span class="date-badge-value">
                {{
                  new Date(orderData.startDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                }}
              </span>
            </div>
            <div class="date-badge end-badge">
              <i class="bi bi-calendar-x"></i>
              <span class="date-badge-label">Fin:</span>
              <span class="date-badge-value">
                {{
                  new Date(orderData.endDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- Groupes de questions -->
        <div class="groups-section">
          <h3 class="section-title">
            <i class="bi bi-collection me-2"></i>
            Groupes et Questions
          </h3>
          <div v-for="group in orderData.question_groups" :key="group.id" class="group-summary mb-4">
            <div class="group-summary-header">
              <i class="bi bi-folder2-open"></i>
              <div>
                <h5 class="group-summary-title">{{ group.title }}</h5>
                <p class="group-summary-description">{{ group.description }}</p>
              </div>
            </div>

            <div class="questions-list">
              <div
                v-for="question in group.questions"
                :key="question.id"
                class="question-summary"
              >
                <div class="question-summary-header">
                  <span class="question-position">{{ question.position }}</span>
                  <div class="question-info">
                    <strong class="question-summary-title">{{ question.title }}</strong>
                    <span
                      class="question-type-badge"
                      :class="{
                        'type-single': question.type === 'single_choice',
                        'type-multiple': question.type === 'multiple_choice',
                        'type-text': question.type === 'text',
                      }"
                    >
                      {{
                        question.type === 'single_choice'
                          ? 'Choix unique'
                          : question.type === 'multiple_choice'
                            ? 'Choix multiple'
                            : 'Réponse texte'
                      }}
                    </span>
                  </div>
                </div>
                <p class="question-summary-description">{{ question.description }}</p>
                <ul
                  v-if="question.type === 'single_choice' || question.type === 'multiple_choice'"
                  class="choices-list"
                >
                  <li v-for="choice in question.choices" :key="choice.id">
                    <i class="bi bi-check-circle me-2"></i>
                    {{ choice.label }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Publication -->
        <div class="publish-section">
          <div class="publish-card">
            <div class="publish-icon">
              <i class="bi bi-rocket-takeoff-fill"></i>
            </div>
            <div class="publish-content">
              <h4>Publier l'enquête</h4>
              <p>Rendre cette enquête accessible aux participants</p>
            </div>
            <div class="publish-toggle">
              <input
                class="form-check-input"
                type="checkbox"
                id="publishCheck"
                v-model="isPublished"
              />
              <label class="form-check-label" for="publishCheck">
                {{ isPublished ? 'Publié' : 'Non publié' }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="step-navigation-footer">
        <button class="btn-nav-back" @click="$emit('onBack')">
          <i class="bi bi-arrow-left"></i>
          <span>Retour</span>
        </button>
        <q-spinner-dots v-if="loadings" color="green" size="20px" class="q-mr-sm" />
        <button v-else class="btn-nav-next finish" @click.prevent="handleNext">
          <span>Terminer et enregistrer</span>
          <i class="bi bi-check-circle-fill"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { api } from 'src/boot/axios'
import { useRegisterStore } from 'src/stores/useRegisterStore'
import Swal from 'sweetalert2'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'

export default {
  components: {},
  setup() {
    const orderData = ref({})
    const store = useRegisterStore()
    const isPublished = ref(false)
    const { emit } = getCurrentInstance()
    const router = useRouter()
    const aurh = useAuthStore()

    const gets = async () => {
      if (store.surveyData && Object.keys(store.surveyData).length > 0) {
        orderData.value = store.surveyData
      } else {
        try {
          const role = aurh.roles[0]
          if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
            const response = await api.get('/business/dashboard/overview')
            const found = response.data.surveys.find((item) => item.id === store.idsurvey)
            orderData.value = found
          } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
            const response = await api.get('/admin/dashboard/overview')
            const found = response.data.surveys.find((item) => item.id === store.idsurvey)
            orderData.value = found || {}
          }
        } catch (error) {
          console.error('Error fetching survey data:', error)
        }
      }
    }
    const Add = async () => {
      const role = aurh.roles[0]
      if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
        if (isPublished.value) {
          if (orderData.value.isPublished === false) {
            try {
              try {
                await api.post(`/surveys/${orderData.value.id}/publish`).then(() => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Enregistre avec success',
                    showConfirmButton: true,
                    timer: 2000,
                  }).then(() => {
                    store.setIdSurvey('')
                    store.setSurveyData({})
                    router.push('/admin/enquetes')
                  })
                })
              } catch (error) {
                Swal.fire({
                  icon: 'error',
                  title: 'Erreur',
                  text: error.response.data.message || 'Une erreur est survenue',
                })
              }
            } catch (error) {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.response.data.message || 'Une erreur est survenue',
              })
            }
          }
        }
      }
      if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
        if (isPublished.value) {
          if (!orderData.value.isPublished) {
            try {
              try {
                await api.post(`/surveys/${orderData.value.id}/publish`).then(() => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Enregistre avec success',
                    showConfirmButton: true,
                    timer: 2000,
                  }).then(() => {
                    store.setIdSurvey('')
                    store.setSurveyData({})
                    router.push('/admin/enquetes')
                  })
                })
              } catch (error) {
                Swal.fire({
                  icon: 'error',
                  title: 'Erreur',
                  text: error.response.data.message || 'Une erreur est survenue',
                })
              }
            } catch (error) {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.response.data.message || 'Une erreur est survenue',
              })
            }
          }
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Enregistre avec success',
            showConfirmButton: true,
            timer: 2000,
          }).then(() => {
            store.setIdSurvey('')
            store.setSurveyData({})
            router.push('/admin/enquetes')
          })
        }
      }
    }
    watch(
      () => store.surveyData,
      (newData) => {
        if (newData && Object.keys(newData).length > 0) {
          orderData.value = newData
        }
      },
      { immediate: true, deep: true },
    )
    const handleNext = () => {
      Add()
      emit('onNext')
    }
    onMounted(() => {
      gets()
    })
    return {
      handleNext,
      orderData,
      isPublished,
      Add,
    }
  },
  emits: ['onBack', 'onNext'],
}
</script>
