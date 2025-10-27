<script>
import { computed, onMounted, ref } from 'vue'
import { BRow, BCol, BFormInput, BPagination, BFormSelect, BTable } from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'

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
    const orderDatas = ref([])
    const detailData = ref([])
    const optionl = ref([])
    const loading = ref(false)
    const loadings = ref(false)
    const loadingx = ref(false)

    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/admin/logs/activity/top-users')
        orderData.value = response.data.top_users
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

    const selectedTask = ref([])
    const sletstats = ref(null)
    const opendMdet = ref(false)
    const currentPages = ref(1)
    const perPages = ref(5)

    const paginatedLogs = computed(() => {
      const start = (currentPages.value - 1) * perPages.value
      return selectedTask.value.slice(start, start + perPages.value)
    })

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

    // --- Formattage date
    function formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleString()
    }

    const openDetailModal = async (userId) => {
      try {
        loadingx.value = true

        // 1️⃣ Récupérer les stats
        const statsResponse = await api.get(`/admin/logs/user/${userId}/stats`)
        sletstats.value = statsResponse.data.stats

        // 2️⃣ Récupérer les logs
        const logsResponse = await api.get(`/admin/logs/user/${userId}`)
        selectedTask.value = logsResponse.data.logs

        opendMdet.value = true
      } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error)
      } finally {
        loadingx.value = false
      }
    }
    onMounted(() => {
      gets()
    })
    return {
      getActionLabel,
      paginatedLogs,
      formatDate,
      sletstats,
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
      currentPages,
      perPages,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: 'age',
      sortDesc: false,
      fields: [
        {
          key: 'participantProfile',
          label: 'Participants',
          sortable: true,
        },

        {
          key: 'email',
          label: 'Email',
          sortable: true,
        },

        {
          key: 'action_count',
          label: 'Actions réalisées',
          sortable: true,
        },

        'actions',
      ],
      fieldss: [
        { key: 'action', label: 'Action', sortable: true },
        { key: 'actionType', label: 'Type d\'action', sortable: true },
        { key: 'entityType', label: 'Entité', sortable: true },
        { key: 'timestamp', label: 'Date', sortable: true },
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
          <i class="bi bi-people-fill"></i>
        </div>
        <div class="section-title-content">
          <h3 class="section-title-modern">Logs Utilisateurs</h3>
          <p class="section-subtitle-modern">Actions des utilisateurs les plus actifs</p>
        </div>
      </div>
    </div>

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
          <q-spinner-ball color="primary" size="50px" />
          <p class="mt-3 text-muted">Chargement des données...</p>
        </div>
        <div
          v-else-if="Array.isArray(orderData) && orderData.length === 0"
          class="empty-state"
        >
          <div class="empty-state-icon">
            <i class="bi bi-inbox"></i>
          </div>
          <h5 class="empty-state-title">Aucune donnée disponible</h5>
          <p class="empty-state-text">Il n'y a pas d'utilisateurs actifs à afficher pour le moment.</p>
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
          <template v-slot:cell(participantProfile)="data">
            <span class="text-body">{{
                data.item.user?.participantProfile?.firstName ||
                data.item.user?.businessAccount?.firstName ||
                data.item.user?.admin?.firstName || 'N/A'
              }}
              {{
                data.item.user?.participantProfile?.lastName ||
                data.item.user?.businessAccount?.lastName ||
                data.item.user?.admin?.lastName || ''
              }}</span>
          </template>

          <template v-slot:cell(email)="data">
            <span class="text-body">{{ data.item.user?.email || 'N/A' }}</span>
          </template>
          <template v-slot:cell(action_count)="data">
            <span class="text-body">{{ data.item.action_count || 0 }}</span>
          </template>

          <template v-slot:cell(actions)="data">
            <ul class="list-inline mb-0">
              <li class="list-inline-item">
                <a
                  href="#"
                  class="px-2 text-info"
                  @click.prevent="openDetailModal(data.item.user.id)"
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
      <q-card class="modern-detail-modal-large">
        <!-- Header moderne -->
        <div class="modal-header-modern">
          <div class="modal-header-content">
            <div class="modal-icon-wrapper">
              <i class="bi bi-person-badge-fill"></i>
            </div>
            <div>
              <h4 class="modal-title">Activité Utilisateur</h4>
              <p class="modal-subtitle">Vue globale des actions</p>
            </div>
          </div>
          <button class="modal-close-btn" @click="opendMdet = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Contenu -->
        <div class="modal-content-modern">
          <div v-if="loadingx" class="text-center q-pa-md">
            <q-spinner-ball color="primary" size="50px" />
            <div class="q-mt-sm text-grey">Chargement des détails...</div>
          </div>

          <div v-else>
            <!-- === Section Statistiques Globales === -->
            <div class="stats-section mb-4">
              <h5 class="stats-section-title">
                <i class="bi bi-bar-chart-fill me-2"></i>
                Statistiques globales
              </h5>

              <div class="stats-grid">
                <div
                  v-for="(action, index) in sletstats?.actions_by_type || []"
                  :key="index"
                  class="stat-card-mini"
                >
                  <div class="stat-card-mini-value">{{ action.count }}</div>
                  <div class="stat-card-mini-label">
                    {{ getActionLabel(action.actionType) }}
                  </div>
                </div>
              </div>

              <!-- Total + dernière action -->
              <div class="summary-cards">
                <div class="summary-card summary-card-total">
                  <div class="summary-card-icon">
                    <i class="bi bi-check-circle-fill"></i>
                  </div>
                  <div class="summary-card-content">
                    <div class="summary-card-value">{{ sletstats?.total_actions || 0 }}</div>
                    <div class="summary-card-label">Total d'actions</div>
                  </div>
                </div>

                <div class="summary-card summary-card-last">
                  <div class="summary-card-icon">
                    <i class="bi bi-clock-history"></i>
                  </div>
                  <div class="summary-card-content">
                    <div class="summary-card-value-small">
                      {{
                        sletstats?.last_action?.timestamp
                          ? new Date(sletstats.last_action.timestamp).toLocaleString('fr-FR')
                          : 'Aucune'
                      }}
                    </div>
                    <div class="summary-card-label">
                      Dernière action : {{ sletstats?.last_action?.action || '—' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- === Section Logs Détail === -->
            <div class="logs-history-section">
              <h5 class="logs-history-title">
                <i class="bi bi-journal-text me-2"></i>
                Historique des actions
              </h5>

              <div class="history-table-wrapper">
                <BTable
                  :items="paginatedLogs"
                  :fields="fieldss"
                  hover
                  responsive
                  class="modern-history-table"
                >
                  <template #cell(timestamp)="data">
                    <span class="text-body">{{ formatDate(data.item.timestamp) }}</span>
                  </template>

                  <template #cell(action)="data">
                    <span class="text-body">{{ data.item.action }}</span>
                  </template>

                  <template #cell(actionType)="data">
                    <span class="badge-modern badge-modern-info">{{ getActionLabel(data.item.actionType) }}</span>
                  </template>

                  <template #cell(entityType)="data">
                    <span class="badge-modern badge-modern-purple">{{ data.item.entityType }}</span>
                  </template>
                </BTable>

                <div class="history-pagination">
                  <BPagination
                    v-model="currentPages"
                    :total-rows="selectedTask.length"
                    :per-page="perPages"
                    class="modern-pagination-small"
                  />
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

/* === Modal de détail large === */
.modern-detail-modal-large {
  width: 70vw !important;
  max-width: 1100px !important;
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

/* === Section Statistiques === */
.stats-section {
  .stats-section-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;

    i {
      color: #667eea;
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card-mini {
  background: white;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }

  .stat-card-mini-value {
    font-size: 2rem;
    font-weight: 800;
    color: #667eea;
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .stat-card-mini-label {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.summary-cards {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.summary-card {
  background: white;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .summary-card-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .summary-card-content {
    flex: 1;
  }

  .summary-card-value {
    font-size: 1.8rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .summary-card-value-small {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 0.5rem;
  }

  .summary-card-label {
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 600;
  }

  &.summary-card-total {
    border-color: #d1fae5;
    background: linear-gradient(135deg, #ffffff, #f0fdf4);

    .summary-card-icon {
      background: linear-gradient(135deg, #34d399, #10b981);
      color: white;
    }

    .summary-card-value {
      color: #10b981;
    }
  }

  &.summary-card-last {
    border-color: #dbeafe;
    background: linear-gradient(135deg, #ffffff, #eff6ff);

    .summary-card-icon {
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
      color: white;
    }

    .summary-card-value-small {
      color: #3b82f6;
    }
  }
}

/* === Section Historique === */
.logs-history-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f1f5f9;

  .logs-history-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;

    i {
      color: #667eea;
    }
  }
}

.history-table-wrapper {
  background: white;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  overflow: hidden;

  .modern-history-table {
    margin: 0;

    thead {
      background: linear-gradient(135deg, #f8fafc, #ffffff);
      
      th {
        border-bottom: 2px solid #e2e8f0;
        color: #475569;
        font-weight: 700;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 1rem;
      }
    }

    tbody {
      tr {
        transition: all 0.2s ease;
        border-bottom: 1px solid #f1f5f9;

        &:hover {
          background: #f8fafc;
        }

        td {
          padding: 0.875rem 1rem;
          vertical-align: middle;
          color: #334155;
          font-size: 0.9rem;
        }
      }
    }
  }
}

.badge-modern {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.badge-modern-info {
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    color: #1e40af;
    border: 1px solid #93c5fd;
  }

  &.badge-modern-purple {
    background: linear-gradient(135deg, #e9d5ff, #ddd6fe);
    color: #6b21a8;
    border: 1px solid #c4b5fd;
  }
}

.history-pagination {
  padding: 1rem;
  background: #fafbfc;
  border-top: 2px solid #f1f5f9;
  display: flex;
  justify-content: center;

  .modern-pagination-small {
    margin: 0;

    .page-item {
      margin: 0 0.15rem;

      .page-link {
        border-radius: 6px;
        border: 1px solid #e2e8f0;
        color: #64748b;
        font-weight: 600;
        padding: 0.375rem 0.625rem;
        font-size: 0.85rem;
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
        box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
      }
    }
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
.stat-card {
  transition: all 0.4s ease-in-out;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #fdfdfd, #f5f5f5);
  position: relative;
  overflow: hidden;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
}

.shadow-warning:hover {
  border-color: #f1c40f;
  background-color: linear-gradient(135deg, #f8dc9f, #fff3cc);
  box-shadow: 0 0 18px rgba(241, 196, 15, 0.6);
}
.shadow-success:hover {
  border-color: #2ecc71;
  background: linear-gradient(135deg, #2ecc71, #d4f5e6);
  box-shadow: 0 0 18px rgba(46, 204, 113, 0.6);
}
.shadow-danger:hover {
  border-color: #e74c3c;
  background: linear-gradient(135deg, #ffecec, #ffd9d6);
  box-shadow: 0 0 18px rgba(231, 76, 60, 0.6);
}
.tabs-morphing-container {
  position: relative;
  padding: 20px;
  border-radius: 30px;
  overflow: hidden;
  z-index: 0;
  background: linear-gradient(135deg, #f8f9ff, #eef2ff);
}

/* Les onglets */
.morph-tabs .nav-tabs {
  border: none;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* Chaque onglet */
.morph-tabs .nav-link {
  border-radius: 12px;
  padding: 10px 20px;
  margin: 0 5px;
  color: #444;
  transition: all 0.3s ease-in-out;
}

/* Hover */
.morph-tabs .nav-link:hover {
  background: rgba(99, 102, 241, 0.1); /* indigo clair */
  color: #4f46e5;
}

/* Actif */
.morph-tabs .nav-link.active {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff !important;
  box-shadow: 0 3px 8px rgba(79, 70, 229, 0.3);
  transform: scale(1.05);
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

.form-control.form-control-modern {
  border-radius: 12px;
  border: 2px solid #e0e7ff;
  padding: 0.9rem 1rem;
  width: 100%;
  transition: all 0.3s ease;
  background: #fff;
}

.form-control.form-control-modern:focus {
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
/* Card principal du dialog */

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

.bg-gold {
  background-color: #ffd700 !important;
  color: #fff !important; /* texte blanc pour contraste */
}

.bg-silver {
  background-color: #c0c0c0 !important;
  color: #000 !important; /* texte noir pour contraste */
}

.bg-bronze {
  background-color: #cd7f32 !important;
  color: #fff !important; /* texte blanc */
}
</style>
