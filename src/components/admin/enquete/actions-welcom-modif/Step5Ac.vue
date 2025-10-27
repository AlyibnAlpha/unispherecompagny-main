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

        <!-- Section Publication -->
        <div class="publish-section">
          <div class="publish-card">
            <div class="publish-icon">
              <i class="bi bi-rocket-takeoff-fill"></i>
            </div>
            <div class="publish-content">
              <h4>Publier votre enquête</h4>
              <p>Activez cette option pour rendre votre enquête accessible aux participants</p>
            </div>
            <div class="publish-toggle">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="publishCheck"
                  v-model="isPublished"
                />
                <label class="form-check-label" for="publishCheck">Publier</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="d-flex justify-content-between mt-4 w-100">
        <BButton
          class="btn-modern btn-secondary-modern"
          @click="$emit('onBack')"
        >
          <i class="bi bi-arrow-left me-2"></i>
          Retour
        </BButton>
        <q-spinner-dots v-if="loadings" color="green" size="20px" class="q-mr-sm" />
        <BButton v-else class="btn-modern btn-success-modern" @click.prevent="Add">
          <i class="bi bi-check-circle-fill me-2"></i>
          Terminer
        </BButton>
      </div>
    </div>
  </div>
</template>

<script>
import { BButton } from 'bootstrap-vue-next'
import { onMounted, ref, watch } from 'vue'
import { api } from 'src/boot/axios'
import { useRegisterStore } from 'src/stores/useRegisterStore'
import Swal from 'sweetalert2'
import { useAuthStore } from 'src/stores/auth'
import { useRoute, useRouter } from 'vue-router'

export default {
  components: {
    BButton,
  },
  setup() {
    const orderData = ref([])
    const store = useRegisterStore()
    const isPublished = ref(false)
    const original = ref(false)
    const loading = ref(false)
    const loadings = ref(false)
    const route = useRoute()
    const router = useRouter()

    const aurh = useAuthStore()

    const gets = async () => {
      if (
        store.surveyData &&
        Object.keys(store.surveyData).length > 0 &&
        store.surveyData.slug === route.params.id
      ) {
        orderData.value = store.surveyData
        isPublished.value = orderData.value.isPublished
        original.value = orderData.value.isPublished
      } else {
        try {
          loading.value = true
          const role = aurh.roles[0]
          const id = route.params.id

          if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
            const response = await api.get('/business/dashboard/overview')
            const found = response.data.surveys.find((item) => item.slug === id)
            orderData.value = found
            isPublished.value = orderData.value.isPublished
            original.value = orderData.value.isPublished
          } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
            const response = await api.get('/admin/dashboard/overview')
            const found = response.data.surveys.find((item) => item.slug === id)
            orderData.value = found
            isPublished.value = orderData.value.isPublished
            original.value = orderData.value.isPublished
          }
        } catch (error) {
          console.error('Error fetching survey data:', error)
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text:
              error.response?.data?.message ||
              'Une erreur est survenue lors de la récupération des données du sondage.',
          })
        } finally {
          loading.value = false
        }
      }
    }

    const Add = async () => {
      const role = aurh.roles[0]
      if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
        if (original.value === isPublished.value) {
          Swal.fire({
            icon: 'success',
            title: 'Enregistre avec success',
            showConfirmButton: true,
            timer: 2000,
          })
          store.setIdSurvey('')
          router.push('/business/enquetes-mes')
          return
        }
        if (isPublished.value) {
          if (orderData.value.isPublished === false) {
            try {
              loadings.value = true
              await api.post(`/surveys/${orderData.value.id}/publish`).then(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Enregistre avec success',
                  showConfirmButton: true,
                  timer: 2000,
                })
              })
              store.setIdSurvey('')
              router.push('/business/enquetes-mes')
            } catch (error) {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.response.data.message || 'Une erreur est survenue',
              })
            } finally {
              loadings.value = false
            }
          }
        } else {
          try {
            loadings.value = true
            await api.post(`/surveys/${orderData.value.id}/unpublish`).then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Enregistre avec success',
                showConfirmButton: true,
                timer: 2000,
              })
            })
            store.setIdSurvey('')
            router.push('/business/enquetes-mes')
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: error.response.data.message || 'Une erreur est survenue',
            })
          }
        }
      }
      if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
        if (original.value === isPublished.value) {
          Swal.fire({
            icon: 'success',
            title: 'Enregistre avec success',
            showConfirmButton: true,
            timer: 2000,
          })
          store.setIdSurvey('')
          router.push('/admin/enquetes-mes')
          return
        }
        if (isPublished.value) {
          if (!orderData.value.isPublished) {
            try {
              loadings.value = true

              await api.post(`/surveys/${orderData.value.id}/publish`).then(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Enregistre avec success',
                  showConfirmButton: true,
                  timer: 2000,
                })
              })
              store.setIdSurvey('')
              router.push('/admin/enquetes-mes')
            } catch (error) {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.response.data.message || 'Une erreur est survenue',
              })
            } finally {
              loadings.value = false
            }
          }
        } else {
          try {
            loadings.value = true
            console.log(orderData.value.id)
            await api.post(`/surveys/${orderData.value.id}/unpublish`).then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Enregistre avec success',
                showConfirmButton: true,
                timer: 2000,
              })
            })
            store.setIdSurvey('')
            router.push('/admin/enquetes-mes')
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

    watch(
      () => store.surveyData,
      (newData) => {
        if (newData && Object.keys(newData).length > 0) {
          orderData.value = newData
        }
      },
      { immediate: true, deep: true },
    )

    onMounted(() => {
      gets()
    })
    return {
      orderData,
      isPublished,
      loading,
      loadings,
      Add,
    }
  },
  emits: ['onBack', 'onNext'],
}
</script>
