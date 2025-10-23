<template>
  <BRow class="justify-content-center" style="height: auto">
    <q-inner-loading v-if="loading" :showing="loading" background-color="rgba(0,0,0,0.4)">
      <q-spinner-bars color="green" size="50px" />
    </q-inner-loading>
    <BCol v-else cols="12">
      <div v-if="orderData" class="p-4 bg-light border-0 shadow rounded">
        <div class="text-center mb-4">
          <h2 class="fw-bold text-primary mb-2">Sondage : {{ orderData.title }}</h2>
          <p class="text-secondary fs-6 mx-auto" style="max-width: 600px">
            {{ orderData.description }}
          </p>
        </div>

        <div class="d-flex justify-content-center gap-5 mb-4 flex-wrap">
          <div>
            <strong class="text-success">Date de début:</strong>
            {{
              new Date(orderData.startDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            }}
          </div>
          <div>
            <strong class="text-danger">Date de fin:</strong>
            {{
              new Date(orderData.endDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            }}
          </div>
        </div>

        <hr />

        <!-- Groupes de questions -->
        <div v-for="group in orderData.question_groups" :key="group.id" class="mb-4">
          <h5 class="text-primary">Groupe: {{ group.title }}</h5>
          <p class="text-muted mb-2">description: {{ group.description }}</p>

          <ul class="list-group">
            <li
              v-for="question in group.questions"
              :key="question.id"
              class="list-group-item mb-2 p-3 border rounded"
            >
              <div class="d-flex flex-wrap align-items-center gap-2">
                <strong>Position {{ question.position }} - {{ question.title }}</strong>
                <span
                  class="badge"
                  :class="{
                    'bg-info': question.type === 'single_choice',
                    'bg-primary': question.type === 'multiple_choice',
                    'bg-warning text-dark': question.type === 'text',
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
              <p class="text-muted mb-1">{{ question.description }}</p>
              <ul
                v-if="question.type === 'single_choice' || question.type === 'multiple_choice'"
                class="ps-4 mt-2"
              >
                <li v-for="choice in question.choices" :key="choice.id">{{ choice.label }}</li>
              </ul>
            </li>
          </ul>
        </div>

        <div class="form-check form-switch mb-4 gap-2 d-flex align-items-center">
          <input
            class="form-check-input"
            type="checkbox"
            id="publishCheck"
            v-model="isPublished"
            style="width: 50px; height: 25px"
          />
          <label class="form-check-label fw-semibold" for="publishCheck">
            Publier ce sondage
          </label>
        </div>

        <div class="d-flex justify-content-end justify-content-md-between">
          <BButton variant="outline-secondary" class="px-4" @click="$emit('onBack')">
            ⬅ Retour
          </BButton>
          <q-spinner-dots v-if="loadings" color="green" size="20px" class="q-mr-sm" />
          <BButton v-else variant="success" class="ms-2" @click.prevent="Add">
            <span class="px-4">Finish</span>
          </BButton>
        </div>
      </div>
    </BCol>
  </BRow>
</template>

<script>
import { BButton, BCol, BRow } from 'bootstrap-vue-next'
import { onMounted, ref, watch } from 'vue'
import { api } from 'src/boot/axios'
import { useRegisterStore } from 'src/stores/useRegisterStore'
import Swal from 'sweetalert2'
import { useAuthStore } from 'src/stores/auth'
import { useRoute, useRouter } from 'vue-router'

export default {
  components: {
    BButton,
    BCol,
    BRow,
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
