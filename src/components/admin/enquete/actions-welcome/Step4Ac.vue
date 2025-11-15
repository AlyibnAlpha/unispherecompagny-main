<template>
  <div class="step-form-container">
    <p class="text-muted mb-4" style="font-size: 0.9375rem;">Créez vos questions et associez-les aux groupes</p>
    
    <q-inner-loading v-if="loading" :showing="loading" background-color="rgba(0,0,0,0.4)">
      <q-spinner-bars color="green" size="50px" />
    </q-inner-loading>

    <div v-else>
      <BRow v-for="(field, index) in fields" :key="field.id" class="mb-4">
        <!-- Carte pour chaque question -->
        <BCard class="question-card w-100">
          <BCardHeader class="question-card-header">
            <div class="question-header-left">
              <div class="question-number">
                <i class="bi bi-question-circle-fill"></i>
                <span>Question {{ index + 1 }}</span>
              </div>
              <div class="question-title-preview" v-if="field.title">
                <span>{{ field.title }}</span>
              </div>
            </div>
            <div class="question-actions">
              <button class="btn-delete-question" @click="deleteRow(index)" title="Supprimer cette question">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </BCardHeader>

          <BCardBody>
            <BRow>
              <!-- Sélection du groupe -->
              <BCol cols="12" md="6" class="mb-3">
                <BFormGroup class="form-group floating-label">
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
              </BCol>

              <!-- Titre -->
              <BCol cols="12" md="6" class="mb-3">
                <BFormGroup class="form-group floating-label">
                  <BFormInput v-model="field.title" placeholder=" " class="form-control-modern" />
                  <label>Titre de la question</label>
                </BFormGroup>
              </BCol>

              <!-- Description -->
              <BCol cols="12" class="mb-3">
                <BFormGroup class="form-group floating-label">
                  <BFormTextarea
                    v-model="field.description"
                    placeholder=" "
                    class="form-control-modern"
                    rows="3"
                  />
                  <label>Description de la question</label>
                </BFormGroup>
              </BCol>

              <!-- Position -->
              <BCol cols="12" md="6" class="mb-3">
                <BFormGroup class="form-group floating-label">
                  <BFormInput
                    type="number"
                    v-model="field.position"
                    placeholder=" "
                    class="form-control-modern"
                  />
                  <label>Position de la question</label>
                </BFormGroup>
              </BCol>

              <!-- Type de réponses -->
              <BCol cols="12" md="6" class="mb-3">
                <BFormGroup class="form-group floating-label">
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
              </BCol>

              <!-- Options de réponses -->
              <BCol cols="12" v-if="field.type === 'single_choice' || field.type === 'multiple_choice'">
                <label class="form-label fw-semibold mb-3">
                  <i class="bi bi-list-ul me-2"></i>
                  Options de réponses
                </label>
                <BListGroup flush>
                  <BListGroupItem
                    v-for="(option, idx) in field.choices"
                    :key="option.id"
                    class="d-flex justify-content-between align-items-center gap-2"
                  >
                    <BFormInput
                      v-model="option.value"
                      placeholder="Entrez une option de réponse"
                      class="form-control-modern"
                    />
                    <div class="d-flex align-items-center gap-2">
                      <BButton size="sm" class="btn-success me-1" @click="AddFormDataM(index)" title="Ajouter une option">
                        <i class="bi bi-file-earmark-plus"></i>
                      </BButton>
                      <BButton size="sm" class="btn-danger" @click="deleteRow2(index, idx)" title="Supprimer cette option">
                        <i class="bi bi-file-earmark-minus"></i>
                      </BButton>
                    </div>
                  </BListGroupItem>
                </BListGroup>

                <!-- Options avancées pour les choix -->
                <div class="advanced-options mt-4">
                  <div class="form-check form-switch gap-2 d-flex align-items-center mb-3">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :id="`allowOther-${index}`"
                      v-model="field.allowOther"
                      style="width: 50px; height: 25px"
                    />
                    <label class="form-check-label fw-semibold" :for="`allowOther-${index}`">
                      <i class="bi bi-plus-square me-2"></i>
                      Permettre option "Autre" avec texte libre
                    </label>
                  </div>

                  <div v-if="field.allowOther" class="other-label-input mb-3">
                    <BFormInput
                      v-model="field.otherLabel"
                      placeholder="Label pour l'option 'Autre' (ex: Autre (précisez))"
                      class="form-control-modern"
                    />
                  </div>

                  <!-- Commentaires conditionnels -->
                  <div class="form-check form-switch gap-2 d-flex align-items-center mb-3">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :id="`enableComments-${index}`"
                      v-model="field.enableComments"
                      style="width: 50px; height: 25px"
                    />
                    <label class="form-check-label fw-semibold" :for="`enableComments-${index}`">
                      <i class="bi bi-chat-left-text me-2"></i>
                      Activer commentaires conditionnels
                    </label>
                  </div>

                  <!-- Configuration des commentaires par option -->
                  <div v-if="field.enableComments" class="comments-config">
                    <div v-for="(option, idx) in field.choices" :key="`comment-${option.id}`" class="comment-config-item mb-3">
                      <div class="d-flex align-items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          :id="`requireComment-${index}-${idx}`"
                          v-model="option.requiresComment"
                          class="form-check-input"
                          style="width: 20px; height: 20px"
                        />
                        <label :for="`requireComment-${index}-${idx}`" class="form-label mb-0">
                          <strong>{{ option.value || `Option ${idx + 1}` }}</strong> - Demander un commentaire
                        </label>
                      </div>
                      <BFormInput
                        v-if="option.requiresComment"
                        v-model="option.commentLabel"
                        placeholder="Label du commentaire (ex: Pourquoi ?)"
                        class="form-control-modern ms-4"
                      />
                    </div>
                  </div>
                </div>
              </BCol>

              <!-- Obligatoire -->
              <BCol cols="12" class="mb-3">
                <div class="form-check form-switch gap-2 d-flex align-items-center">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="publishCheck"
                    v-model="field.isRequired"
                    style="width: 50px; height: 25px"
                  />
                  <label class="form-check-label fw-semibold" for="publishCheck"> Obligatoire </label>
                </div>
              </BCol>

              <!-- Questions Conditionnelles -->
              <BCol cols="12" class="mb-3">
                <div class="form-check form-switch gap-2 d-flex align-items-center">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`enableConditional-${index}`"
                    v-model="field.enableConditional"
                    style="width: 50px; height: 25px"
                  />
                  <label class="form-check-label fw-semibold" :for="`enableConditional-${index}`">
                    <i class="bi bi-diagram-3 me-2"></i>
                    Cette question dépend d'une autre question
                  </label>
                </div>
              </BCol>

              <!-- Configuration de la logique conditionnelle -->
              <BCol cols="12" v-if="field.enableConditional" class="mb-3">
                <div class="conditional-logic-config">
                  <div class="alert alert-info mb-3">
                    <i class="bi bi-info-circle me-2"></i>
                    <strong>Logique conditionnelle :</strong> Cette question s'affichera uniquement si la condition est remplie
                  </div>

                  <BRow>
                    <!-- Sélection de la question de référence -->
                    <BCol cols="12" md="6" class="mb-3">
                      <BFormGroup class="form-group floating-label">
                        <Multiselect
                          square
                          outlined
                          v-model="field.conditionalLogic.questionId"
                          :options="getPreviousQuestions(index)"
                          placeholder=" "
                          class="form-control-modern"
                        />
                        <label>Question de référence</label>
                      </BFormGroup>
                    </BCol>

                    <!-- Opérateur -->
                    <BCol cols="12" md="6" class="mb-3">
                      <BFormGroup class="form-group floating-label">
                        <Multiselect
                          square
                          outlined
                          v-model="field.conditionalLogic.operator"
                          :options="[
                            { label: 'Égal à', value: 'equals' },
                            { label: 'Différent de', value: 'not_equals' },
                            { label: 'Contient', value: 'contains' },
                            { label: 'Dans la liste', value: 'in' }
                          ]"
                          placeholder=" "
                          class="form-control-modern"
                        />
                        <label>Opérateur</label>
                      </BFormGroup>
                    </BCol>

                    <!-- Valeur -->
                    <BCol cols="12" class="mb-3">
                      <BFormGroup class="form-group floating-label">
                        <BFormInput
                          v-model="field.conditionalLogic.value"
                          placeholder=" "
                          class="form-control-modern"
                        />
                        <label>Valeur attendue</label>
                      </BFormGroup>
                    </BCol>

                    <!-- Action -->
                    <BCol cols="12" class="mb-3">
                      <BFormGroup class="form-group floating-label">
                        <Multiselect
                          square
                          outlined
                          v-model="field.conditionalLogic.action"
                          :options="[
                            { label: 'Afficher', value: 'show' },
                            { label: 'Masquer', value: 'hide' }
                          ]"
                          placeholder=" "
                          class="form-control-modern"
                        />
                        <label>Action</label>
                      </BFormGroup>
                    </BCol>
                  </BRow>
                </div>
              </BCol>
            </BRow>
          </BCardBody>
        </BCard>
        
        <!-- Bouton Ajouter une question (uniquement sur la dernière question) -->
        <div v-if="index === fields.length - 1" class="btn-add-question-container">
          <button class="btn-add-question-outline" @click="AddFormData">
            <i class="bi bi-plus-circle me-2"></i>
            Ajouter une question
          </button>
        </div>
      </BRow>

      <!-- Navigation -->
      <div class="d-flex justify-content-between mt-4 w-100">
        <BButton
          class="btn-modern btn-secondary-modern"
          @click="$emit('onBack')"
        >
          ⬅ Retour
        </BButton>
        <q-spinner-dots v-if="loadings" color="green" size="20px" class="q-mr-sm" />
        <BButton v-else class="btn-modern btn-success-modern" @click="handleNext">
          Suivant ➡
        </BButton>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BButton,
  BRow,
  BCol,
  BCard,
  BCardBody,
  BCardHeader,
  BFormGroup,
  BFormTextarea,
  BFormInput,
  BListGroup,
  BListGroupItem,
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
    BRow,
    BCol,
    BCard,
    Multiselect,
    BFormGroup, 
    BFormInput,
    BFormTextarea,
    BCardBody,
    BCardHeader,
    BListGroup,
    BListGroupItem,
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
        isRequired: false,
        choices: [{ id: 1, label: '', value: '', requiresComment: false, commentLabel: '' }],
        isNew: true,
        allowOther: false,
        otherLabel: 'Autre (précisez)',
        enableComments: false,
        enableConditional: false,
        conditionalLogic: {
          questionId: null,
          operator: 'equals',
          value: '',
          action: 'show'
        }
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
        isRequired: false,
        choices: [{ id: 1, label: '', value: '', requiresComment: false, commentLabel: '' }],
        isNew: true,
        allowOther: false,
        otherLabel: 'Autre (précisez)',
        enableComments: false,
        enableConditional: false,
        conditionalLogic: {
          questionId: null,
          operator: 'equals',
          value: '',
          action: 'show'
        }
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
        requiresComment: false,
        commentLabel: ''
      })
    }
    const deleteRow2 = async (index, indexs) => {
      if (fields.value[index].choices.length > 1) {
        if (fields.value[index].choices[indexs].label !== '') {
          await api
            .delete(
              `/surveys/${store.idsurvey}/question-groups/${fields.value[index].group.id}/choices/${fields.value[index].choices[indexs].id}`,
            )
            .then(() => {
              console.log('Choice deleted successfully')
            })
          const response = await api.get('/admin/dashboard/overview')
          store
            .setSurveyData(response.data.surveys.find((s) => s.id === store.idsurvey))
            .catch((error) => {
              console.error('Error deleting choice:', error)
            })
        }
        fields.value[index].choices.splice(indexs, 1)
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
              isRequired: question.isRequired,
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
            isRequired: false,
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
              message: 'Question supprimée avec succès.',
            })
          })
          .catch((error) => {
            console.error('Error deleting question group:', error)
          })
        fields.value.splice(index, 1)
        const response = await api.get('/admin/welcome-surveys')
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
        isRequired: field.isRequired,
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
          field.isRequired !== original.isRequired ||
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
          isRequired: item.isRequired,
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
              `/admin/welcome-surveys/${store.idsurveyw}/question-groups/${t.group}/questions`,
              {
                title: t.title,
                description: t.description,
                type: t.type,
                position: t.position,
                isRequired: t.isRequired,
                choices: t.choices.map((choice) => ({
                  label: choice.value,
                  value: choice.value,
                })),
              },
            )
          }
          const response = await api.get('/admin/welcome-surveys')
          store.setSurveyDataw(response.data.find((s) => s.id === store.idsurveyw))
          Notify.create({
            type: 'positive',
            message: 'Opération effectuée avec succès !',
            timeout: 5000,
          })
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
            `/admin/welcome-surveys/${store.idsurveyw}/question-groups/${t.group}/questions/${t.id}`,
            {
              title: t.title,
              description: t.description,
              type: t.type,
              position: t.position,
              isRequired: t.isRequired,
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

      await getz()
      return true
    }
    const handleNext = async () => {
      const result = await Add()
      if (result) {
        emit('onNext')
      }
    }

    const getPreviousQuestions = (currentIndex) => {
      return fields.value
        .slice(0, currentIndex)
        .map((field, idx) => ({
          label: `Q${idx + 1}: ${field.title || 'Sans titre'}`,
          value: field.id
        }))
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
      getPreviousQuestions,
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

/* Styles pour les options avancées */
.advanced-options {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border: 2px solid #e0e7ff;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
}

.advanced-options .form-check-label {
  color: #333;
  font-size: 0.95rem;
}

.advanced-options .form-check-input:checked {
  background-color: #10d0f2;
  border-color: #10d0f2;
}

.other-label-input {
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #10d0f2;
}

/* Configuration des commentaires */
.comments-config {
  background: #fff;
  border: 1px solid #e0e7ff;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
}

.comment-config-item {
  background: #f8f9ff;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #10d0f2;
}

.comment-config-item .form-check-input {
  border-color: #10d0f2;
}

.comment-config-item .form-check-input:checked {
  background-color: #10d0f2;
  border-color: #10d0f2;
}

/* Configuration de la logique conditionnelle */
.conditional-logic-config {
  background: linear-gradient(135deg, #f0f8ff 0%, #f0f4ff 100%);
  border: 2px solid #10d0f2;
  border-radius: 12px;
  padding: 20px;
  margin-top: 15px;
}

.conditional-logic-config .alert {
  background: #e3f2fd;
  border: 1px solid #90caf9;
  color: #1565c0;
  border-radius: 8px;
}

.conditional-logic-config .form-label {
  color: #333;
  font-weight: 500;
}
</style>
