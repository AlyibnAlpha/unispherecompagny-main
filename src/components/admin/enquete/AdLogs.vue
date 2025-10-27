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
import CountToComponent from 'src/components/common/CountToComponent.vue'
  
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
    CountToComponent,
  },
  data() {
    const orderData = ref([])
    const orderDatas = ref([])
    const detailData = ref([])
    const optionl = ref([])
    const loading = ref(false)
    const loadings = ref(false)
    const loadingx = ref(false)
    const ROLEA = import.meta.env.VITE_DEFAULT_ROLEA
    const ROLEB = import.meta.env.VITE_DEFAULT_ROLEB
    const ROLEP = import.meta.env.VITE_DEFAULT_ROLEP

    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/admin/logs')
        orderData.value = response.data.logs

        const responses = await api.get('/admin/logs/stats')
        orderDatas.value = responses.data
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }
    function truncate(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    }

    const selectedTask = ref(null)
    const opendMdet = ref(false)
    const openDetailModal = async (index) => {
      const response = await api.get(`/admin/logs/${index}`)
      console.log(response.data)
      selectedTask.value = response.data
      opendMdet.value = true
    }
    function getActionLabel(type) {
      const map = {
        CREATE: 'Création d’entités',
        UPDATE: 'Mise à jour d’entités',
        DELETE: 'Suppression d’entités',
        PUBLISH: 'Publication de sondages',
        UNPUBLISH: 'Dépublication de sondages',
        ASSIGN_PARTICIPANTS: 'Assignation de participants',
        FINALIZE: 'Finalisation d’une réponse',
        SAVE: 'Sauvegarde',
        REDEEM: 'Échange de récompense',
        ERROR: 'Erreur système',
      }
      return map[type] || type
    }
    onMounted(() => {
      gets()
    })
    return {
      getActionLabel,
      openDetailModal,
      truncate,
      selectedTask,
      opendMdet,
      orderDatas,
      activeTabss: 0,
      optionl,
      detailData,
      orderData,
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: 'age',
      sortDesc: false,
      ROLEA,
      ROLEB,
      ROLEP,
      fields: [
        {
          key: 'action',
          label: 'Action',
          sortable: true,
        },

        {
          key: 'timestamp',
          label: "Date de l'action",
          sortable: true,
        },

        {
          key: 'entityType',
          label: 'Type',
          sortable: true,
        },
        {
          key: 'actionType',
          label: "Type de l'action",
          sortable: true,
        },
        {
          key: 'user',
          label: 'Utilisateur',
          sortable: true,
        },
        'actions',
      ],
      progressBarValue: 15,
      activeTab: 1,
      activeTabArrow: 2,

      loading,
      loadings,
      loadingx,
    }
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.orderData.length
    },
    totalRecentLog() {
      return this.orderDatas.recent_logs_7_days
    },
    totalLog() {
      return this.orderDatas.total_logs
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
    <!-- En-tête de section moderne -->
    <div class="section-header-modern mb-4">
      <div class="section-title-wrapper">
        <div class="section-icon-modern">
          <i class="bi bi-journal-text"></i>
        </div>
        <div class="section-title-content">
          <h3 class="section-title-modern">Logs d'Activité</h3>
          <p class="section-subtitle-modern">Historique complet des actions</p>
        </div>
      </div>
    </div>

    <!-- Cartes de statistiques modernes -->
    <BRow class="g-3 mb-4">
      <BCol md="6">
        <div class="modern-stat-card stat-info">
          <div class="stat-icon">
            <i class="bi bi-clock-history"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">
              <CountToComponent :startVal="0" :endVal="totalRecentLog" :duration="2000" />
            </h3>
            <p class="stat-label">Actions Récentes (7 jours)</p>
          </div>
        </div>
      </BCol>
      <BCol md="6">
        <div class="modern-stat-card stat-success">
          <div class="stat-icon">
            <i class="bi bi-check2-all"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">
              <CountToComponent :startVal="0" :endVal="totalLog" :duration="2000" />
            </h3>
            <p class="stat-label">Actions Réalisées (Total)</p>
          </div>
        </div>
      </BCol>
    </BRow>

    <!-- Section tableau -->
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
          <q-spinner-ball color="green" size="50px" />
        </div>
        <div
          v-else-if="Array.isArray(orderData) && orderData.length === 0"
          class="text-center py-5"
        >
          <i class="uil uil-folder-open text-muted" style="font-size: 3rem"></i>
          <p class="mt-3 text-muted">Aucune Classements</p>
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
          <template v-slot:cell(action)="data">
            <span class="text-body">{{ truncate(data.item.action, 53) }}</span>
          </template>
          <template v-slot:cell(timestamp)="data">
            <span class="text-body">{{
              new Date(data.item.timestamp).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            }}</span>
          </template>

          <template v-slot:cell(entityType)="data">
            <span class="text-body">{{
              data.item.entityType === 'Responses' ? 'Réponse' : data.item.entityType
            }}</span>
          </template>

          <template v-slot:cell(actionType)="data">
            <span class="text-body">{{
              data.item.actionType === 'SAVE' ? 'Sauvegarde' : data.item.actionType
            }}</span>
          </template>
          <template v-slot:cell(user)="data">
            <span class="text-body">{{ data.item.user.email }}</span>
          </template>
          <template v-slot:cell(actions)="data">
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
              <i class="bi bi-file-text-fill"></i>
            </div>
            <div>
              <h4 class="modal-title">{{ selectedTask?.action }}</h4>
              <p class="modal-subtitle">Détails du log d'activité</p>
            </div>
          </div>
          <button class="modal-close-btn" @click="opendMdet = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Contenu -->
        <div class="modal-content-modern">
          <!-- Grille d'informations -->
          <div class="info-cards-grid-logs">
            <div class="info-card-log">
              <div class="info-card-icon info-icon-blue">
                <i class="bi bi-hash"></i>
              </div>
              <div class="info-card-content">
                <div class="info-card-label">ID du log</div>
                <div class="info-card-value">{{ selectedTask?.id }}</div>
              </div>
            </div>

            <div class="info-card-log">
              <div class="info-card-icon info-icon-purple">
                <i class="bi bi-lightning-charge-fill"></i>
              </div>
              <div class="info-card-content">
                <div class="info-card-label">Type d'action</div>
                <div class="info-card-value">{{ getActionLabel(selectedTask?.actionType) }}</div>
              </div>
            </div>

            <div class="info-card-log">
              <div class="info-card-icon info-icon-orange">
                <i class="bi bi-calendar-event"></i>
              </div>
              <div class="info-card-content">
                <div class="info-card-label">Date de l'action</div>
                <div class="info-card-value">
                  {{ new Date(selectedTask?.timestamp).toLocaleString('fr-FR') }}
                </div>
              </div>
            </div>

            <div class="info-card-log">
              <div class="info-card-icon info-icon-green">
                <i class="bi bi-person-circle"></i>
              </div>
              <div class="info-card-content">
                <div class="info-card-label">Utilisateur</div>
                <div class="info-card-value">
                  {{
                    selectedTask?.user?.participantProfile?.firstName ||
                    selectedTask?.user?.businessAccount?.firstName ||
                    selectedTask?.user?.admin?.firstName
                  }}
                  {{
                    selectedTask?.user?.participantProfile?.lastName ||
                    selectedTask?.user?.businessAccount?.lastName ||
                    selectedTask?.user?.admin?.lastName
                  }}
                  ({{ selectedTask?.user?.email }})
                </div>
              </div>
            </div>

            <div class="info-card-log">
              <div class="info-card-icon info-icon-purple">
                <i class="bi bi-shield-check"></i>
              </div>
              <div class="info-card-content">
                <div class="info-card-label">Rôle</div>
                <div class="info-card-value">
                  {{
                    selectedTask?.user?.roles[0] === ROLEP
                      ? 'Participant'
                      : selectedTask?.user?.roles[0] === ROLEB
                        ? 'Business'
                        : 'Administrateur'
                  }}
                </div>
              </div>
            </div>

            <div class="info-card-log">
              <div class="info-card-icon info-icon-blue">
                <i class="bi bi-folder2-open"></i>
              </div>
              <div class="info-card-content">
                <div class="info-card-label">Entité</div>
                <div class="info-card-value">
                  {{ selectedTask?.entityType }}
                </div>
              </div>
            </div>
          </div>

          <!-- Metadata -->
          <div
            v-if="
              selectedTask?.metadata?.survey_title &&
              selectedTask.metadata.survey_title.trim() !== ''
            "
            class="metadata-section"
          >
            <h5 class="metadata-title">
              <i class="bi bi-clipboard-data me-2"></i>
              Détails du Sondage
            </h5>
            <div class="metadata-card">
              <div class="metadata-label">Titre du sondage</div>
              <div class="metadata-value">{{ selectedTask?.metadata?.survey_title }}</div>
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

/* === En-tête de section moderne === */
.section-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

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

/* === Cartes de statistiques modernes === */
.modern-stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #667eea, #764ba2);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

    &::before {
      opacity: 1;
    }

    .stat-icon {
      transform: scale(1.1) rotate(5deg);
    }
  }

  .stat-icon {
    width: 64px;
    height: 64px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    color: white;
    flex-shrink: 0;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .stat-content {
    flex: 1;

    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      line-height: 1;
      margin: 0 0 0.5rem 0;
      color: #1e293b;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 600;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  &.stat-info {
    .stat-icon {
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
    }

    &:hover {
      border-color: #dbeafe;
      background: linear-gradient(135deg, #ffffff, #eff6ff);
    }
  }

  &.stat-success {
    .stat-icon {
      background: linear-gradient(135deg, #34d399, #10b981);
    }

    &:hover {
      border-color: #d1fae5;
      background: linear-gradient(135deg, #ffffff, #f0fdf4);
    }
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

/* === Modal de détail moderne === */
.modern-detail-modal {
  width: 60vw !important;
  max-width: 950px !important;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  background: white;

  @media (max-width: 768px) {
    width: 90vw !important;
  }
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

.info-cards-grid-logs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.info-card-log {
  background: white;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .info-card-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
    flex-shrink: 0;

    &.info-icon-orange {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
    }

    &.info-icon-purple {
      background: linear-gradient(135deg, #a78bfa, #8b5cf6);
    }

    &.info-icon-blue {
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
    }

    &.info-icon-green {
      background: linear-gradient(135deg, #34d399, #10b981);
    }
  }

  .info-card-content {
    flex: 1;

    .info-card-label {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.5rem;
    }

    .info-card-value {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.3;
    }
  }
}

.metadata-section {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border-radius: 16px;
  border: 2px solid #bae6fd;

  .metadata-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #0c4a6e;
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;

    i {
      color: #0284c7;
    }
  }

  .metadata-card {
    background: white;
    padding: 1rem;
    border-radius: 12px;
    border: 2px solid #e0f2fe;

    .metadata-label {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.5rem;
    }

    .metadata-value {
      font-size: 1rem;
      font-weight: 600;
      color: #0c4a6e;
    }
  }
}
</style>
