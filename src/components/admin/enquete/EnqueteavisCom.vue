<script>
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
  <div class="survey-form-container">
    <q-spinner v-if="loading" size="60px" color="primary" style="display: block; margin: 100px auto" />

    <div v-else-if="loading === false && questionsList.length > 0" class="survey-card-creative">
      <!-- Header avec progression -->
      <div class="survey-header-creative">
        <div class="progress-section">
          <div class="question-counter">
            <i class="bi bi-list-check"></i>
            Question {{ activeTab }} / {{ questionsList.length }}
          </div>
          <div class="progress-bar-creative">
            <div
              class="progress-fill"
              :style="{ width: (activeTab / questionsList.length) * 100 + '%' }"
            ></div>
          </div>
          <div class="progress-percentage">
            {{ Math.round((activeTab / questionsList.length) * 100) }}%
          </div>
        </div>
      </div>

      <!-- Corps du formulaire -->
      <div class="survey-body-creative">
        <!-- Question Header -->
        <div class="question-header">
          <div class="question-title-wrapper">
            <div class="question-number">{{ currentQuestion.position }}</div>
            <div class="question-title-content">
              <h3>{{ currentQuestion.title }}</h3>
              <div class="question-badges">
                <span v-if="currentQuestion.isRequired" class="badge-required">
                  <i class="bi bi-asterisk"></i>
                  Obligatoire
                </span>
                <span class="badge-type">
                  {{ questionTypeLabel(currentQuestion.type) }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="currentQuestion.description" class="question-description">
            {{ currentQuestion.description }}
          </div>
        </div>

        <!-- Question texte -->
        <div v-if="currentQuestion.type === 'text'">
          <textarea
            v-model="answers[currentQuestion.id]"
            class="answer-textarea"
            placeholder="Tapez votre réponse ici..."
            rows="5"
          ></textarea>
        </div>

        <!-- Question choix multiples -->
        <div v-if="currentQuestion.type === 'multiple_choice'" class="choices-grid">
          <div
            v-for="option in currentQuestion.choices"
            :key="option.id"
            class="choice-checkbox-item"
          >
            <input
              type="checkbox"
              :id="'opt-' + option.id"
              :value="option.value || option.label"
              v-model="answers[currentQuestion.id]"
            />
            <label :for="'opt-' + option.id">
              <div class="check-icon">
                <i class="bi bi-check-lg"></i>
              </div>
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- Question choix unique -->
        <div v-if="currentQuestion.type === 'single_choice'" class="choices-single-grid">
          <div
            v-for="option in currentQuestion.choices"
            :key="option.id"
            :class="['choice-single-item', {
              selected: answers[currentQuestion.id] === (option.value || option.label)
            }]"
            @click="selectOption(option.value || option.label)"
          >
            {{ option.label }}
          </div>
        </div>

        <!-- Question fichier -->
        <div v-if="currentQuestion.type === 'file'">
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
          <ul class="list-unstyled mt-3">
            <li
              v-for="(file, index) in galleryFiles"
              :key="index"
              style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;"
            >
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="/images2/new-document.png" alt="file" style="width: 40px; height: 40px; border-radius: 8px;" />
                <div>
                  <h6 style="margin: 0; font-size: 0.95rem;">{{ file.name }}</h6>
                  <p style="margin: 0; color: #64748b; font-size: 0.85rem;">{{ (file.size / 1024).toFixed(2) }} KB</p>
                </div>
              </div>
              <button
                @click="() => deleteRecord(file)"
                style="padding: 6px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer;"
              >
                Supprimer
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Footer avec navigation -->
      <div class="survey-footer-creative">
        <button
          class="btn-navigation btn-prev"
          @click="prevStep"
          :disabled="activeTab === 1"
        >
          <i class="bi bi-arrow-left"></i>
          Précédent
        </button>
        <button
          :class="['btn-navigation', activeTab === questionsList.length ? 'btn-finish' : 'btn-next']"
          @click="nextStep"
        >
          {{ activeTab === questionsList.length ? 'Terminer' : 'Suivant' }}
          <i :class="activeTab === questionsList.length ? 'bi bi-check-lg' : 'bi bi-arrow-right'"></i>
        </button>
      </div>
    </div>

    <!-- Message si pas de questions -->
    <div v-else-if="loading === false && questionsList.length === 0" style="text-align: center; padding: 100px 20px;">
      <i class="bi bi-check-circle" style="font-size: 4rem; color: #10b981;"></i>
      <h3 style="margin-top: 20px; color: #64748b;">Vous avez déjà répondu à toutes les questions</h3>
    </div>
  </div>
</template>
<style lang="scss">
@import '../../../css/survey/survey-form.scss';
</style>
