<template>
  <BRow style="height: auto">
    <BCol cols="12" class="mb-3">
      <h3 class="mb-4 text-success fw-bold">
        Ajouter votre question par rapport aux groupes de question
      </h3>
    </BCol>
    <q-inner-loading v-if="loading" :showing="loading" background-color="rgba(0,0,0,0.4)">
      <q-spinner-bars color="green" size="50px" />
    </q-inner-loading>

    <BCol v-else cols="12">
      <BRow v-for="(field, index) in fields" :key="field.id" class="mb-4">
        <!-- Carte pour chaque question -->
        <BCard class="shadow-sm rounded-3 border-1 w-100">
          <BCardHeader class="bg-light d-flex justify-content-between align-items-center">
            <h6 class="mb-0">Question {{ index + 1 }}</h6>
            <div>
              <BButton size="sm" class="btn-success me-1 rounded-circle" @click="AddFormData">
                <i class="bi bi-file-earmark-plus"></i>
              </BButton>
              <BButton size="sm" class="btn-danger rounded-circle" @click="deleteRow(index)">
                <i class="bi bi-file-earmark-minus"></i>
              </BButton>
            </div>
          </BCardHeader>

          <BCardBody>
            <!-- Sélection du groupe -->

            <BFormGroup class="form-group mb-3 floating-label">
              <Multiselect
                square
                outlined
                v-model="field.group"
                :options="optionl2"
                placeholder=" "
                class="form-control-modern"
              />
              <label>Choisir le groupe de question</label>
            </BFormGroup>

            <!-- Titre -->
            <BFormGroup class="form-group mb-3 floating-label">
              <BFormInput v-model="field.title" placeholder=" " class="form-control-modern" />
              <label>Titre de la question</label>
            </BFormGroup>

            <!-- Description -->
            <BFormGroup class="form-group mb-3 floating-label">
              <BFormTextarea
                v-model="field.description"
                placeholder=" "
                class="form-control-modern"
                rows="3"
              />
              <label>Description de la question</label>
            </BFormGroup>

            <!-- Position -->
            <BFormGroup class="form-group mb-3 floating-label">
              <BFormInput
                type="number"
                v-model="field.position"
                placeholder=" "
                class="form-control-modern"
              />
              <label>Position de la question</label>
            </BFormGroup>

            <!-- Type de réponses -->
            <BFormGroup class="form-group mb-3 floating-label">
              <Multiselect
                square
                outlined
                v-model="field.type"
                :options="options"
                placeholder=" "
                class="form-control-modern"
              />
              <label>Type de réponses</label>
            </BFormGroup>

            <!-- Options de réponses -->
            <div v-if="field.type === 'single_choice' || field.type === 'multiple_choice'">
              <label class="form-label">Options de réponses</label>
              <BListGroup flush>
                <BListGroupItem
                  v-for="(option, idx) in field.choices"
                  :key="option.id"
                  class="d-flex justify-content-between align-items-center gap-2"
                >
                  <BFormInput
                    v-model="option.value"
                    placeholder="Option de réponse"
                    class="form-control-modern"
                  />
                  <div class="d-flex align-items-center gap-2">
                    <BButton size="sm" class="btn-success me-1" @click="AddFormDataM(index)">
                      <i class="bi bi-file-earmark-plus"></i>
                    </BButton>
                    <BButton size="sm" class="btn-danger" @click="deleteRow2(index, idx)">
                      <i class="bi bi-file-earmark-minus"></i>
                    </BButton>
                  </div>
                </BListGroupItem>
              </BListGroup>
            </div>
            <div class="form-check form-switch mb-4 gap-2 d-flex align-items-center">
              <input
                class="form-check-input"
                type="checkbox"
                id="publishCheck"
                v-model="field.is_required"
                style="width: 50px; height: 25px"
              />
              <label class="form-check-label fw-semibold" for="publishCheck"> Obligatoire </label>
            </div>
          </BCardBody>
        </BCard>
      </BRow>
    </BCol>

    <!-- Navigation -->
    <div class="d-flex justify-content-between mt-4 w-100">
      <BButton
        variant="outline-secondary"
        class="px-4 rounded-3 shadow-sm"
        @click="$emit('onBack')"
      >
        ⬅ Retour
      </BButton>
      <q-spinner-dots v-if="loadings" color="green" size="20px" class="q-mr-sm" />
      <BButton v-else class="btn-success px-4 rounded-3 shadow-sm" @click="handleNext">
        Suivant ➡
      </BButton>
    </div>
  </BRow>
</template>

<script>
import {
  BButton,
  BCol,
  BRow,
  BCard,
  BCardBody,
  BCardHeader,
  BFormGroup,
  BListGroupItem,
  BListGroup,
  BFormTextarea,
  BFormInput,
} from 'bootstrap-vue-next'
import { useRegisterStore } from 'src/stores/useRegisterStore'
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { api } from 'src/boot/axios'
import Multiselect from '@vueform/multiselect'
import { Notify } from 'quasar'
export default {
  props: {
    refreshTrigger: Number,
  },
  components: {
    BButton,
    BCol,
    BRow,
    BCard,
    Multiselect,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BListGroup,
    BListGroupItem,
    BCardBody,
    BCardHeader,
  },
  emits: ['onBack', 'onNext'],
  setup(props) {
    let idCounter = 1
    let idCounterch = 1
    const fields = ref([
      {
        id: idCounter,
        title: '',
        description: '',
        group: null,
        type: null,
        position: 0,
        is_required: false,
        choices: [{ id: 1, label: '', value: '' }],
        isNew: true,
      },
    ])
    const originalFields = ref([])
    const add = ref([])
    const store = useRegisterStore()
    const { emit } = getCurrentInstance()
    const loading = ref(false)
    const loadings = ref(false)
    const optionl2 = ref([])
    const options = [
      {
        label: 'à une choix',
        value: 'single_choice',
      },
      {
        label: 'par texte',
        value: 'text',
      },
      {
        label: 'par choix multiple',
        value: 'multiple_choice',
      },
      {
        label: 'par selection de fichier',
        value: 'file',
      },
    ]

    const AddFormData = () => {
      if (!Array.isArray(fields.value)) {
        fields.value = [] // Réinitialiser proprement
      }

      fields.value.push({
        id: idCounter++,

        title: '',
        description: '',
        group: null,
        type: null,
        position: 0,
        is_required: false,
        choices: [{ id: 1, label: '', value: '' }],
        isNew: true,
      })
    }
    const AddFormDataM = (index) => {
      const field = fields.value[index]
      if (!field) {
        console.error(`Aucun champ à l'index ${index}`)
        return
      }

      if (!field.choices) {
        field.choices = []
      }

      field.choices.push({
        id: idCounterch++,
        label: '',
        value: '',
        isNew: true,
      })
    }
    const deleteRow2 = async (index, indexs) => {
      if (fields.value[index].choices.length > 1) {
        if (fields.value[index].choices[indexs].label !== '') {
          await api
            .delete(
              `/admin/welcome-surveys/${store.idsurveyw}/question-groups/${fields.value[index].group.id}/choices/${fields.value[index].choices[indexs].id}`,
            )
            .then(() => {
              console.log('Choice deleted successfully')
            })
            .catch((error) => {
              console.error('Error deleting choice:', error)
            })
        }
        fields.value[index].choices.splice(indexs, 1)
        const response = await api.get('/admin/welcome-surveys') // récupère le sondage mis à jour
        store.setSurveyDataw(response.data.find((s) => s.id === store.idsurveyw))
      } else {
        fields.value[index].choices = [{ id: 1, label: '', value: '' }]
      }
    }

    const getss = async () => {
      try {
        loading.value = true
        optionl2.value = []
        const response = await api.get(`/admin/welcome-surveys/${store.idsurveyw}/question-groups`)
        response.data.map((group) => {
          const fieldData = {
            value: group.id,
            label: group.title,
          }
          optionl2.value.push({ ...fieldData })
        })
      } catch (error) {
        console.error('Erreur lors de la récupération des groupes de questions:', error)
      } finally {
        loading.value = false
      }
    }
    const getz = async () => {
      try {
        loading.value = true
        originalFields.value = []

        // Pour chaque group.id, on récupère les questions et les ajoute à originalFields
        for (const option of optionl2.value) {
          const groupId = option.value
          try {
            const response = await api.get(
              `/admin/welcome-surveys/${store.idsurveyw}/question-groups/${groupId}/questions`,
            )
            const questions = response.data.map((question) => ({
              id: question.id,
              title: question.title,
              description: question.description,
              group: parseInt(question.questionGroups.id),
              type: question.type,
              position: question.position,
              is_required: question.is_required,
              choices: question.choices || [{ id: 1, label: '', value: '', isNew: true }],
              isNew: false,
            }))
            originalFields.value.push(...questions)
          } catch (error) {
            console.error(
              `Erreur lors de la récupération des questions du groupe ${groupId}:`,
              error,
            )
          }
        }

        // Mettre à jour fields si nécessaire
        if (originalFields.value.length !== 0) {
          fields.value = JSON.parse(JSON.stringify(originalFields.value))
        } else {
          fields.value = {
            id: 1,
            title: '',
            description: '',
            group: null,
            type: null,
            position: 0,
            is_required: false,
            choices: [{ id: 1, label: '', value: '' }],
            isNew: true,
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des groupes de questions:', error)
      } finally {
        loading.value = false
      }
    }
    const deleteRow = async (index) => {
      if (fields.value[index].title !== '') {
        await api
          .delete(
            `/admin/welcome-surveys/${store.idsurveyw}/question-groups/${fields.value[index].group.id}/questions/${index}`,
          )
          .then(() => {
            Notify.create({
              type: 'success',
              message: 'Question supprimmer avec success.',
            })
          })

          .catch((error) => {
            console.error('Error deleting question group:', error)
          })
        fields.value.splice(index, 1)
        const response = await api.get('/admin/welcome-surveys') // récupère le sondage mis à jour
        store.setSurveyDataw(response.data.find((s) => s.id === store.idsurveyw))
      } else {
        fields.value.splice(index, 1)
      }
    }
    const Add = async () => {
      if (fields.value.length === 0) {
        Notify.create({
          type: 'negative',
          message: 'Veuillez ajouter au moins une question.',
        })
        return false
      }
      const data = fields.value.map((field) => ({
        id: field.id,
        title: field.title,
        description: field.description,
        type: field.type,
        group: field.group,
        position: field.position,
        is_required: field.is_required,
        choices: field.choices.map((choice) => ({
          label: choice.value,
          value: choice.value,
          isNew: choice.isNew,
        })),
        isNew: field.isNew,
      }))
      const newItems = data.filter((field) => field.title !== '' && field.isNew == true)
      const updates = data.filter((field) => {
        if (field.isNew == true || field.title === '') return false
        const original = originalFields.value.find((f) => f.id === field.id)
        return (
          !original ||
          field.title !== original.title ||
          field.description !== original.description ||
          field.type !== original.type ||
          field.position !== original.position ||
          field.is_required !== original.is_required ||
          field.group !== original.group ||
          JSON.stringify(field.choices) !== JSON.stringify(original.choices)
        )
      })
      if (newItems.length === 0 && updates.length === 0) {
        return true
      }
      add.value = []
      newItems.map((item) => {
        add.value.push({
          title: item.title,
          description: item.description,
          type: item.type,
          group: item.group,
          position: item.position,
          is_required: item.is_required,
          choices: item.choices.map((choice) => ({
            label: choice.value,
            value: choice.value,
          })),
        })
        item.isNew = false // Marquer comme non nouveau après l'ajout
      })

      if (add.value.length > 0) {
        try {
          loadings.value = true

          for (const t of add.value) {
            await api.post(
              `/admin/welcome-surveys/${store.idsurvey}/question-groups/${t.group}/questions`,
              {
                title: t.title,
                description: t.description,
                type: t.type,
                position: t.position,
                is_required: t.is_required,
                choices: t.choices.map((choice) => ({
                  label: choice.value,
                  value: choice.value,
                })),
              },
            )
          }
          const response = await api.get('/admin/welcome-surveys')
          store.setSurveyDataw(response.data.find((s) => s.id === store.idsurveyw))
        } catch (error) {
          console.error('Erreur POST:', error)
        } finally {
          loadings.value = false
        }
      }

      for (const t of updates) {
        try {
          loadings.value = true
          await api.put(
            `/admin/welcome-surveys/${store.idsurvey}/question-groups/${t.group}/questions/${t.id}`,
            {
              title: t.title,
              description: t.description,
              type: t.type,
              position: t.position,
              is_required: t.is_required,
              choices: t.choices.map((choice) => ({
                label: choice.value,
                value: choice.value,
              })),
            },
          )
        } catch (error) {
          Notify.create(
            {
              type: 'negative',
              message: 'une erreur est survenue',
            },
            5000,
          )
          console.error(`Erreur PUT id=${t.id}:`, error)
        } finally {
          loadings.value = false
        }
      }
      const response = await api.get('/admin/welcome-surveys')
      store.setSurveyDataw(response.data.find((s) => s.id === store.idsurveyw))
      Notify.create({
        type: 'positive',
        message: 'Opération effectuée avec succès !',
        timeout: 5000, // durée en ms
      })
      await getz()
      return true
    }
    const handleNext = async () => {
      const result = await Add()
      if (result) {
        emit('onNext')
      }
    }

    watch(
      () => props.refreshTrigger,
      async () => {
        await getss() // ta fonction de refresh interne
      },
    )

    onMounted(async () => {
      await getss()
      await getz()
      AddFormData()
    })
    return {
      handleNext,
      Add,
      AddFormData,
      deleteRow,
      AddFormDataM,
      deleteRow2,
      fields,
      idCounter,
      optionl2,
      options,
      originalFields,
      add,
      loading,
      loadings,
    }
  },
}
</script>
<style scoped>
.btn-success {
  background: linear-gradient(135deg, #34c38f, #2ea3f2);
  border: none;
  border-radius: 50px;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(46, 163, 242, 0.3);
}

.btn-success:hover {
  background: linear-gradient(135deg, #2ea3f2, #34c38f);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(46, 163, 242, 0.4);
}

.btn-success:active {
  transform: scale(0.96);
}

.btn-danger {
  background: #ff6b6b;
  border: none;
  color: white;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background: #ff4c4c;
  transform: translateY(-2px);
}

.btn-danger:active {
  transform: scale(0.96);
}

.form-control-modern {
  margin-top: 15px;
  border-radius: 12px;
  border: 2px solid #e0e7ff;
  padding: 0.9rem 1rem;
  width: 100%;
  transition: all 0.3s ease;
  background: #fff;
}

.form-control-modern:focus {
  border-color: #10d0f2;
  box-shadow: 0 0 8px rgba(102, 16, 242, 0.25);
  transform: scale(1.01);
}

.floating-label {
  position: relative;
}

.floating-label label {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1rem;
  transition: all 0.3s ease;
  pointer-events: none;
  background: #fff;
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
