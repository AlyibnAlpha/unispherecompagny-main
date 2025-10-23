<script>
import { onMounted, ref } from 'vue'
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
    const ROLEA = import.meta.env.VITE_DEFAULT_ROLEA
    const ROLEB = import.meta.env.VITE_DEFAULT_ROLEB
    const ROLEP = import.meta.env.VITE_DEFAULT_ROLEP

    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/admin/logs/activity/recent')
        orderData.value = response.data.logs
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

    const selectedTask = ref(null)
    const opendMdet = ref(false)
    const openDetailModal = async (index) => {
      const response = await api.get(`/admin/logs/${index}`)
      console.log(response.data)
      selectedTask.value = response.data
      opendMdet.value = true
    }
    onMounted(() => {
      gets()
    })
    return {
      getActionLabel,
      ROLEA,
      ROLEB,
      ROLEP,
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
          <p class="mt-3 text-muted">Aucune vue récents dans ces 24 heures</p>
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
            <a href="#" class="text-warning">{{ truncate(data.item.action, 53) }}</a>
          </template>
          <template v-slot:cell(timestamp)="data">
            <a href="#" class="text-body">{{
              new Date(data.item.timestamp).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            }}</a>
          </template>

          <template v-slot:cell(entityType)="data">
            <a href="#" class="text-body">{{
              data.item.entityType === 'Responses' ? 'Réponse' : data.item.entityType
            }}</a>
          </template>

          <template v-slot:cell(actionType)="data">
            <a href="#" class="text-body">{{
              data.item.actionType === 'SAVE' ? 'Sauvegarde' : data.item.actionType
            }}</a>
          </template>
          <template v-slot:cell(user)="data">
            <a href="#" class="text-warning">{{ data.item.user.email }}</a>
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
      <q-card class="detail-dialog" style="width: 800px; max-width: 90vw">
        <!-- Header -->
        <q-card-section class="dialog-header row items-center q-pa-sm bg-primary text-white">
          <div class="q-ml-sm">
            <div class="text-h6">{{ selectedTask?.action }}</div>
            <div class="text-caption text-white-7">📋 Détails du log</div>
          </div>
          <q-space />
        </q-card-section>

        <!-- Contenu -->
        <q-card-section class="dialog-content">
          <div class="info-grid">
            <div class="info-box">
              <q-icon name="assignment" class="text-primary q-mr-sm" />
              <div>
                <div class="label">ID du log</div>
                <div class="value">{{ selectedTask?.id }}</div>
              </div>
            </div>

            <div class="info-box">
              <q-icon name="category" class="text-indigo q-mr-sm" />
              <div>
                <div class="label">Type d'action</div>
                <div class="value">{{ getActionLabel(selectedTask?.actionType) }}</div>
              </div>
            </div>

            <div class="info-box">
              <q-icon name="event" class="text-indigo q-mr-sm" />
              <div>
                <div class="label">Date de l'action</div>
                <div class="value">
                  {{ new Date(selectedTask?.timestamp).toLocaleString('fr-FR') }}
                </div>
              </div>
            </div>

            <div class="info-box col-span-2">
              <q-icon name="people" class="text-teal q-mr-sm" />
              <div>
                <div class="label">Utilisateur</div>
                <div class="value">
                  {{
                    selectedTask?.user?.participantProfile?.firstName ||
                    selectedTask.user?.businessAccount?.firstName ||
                    selectedTask.user.admin.firstName
                  }}
                  {{
                    selectedTask?.user?.participantProfile?.lastName ||
                    selectedTask?.user?.businessAccount?.lastName ||
                    selectedTask.user?.admin?.lastName
                  }}({{ selectedTask?.user?.email }})
                </div>
              </div>
            </div>

            <div class="info-box col-span-2">
              <q-icon name="verified_user" class="text-green q-mr-sm" />
              <div>
                <div class="label">Rôles</div>
                <div class="value">
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

            <div class="info-box col-span-2">
              <q-icon name="info" class="text-indigo q-mr-sm" />
              <div>
                <div class="label">Entité</div>
                <div class="value">
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
            class="survey-info q-mt-md q-pa-md bg-grey-1 rounded-borders shadow-1"
          >
            <div class="text-subtitle1 text-primary q-mb-md">🧾 Détails du Sondage</div>
            <table class="table table-sm table-striped table-bordered mb-0">
              <tbody>
                <tr>
                  <th scope="row">Titre du sondag</th>
                  <td>{{ selectedTask?.metadata?.survey_title }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
.dialog-header {
  background: linear-gradient(135deg, #4f46e5, #6d28d9);
  color: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
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
