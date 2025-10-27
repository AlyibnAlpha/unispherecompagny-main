<template>
  <div class="step-form-container">
    <q-inner-loading v-if="loading" :showing="loading" background-color="rgba(0,0,0,0.4)">
      <q-spinner-bars color="green" size="50px" />
    </q-inner-loading>
    <BForm v-else>
        <!-- Titre -->
        <BCol cols="12" class="mb-4 floating-label">
          <input
            id="title"
            v-model="form.title"
            type="text"
            class="form-control form-control-modern"
            placeholder=" "
          />
          <label for="title">Titre de l'enquête</label>
        </BCol>

        <!-- Description -->
        <BCol cols="12" class="mb-4 floating-label">
          <textarea
            id="desc"
            v-model="form.description"
            class="form-control form-control-modern"
            rows="3"
            placeholder=" "
          ></textarea>
          <label for="desc">Description</label>
        </BCol>

        <!-- Langues supportées -->
        <BCol cols="12" class="mb-4 floating-label">
          <Multiselect
            id="lang"
            v-model="levals"
            mode="tags"
            :options="optionl"
            placeholder=" "
            class="form-control-modern"
          />
          <label for="lang">Choisissez les langues</label>
        </BCol>

        <BRow class="mb-4">
          <BCol md="6" class="floating-label">
            <Multiselect
              id="st"
              v-model="form.type"
              :options="optionl3"
              placeholder=" "
              class="form-control-modern"
            />
            <label for="st">Sélectionnez le type</label>
          </BCol>

          <BCol md="6" class="floating-label">
            <Multiselect
              id="st"
              v-model="form.categoryId"
              :options="categories"
              :searchable="true"
              :close-on-select="true"
              :clear-on-select="false"
              placeholder=" "
              class="form-control-modern"
            />
            <label for="st">Sélectionnez la catégorie</label>
          </BCol>
        </BRow>
        <!-- Dates -->
        <BRow class="mb-4">
          <BCol md="6" class="floating-label">
            <VueDatePicker
              v-model="form.startDate"
              class="w-100 form-control-modern"
              placeholder=" "
              model-type="yyyy-MM-dd"
            />
            <label>Date de début</label>
          </BCol>

          <BCol md="6" class="floating-label">
            <VueDatePicker
              v-model="form.endDate"
              class="w-100 form-control-modern"
              placeholder=" "
              model-type="yyyy-MM-dd"
            />
            <label>Date de fin</label>
          </BCol>
        </BRow>

        <!-- Bouton Suivant -->
        <div v-if="loadings" class="d-flex justify-content-end mt-4">
          <q-spinner-dots color="green" size="20px" class="q-mr-sm" />
        </div>

        <div v-else class="d-flex justify-content-end mt-4">
          <BButton class="btn-modern btn-success-modern" @click="handleNext">
            Suivant →
          </BButton>
        </div>
      </BForm>
  </div>
</template>
<script>
import { BButton, BCol, BRow } from 'bootstrap-vue-next'
import Multiselect from '@vueform/multiselect'
import { getCurrentInstance, onMounted, ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { api } from 'src/boot/axios'
import { Notify } from 'quasar'
import { useRegisterStore } from 'src/stores/useRegisterStore'
import { useAuthStore } from 'src/stores/auth'
export default {
  components: {
    BButton,
    BCol,
    BRow,
    Multiselect,
    VueDatePicker,
  },
  emits: ['refreshTable', 'onNext'],
  setup() {
    const optionl = [
      { label: 'Français', value: 'FR' },
      { label: 'English', value: 'EN' },
      { label: 'Español', value: 'ES' },
      { label: 'Italiano', value: 'IT' },
      { label: 'Português', value: 'PT' },
    ]

    const { emit } = getCurrentInstance()
    const optionl3 = [
      { label: 'Public', value: 'PUBLIC' },
      { label: 'Business', value: 'BUSINESS' },
    ]
    const levals = ref([])
    const loading = ref(false)
    const loadings = ref(false)
    const store = useRegisterStore()
    const authStore = useAuthStore()
    const originalForm = ref({})
    const form = ref({
      title: '',
      description: '',
      supportedLanguages: '',
      status: 'draft',
      type: '',
      categoryId: '',
      isPublished: false,
      startDate: '',
      endDate: '',
    })
    const categories = ref([])

    const getcaetory = async () => {
      try {
        const role = authStore.roles[0]
        if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          const response = await api.get('/business/survey-categories')
          categories.value = response.data.categories.map((cat) => ({
            label: cat.name,
            value: cat.id,
          }))
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          const response = await api.get('/admin/survey-categories')
          categories.value = response.data.categories.map((cat) => ({
            label: cat.name,
            value: cat.id,
          }))
        }
      } catch (error) {
        Notify.create(
          {
            type: 'negative',
            message: error.response?.data.message,
          },
          5000,
        )
      } finally {
        loading.value = false
      }
    }

    const formule = async () => {
      try {
        loadings.value = true
        if (
          !form.value.title ||
          !form.value.description ||
          levals.value.length === 0 ||
          !form.value.type ||
          !form.value.categoryId ||
          !form.value.startDate ||
          !form.value.endDate
        ) {
          Notify.create({
            type: 'warning',
            message: 'Veuillez remplir tous les champs obligatoires.',
            timeout: 3000,
          })

          return false
        }
        const hasChanged = JSON.stringify(form.value) !== JSON.stringify(originalForm.value)
        if (!hasChanged) {
          return true // On laisse passer pour "Suivant →"
        }
        const role = authStore.roles[0]
        if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          if (!store.idsurvey) {
            form.value.supportedLanguages = levals.value
            const response = await api.post('/surveys', form.value)
            store.setIdSurvey(response.data.id)

            Notify.create({
              type: 'positive',
              message: 'Opération effectuée avec succès !',
              timeout: 5000, // durée en ms
            })
          } else {
            form.value.supportedLanguages = levals.value
            await api.put(`/surveys/${form.value.id}`, {
              tittle: form.value.title,
              description: form.value.description,
              supportedLanguages: form.value.supportedLanguages,
              isPublished: form.value.isPublished,
            })
            Notify.create({
              type: 'positive',
              message: 'Opération effectuée avec succès !',
              timeout: 5000, // durée en ms
            })
          }
          const response = await api.get('/business/dashboard/overview')
          store.setSurveyData(response.data.surveys.find((s) => s.id === store.idsurvey))
          emit('refreshTable')
          originalForm.value = JSON.parse(JSON.stringify(form.value))
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          if (!store.idsurvey) {
            form.value.supportedLanguages = levals.value
            const response = await api.post('/admin/surveys', form.value)
            store.setIdSurvey(response.data.id)
            console.log('ddd', store.idsurvey)
            Notify.create({
              type: 'positive',
              message: 'Opération effectuée avec succès !',
              timeout: 5000, // durée en ms
            })
            const responseS = await api.get('/admin/dashboard/overview')
            store.setSurveyData(responseS.data.surveys.find((s) => s.id === store.idsurvey))
            console.log('ppp', store.surveyData)
            emit('refreshTable')
          } else {
            form.value.supportedLanguages = levals.value
            await api.put(`/admin/surveys/${form.value.id}`, {
              tittle: form.value.title,
              description: form.value.description,
              supportedLanguages: form.value.supportedLanguages,
              isPublished: form.value.isPublished,
            })
            Notify.create({
              type: 'positive',
              message: 'Opération effectuée avec succès !',
              timeout: 5000, // durée en ms
            })
          }
          const response = await api.get('/admin/dashboard/overview')
          store.setSurveyData(response.data.surveys.find((s) => s.id === store.idsurvey))
          emit('refreshTable')
          originalForm.value = JSON.parse(JSON.stringify(form.value))
        }
        return true
      } catch (error) {
        console.error('Status:', error)
        console.error('Headers:', error.response?.headers)
        console.error('er:', error.response?.data.message)

        Notify.create(
          {
            type: 'negative',
            message: error.response?.data.message,
          },
          5000,
        )
      } finally {
        loadings.value = false
      }
    }
    const handleNext = async () => {
      const success = await formule()
      if (success) {
        emit('onNext')
      }
    }
    onMounted(() => {
      getcaetory()
    })
    return {
      form,
      optionl,
      handleNext,
      levals,
      categories,
      optionl3,
      loading,
      loadings,
    }
  },
}
</script>

<style>
.btn-success {
  background: linear-gradient(135deg, #34c38f, #2ea3f2);
  border: none;
  border-radius: 50px;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(46, 163, 242, 0.3);

  &:hover {
    background: linear-gradient(135deg, #2ea3f2, #34c38f);
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(46, 163, 242, 0.4);
  }

  &:active {
    transform: scale(0.96);
  }
}
.form-control {
  border-radius: 12px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2ea3f2;
    box-shadow: 0 0 8px rgba(46, 163, 242, 0.4);
    transform: scale(1.01);
  }
}

.bg-gradient {
  background: linear-gradient(135deg, #0d6efd, #6610f2);
}

/* === Champs modernes avec floating label === */
.floating-label {
  position: relative;
}

.form-control.form-control-modern {
  border-radius: 12px;
  border: 2px solid #e0e7ff;
  padding: 0.9rem 1rem;
  width: 100%;
  transition: all 0.3s ease;
  background: #fff;
}

.form-control.form-control-modern:focus {
  border-color: #10d0f2;
  box-shadow: 0 0 8px rgba(102, 16, 242, 0.25);
  transform: scale(1.01);
}

/* Labels flottants */
.floating-label label {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1rem;
  transition: all 0.3s ease;
  pointer-events: none;
  background: white;
  padding: 0 5px;
}

.form-control-modern:focus + label,
.form-control-modern:not(:placeholder-shown) + label {
  top: -10px;
  left: 10px;
  font-size: 0.8rem;
  color: #10d0f2;
}
</style>
