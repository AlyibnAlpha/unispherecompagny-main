<template>
  <q-card class="shadow-lg rounded-3" style="max-width: 800px; margin: auto" bordered>
    <!-- Titre -->
    <q-card-section
      class="q-pa-md flex items-center justify-center"
      style="
        background: linear-gradient(135deg, #f0f4ff, #e0f7fa);
        transition: background 0.5s ease;
        color: #10d0f2;
      "
    >
      <div class="text-h5 text-center text-weight-bold">Créer Votre Sondage de Bienvenue</div>
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
              v-model="form.welcomeBonusPoints"
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
        <!-- Dates -->

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
import { getCurrentInstance, ref } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'
import { api } from 'src/boot/axios'
import { Notify } from 'quasar'
import { useRegisterStore } from 'src/stores/useRegisterStore'
export default {
  components: {
    BButton,
    BCol,
    BRow,
    Multiselect,
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
    const originalForm = ref({})
    const form = ref({
      title: '',
      description: '',
      supportedLanguages: '',
      welcomeBonusPoints: '',
      status: 'draft',
      displayOrder: '',
      isPublished: false,
    })

    const formule = async () => {
      try {
        loadings.value = true
        if (
          !form.value.title ||
          !form.value.description ||
          levals.value.length === 0 ||
          !form.value.displayOrder ||
          !form.value.welcomeBonusPoints
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

        if (!store.idsurveyw) {
          form.value.supportedLanguages = levals.value
          const response = await api.post('/admin/welcome-surveys', form.value)
          store.setIdSurveyw(response.data.id)

          Notify.create({
            type: 'positive',
            message: 'Opération effectuée avec succès !',
            timeout: 5000, // durée en ms
          })
          const responseS = await api.get('/admin/welcome-surveys')
          store.setSurveyDataw(responseS.data.find((s) => s.id === store.idsurveyw))
          emit('refreshTable')
        } else {
          form.value.supportedLanguages = levals.value
          await api.put(`/admin/welcome-surveys/${form.value.id}`, {
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
        const response = await api.get('/admin/welcome-surveys')
        store.setSurveyDataw(response.data.find((s) => s.id === store.idsurveyw))
        emit('refreshTable')
        originalForm.value = JSON.parse(JSON.stringify(form.value))
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

    return {
      form,
      optionl,
      handleNext,
      levals,
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
