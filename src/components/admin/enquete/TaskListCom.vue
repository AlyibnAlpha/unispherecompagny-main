<script>
import { onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BFormInput,
  BPagination,
  BFormSelect,
  BTable,
} from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
import Swal from 'sweetalert2'
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
    BFormSelect,
    BTable,
  },
  data() {
    const orderData = ref([])
    const ajout = ref(false)
    const opendMdet = ref(false)
    const loading = ref(false)
    const loadings = ref(false)
    const loadingss = ref(false)
    function truncate(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    }

    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/admin/tasks')
        orderData.value = response.data.sort((a, b) => b.id - a.id)
        console.log(orderData.value)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        loading.value = false
      }
    }

    const Add = async () => {
      try {
        loadings.value = true
        await api.post('/admin/tasks/execute')
        Swal.fire({
          icon: 'success',
          title: 'Les demandes sont envoyées avec success',
          showConfirmButton: true,
          timer: 2000,
        })
      } catch (error) {
        console.error(error)
        Notify.create({
          type: 'warning',
          message: `Un problème est survenue pendant l'envoie.Veillez réssayer.`,
          timeout: 3000,
        })
      } finally {
        gets()
        loadings.value = false
      }
    }
    const Demande = async (ids) => {
      try {
        loadingss.value = true
        await api.post(`/admin/tasks/${ids}/execute`)
        Swal.fire({
          icon: 'success',
          title: 'Votre demande a été envoyé avec success',
          showConfirmButton: true,
          timer: 2000,
        })
        gets()
      } catch (error) {
        console.error(error)
        Notify.create({
          type: 'warning',
          message:
            error.response.data.error ||
            `Un problème est survenue pendant l'envoie.Veillez réssayer.`,
          timeout: 5000,
        })
      } finally {
        loadingss.value = false
      }
    }

    const deleteRow = (index) => {
      Swal.fire({
        title: 'Etes vous sur?',
        text: 'Voulez-vous supprimmer le paricipant',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      }).then(async (result) => {
        if (result.value) {
          await api.delete(`/admin/tasks/${index}`)
          gets()
          Swal.fire('Deleted!', 'Supprimer avec success.', 'success')
        }
      })
    }
    const selectedTask = ref(null)

    const openDetailModal = async (index) => {
      const response = await api.get(`/admin/tasks/${index}`)
      selectedTask.value = response.data
      opendMdet.value = true
    }
    onMounted(() => {
      gets()
    })
    return {
      truncate,
      opendMdet,
      selectedTask,
      ajout,
      Demande,
      Add,
      openDetailModal,
      deleteRow,
      orderData,
      loadingss,
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: 'age',
      sortDesc: false,
      chat: ref(false),
      fields: [
        {
          key: 'check',
          label: '',
        },

        {
          key: 'title',
          label: 'Titre',
          sortable: true,
        },
        {
          key: 'surveys',
          label: 'Sondage',
        },
        {
          key: 'survey',
          label: 'Type',
          sortable: true,
        },
        {
          key: 'surveyss',
          label: 'Status du sondage',
          sortable: true,
        },

        {
          key: 'scheduled_at',
          label: 'Date de début',
          sortable: true,
        },
        {
          key: 'dueDate',
          label: 'Date de fin',
          sortable: true,
        },
        {
          key: 'type',
          label: "Type d'envoie",
          sortable: true,
        },
        {
          key: 'completed',
          label: 'Status',
          sortable: true,
        },

        'action',
      ],
      progressBarValue: 15,
      activeTab: 1,
      activeTabArrow: 2,
      loading,
      loadings,
    }
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.orderData.length
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
            <i class="bi bi-list-task"></i>
          </div>
          <div class="section-title-content">
            <h3 class="section-title-modern">Mes Tâches</h3>
            <p class="section-subtitle-modern">Gestion des tâches planifiées</p>
          </div>
        </div>
        <div v-if="loadings" class="d-flex align-items-center">
          <q-spinner-orbit color="primary" size="20px" class="me-2" />
          <span class="text-muted">Exécution en cours...</span>
        </div>
        <button v-else class="btn-execute-all" @click="Add">
          <i class="bi bi-play-circle-fill me-2"></i>
          Tout Exécuter
        </button>
      </div>
    </div>

    <!-- Section tableau séparée -->
    <BRow>
      <BCol cols="12">
        <div class="table-section-card">
          <!-- Contenu du tableau -->
          <div class="table-content-section">
          <BRow>
            <BCol sm="12" md="6">
              <div id="tickets-table_length" class="dataTables_length">
                <label class="d-inline-flex align-items-center">
                  Trier:
                  <BFormSelect v-model="perPage" size="sm" :options="pageOptions"></BFormSelect>
                </label>
              </div>
            </BCol>
            <BCol sm="12" md="6">
              <div id="tickets-table_filter" class="dataTables_filter text-md-end">
                <label class="d-inline-flex align-items-center">
                  Recherche:
                  <BFormInput
                    v-model="filter"
                    type="search"
                    placeholder="Recherche..."
                    class="form-control form-control-sm ms-2"
                  ></BFormInput>
                </label>
              </div>
            </BCol>
          </BRow>
          <div v-if="loading" class="text-center my-5">
            <q-spinner-ball color="primary" size="50px" />
            <p class="mt-3 text-muted">Chargement des tâches...</p>
          </div>
          <div
            v-else-if="Array.isArray(orderData) && orderData.length === 0"
            class="empty-state"
          >
            <div class="empty-state-icon">
              <i class="bi bi-inbox"></i>
            </div>
            <h5 class="empty-state-title">Aucune tâche disponible</h5>
            <p class="empty-state-text">Il n'y a pas de tâches planifiées pour le moment.</p>
          </div>
          <BTable
            v-else
            table-class="table table-centered datatable table-card-list"
            thead-tr-class="bg-transparent"
            :items="orderData"
            :fields="fields"
            responsive="sm"
            :per-page="perPage"
            :current-page="currentPage"
            :filter="filter"
            :filter-included-fields="filterOn"
            @filtered="onFiltered"
          >
            <template v-slot:cell(title)="data">
              <span class="text-body">{{ data.item.title }}</span>
            </template>
            <template v-slot:cell(surveys)="data">
              <span class="text-body">{{
                data.item.survey.title.length > 30
                  ? data.item.survey.title.substring(0, 30) + '...'
                  : data.item.survey.title
              }}</span>
            </template>
            <template v-slot:cell(survey)="data">
              <span
                class="badge-modern"
                :class="{
                  'badge-modern-success': data.item.survey.type === 'PUBLIC',
                  'badge-modern-warning': data.item.survey.type === 'BUSINESS',
                }"
              >{{ data.item.survey.type }}</span>
            </template>
            <template v-slot:cell(surveyss)="data">
              <div
                class="badge badge-pill font-size-12"
                :class="{
                  'bg-soft-primary': data.item.survey.status === 'draft',
                  'bg-soft-success': data.item.survey.status === 'published',
                  'bg-soft-warning': data.item.survey.status === 'archived',
                  'bg-soft-secondary': data.item.survey.status === 'review',
                  'bg-soft-danger': data.item.survey.status === 'closed',
                }"
              >
                {{ data.item.survey.status }}
              </div>
            </template>

            <template v-slot:cell(scheduled_at)="data">
              <span class="text-body">{{
                new Date(data.item.scheduled_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              }}</span>
            </template>
            <template v-slot:cell(dueDate)="data">
              <span class="text-body">{{
                new Date(data.item.dueDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              }}</span>
            </template>
            <template v-slot:cell(type)="data">
              <span
                class="badge-modern"
                :class="{
                  'badge-modern-info': data.item.type[0] === 'invitation',
                  'badge-modern-warning': data.item.type[0] === 'send_reminder',
                }"
              >{{ data.item.type[0] === 'send_reminder' ? 'Renvoyer' : 'Invitation' }}</span>
            </template>

            <template v-slot:cell(completed)="data">
              <span
                class="badge-modern"
                :class="{
                  'badge-modern-success': data.item.completed === true,
                  'badge-modern-danger': data.item.completed === false,
                }"
              >{{ data.item.completed === true ? 'Envoyée' : 'Non Transmis' }}</span>
            </template>

            <template v-slot:cell(action)="data">
              <ul class="list-inline mb-0">
                <li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-info"
                    @click.prevent="openDetailModal(data.item.id)"
                    title="stastique"
                  >
                    <i class="bi bi-eye" style="font-size: 18px"></i>
                  </a>
                </li>

                <li class="list-inline-item" v-if="data.item.completed === false">
                  <a
                    href="#"
                    class="px-2 text-warning"
                    @click.prevent="Demande(data.item.id)"
                    title="envoyée"
                  >
                    <q-spinner-orbit color="orange" size="18px" v-if="loadingss" />
                    <i v-else class="uil uil-redo font-size-18"></i>
                  </a>
                </li>

                <li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-danger"
                    @click.prevent="deleteRow(data.item.id)"
                    title="Delete"
                  >
                    <i class="uil uil-trash-alt font-size-18"></i>
                  </a>
                </li>
              </ul>
            </template>
          </BTable>
          </div>
          
          <!-- Pagination -->
          <div class="table-footer-section">
            <BPagination 
              v-model="currentPage" 
              :total-rows="rows" 
              :per-page="perPage"
              class="modern-pagination"
            />
          </div>
        </div>
      </BCol>
    </BRow>

    <q-dialog v-model="opendMdet" transition-show="scale" transition-hide="fade">
      <q-card class="modern-detail-modal">
        <!-- Header moderne -->
        <div class="modal-header-modern">
          <div class="modal-header-content">
            <div class="modal-icon-wrapper">
              <i class="bi bi-card-checklist"></i>
            </div>
            <div>
              <h4 class="modal-title">{{ selectedTask?.title }}</h4>
              <p class="modal-subtitle">Détails de la tâche</p>
            </div>
          </div>
          <button class="modal-close-btn" @click="opendMdet = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Contenu -->
        <div class="modal-content-modern">
          <!-- Grille d'informations -->
          <div class="info-cards-grid-task">
            <div class="info-card-task">
              <div class="info-card-icon info-icon-blue">
                <i class="bi bi-tag-fill"></i>
              </div>
              <div class="info-card-content">
                <div class="info-card-label">Type</div>
                <span
                  class="badge-modern"
                  :class="selectedTask?.type[0] === 'send_reminder' ? 'badge-modern-warning' : 'badge-modern-info'"
                >
                  {{ selectedTask?.type[0] === 'send_reminder' ? 'Rappel' : 'Invitation' }}
                </span>
              </div>
            </div>

            <div class="info-card-task">
              <div class="info-card-icon info-icon-green">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              <div class="info-card-content">
                <div class="info-card-label">Statut</div>
                <span
                  class="badge-modern"
                  :class="selectedTask?.completed ? 'badge-modern-success' : 'badge-modern-danger'"
                >
                  {{ selectedTask?.completed ? 'Envoyée' : 'Non transmise' }}
                </span>
              </div>
            </div>

            <div class="info-card-task">
              <div class="info-card-icon info-icon-purple">
                <i class="bi bi-calendar-event"></i>
              </div>
              <div class="info-card-content">
                <div class="info-card-label">Date début</div>
                <div class="info-card-value">
                  {{ new Date(selectedTask?.scheduled_at).toLocaleDateString('fr-FR') }}
                </div>
              </div>
            </div>

            <div class="info-card-task">
              <div class="info-card-icon info-icon-purple">
                <i class="bi bi-calendar-check"></i>
              </div>
              <div class="info-card-content">
                <div class="info-card-label">Date fin</div>
                <div class="info-card-value">
                  {{ new Date(selectedTask?.dueDate).toLocaleDateString('fr-FR') }}
                </div>
              </div>
            </div>

            <div class="info-card-task">
              <div class="info-card-icon info-icon-orange">
                <i class="bi bi-clock-history"></i>
              </div>
              <div class="info-card-content">
                <div class="info-card-label">Exécution</div>
                <div class="info-card-value">
                  {{
                    selectedTask?.executed_at
                      ? new Date(selectedTask.executed_at).toLocaleString('fr-FR')
                      : 'Non exécutée'
                  }}
                </div>
              </div>
            </div>

            <div class="info-card-task">
              <div class="info-card-icon info-icon-red">
                <i class="bi bi-exclamation-triangle-fill"></i>
              </div>
              <div class="info-card-content">
                <div class="info-card-label">Erreur</div>
                <div class="info-card-value">
                  {{ selectedTask?.errorMessage || 'Aucune erreur' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="description-section">
            <h5 class="description-title">
              <i class="bi bi-file-text me-2"></i>
              Description
            </h5>
            <p class="description-text">
              {{ selectedTask?.description || 'Pas de description' }}
            </p>
          </div>

          <!-- Section Informations du sondage -->
          <div v-if="selectedTask?.survey" class="survey-section">
            <h5 class="survey-section-title">
              <i class="bi bi-clipboard-data me-2"></i>
              Informations du sondage
            </h5>

            <!-- Titre du sondage en vedette -->
            <div class="survey-title-card">
              <div class="survey-title-icon">
                <i class="bi bi-file-earmark-text-fill"></i>
              </div>
              <div class="survey-title-content">
                <div class="survey-title-label">Titre du sondage</div>
                <div class="survey-title-value">{{ selectedTask.survey.title }}</div>
              </div>
            </div>

            <!-- Grille d'informations -->
            <div class="survey-cards-grid">
              <div class="survey-card survey-card-type">
                <div class="survey-card-icon">
                  <i class="bi bi-diagram-3-fill"></i>
                </div>
                <div class="survey-card-content">
                  <div class="survey-card-label">Type</div>
                  <span
                    class="badge-modern"
                    :class="selectedTask.survey.type === 'PUBLIC' ? 'badge-modern-success' : 'badge-modern-warning'"
                  >
                    {{ selectedTask.survey.type }}
                  </span>
                </div>
              </div>

              <div class="survey-card survey-card-status">
                <div class="survey-card-icon">
                  <i class="bi bi-shield-check"></i>
                </div>
                <div class="survey-card-content">
                  <div class="survey-card-label">Statut</div>
                  <span
                    class="badge-modern"
                    :class="{
                      'badge-modern-info': selectedTask.survey.status === 'draft',
                      'badge-modern-success': selectedTask.survey.status === 'published',
                      'badge-modern-warning': selectedTask.survey.status === 'archived',
                    }"
                  >
                    {{ selectedTask.survey.status }}
                  </span>
                </div>
              </div>

              <div class="survey-card survey-card-start">
                <div class="survey-card-icon">
                  <i class="bi bi-calendar-event"></i>
                </div>
                <div class="survey-card-content">
                  <div class="survey-card-label">Date de début</div>
                  <div class="survey-card-value">{{ new Date(selectedTask.survey.startDate).toLocaleDateString('fr-FR') }}</div>
                </div>
              </div>

              <div class="survey-card survey-card-end">
                <div class="survey-card-icon">
                  <i class="bi bi-calendar-check"></i>
                </div>
                <div class="survey-card-content">
                  <div class="survey-card-label">Date de fin</div>
                  <div class="survey-card-value">{{ new Date(selectedTask.survey.endDate).toLocaleDateString('fr-FR') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';

/* === Page moderne === */
.modern-admin-page {
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* === Carte d'en-tête === */
.header-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 2px solid #f1f5f9;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
}

/* === En-tête de section moderne === */
.section-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .section-title-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;

    .section-icon-modern {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.8rem;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .section-title-content {
      .section-title-modern {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .section-subtitle-modern {
        font-size: 0.95rem;
        color: #64748b;
        margin: 0;
        font-weight: 500;
      }
    }
  }
}

/* === Bouton Exécuter Tout === */
.btn-execute-all {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  i {
    font-size: 1.2rem;
  }
}

/* === Section tableau moderne === */
.table-section-card {
  background: white;
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 2px solid #f1f5f9;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
}

.table-content-section {
  padding: 1.5rem;
}

.table-footer-section {
  padding: 1.25rem 1.5rem;
  background: #fafbfc;
  border-top: 2px solid #f1f5f9;
  display: flex;
  justify-content: center;

  .modern-pagination {
    margin: 0;
    
    .page-item {
      margin: 0 0.25rem;

      .page-link {
        border-radius: 8px;
        border: 2px solid #e2e8f0;
        color: #64748b;
        font-weight: 600;
        padding: 0.5rem 0.75rem;
        transition: all 0.2s ease;

        &:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #475569;
        }
      }

      &.active .page-link {
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-color: #667eea;
        color: white;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      }
    }
  }
}

/* === État vide === */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  margin: 2rem 0;

  .empty-state-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    
    i {
      font-size: 2.5rem;
      color: #94a3b8;
    }
  }

  .empty-state-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #334155;
    margin-bottom: 0.5rem;
  }

  .empty-state-text {
    font-size: 0.95rem;
    color: #64748b;
    margin: 0;
  }
}

/* === Badges modernes === */
.badge-modern {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.badge-modern-success {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #065f46;
    border: 1px solid #6ee7b7;
  }

  &.badge-modern-warning {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    color: #92400e;
    border: 1px solid #fbbf24;
  }

  &.badge-modern-info {
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    color: #1e40af;
    border: 1px solid #93c5fd;
  }

  &.badge-modern-danger {
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    color: #991b1b;
    border: 1px solid #f87171;
  }
}

/* === Modal de détail moderne === */
.modern-detail-modal {
  width: 800px !important;
  max-width: 90vw !important;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  background: white;
}

.modal-header-modern {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .modal-header-content {
    display: flex;
    align-items: center;
    gap: 1rem;

    .modal-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      backdrop-filter: blur(10px);
    }

    .modal-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: white;
      margin: 0;
      line-height: 1.2;
    }

    .modal-subtitle {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0.25rem 0 0 0;
    }
  }

  .modal-close-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    i {
      font-size: 1rem;
    }
  }
}

.modal-content-modern {
  padding: 1.5rem;
}

/* Grille d'informations de tâche */
.info-cards-grid-task {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.info-card-task {
  background: white;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .info-card-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    color: white;
    flex-shrink: 0;

    &.info-icon-blue {
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
    }

    &.info-icon-green {
      background: linear-gradient(135deg, #34d399, #10b981);
    }

    &.info-icon-purple {
      background: linear-gradient(135deg, #a78bfa, #8b5cf6);
    }

    &.info-icon-orange {
      background: linear-gradient(135deg, #fb923c, #f97316);
    }

    &.info-icon-red {
      background: linear-gradient(135deg, #f87171, #ef4444);
    }
  }

  .info-card-content {
    flex: 1;
  }

  .info-card-label {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
  }

  .info-card-value {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1e293b;
  }
}

/* Section Description */
.description-section {
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;

  .description-title {
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;

    i {
      color: #667eea;
    }
  }

  .description-text {
    font-size: 0.9rem;
    color: #475569;
    line-height: 1.6;
    margin: 0;
  }
}

/* Section Sondage */
.survey-section {
  background: linear-gradient(135deg, #fef3c7, #fffbeb);
  border: 2px solid #fbbf24;
  border-radius: 16px;
  padding: 1.5rem;

  .survey-section-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #92400e;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;

    i {
      color: #f59e0b;
      font-size: 1.3rem;
    }
  }
}

/* Carte titre du sondage en vedette */
.survey-title-card {
  background: white;
  border: 2px solid #fbbf24;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.15);

  .survey-title-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .survey-title-content {
    flex: 1;
  }

  .survey-title-label {
    font-size: 0.75rem;
    color: #92400e;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }

  .survey-title-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #78350f;
    line-height: 1.3;
  }
}

/* Grille de cartes sondage */
.survey-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.survey-card {
  background: white;
  border: 2px solid #fde68a;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #fbbf24;
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
    transform: translateY(-2px);
  }

  .survey-card-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    color: white;
    flex-shrink: 0;
  }

  &.survey-card-type .survey-card-icon {
    background: linear-gradient(135deg, #10b981, #059669);
  }

  &.survey-card-status .survey-card-icon {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
  }

  &.survey-card-start .survey-card-icon {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  }

  &.survey-card-end .survey-card-icon {
    background: linear-gradient(135deg, #ec4899, #db2777);
  }

  .survey-card-content {
    flex: 1;
  }

  .survey-card-label {
    font-size: 0.75rem;
    color: #92400e;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
  }

  .survey-card-value {
    font-size: 0.95rem;
    font-weight: 600;
    color: #78350f;
  }
}

/* Grid d'infos */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 20px;
}

.info-box {
  display: flex;
  align-items: flex-start;
  padding: 14px;
  border-radius: 12px;
  background: #f9fafc;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.08);
  transition: all 0.2s ease;
}

.info-box:hover {
  background: #eef2ff;
  transform: translateY(-2px);
}

.label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4b5563;
}
.value {
  font-size: 0.95rem;
  color: #111827;
}

/* Description */
.description-box {
  margin-top: 16px;
  padding: 16px;
  border-radius: 12px;
  background: #f0f9ff;
  display: flex;
  align-items: flex-start;
}

.description-text {
  margin: 4px 0 0;
  color: #374151;
  font-size: 0.95rem;
  line-height: 1.4;
}

/* Animation d'ouverture */
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
.skeleton {
  display: inline-block;
  height: 1em;
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
.skeleton-title {
  width: 60%;
  height: 24px;
}
.skeleton-text {
  width: 100%;
  height: 16px;
  margin: 6px 0;
}
.bg-pink {
  background-color: #ff69b4; /* rose */
  color: white; /* texte blanc pour le contraste */
}

.progress-nav {
  position: relative;
  display: flex;
  align-items: center;
}

.progress {
  width: 100%;
  position: absolute;
  height: 4px;
}

.wizard-steps {
  position: relative;
  z-index: 3;
  width: 100%;

  .wizard-step {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    border: 3px solid;
    display: flex;
    justify-content: center;
    z-index: 9;
    position: relative;
    background: white;
  }
}

.step-arrow-nav {
  .nav-link {
    background: #f3f2ee;
    padding: 4px 0;
    border-radius: 0 !important;
  }
}

.wizard {
  .nav-link:not(.active) {
    color: #f3f2ee;

    .wizard-icon {
      color: #a5a5a5;
    }
  }
}

[data-bs-theme='dark'] {
  .wizard-steps .wizard-step:not(.active) {
    background: var(--bs-input-bg);
  }

  .step-arrow-nav {
    .nav-link:not(.active) {
      background: var(--bs-input-bg);
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
    box-shadow: #1f6bad33 0px 4px 8px;
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
