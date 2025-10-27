<script>
import { onMounted, ref, watch } from 'vue'
import {
  BRow,
  BCol,
  BFormInput,
  BPagination,
} from 'bootstrap-vue-next'

import { api } from 'src/boot/axios'
import Swal from 'sweetalert2'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import TeleDetail from './TeleDetail.vue'
import autoTable from 'jspdf-autotable'
import { Notify } from 'quasar'
/**
 * Orders component
 */
export default {
  components: {
    BRow,
    BCol,
    BFormInput,
    BPagination,
    TeleDetail,
  },
  data() {
    const orderData = ref([])
    const authStore = useAuthStore()
    const router = useRouter()
    const selectedReport = ref([])
    const isDownloading = ref(false)
    const loading = ref(false)
    const showCreateModal = ref(false)
    const selectedSurvey = ref('')
    const surveys = ref([])
    const isCreating = ref(false)
    const loadingSurveyDetails = ref(false)
    
    function truncate(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    }

    const gets = async () => {
      try {
        loading.value = true
        const role = authStore.roles[0]
        if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          const response = await api.get('/reports')
          orderData.value = response.data
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          const response = await api.get('/admin/reports')
          orderData.value = response.data
        }
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }
    const openCreateModal = async () => {
      showCreateModal.value = true
      selectedSurvey.value = ''
      await loadSurveys()
    }

    const loadSurveys = async () => {
      try {
        const response = await api.get('/admin/surveys')
        // Charger les sondages avec leurs relations (participants, réponses, questions)
        surveys.value = await Promise.all(
          response.data.map(async (survey) => {
            try {
              const detailResponse = await api.get(`/admin/surveys/${survey.id}`)
              return detailResponse.data
            } catch (error) {
              console.error(`Erreur lors du chargement du sondage ${survey.id}:`, error)
              return survey
            }
          })
        )
      } catch (error) {
        console.error('Erreur lors du chargement des sondages:', error)
        Notify.create({
          type: 'negative',
          message: 'Erreur lors du chargement des sondages',
          position: 'top',
        })
      }
    }

    const getSurveyById = (id) => {
      return surveys.value.find(s => s.id === id)
    }

    const formatDate = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    }

    const calculateCompletionRate = (surveyId) => {
      const survey = getSurveyById(surveyId)
      if (!survey) return 0
      
      const participants = survey.survey_participants || []
      
      if (participants.length === 0) return 0
      
      // Calculer le nombre de participants qui ont répondu
      const completedCount = participants.filter(p => p.hasResponded || p.status === 'completed').length
      const rate = (completedCount / participants.length) * 100
      return Math.round(rate)
    }

    const getSurveyStatus = (surveyId) => {
      const survey = getSurveyById(surveyId)
      if (!survey) return 'draft'
      
      const now = new Date()
      const startDate = new Date(survey.startDate)
      const endDate = new Date(survey.endDate)
      
      if (survey.status === 'archived') return 'archived'
      if (survey.status === 'closed') return 'closed'
      if (now < startDate) return 'draft'
      if (now > endDate) return 'closed'
      return 'active'
    }

    const getSurveyStatusLabel = (surveyId) => {
      const status = getSurveyStatus(surveyId)
      const labels = {
        draft: 'Brouillon',
        active: 'En cours',
        closed: 'Terminé',
        archived: 'Archivé'
      }
      return labels[status] || 'Inconnu'
    }

    const canCreateReport = (surveyId) => {
      if (!surveyId) return false
      const status = getSurveyStatus(surveyId)
      // On peut créer un rapport seulement si le sondage est terminé ou archivé
      return status === 'closed' || status === 'archived'
    }

    const createReport = async () => {
      if (!selectedSurvey.value) return
      
      try {
        isCreating.value = true
        await api.post('/admin/reports', {
          surveyId: selectedSurvey.value
        })
        
        Notify.create({
          type: 'positive',
          message: 'Rapport créé avec succès !',
          position: 'top',
        })
        
        showCreateModal.value = false
        selectedSurvey.value = ''
        await gets()
      } catch (error) {
        console.error('Erreur lors de la création du rapport:', error)
        Notify.create({
          type: 'negative',
          message: 'Erreur lors de la création du rapport',
          position: 'top',
        })
      } finally {
        isCreating.value = false
      }
    }

    const ajout = () => {
      router.push('/admin/rapport-add')
    }
    const openEditModal = () => {
      this.activeTab = 1
      this.progressBarValue = 15
    }
    const deleteRow = (index) => {
      Swal.fire({
        title: 'Etes vous sur?',
        text: 'Voulez-vous supprimmer le paricipant',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Yes, delete it!',
      }).then(async (result) => {
        if (result.value) {
          await api.delete(`/admin/reports/${index}`)
          gets()
          Swal.fire('Deleted!', 'Le participants a été supprimer avec success.', 'success')
        }
      })
    }
    const getSingleChoiceLabel = (quest, answer) => {
      const choice = quest.choices.find((c) => c.value === answer)
      return choice ? choice.label : answer
    }

    const getMultipleChoiceLabels = (quest, answer) => {
      const values = answer.split(',').map((a) => a.trim())
      return values.map((val) => {
        const choice = quest.choices.find((c) => c.value === val)
        return choice ? choice.label : val
      })
    }
    // Watcher pour simuler le chargement des détails du sondage
    watch(selectedSurvey, async (newVal) => {
      if (newVal) {
        loadingSurveyDetails.value = true
        // Simuler un petit délai pour le chargement
        await new Promise(resolve => setTimeout(resolve, 500))
        loadingSurveyDetails.value = false
      }
    })

    onMounted(() => {
      gets()
    })
    return {
      truncate,
      ajout,
      openEditModal,
      getSingleChoiceLabel,
      getMultipleChoiceLabels,
      deleteRow,
      isDownloading,
      orderData,
      totalRows: 1,
      currentPage: 1,
      perPage: 6,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: 'age',
      sortDesc: false,
      selectedReport,
      progressBarValue: 15,
      activeTab: 1,
      activeTabArrow: 2,
      loading,
      showCreateModal,
      selectedSurvey,
      surveys,
      isCreating,
      openCreateModal,
      getSurveyById,
      formatDate,
      createReport,
      calculateCompletionRate,
      getSurveyStatus,
      getSurveyStatusLabel,
      canCreateReport,
      loadingSurveyDetails,
    }
  },
  computed: {
    // 1️⃣ Filtrer selon le texte recherché
    filteredData() {
      if (!this.filter) return this.orderData
      const search = this.filter.toLowerCase()
      return this.orderData.filter((item) => item.survey.title.toLowerCase().includes(search))
    },
    // 2️⃣ Obtenir seulement les cartes de la page actuelle
    paginatedData() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredData.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.perPage)
    },
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.orderData.length
  },
  methods: {
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async downloadReport(reportId) {
      try {
        this.isDownloading = true

        // 1️⃣ Charger le rapport complet
        const { data } = await api.get(`/admin/surveys/${reportId}`)
        this.selectedReport = data

        // 2️⃣ Ouvrir tous les collapses
        if (this.openCollapse) {
          Object.keys(this.openCollapse).forEach((id) => (this.openCollapse[id] = true))
        }

        // 3️⃣ Attendre rendu complet
        await this.$nextTick()
        await new Promise((r) => setTimeout(r, 800))

        // 4️⃣ Initialiser le PDF
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()

        // Fonction header/footer
        const addHeaderFooter = () => {
          const page = pdf.internal.getNumberOfPages()
          pdf.setFontSize(9)
          pdf.setTextColor(120)
          pdf.text(data.title, 14, 10)
          pdf.text(`Page ${page}`, pdfWidth - 20, pageHeight - 10)
        }

        // 5️⃣ Page de garde
        pdf.setFillColor(41, 128, 185) // bandeau bleu
        pdf.rect(0, 0, pdfWidth, 40, 'F')
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(20)
        pdf.text(data.title, pdfWidth / 2, 25, { align: 'center' })

        pdf.setTextColor(80)
        pdf.setFontSize(12)

        // 6️⃣ Capturer sections (stats, graphiques...)
        const sections = [
          document.querySelector('#report-title'),
          document.querySelector('#stat-detail'),
          document.querySelector('#table-recap'),
          document.querySelector('#table-recap2'),
        ]
        for (const section of sections) {
          if (!section) continue
          const canvas = await html2canvas(section, { scale: 2, useCORS: true, logging: false })
          const imgData = canvas.toDataURL('image/png')
          const imgHeight = (canvas.height * pdfWidth) / canvas.width
          pdf.addImage(imgData, 'PNG', 0, 15, pdfWidth, imgHeight)
          addHeaderFooter()
          pdf.addPage()
        }

        // 7️⃣ Préparer toutes les questions + réponses
        const allQuestions = []
        data.question_groups.forEach((group) => {
          group.questions.forEach((q) => {
            const answers = data.responses.flatMap((resp) =>
              resp.responseDetails
                .filter((d) => d.question.id === q.id)
                .map((d) => ({
                  answer: d.answer,
                  submittedAt: resp.submittedAt,
                })),
            )
            allQuestions.push({ ...q, answers })
          })
        })

        const groupall = allQuestions.sort((a, b) => a.position - b.position)

        // 8️⃣ Boucler sur les questions
        let yPos = 30
        for (const question of groupall) {
          // Couleurs par type
          const questionColors = {
            text: [41, 128, 185], // bleu
            single_choice: [39, 174, 96], // vert
            multiple_choice: [243, 156, 18], // orange
            file: [192, 57, 43], // rouge
          }
          const qc = questionColors[question.type] || [120, 120, 120]

          // Titre question
          if (yPos > pageHeight - 40) {
            addHeaderFooter()
            pdf.addPage()
            yPos = 30
          }
          pdf.setFillColor(...qc)
          pdf.setTextColor(255, 255, 255)
          pdf.rect(10, yPos - 6, pdfWidth - 20, 12, 'F')
          pdf.setFontSize(12)
          pdf.text(`Q${question.position}: ${question.title}`, 12, yPos + 2)
          yPos += 16

          // Réponses
          if (question.answers.length === 0) {
            pdf.setFontSize(11)
            pdf.setTextColor(120)
            pdf.text(' Aucune réponse', 12, yPos)
            yPos += 12
          } else {
            for (const ans of question.answers) {
              if (yPos > pageHeight - 40) {
                addHeaderFooter()
                pdf.addPage()
                yPos = 30
              }

              // Encadré réponse
              pdf.setDrawColor(200)
              pdf.roundedRect(10, yPos, pdfWidth - 20, 20, 3, 3, 'S')
              pdf.setFontSize(11)
              pdf.setTextColor(50)

              // Texte selon type
              let answerText = ''
              if (question.type === 'single_choice') {
                answerText = this.getSingleChoiceLabel(question, ans.answer)
              } else if (question.type === 'multiple_choice') {
                answerText = this.getMultipleChoiceLabels(question, ans.answer).join(', ')
              } else {
                answerText = ans.answer
              }

              // Afficher réponse
              pdf.text(`Reponses: ${answerText}`, 14, yPos + 8, { maxWidth: pdfWidth - 30 })

              // Date à droite
              pdf.setFontSize(9)
              pdf.setTextColor(120)
              pdf.text(
                ` ${new Date(ans.submittedAt).toLocaleDateString('fr-FR')}`,
                pdfWidth - 60,
                yPos + 8,
              )

              yPos += 25
            }
          }
          pdf.setDrawColor(200)
          pdf.setLineWidth(0.3)
          pdf.line(10, yPos, pdfWidth - 10, yPos)
          yPos += 10
        }

        // 9️⃣ Tableau récapitulatif final
        addHeaderFooter()
        pdf.addPage()
        autoTable(pdf, {
          head: [['Type de question', 'Nombre de réponses']],
          body: [
            ['Texte', groupall.filter((q) => q.type === 'text').length],
            ['Choix unique', groupall.filter((q) => q.type === 'single_choice').length],
            ['Choix multiple', groupall.filter((q) => q.type === 'multiple_choice').length],
            ['Fichier', groupall.filter((q) => q.type === 'file').length],
          ],
          startY: 40,
          styles: { halign: 'center' },
          headStyles: { fillColor: [41, 128, 185] },
        })

        // 🔟 Sauvegarder le PDF
        pdf.save(`rapport_${data.title}.pdf`)
      } catch (err) {
        console.error('Erreur export PDF :', err)
        Notify.create({
          type: 'negative',
          message:
            err.response.data.message || "Erreur lors de l'export du rapport. Veuillez réessayer.",

          timeout: 5000,
        })
      } finally {
        this.isDownloading = false
      }
    },
  },
}
</script>

<template>
  <div class="modern-admin-page">
    <!-- Carte d'en-tête séparée -->
    <div class="header-card mb-4">
      <div class="section-header-modern">
        <div class="section-title-wrapper">
          <div class="section-icon-modern">
            <i class="bi bi-file-earmark-bar-graph"></i>
          </div>
          <div class="section-title-content">
            <h3 class="section-title-modern">Mes Rapports</h3>
            <p class="section-subtitle-modern">Consultez et téléchargez vos rapports d'enquêtes</p>
          </div>
        </div>
        <button class="btn-create-report" @click="openCreateModal">
          <i class="bi bi-plus-circle-fill me-2"></i>
          Créer un Rapport
        </button>
      </div>
    </div>

    <!-- Section rapports -->
    <BRow>
      <BCol cols="12">
        <div class="reports-section-card">
          <BRow>
            <BCol cols="auto" md="12" class="d-flex justify-content-end mb-3">
              <div class="search-wrapper-modern">
                <BFormInput
                  v-model="filter"
                  type="search"
                  placeholder="Rechercher un rapport..."
                  class="form-control-modern"
                />
              </div>
            </BCol>
          </BRow>
          <div v-if="loading" class="text-center my-5">
            <q-spinner-ball color="primary" size="50px" />
            <p class="mt-3 text-muted">Chargement des rapports...</p>
          </div>
          <div
            v-else-if="Array.isArray(paginatedData) && paginatedData.length === 0"
            class="empty-state"
          >
            <div class="empty-state-icon">
              <i class="bi bi-inbox"></i>
            </div>
            <h5 class="empty-state-title">Aucun rapport disponible</h5>
            <p class="empty-state-text">Créez votre premier rapport pour commencer.</p>
          </div>
          <BRow v-else style="margin-top: 5px">
            <BCol
              cols="12"
              sm="6"
              md="4"
              lg="3"
              xl="2"
              class="mb-3"
              v-for="(item, index) in paginatedData"
              :key="index"
            >
              <div class="modern-report-card">
                <!-- Header badges -->
                <div class="report-card-top">
                  <span class="report-badge report-badge-survey">
                    <i class="bi bi-bar-chart-fill me-1"></i>
                    Rapport
                  </span>
                  <button 
                    class="report-delete-btn" 
                    @click.stop="deleteRow(item.id)"
                    title="Supprimer"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>

                <!-- Titre du sondage -->
                <div class="report-card-body" @click="downloadReport(item.survey.id)">
                  <h3 class="report-card-title">{{ item.survey.title }}</h3>
                </div>

                <!-- Footer avec icônes -->
                <div class="report-card-bottom">
                  <div class="report-icons-group">
                    <div class="report-icon-item" :title="`${item.totalParticipants} Participations`">
                      <i class="bi bi-people-fill"></i>
                      <span class="report-icon-value">{{ item.totalParticipants }}</span>
                    </div>
                    <div class="report-icon-item" :title="`${item.totalResponses} Réponses`">
                      <i class="bi bi-check-circle-fill"></i>
                      <span class="report-icon-value">{{ item.totalResponses }}</span>
                    </div>
                    <div class="report-icon-item" :title="`Taux: ${item.participationRate}`">
                      <i class="bi bi-star-fill"></i>
                      <span class="report-icon-value">{{ item.participationRate }}</span>
                    </div>
                  </div>
                </div>

                <!-- Bouton télécharger -->
                <div class="report-card-actions">
                  <button 
                    class="btn-download-report"
                    @click="downloadReport(item.survey.id)"
                    :disabled="isDownloading"
                  >
                    <i v-if="!isDownloading" class="bi bi-download me-2"></i>
                    <q-spinner-dots v-else color="white" size="20px" class="me-2" />
                    {{ isDownloading ? 'Téléchargement...' : 'Télécharger' }}
                  </button>
                </div>
              </div>
            </BCol>
            <div
              ref="statDetail"
              style="position: absolute; top: 0; left: -9999px; width: 210mm; padding: 20px"
            >
              <TeleDetail v-if="selectedReport" :report="selectedReport" />
            </div>
          </BRow>
          <!-- Pagination -->
          <div class="reports-pagination">
            <BPagination
              v-model="currentPage"
              :total-rows="filteredData.length"
              :per-page="perPage"
              class="modern-pagination"
            />
          </div>
        </div>
      </BCol>
    </BRow>

    <!-- Modal de création de rapport -->
    <q-dialog v-model="showCreateModal" transition-show="scale" transition-hide="fade">
      <q-card class="create-report-modal">
        <div class="modal-header-create">
          <div class="modal-header-content">
            <div class="modal-icon-wrapper">
              <i class="bi bi-file-earmark-plus"></i>
            </div>
            <div>
              <h4 class="modal-title">Créer un nouveau rapport</h4>
              <p class="modal-subtitle">Sélectionnez un sondage pour générer son rapport</p>
            </div>
          </div>
          <button class="modal-close-btn" @click="showCreateModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="modal-body-create">
          <div class="survey-selection-wrapper">
            <label class="selection-label">
              <i class="bi bi-ui-checks me-2"></i>
              Sélectionnez un sondage
            </label>
            <select v-model="selectedSurvey" class="modern-select">
              <option value="">-- Choisir un sondage --</option>
              <option v-for="survey in surveys" :key="survey.id" :value="survey.id">
                {{ survey.title }}
              </option>
            </select>
          </div>

          <div v-if="selectedSurvey" class="survey-preview">
            <div class="preview-header">
              <i class="bi bi-eye me-2"></i>
              Aperçu du sondage sélectionné
            </div>
            
            <!-- Loader pendant le chargement -->
            <div v-if="loadingSurveyDetails" class="preview-loader">
              <q-spinner-dots color="primary" size="50px" />
              <p>Chargement des détails...</p>
            </div>

            <div v-else class="preview-content">
              <!-- Titre + Badge de statut -->
              <div class="preview-title-section">
                <h5 class="preview-title">{{ getSurveyById(selectedSurvey)?.title }}</h5>
                <span class="status-badge-inline" :class="'status-' + getSurveyStatus(selectedSurvey)">
                  <i class="bi bi-circle-fill me-1"></i>
                  {{ getSurveyStatusLabel(selectedSurvey) }}
                </span>
              </div>

              <!-- Statistiques (au-dessus de la description) -->
              <div class="preview-statistics">
                <div class="stat-card">
                  <div class="stat-icon stat-icon-blue">
                    <i class="bi bi-patch-question-fill"></i>
                  </div>
                  <div class="stat-content">
                    <span class="stat-value">{{ getSurveyById(selectedSurvey)?.survey_questions?.length || 0 }}</span>
                    <span class="stat-label">Questions</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon stat-icon-green">
                    <i class="bi bi-people-fill"></i>
                  </div>
                  <div class="stat-content">
                    <span class="stat-value">{{ getSurveyById(selectedSurvey)?.survey_participants?.length || 0 }}</span>
                    <span class="stat-label">Participants</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon stat-icon-purple">
                    <i class="bi bi-check-circle-fill"></i>
                  </div>
                  <div class="stat-content">
                    <span class="stat-value">{{ getSurveyById(selectedSurvey)?.responses?.length || 0 }}</span>
                    <span class="stat-label">Réponses</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon stat-icon-orange">
                    <i class="bi bi-graph-up-arrow"></i>
                  </div>
                  <div class="stat-content">
                    <span class="stat-value">{{ calculateCompletionRate(selectedSurvey) }}%</span>
                    <span class="stat-label">Taux de complétion</span>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="preview-description-section">
                <h6 class="description-title">
                  <i class="bi bi-text-paragraph me-2"></i>
                  Description
                </h6>
                <p class="preview-description">{{ getSurveyById(selectedSurvey)?.description || 'Aucune description disponible' }}</p>
              </div>

              <!-- Dates en badges -->
              <div class="preview-dates-badges">
                <div class="date-badge date-badge-start">
                  <i class="bi bi-calendar-event me-2"></i>
                  <span class="date-badge-label">Début:</span>
                  <span class="date-badge-value">{{ formatDate(getSurveyById(selectedSurvey)?.startDate) }}</span>
                </div>
                <div class="date-badge date-badge-end">
                  <i class="bi bi-calendar-check me-2"></i>
                  <span class="date-badge-label">Fin:</span>
                  <span class="date-badge-value">{{ formatDate(getSurveyById(selectedSurvey)?.endDate) }}</span>
                </div>
              </div>

              <!-- Alerte si sondage en cours ou brouillon -->
              <div v-if="!canCreateReport(selectedSurvey)" class="preview-alert">
                <div class="alert-icon">
                  <i class="bi bi-exclamation-triangle-fill"></i>
                </div>
                <div class="alert-content">
                  <h6 class="alert-title">Impossible de créer un rapport</h6>
                  <p class="alert-message">
                    <span v-if="getSurveyStatus(selectedSurvey) === 'draft'">
                      Ce sondage est encore en brouillon. Vous devez le publier et attendre sa clôture avant de générer un rapport.
                    </span>
                    <span v-else-if="getSurveyStatus(selectedSurvey) === 'active'">
                      Ce sondage est actuellement en cours. Vous devez attendre sa date de fin ({{ formatDate(getSurveyById(selectedSurvey)?.endDate) }}) avant de générer un rapport.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer-create">
          <button class="btn-cancel" @click="showCreateModal = false">
            <i class="bi bi-x-circle me-2"></i>
            Annuler
          </button>
          <button 
            class="btn-confirm" 
            @click="createReport" 
            :disabled="!selectedSurvey || isCreating || !canCreateReport(selectedSurvey)"
          >
            <i v-if="!isCreating" class="bi bi-check-circle-fill me-2"></i>
            <q-spinner-dots v-else color="white" size="20px" class="me-2" />
            {{ isCreating ? 'Création...' : 'Créer le rapport' }}
          </button>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
@import '../../../css/admin/modern-shared.scss';
@import '../../../css/admin/reports.scss';

// ✅ Tous les styles sont maintenant dans les fichiers SCSS partagés
// Ajoutez ici uniquement les styles spécifiques à ce composant si nécessaire
</style>
