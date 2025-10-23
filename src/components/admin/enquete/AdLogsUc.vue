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
        { key: 'id', label: 'ID', sortable: true },
        { key: 'action', label: 'Action', sortable: true },
        { key: 'actionType', label: 'Type', sortable: true },
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
  <div>
    <BRow class="d-flexjustify-content-center"> </BRow>
    <BRow>
      <BCol cols="12">
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
          <p class="mt-3 text-muted">Aucune données</p>
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
            <a href="#" class="text-body"
              >{{
                data.item.user.participantProfile.firstName ||
                data.item.user.businessAccount.firstName ||
                data.item.user.admin.firstName
              }}
              {{
                data.item.user.participantProfile.lastName ||
                data.item.user.businessAccount.lastName ||
                data.item.user.admin.lastName
              }}</a
            >
          </template>

          <template v-slot:cell(email)="data">
            <a href="#" class="text-warning">{{ data.item.user.email }} </a>
          </template>
          <template v-slot:cell(action_count)="data">
            <a href="#" class="text-body">{{ data.item.action_count }} </a>
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
        <BRow>
          <BCol>
            <div class="dataTables_paginate paging_simple_numbers float-end">
              <ul class="pagination pagination-rounded">
                <BPagination v-model="currentPage" :total-rows="rows" :per-page="perPage" />
              </ul>
            </div>
          </BCol>
        </BRow>
      </BCol>
    </BRow>

    <q-dialog v-model="opendMdet">
      <q-card class="detail-dialog" style="width: 900px; max-width: 90vw">
        <!-- Header -->
        <q-card-section
          class="row items-center q-pa-sm text-white"
          style="padding: 16px 20px; display: flex; align-items: center"
        >
          <div class="q-ml-sm">
            <div class="text-h6 text-primary">Vue Globale des actions de l'Utilisateur</div>
            <div class="text-caption text-primary">📋 Détails du log</div>
          </div>
          <q-space />
        </q-card-section>

        <!-- Contenu -->
        <q-card-section class="dialog-content">
          <div v-if="loadingx" class="text-center q-pa-md">
            <q-spinner-ball color="primary" size="50px" />
            <div class="q-mt-sm text-grey">Chargement des détails...</div>
          </div>

          <div v-else>
            <!-- === Section Statistiques Globales === -->
            <div class="q-mb-md">
              <div class="text-h6 text-primary q-mb-sm">Statistiques globales</div>

              <div class="row q-col-gutter-md">
                <div
                  v-for="(action, index) in sletstats?.actions_by_type || []"
                  :key="index"
                  class="col-12 col-sm-6 col-md-4 col-lg-3"
                >
                  <q-card flat bordered class="text-center shadow-1 stat-card q-pa-sm">
                    <div class="text-h6 text-primary">{{ action.count }}</div>
                    <div class="text-caption text-grey">
                      {{ getActionLabel(action.actionType) }}
                    </div>
                  </q-card>
                </div>
              </div>

              <!-- Total + dernière action -->
              <div class="row q-col-gutter-md q-mt-md">
                <div class="col-6 col-md-4">
                  <q-card flat bordered class="text-center shadow-1 stat-card">
                    <div class="text-h6 text-green">{{ sletstats?.total_actions || 0 }}</div>
                    <div class="text-caption text-grey">Total d'actions</div>
                  </q-card>
                </div>

                <div class="col-6 col-md-8">
                  <q-card flat bordered class="text-center shadow-1 stat-card">
                    <div class="text-h6 text-orange">
                      {{
                        sletstats?.last_action?.timestamp
                          ? new Date(sletstats.last_action.timestamp).toLocaleString('fr-FR')
                          : 'Aucune'
                      }}
                    </div>
                    <div class="text-caption text-grey">
                      Dernière action : {{ sletstats?.last_action?.action || '—' }}
                    </div>
                  </q-card>
                </div>
              </div>
            </div>

            <!-- === Section Logs Détail === -->
            <div class="q-mt-lg">
              <div class="text-h6 text-primary q-mb-sm">🧾 Historique des actions</div>

              <BTable
                :items="paginatedLogs"
                :fields="fieldss"
                striped
                hover
                bordered
                responsive
                small
              >
                <template #cell(timestamp)="data">
                  {{ formatDate(data.item.timestamp) }}
                </template>

                <template #cell(actionType)="data">
                  <span class="badge bg-info">{{ data.item.entityType }}</span>
                </template>
              </BTable>

              <div class="d-flex justify-content-end mt-3">
                <BPagination
                  v-model="currentPages"
                  :total-rows="selectedTask.length"
                  :per-page="perPages"
                  align="right"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
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
