<script>
import { onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BButton,
  BFormInput,
  BPagination,
  BCard,
  BCardBody,
  BDropdown,
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
    BButton,
    BFormInput,
    BPagination,
    BCard,
    BCardBody,
    BDropdown,
    TeleDetail,
  },
  data() {
    const orderData = ref([])
    const authStore = useAuthStore()
    const router = useRouter()
    const selectedReport = ref([])
    const isDownloading = ref(false)
    const loading = ref(false)
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
  <div>
    <BRow>
      <BCol cols="12">
        <div class="d-flex justify-content-between">
          <BButton variant="success" class="btn-success" @click="ajout()">Créer un Rapport</BButton>
        </div>

        <div
          class="ttable table-centered datatable dt-responsive nowrap table-card-list dataTable no-footer dtr-inline"
        >
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
            <q-spinner-ball color="green" size="50px" />
          </div>
          <div
            v-else-if="Array.isArray(paginatedData) && paginatedData.length === 0"
            class="text-center py-5"
            style="margin-top: 5px"
          >
            <i class="uil uil-folder-open text-muted" style="font-size: 3rem"></i>
            <p class="mt-3 text-muted">Aucun Rapport</p>
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
              <BCard no-body class="ultra-card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5 class="card-title mb-0">Rapport: {{ truncate(item.survey.title, 40) }}</h5>
                  <BDropdown toggle-class=" p-0" no-caret menu-class="dropdown-menu-end">
                    <template #button-content>
                      <i class="uil uil-ellipsis-h dropdown-icon"></i>
                    </template>
                    <!--<a class="dropdown-item" href="#" @click.prevent="openEditModal(item.id)">
                      <i class="uil uil-pen me-1"></i> Modifier
                    </a>-->
                    <a class="dropdown-item" href="#" @click.prevent="deleteRow(item.id)">
                      <i class="uil uil-trash-alt me-1"></i> Supprimer
                    </a>
                  </BDropdown>
                </div>

                <BCardBody>
                  <div class="card-stats">
                    <div
                      class="stat"
                      v-for="(stat, i) in [
                        {
                          icon: 'uil-users-alt',
                          value: item.totalParticipants,
                          label: 'Participations',
                        },
                        { icon: 'uil-check-circle', value: item.totalResponses, label: 'Réponses' },
                        { icon: 'uil-star', value: item.participationRate, label: 'Moyenne' },
                      ]"
                      :key="i"
                    >
                      <i :class="stat.icon"></i>
                      <span class="stat-value">{{ stat.value }}</span>
                      <small>{{ stat.label }}</small>
                    </div>
                  </div>

                  <p class="card-description mt-3">
                    Ce rapport présente un résumé complet des participations et réponses pour le
                    sondage
                    <strong style="color: black">{{ truncate(item.survey.title, 40) }}</strong
                    >. Analysez les performances et exportez les données pour plus de détails.
                  </p>
                </BCardBody>

                <BCardBody class="text-center">
                  <BButton
                    variant="download"
                    class="btn-download"
                    @click="downloadReport(item.survey.id)"
                    :disabled="isDownloading"
                  >
                    <i v-if="!isDownloading" class="uil uil-file-download-alt me-1"></i>
                    <i v-else class="spinner-border spinner-border-sm me-2"></i>
                    {{ isDownloading ? 'Téléchargement...' : 'Télécharger' }}
                  </BButton>
                </BCardBody>
              </BCard>
            </BCol>
            <div
              ref="statDetail"
              style="position: absolute; top: 0; left: -9999px; width: 210mm; padding: 20px"
            >
              <TeleDetail v-if="selectedReport" :report="selectedReport" />
            </div>
          </BRow>
        </div>
        <BRow>
          <BCol>
            <div class="dataTables_paginate paging_simple_numbers float-end">
              <ul class="pagination pagination-rounded">
                <BPagination
                  v-model="currentPage"
                  :total-rows="filteredData.length"
                  :per-page="perPage"
                  align="right"
                  size="md"
                />
              </ul>
            </div>
          </BCol>
        </BRow>
      </BCol>
    </BRow>
  </div>
</template>

<style lang="scss">
.dropdown-menu {
  z-index: 1050 !important;
}
@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.ultra-card {
  min-height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(270deg, #b2f2fa, #83eefc, #4edaec, #b2f2fa);
  background-size: 800% 800%;
  border-radius: 20px;
  overflow: hidden;
  color: #141313;
  position: relative;
  transition: all 0.5s ease;
  cursor: pointer;
  animation: gradientBG 10s ease infinite;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(12px);

  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  }

  .card-header {
    padding: 1rem;
    font-weight: 700;
    font-size: 1.1rem;

    .dropdown-icon {
      transition:
        transform 0.3s ease,
        color 0.3s ease;
    }

    .dropdown-icon:hover {
      transform: rotate(15deg) scale(1.3);
      color: #3b3602;
    }
  }

  .card-stats {
    display: flex;
    justify-content: space-around;

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-weight: 600;
      transition: transform 0.3s ease;

      i {
        font-size: 1.8rem;
        margin-bottom: 5px;
        transition: all 0.3s ease;
      }

      .stat-value {
        font-size: 1.3rem;
        margin-bottom: 2px;
        animation: countUp 1s ease;
      }

      small {
        font-size: 0.75rem;
        opacity: 0.8;
      }

      &:hover {
        transform: scale(1.1);
        i {
          color: #4edaec;
          transform: scale(1.3) rotate(-10deg);
        }
      }
    }
  }

  .card-description {
    font-size: 0.85rem;
    line-height: 1.4;
    opacity: 0.95;
  }

  .btn-download {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 50px;
    padding: 0.4rem 1.2rem;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
      transform: scale(1.1) translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    i {
      margin-right: 5px;
    }
  }
}
.BCardBody.text-center {
  display: flex;
  justify-content: center;
  flex-wrap: wrap; // pour que le bouton descende si l'écran est petit
}

/* Animation stat-count */
@keyframes countUp {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.search-wrapper-modern {
  position: relative;
  width: 300px; // largeur du champ
  display: flex;
  align-items: center;

  .search-icon {
    position: absolute;
    left: 12px;
    font-size: 1.2rem;
    color: #10d0f2;
    pointer-events: none;
  }

  .form-control-modern {
    width: 100%;
    padding: 0.55rem 1rem 0.55rem 2.5rem; // padding gauche pour icône
    border-radius: 50px;
    border: 2px solid #e0e7ff;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(16, 208, 242, 0.2);

    &:focus {
      border-color: #10d0f2;
      box-shadow: 0 0 12px rgba(16, 208, 242, 0.4);
      transform: scale(1.02);
    }

    &::placeholder {
      color: #a0a0a0;
      font-weight: 500;
    }
  }
}
/* === Boutons modernes === */
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

/* === Table améliorée === */
.table tbody tr {
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #f9fcff;
    transform: scale(1.01);
  }
}

/* Icônes d'action */
.list-inline-item a {
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2) rotate(-5deg);
    opacity: 0.8;
  }
}

/* === Dialogues avec animation === */
.q-dialog__inner {
  animation: fadeScale 0.35s ease forwards;
}

@keyframes fadeScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* === Inputs flottants modernes === */
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

.form-control-modern {
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

/* Multiselect alignement */
.multiselect {
  border-radius: 12px !important;
  border: 2px solid #e0e7ff !important;
  padding: 6px 10px;
  transition: all 0.3s ease;
}
.multiselect:focus-within {
  border-color: #10d0f2 !important;
  box-shadow: 0 0 8px rgba(102, 16, 242, 0.25);
}
</style>
