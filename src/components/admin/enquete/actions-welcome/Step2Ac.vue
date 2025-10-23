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
    <div v-else v-for="(field, index) in fields" :key="index" class="mb-4">
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
              <label>Titre du groupe</label>
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
import { BButton, BCol, BRow, BCard, BCardBody } from 'bootstrap-vue-next'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { useRegisterStore } from 'src/stores/useRegisterStore'
import { getCurrentInstance, onMounted, ref } from 'vue'
export default {
  components: {
    BButton,
    BCol,
    BRow,
    BCard,
    BCardBody,
  },
  emits: ['onBack', 'onNext'],
  setup() {
    const fields = ref([])
    const add = ref([])
    const originalFields = ref([])
    const { emit } = getCurrentInstance()
    const store = useRegisterStore()
    const loadings = ref(false)
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
        const response = await api.get(`/admin/welcome-surveys/${store.idsurveyw}/question-groups`)
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
        api
          .delete(
            `/admin/welcome-surveys/${store.idsurveyw}/question-groups/${fields.value[index].id}`,
          )
          .then(() => {
            Notify.create({
              type: 'success',
              message: 'Question groupe supprimmer avec success.',
            })
          })
          .catch((error) => {
            console.error('Error deleting question group:', error)
          })
        const response = await api.get('/admin/welcome-surveys') // récupère le sondage mis à jour
        store.setSurveyDataw(response.data.find((s) => s.id === store.idsurveyw))

        fields.value.splice(index, 1)
      } else {
        fields.value.splice(index, 1)
      }
    }

    const Add = async () => {
      loadings.value = true
      if (!store.idsurveyw) {
        Notify.create({
          type: 'negative',
          message: 'Créer votre sondage de bienvenue.',
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
          await api.post(`/admin/welcome-surveys/${store.idsurveyw}/question-groups`, {
            groups: add.value,
          })
          const response = await api.get('/admin/welcome-surveys') // récupère le sondage mis à jour
          store.setSurveyDataw(response.data.find((s) => s.id === store.idsurveyw))
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
          console.error('Erreur POST:', error)
        } finally {
          loadings.value = false
        }
      }

      for (const field of updates) {
        try {
          await api.put(`/admin/welcome-surveys/${store.idsurveyw}/question-groups/${field.id}`, {
            title: field.title,
            description: field.description,
          })
          const response = await api.get('/admin/welcome-surveys') // récupère le sondage mis à jour
          store.setSurveyDataw(response.data.find((s) => s.id === store.idsurveyw))

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
