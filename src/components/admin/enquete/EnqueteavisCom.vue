<script>
import { BRow, BCol, BCard, BCardBody, BButton } from 'bootstrap-vue-next'

import { useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import { onMounted, ref } from 'vue'
import { Notify } from 'quasar'
import DropzoneAd from '../common/DropzoneAd.vue'
import Swal from 'sweetalert2'

/**
 * Product-detail component
 */
export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,

    BButton,
    DropzoneAd,
  },
  data() {
    const route = useRoute()
    const questionsList = ref([])
    const activeTab = ref(1)
    const idf = ref('')
    const selectedAnswer = ref(null)
    const answers = ref({})
    const loading = ref(false)

    const gets = async () => {
      try {
        loading.value = true
        const id = route.params.id
        const response = await api.get('/participants/dashboard/overview')
        const available = (response.data.surveys_available || []).map((s) => ({
          ...s,
        }))
        const inProgress = (response.data.surveys_in_progress || []).map((s) => ({
          ...s,
        }))
        const completed = (response.data.surveys_completed || []).map((s) => ({
          ...s,
        }))
        const welcom = (response.data.welcome_surveys || []).map((s) => ({
          ...s,
        }))
        const allSurveys = [...available, ...inProgress, ...completed, ...welcom]

        const found = allSurveys.find((item) => item.survey_participants[0].accessToken === id)
        idf.value = found.id

        const answeredIds = found.responses.flatMap((resp) =>
          resp.responseDetails.map((d) => d.question.id),
        )

        const allQuestions = []

        found.question_groups?.forEach((group) => {
          if (group.questions) {
            group.questions.forEach((q) => {
              if (!answeredIds.includes(q.id)) {
                allQuestions.push(q)
              }

              if (q.type === 'multiple_choice') {
                answers.value[q.id] = []
              } else if (q.type === 'single_choice' || q.type === 'text') {
                answers.value[q.id] = null
              }
            })
          }
        })

        questionsList.value = allQuestions.sort((a, b) => a.position - b.position)
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error)
        Notify.create({
          type: 'negative',
          message: `Erreur de chargement des questions : ${error.response?.data?.message || 'Inconnue'}`,
        })
      } finally {
        loading.value = false
      }
    }

    /*const submitAnswers = async () => {
      const surveyId = route.params.id

      const response_details = Object.entries(this.answers).map(([question_id, answer]) => {
        return {
          question_id: parseInt(question_id),
          answer: Array.isArray(answer) ? answer.join(', ') : answer,
        }
      })

      const payload = {
        survey_id: parseInt(surveyId),
        response_details,
        files: this.galleryFiles.map((file) => ({
          path: file.content, // base64
        })), // tu peux ajouter les fichiers ici si tu les gères ailleurs
      }
      console.log('Payload to send:', payload)
      api
        .post('/participants/responses', payload)
        .then(() => {
          Notify.create({
            type: 'positive',
            message: 'Votre Réponses envoyées avec succès. Merci de partager votre opinion',
          })
        })
        .catch((error) => {
          console.error(error)
          Notify.create({
            type: 'negative',
            message: `Erreur lors de l’envoi des réponses, ${error.response.data.message}`,
          })
        })
    }*/
    const saveCurrentAnswer = async (isFinal = false) => {
      //const surveyId = idf.value
      const currentId = this.currentQuestion.id
      let answer = this.answers[currentId]

      // 🔹 Gestion spéciale si la question est de type "file"
      /*let filesPayload = []
      if (this.currentQuestion.type === 'file' && this.galleryFiles.length > 0) {
        filesPayload = this.galleryFiles.map((file) => ({
          path: `uploads/${file.name}`, // Chemin relatif comme dans ton exemple
        }))
        // Optionnel : mettre le nom du fichier comme réponse
        answer = this.galleryFiles.map((file) => file.name)
      }*/

      const payload = {
        response_details: [
          {
            question_id: parseInt(currentId),
            answer: Array.isArray(answer) ? answer.join(', ') : answer,
          },
        ],
        finalize: isFinal,
      }

      try {
        await api.post(
          `/participants/responses/survey/participate/${route.params.id}/submit`,
          payload,
        )
        console.log(`Réponse enregistrée pour question ${currentId}, finalize=${isFinal}`)
      } catch (error) {
        console.error('Erreur enregistrement réponse :', error)
        Notify.create({
          type: 'negative',
          message: `Erreur d'enregistrement : ${error.response?.data?.message || 'Inconnue'}`,
        })
      }
    }
    onMounted(() => {
      gets()
    })
    return {
      idf,
      loading,
      saveCurrentAnswer,
      activeTab,
      questionsList,
      selectedAnswer,
      answers,
      galleryFiles: [],
      galleryDropzoneFile: '',
    }
  },
  computed: {
    currentQuestion() {
      return this.questionsList[this.activeTab - 1] || {}
    },
  },
  methods: {
    async nextStep() {
      const currentId = this.currentQuestion.id
      const answer = this.answers[currentId]

      // Validation simple : pas de réponse
      const isEmpty =
        answer === null ||
        answer === undefined ||
        (typeof answer === 'string' && answer.trim() === '') ||
        (Array.isArray(answer) && answer.length === 0)

      if (this.currentQuestion?.isRequired && isEmpty) {
        Notify.create({
          type: 'warning',
          message: 'Veuillez répondre à la question avant de continuer.',
        })
        return
      }
      const allAnswered = this.questionsList.every((q) => {
        const ans = this.answers[q.id]
        if (q.isRequired) {
          return (
            ans !== null &&
            ans !== undefined &&
            !(
              (typeof ans === 'string' && ans.trim() === '') ||
              (Array.isArray(ans) && ans.length === 0)
            )
          )
        }
        return true // si non requise, on ignore
      })
      const isLastQuestion = this.activeTab === this.questionsList.length
      const shouldFinalize = isLastQuestion && allAnswered
      // 🔹 Sauvegarder la réponse avant de passer à la question suivante
      await this.saveCurrentAnswer(shouldFinalize)
      if (!isLastQuestion) {
        this.activeTab++
      } else {
        Swal.fire({
          title: 'Merci !',
          text: 'Votre avis a été enregistré avec succès.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.$router.push('/admin/enquetes-encours') // Redirection vers la liste des enquêtes
        })
      }
    },
    toggleOption(value) {
      if (!this.answers[this.currentQuestion.id]) {
        this.answers[this.currentQuestion.id] = []
      }
      const idx = this.answers[this.currentQuestion.id].indexOf(value)
      if (idx > -1) {
        this.answers[this.currentQuestion.id].splice(idx, 1) // décocher
      } else {
        this.answers[this.currentQuestion.id].push(value) // cocher
      }
    },
    prevStep() {
      if (this.activeTab > 1) {
        this.activeTab--
      }
    },
    deleteRecord(ele) {
      if (ele.id) {
        this.galleryFiles = this.galleryFiles.filter((item) => {
          return item.id != ele.id
        })
      }
    },
    gallerySelectedFile() {
      const files = document.querySelector('.galleryDropzoneFile').files
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64File = e.target.result

          // Ajout au tableau d'affichage
          this.galleryFiles.push({
            id: this.galleryFiles.length + 1,
            name: file.name,
            size: file.size,
            content: base64File, // stocké pour l'envoi
          })

          // Stocker dans answers si besoin (facultatif ici)
          if (this.currentQuestion && this.currentQuestion.type === 'file') {
            if (!Array.isArray(this.answers[this.currentQuestion.id])) {
              this.answers[this.currentQuestion.id] = []
            }
            this.answers[this.currentQuestion.id].push(base64File)
          }
        }
        reader.readAsDataURL(file) // Conversion en Base64
      })
    },
    selectOption(value) {
      this.answers[this.currentQuestion.id] = value
    },
    questionTypeLabel(type) {
      switch (type) {
        case 'text':
          return 'Texte libre'
        case 'single_choice':
          return 'Choix unique'
        case 'multiple_choice':
          return 'Choix multiples'
        case 'file':
          return 'Fichier à uploader'
        default:
          return 'Question'
      }
    },
  },
}
</script>

<template>
  <div>
    <BRow>
      <BCol lg="12">
        <BCard no-body class="shadow-lg rounded-4">
          <BCardBody class="p-4 bg-light">
            <!-- Header : Progression -->
            <q-spinner v-if="loading" size="50px" color="green" class="full-width" />

            <div class="tab-content" v-else-if="loading === false">
              <div
                class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4"
              >
                <span class="fw-bold text-muted mb-2 mb-md-0">
                  Question {{ activeTab }} sur {{ questionsList.length }}
                </span>
                <div
                  class="progress flex-grow-1 mx-md-3"
                  style="height: 8px; border-radius: 10px; overflow: hidden"
                >
                  <div
                    class="progress-bar"
                    role="progressbar"
                    :style="{
                      width: (activeTab / questionsList.length) * 100 + '%',
                      transition: 'width 0.4s ease-in-out',
                      background: 'linear-gradient(90deg, #4ade80, #16a34a)',
                    }"
                  ></div>
                </div>
              </div>
              <div class="tab-pane fade show active">
                <BRow>
                  <!-- Titre et description -->
                  <BCol cols="12" class="mb-3">
                    <h3 class="fw-bold text-success mb-2">
                      {{ currentQuestion.position }}. {{ currentQuestion.title }} ?
                      <span
                        v-if="currentQuestion.isRequired"
                        class="badge bg-warning text-dark ms-2"
                        title="Cette question est obligatoire"
                      >
                        Obligatoire
                      </span>
                      <span class="badge bg-info text-dark mb-4">
                        {{ questionTypeLabel(currentQuestion.type) }}
                      </span>
                    </h3>
                    <h3 class="fw-bold text-muted mb-2">Description:</h3>
                    <p class="text-muted">{{ currentQuestion.description }}</p>
                  </BCol>

                  <!-- Question texte -->
                  <BCol cols="12" class="mb-3" v-if="currentQuestion.type === 'text'">
                    <textarea
                      v-model="answers[currentQuestion.id]"
                      class="form-control shadow-sm rounded-3"
                      placeholder="Tapez votre réponse ici..."
                      rows="3"
                    />
                  </BCol>

                  <!-- Question multiple choice -->
                  <BCol cols="12" class="mb-3" v-if="currentQuestion.type === 'multiple_choice'">
                    <div class="d-flex flex-column gap-2">
                      <div
                        v-for="option in currentQuestion.choices"
                        :key="option.id"
                        class="form-check"
                      >
                        <input
                          class="form-check-input"
                          type="checkbox"
                          :id="'opt-' + option.id"
                          :value="option.value || option.label"
                          v-model="answers[currentQuestion.id]"
                        />
                        <label class="form-check-label" :for="'opt-' + option.id">
                          {{ option.label }}
                        </label>
                      </div>
                    </div>
                  </BCol>

                  <!-- Question single choice -->
                  <BCol cols="12" class="mb-3" v-if="currentQuestion.type === 'single_choice'">
                    <div class="d-flex flex-wrap gap-2">
                      <div
                        v-for="option in currentQuestion.choices"
                        :key="option.id"
                        :class="[
                          'option-card',
                          {
                            selected:
                              answers[currentQuestion.id] === (option.value || option.label),
                          },
                        ]"
                        @click="selectOption(option.value || option.label)"
                      >
                        {{ option.label }}
                      </div>
                    </div>
                  </BCol>

                  <!-- Question fichier -->
                  <BCol cols="12" class="mb-3" v-if="currentQuestion.type === 'file'">
                    <BCard no-body class="shadow-sm rounded-3">
                      <BCardBody>
                        <DropzoneAd
                          files="files"
                          cloudIcon="remix"
                          dropzoneFile="galleryDropzoneFile"
                          v-model="answers[currentQuestion.id]"
                          :isMultiple="true"
                          @drop.prevent="galleryDrop($event)"
                          @change="gallerySelectedFile"
                          @dragenter.prevent
                          @dragover.prevent
                        />
                        <ul class="list-unstyled mt-3" id="dropzone-preview2">
                          <li
                            v-for="(file, index) in galleryFiles"
                            :key="index"
                            class="border rounded mb-2 p-2 d-flex align-items-center justify-content-between shadow-sm"
                          >
                            <div class="d-flex align-items-center">
                              <div
                                class="avatar-sm bg-light rounded me-3 d-flex align-items-center justify-content-center"
                              >
                                <img
                                  class="img-fluid rounded"
                                  src="/images2/new-document.png"
                                  alt="file"
                                />
                              </div>
                              <div>
                                <h6 class="mb-1">{{ file.name }}</h6>
                                <p class="mb-0 text-muted fs-sm">
                                  {{ (file.size / 1024).toFixed(2) }} KB
                                </p>
                              </div>
                            </div>
                            <BButton
                              size="sm"
                              variant="danger"
                              class="rounded-pill"
                              @click="() => deleteRecord(file)"
                            >
                              Supprimer
                            </BButton>
                          </li>
                        </ul>
                      </BCardBody>
                    </BCard>
                  </BCol>
                </BRow>

                <!-- Navigation -->
                <div class="d-flex flex-column flex-md-row justify-content-between mt-4">
                  <BButton
                    variant="secondary"
                    class="rounded-pill px-4 shadow-sm mb-2 mb-md-0"
                    @click="prevStep"
                    :disabled="activeTab === 1"
                  >
                    Précédent
                  </BButton>
                  <BButton
                    :variant="activeTab === questionsList.length ? 'success' : 'primary'"
                    class="rounded-pill px-4 shadow-sm"
                    @click="nextStep"
                  >
                    {{ activeTab === questionsList.length ? 'Terminer' : 'Suivant' }}
                  </BButton>
                </div>
              </div>
            </div>

            <!-- Message si pas de questions -->
            <h3 v-else class="text-center text-muted py-5">
              Vous avez déjà répondu à toutes les questions
            </h3>

            <!-- Contenu des questions -->
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </div>
</template>
<style>
@import '../../../css/assets/scss/app2.scss';
.badge.bg-info {
  background-color: #d0f0fd; /* couleur claire */
  color: #055a11;
  font-weight: 500;
  font-size: 0.85rem;
}
/* Animation légère pour la transition entre questions */
.tab-pane {
  transition: all 0.3s ease-in-out;
}

/* Hover léger sur les options */
.form-check-input:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

/* Responsive spacing */
@media (max-width: 767px) {
  .d-flex.flex-md-row {
    flex-direction: column !important;
  }
}
.option-card {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  background-color: #f8f9fa;
  color: #333;
}

.option-card:hover {
  background-color: #e2e6ea;
  transform: scale(1.03);
}

.option-card.selected {
  background: linear-gradient(90deg, #4ade80, #16a34a);
  color: white;
  border-color: #4ade80;
}
.form-check-input:checked {
  background-color: #16a34a !important;
  border-color: #16a34a !important;
}
.form-check-label {
  font-weight: 500;
  color: #333;
}
</style>
