<template>
  <div style="height: auto">
    <h3 class="mb-4 text-success fw-bold">Ajouter vos groupes des questions</h3>
    <BButton
      variant="success"
      class="px-4 py-2 rounded-3 shadow-sm mb-3"
      @click="AddFormData"
      type="button"
    >
      ➕ Ajouter un groupe
    </BButton>
    <q-inner-loading v-if="loading" :showing="loading" background-color="rgba(0,0,0,0.4)">
      <q-spinner-bars color="green" size="50px" />
    </q-inner-loading>

    <!-- Liste des groupes -->
    <div v-else v-for="(field, index) in fields" :key="field.id" class="mb-4">
      <BCard class="shadow-sm rounded-3 border-0">
        <BCardBody>
          <BRow>
            <!-- Titre -->
            <BCol lg="4" class="mb-3 floating-label">
              <input
                type="text"
                v-model="field.title"
                class="form-control form-control-modern"
                placeholder=" "
              />
              <label>Titre du groupe de questions</label>
            </BCol>

            <!-- Description -->
            <BCol lg="7" class="mb-3 floating-label">
              <textarea
                v-model="field.description"
                class="form-control form-control-modern"
                rows="3"
                placeholder=" "
              ></textarea>
              <label>Description du groupe</label>
            </BCol>

            <!-- Supprimer -->
            <BCol lg="1" class="d-flex justify-content-end align-self-center">
              <BButton variant="danger" class="px-3 py-2 rounded-3" @click="deleteRow(index)">
                🗑
              </BButton>
            </BCol>
          </BRow>
        </BCardBody>
      </BCard>
    </div>

    <!-- Navigation -->
    <div class="d-flex justify-content-end justify-content-md-between mt-4">
      <BButton
        variant="outline-secondary"
        class="px-5 rounded-3 shadow-sm"
        @click="$emit('onBack')"
      >
        ← Retour
      </BButton>
      <q-spinner-dots v-if="loadings" color="green" size="20px" class="q-mr-sm" />
      <BButton v-else variant="success" class="px-5 rounded-3 shadow-sm ms-2" @click="handleNext">
        Suivant →
      </BButton>
    </div>
  </div>
</template>
<script>
import { BButton, BCol, BRow, BCardBody, BCard } from 'bootstrap-vue-next'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth'
import { useRegisterStore } from 'src/stores/useRegisterStore'
import { getCurrentInstance, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
export default {
  components: {
    BButton,
    BCol,
    BRow,
    BCardBody,
    BCard,
  },
  emits: ['onBack', 'onNext'],
  setup() {
    const fields = ref([])
    const add = ref([])
    const originalFields = ref([])
    const authStore = useAuthStore()
    const { emit } = getCurrentInstance()
    const store = useRegisterStore()
    const loading = ref(false)
    const loadings = ref(false)
    const route = useRoute()
    let idCounter = 1
    const AddFormData = () => {
      fields.value.push({
        id: idCounter++,
        title: '',
        description: '',
        isNew: true,
      })
    }
    const getz = async () => {
      try {
        loading.value = true
        const id = route.params.id
        const sch = await api.get(`/admin/surveys`)
        const surveys = sch.data.find((s) => s.slug === id)
        store.idsurvey = surveys.id
        const response = await api.get(`/surveys/${store.idsurvey}/question-groups`)
        response.data.map((group) => {
          const fieldData = {
            id: group.id,
            title: group.title,
            description: group.description,
            isNew: false,
          }
          fields.value.push({ ...fieldData })
          originalFields.value.push({ ...fieldData })
        })
      } catch (error) {
        console.error('Error fetching question groups:', error)
        Notify.create({
          type: 'negative',
          message: 'Erreur lors de la récupération des groupes de questions.',
        })
      } finally {
        loading.value = false
      }
    }
    const deleteRow = async (index) => {
      if (fields.value[index].title !== '') {
        const role = authStore.roles[0]
        if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          api
            .delete(`/surveys/${store.idsurvey}/question-groups/${fields.value[index].id}`)
            .then(() => {
              Notify.create({
                type: 'success',
                message: 'Question groupe supprimmer avec success.',
              })
            })
            .catch((error) => {
              console.error('Error deleting question group:', error)
            })
          const response = await api.get('/business/dashboard/overview') // récupère le sondage mis à jour
          store.setSurveyData(response.data.surveys.find((s) => s.id === store.idsurvey))
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          api
            .delete(`/admin/surveys/${store.idsurvey}/question-groups/${fields.value[index].id}`)
            .then(() => {
              Notify.create({
                type: 'success',
                message: 'Question groupe supprimmer avec success.',
              })
            })
            .catch((error) => {
              console.error('Error deleting question group:', error)
            })
          const response = await api.get('/admin/dashboard/overview') // récupère le sondage mis à jour
          store.setSurveyData(response.data.surveys.find((s) => s.id === store.idsurvey))
        }

        fields.value.splice(index, 1)
      } else {
        fields.value.splice(index, 1)
      }
    }

    const Add = async () => {
      if (!store.idsurvey) {
        Notify.create({
          type: 'negative',
          message: 'Créer votre sondage.',
        })
        return
      }
      if (fields.value.length === 0) {
        Notify.create({
          type: 'negative',
          message: 'Veuillez ajouter au moins un groupe de question.',
        })
        return false
      }
      const newItems = fields.value.filter((field) => field.isNew == true && field.title !== '')
      const updates = fields.value.filter((field) => {
        if (field.isNew == true || field.title === '') return false
        const original = originalFields.value.find((f) => f.id === field.id)
        return (
          !original || field.title !== original.title || field.description !== original.description
        )
      })
      if (newItems.length === 0 && updates.length === 0) {
        return true // ✅ Rien à enregistrer, on autorise next
      }
      add.value = []
      newItems.map((field) => {
        add.value.push({
          title: field.title,
          description: field.description,
        })
      })

      if (add.value.length > 0) {
        try {
          loadings.value = true
          const role = authStore.roles[0]
          if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
            await api.post(`/surveys/${store.idsurvey}/question-groups`, {
              groups: add.value,
            })
            const response = await api.get('/business/dashboard/overview') // récupère le sondage mis à jour
            store.setSurveyData(response.data.surveys.find((s) => s.id === store.idsurvey))
            Notify.create({
              type: 'positive',
              message: 'Opération effectuée avec succès !',
              timeout: 5000, // durée en ms
            })
          } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
            await api.post(`/admin/surveys/${store.idsurvey}/question-groups`, {
              groups: add.value,
            })
            const response = await api.get('/admin/dashboard/overview') // récupère le sondage mis à jour
            store.setSurveyData(response.data.surveys.find((s) => s.id === store.idsurvey))
            Notify.create({
              type: 'positive',
              message: 'Opération effectuée avec succès !',
              timeout: 5000, // durée en ms
            })
          }
        } catch (error) {
          console.error('Erreur POST:', error)
        } finally {
          loadings.value = false
        }
      }

      for (const field of updates) {
        try {
          loadings.value = true
          const role = authStore.roles[0]
          if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
            await api.put(`/surveys/${store.idsurvey}/question-groups/${field.id}`, {
              title: field.title,
              description: field.description,
            })
            const response = await api.get('/business/dashboard/overview') // récupère le sondage mis à jour
            store.setSurveyData(response.data.surveys.find((s) => s.id === store.idsurvey))
          } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
            await api.put(`/admin/surveys/${store.idsurvey}/question-groups/${field.id}`, {
              title: field.title,
              description: field.description,
            })
            const response = await api.get('/admin/dashboard/overview') // récupère le sondage mis à jour
            store.setSurveyData(response.data.surveys.find((s) => s.id === store.idsurvey))
          }
          Notify.create({
            type: 'positive',
            message: 'Opération effectuée avec succès !',
            timeout: 5000, // durée en ms
          })
        } catch (error) {
          Notify.create(
            {
              type: 'negative',
              message: 'une erreur est survenue',
            },
            5000,
          )
          console.error(`Erreur PUT id=${field.id}:`, error)
        } finally {
          loadings.value = false
        }
      }
      emit('refreshGroups')
      await getz()
      return true
    }
    const handleNext = async () => {
      const result = await Add()
      if (result) {
        emit('onNext')
      }
    }
    onMounted(async () => {
      await getz()

      AddFormData()
    })
    return {
      handleNext,
      Add,
      AddFormData,
      deleteRow,
      fields,
      idCounter,
    }
  },
}
</script>
<style scoped>
.btn-primary {
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
.floating-label {
  position: relative;

  input,
  textarea,
  .form-control-modern,
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
