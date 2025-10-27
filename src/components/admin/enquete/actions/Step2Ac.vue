<template>
  <div class="step-form-container">
    <!-- Bouton d'action -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <p class="text-muted mb-0" style="font-size: 0.9375rem;">Organisez vos questions par thématiques</p>
      <BButton
        class="btn-modern btn-success-modern"
        @click="AddFormData"
        type="button"
      >
        <i class="bi bi-plus-circle me-2"></i>
        Ajouter un groupe
      </BButton>
    </div>

    <q-inner-loading v-if="loading" :showing="loading" background-color="rgba(0,0,0,0.4)">
      <q-spinner-bars color="green" size="50px" />
    </q-inner-loading>

    <!-- Liste des groupes -->
    <div v-else>
      <div v-if="fields.length === 0" class="empty-state">
        <i class="bi bi-inbox" style="font-size: 3rem; color: #cbd5e1;"></i>
        <p class="mt-3 text-muted">Aucun groupe ajouté. Cliquez sur "Ajouter un groupe" pour commencer.</p>
      </div>

      <div v-for="(field, index) in fields" :key="index" class="group-card mb-3">
        <div class="group-card-header">
          <div class="group-number">
            <i class="bi bi-folder2-open"></i>
            <span>Groupe {{ index + 1 }}</span>
          </div>
          <BButton 
            class="btn-delete" 
            @click="deleteRow(index)"
            title="Supprimer ce groupe"
          >
            <i class="bi bi-trash"></i>
          </BButton>
        </div>
        <div class="group-card-body">
          <BRow>
            <!-- Titre -->
            <BCol lg="5" class="mb-3 floating-label">
              <input
                type="text"
                v-model="field.title"
                class="form-control form-control-modern"
                placeholder=" "
              />
              <label>Titre du groupe</label>
            </BCol>

            <!-- Description -->
            <BCol lg="7" class="mb-3 floating-label">
              <textarea
                v-model="field.description"
                class="form-control form-control-modern"
                rows="2"
                placeholder=" "
              ></textarea>
              <label>Description du groupe</label>
            </BCol>
          </BRow>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="d-flex justify-content-end justify-content-md-between mt-4">
      <BButton
        class="btn-modern btn-secondary-modern"
        @click="$emit('onBack')"
      >
        ← Retour
      </BButton>

      <q-spinner-dots v-if="loadings" color="green" size="20px" class="q-mr-sm" />

      <BButton v-else class="btn-modern btn-success-modern ms-2" @click="handleNext">
        Suivant →
      </BButton>
    </div>
  </div>
</template>

<script>
import { BButton, BCol, BRow } from 'bootstrap-vue-next'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth'
import { useRegisterStore } from 'src/stores/useRegisterStore'
import { getCurrentInstance, onMounted, ref } from 'vue'
export default {
  components: {
    BButton,
    BCol,
    BRow,
  },
  emits: ['onBack', 'onNext'],
  setup() {
    const fields = ref([])
    const add = ref([])
    const originalFields = ref([])
    const { emit } = getCurrentInstance()
    const store = useRegisterStore()
    const loadings = ref(false)
    const authStore = useAuthStore()
    const loading = ref(false)
    let idCounter = 1
    const AddFormData = () => {
      fields.value.push({
        id: idCounter,
        title: '',
        description: '',
        isNew: true,
      })
    }
    const getz = async () => {
      try {
        const response = await api.get(`/surveys/${store.idsurvey}/question-groups`)
        if (response.data.length == 0) {
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
        } else {
          fields.value = [
            {
              id: 1,
              title: '',
              description: '',
            },
          ]
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des groupes de questions:', error)
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
      loadings.value = true
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
      loadings.value = true
      const newItems = fields.value.filter((field) => field.isNew && field.title !== '')
      const updates = fields.value.filter(
        (f) =>
          !f.isNew &&
          f.title !== '' &&
          (f.title !== originalFields.value.find((o) => o.id === f.id)?.title ||
            f.description !== originalFields.value.find((o) => o.id === f.id)?.description),
      )
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
          Notify.create(
            {
              type: 'negative',
              message: 'une erreur est survenue',
            },
            5000,
          )
          console.error('Erreur POST:', error)
        } finally {
          loadings.value = false
        }
      }

      for (const field of updates) {
        try {
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
      const success = await Add()
      if (success !== false) {
        emit('onNext')
      }
      // bien sûr tu dois recevoir `emit` de setup
    }
    onMounted(async () => {
      await getz()
      fields.value
      AddFormData()
    })
    return {
      loadings,
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

<style scoped lang="scss">
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #cbd5e1;
}

.group-card {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .group-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    border-bottom: 2px solid #e2e8f0;

    .group-number {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 600;
      color: #475569;
      font-size: 1rem;

      i {
        font-size: 1.25rem;
        color: #667eea;
      }
    }

    .btn-delete {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: #fee2e2;
      border: none;
      color: #dc2626;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #fecaca;
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }

      i {
        font-size: 1rem;
      }
    }
  }

  .group-card-body {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;

    .btn-modern {
      width: 100%;
    }
  }

  .group-card-header {
    .group-number {
      font-size: 0.875rem;
    }
  }
}
</style>
