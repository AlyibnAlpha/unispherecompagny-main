<template>
  <q-card class="shadow-lg rounded-3" style="height: auto" bordered>
    <!-- Titre -->
    <q-card-section
      class="q-pa-md flex items-center justify-center"
      style="
        background: linear-gradient(135deg, #f0f4ff, #e0f7fa);
        transition: background 0.5s ease;
        color: #10d0f2;
      "
    >
      <div class="text-h5 text-center text-weight-bold">Créer Votre Sondage</div>
    </q-card-section>

    <!-- Formulaire -->
    <q-card-section class="q-pa-lg">
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
        <BRow class="mb-4">
          <BCol cols="6" class="floating-label">
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
          <BCol cols="6" class="floating-label">
            <input
              id="points"
              v-model="form.bonusPoints"
              type="number"
              class="form-control form-control-modern"
              placeholder=" "
            />
            <label for="points">Points de bonus</label>
          </BCol>
        </BRow>

        <BRow class="mb-4">
          <BCol md="12" class="floating-label">
            <input
              id="orde"
              v-model="form.displayOrder"
              type="number"
              class="form-control form-control-modern"
              placeholder=" "
            />
            <label for="orde">Ordre d'affichage</label>
          </BCol>
        </BRow>

        <!-- Bouton Suivant -->
        <div v-if="loadings" class="d-flex justify-content-end mt-4">
          <q-spinner-dots color="green" size="20px" class="q-mr-sm" />
        </div>
        <div v-else class="d-flex justify-content-end mt-4">
          <BButton variant="success" size="lg" class="px-5 rounded-3 shadow-sm" @click="handleNext">
            Suivant →
          </BButton>
        </div>
      </BForm>
    </q-card-section>
  </q-card>
</template>
<script>
import { BButton, BCol, BRow } from 'bootstrap-vue-next'
import Multiselect from '@vueform/multiselect'
import { getCurrentInstance, onMounted, ref } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'
import { api } from 'src/boot/axios'
import { Notify } from 'quasar'
import { useRegisterStore } from 'src/stores/useRegisterStore'
import { useRoute } from 'vue-router'
export default {
  components: {
    BButton,
    BCol,
    BRow,
    Multiselect,
  },
  emits: ['onNext'],
  setup() {
    const optionl = [
      { label: 'Français', value: 'FR' },
      { label: 'English', value: 'EN' },
      { label: 'Español', value: 'ES' },
      { label: 'Italiano', value: 'IT' },
      { label: 'Português', value: 'PT' },
    ]
    const { emit } = getCurrentInstance()
    const levals = ref([])
    const store = useRegisterStore()
    const categories = ref([])
    const loading = ref(false)
    const loadings = ref(false)
    const route = useRoute()
    const originalForm = ref({})
    const optionl3 = [
      { label: 'Public', value: 'PUBLIC' },
      { label: 'Business', value: 'BUSINESS' },
    ]
    const form = ref({
      title: '',
      description: '',
      supportedLanguages: '',
      status: 'draft',
      displayOrder: '',
      bonusPoints: '',
      isPublished: false,
    })

    const gets = async () => {
      try {
        const id = route.params.id

        const response = await api.get('/admin/welcome-surveys')
        const survey = response.data.find((s) => s.slug === id)
        levals.value = survey.supportedLanguages
        form.value = {
          id: survey.id,
          title: survey.title,
          description: survey.description,
          supportedLanguages: survey.supportedLanguages,
          displayOrder: survey.displayOrder,
          bonusPoints: survey.bonusPoints,
          isPublished: survey.isPublished,
        }
        originalForm.value = JSON.parse(JSON.stringify(form.value))
      } catch (error) {
        console.error('Status:', error.response?.status)
        console.error('Headers:', error.response?.headers)
        console.error('er:', error.response?.data.message)
      } finally {
        loading.value = false
      }
    }
    const formule = async () => {
      try {
        loadings.value = true
        form.value.supportedLanguages = levals.value
        const hasChanged = JSON.stringify(form.value) !== JSON.stringify(originalForm.value)
        if (!hasChanged) {
          return true // On laisse passer pour "Suivant →"
        }
        const responses = await api.put(`/admin/welcome-surveys/${form.value.id}`, {
          title: form.value.title,
          description: form.value.description,
          supportedLanguages: form.value.supportedLanguages,
          isPublished: form.value.isPublished,
          bonusPoints: form.value.bonusPoints,
          displayOrder: form.value.displayOrder,
        })
        Notify.create({
          type: 'positive',
          message: 'Opération effectuée avec succès !',
          timeout: 5000, // durée en ms
        })
        store.setIdSurveyw(responses.data.id)

        emit('refreshTable')
        const response = await api.get('/admin/welcome-surveys')
        store.setSurveyDataw(response.data.find((s) => s.id === store.idsurveyw))
        originalForm.value = JSON.parse(JSON.stringify(form.value))
        return true
      } catch (error) {
        console.error('Status:', error)
        console.error('Headers:', error.response?.headers)
        console.error('er:', error.response?.data.message)

        Notify.create(
          {
            type: 'negative',
            message: error.response?.data.message || 'une erreur est survenue',
          },
          5000,
        )
      } finally {
        loadings.value = false
      }
    }
    onMounted(() => {
      gets()
    })
    const handleNext = async () => {
      const success = await formule()
      if (success) {
        emit('onNext')
      }
    }
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
/* Floating labels modernes */
.floating-label {
  position: relative;

  input,
  textarea,
  .form-control.form-control-modern,
  .multiselect {
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  label {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    transition: all 0.2s ease;
    color: #6c757d;
    pointer-events: none;
  }

  input:focus + label,
  input:not(:placeholder-shown) + label,
  textarea:focus + label,
  textarea:not(:placeholder-shown) + label,
  .multiselect:focus + label,
  .multiselect:not(:empty) + label {
    top: -10px;
    font-size: 0.8rem;
    color: #10d0f2;
    background: white;
    padding: 0 5px;
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
</style>
