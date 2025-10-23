<script>
import { onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BButton,
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
    BButton,
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
  <div>
    <BRow>
      <BCol cols="12" class="h-100">
        <div v-if="loadings" class="d-flex justify-content-between">
          <q-spinner-orbit color="green" size="20px" class="q-mr-sm" />
        </div>
        <div v-else class="d-flex justify-content-between">
          <BButton variant="success" class="waves-effect waves-light mb-3" @click="Add"
            >Tout Execute</BButton
          >
        </div>

        <div
          class="ttable table-centered datatable dt-responsive nowrap table-card-list dataTable no-footer dtr-inline"
        >
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
            <p class="mt-3 text-muted">Aucune Tâches</p>
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
              <a href="#" class="text-body">{{ data.item.title }}</a>
            </template>
            <template v-slot:cell(surveys)="data">
              <a href="#" class="text-body">{{
                data.item.survey.title.length > 30
                  ? data.item.survey.title.substring(0, 30) + '...'
                  : data.item.survey.title
              }}</a>
            </template>
            <template v-slot:cell(survey)="data">
              <a
                href="#"
                class="badge"
                :class="{
                  'bg-success': data.item.survey.type === 'PUBLIC',

                  'bg-warning': data.item.survey.type === 'BUSINESS',
                }"
                >{{ data.item.survey.type }}</a
              >
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
              <a href="#" class="text-body">{{
                new Date(data.item.scheduled_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              }}</a>
            </template>
            <template v-slot:cell(dueDate)="data">
              <a href="#" class="text-body">{{
                new Date(data.item.dueDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              }}</a>
            </template>
            <template v-slot:cell(type)="data">
              <a
                href="#"
                class="badge"
                :class="{
                  'bg-primary': data.item.type[0] === 'invitation',

                  'bg-warning': data.item.type[0] === 'send_reminder',
                }"
                >{{ data.item.type[0] === 'send_reminder' ? 'Renvoyer' : 'Invitation' }}</a
              >
            </template>

            <template v-slot:cell(completed)="data">
              <a
                href="#"
                class="badge"
                :class="{
                  'bg-success': data.item.completed === true,

                  'bg-danger': data.item.completed === false,
                }"
                >{{ data.item.completed === true ? 'Envoyée' : 'Non Transmit' }}</a
              >
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
        <q-card-section class="dialog-header row items-center q-pa-sm text-white">
          <div class="q-ml-sm">
            <div class="text-h6 text-warning">{{ selectedTask?.title }}</div>
            <div class="text-caption text-warning">📋 Détails de la tâche</div>
          </div>
          <q-space />
        </q-card-section>

        <!-- Contenu -->
        <q-card-section class="dialog-content">
          <div class="info-grid">
            <div class="info-box">
              <q-icon name="category" class="text-primary q-mr-sm" />
              <div>
                <div class="label">Type</div>
                <q-badge
                  :color="selectedTask?.type[0] === 'send_reminder' ? 'orange' : 'primary'"
                  class="chip"
                >
                  {{ selectedTask?.type[0] === 'send_reminder' ? 'Rappel' : 'Invitation' }}
                </q-badge>
              </div>
            </div>

            <div class="info-box">
              <q-icon name="check_circle" class="text-green q-mr-sm" />
              <div>
                <div class="label">Statut</div>
                <q-badge :color="selectedTask?.completed ? 'green' : 'red'" class="chip">
                  {{ selectedTask?.completed ? 'Envoyée' : 'Non transmise' }}
                </q-badge>
              </div>
            </div>

            <div class="info-box">
              <q-icon name="event" class="text-indigo q-mr-sm" />
              <div>
                <div class="label">Date début</div>
                <div class="value">
                  {{ new Date(selectedTask?.scheduled_at).toLocaleDateString('fr-FR') }}
                </div>
              </div>
            </div>

            <div class="info-box">
              <q-icon name="event_available" class="text-indigo q-mr-sm" />
              <div>
                <div class="label">Date fin</div>
                <div class="value">
                  {{ new Date(selectedTask?.dueDate).toLocaleDateString('fr-FR') }}
                </div>
              </div>
            </div>

            <div class="info-box">
              <q-icon name="alarm" class="text-pink q-mr-sm" />
              <div>
                <div class="label">Exécution</div>
                <div class="value">
                  {{
                    selectedTask?.executed_at
                      ? new Date(selectedTask.executed_at).toLocaleString('fr-FR')
                      : 'Non exécutée'
                  }}
                </div>
              </div>
            </div>

            <div class="info-box col-span-2">
              <q-icon name="error_outline" class="text-red q-mr-sm" />
              <div>
                <div class="label">Erreur</div>
                <div class="value text-negative">
                  {{ selectedTask?.errorMessage || 'Aucune erreur' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="description-box q-mt-md">
            <q-icon name="description" class="text-teal q-mr-sm" />
            <div>
              <div class="label">Description</div>
              <p class="description-text">
                {{ selectedTask?.description || 'Pas de description' }}
              </p>
            </div>
          </div>

          <!-- 🟩 Section Informations du sondage avec Bootstrap -->
          <div
            v-if="selectedTask?.survey"
            class="survey-info q-mt-md q-pa-md bg-grey-1 rounded-borders shadow-1"
          >
            <div class="text-subtitle1 text-primary q-mb-md">🧾 Informations du sondage</div>

            <table class="table table-sm table-striped table-bordered mb-0">
              <tbody>
                <tr>
                  <th scope="row">Titre</th>
                  <td>{{ selectedTask.survey.title }}</td>
                </tr>
                <tr>
                  <th scope="row">Type de sondage</th>
                  <td>
                    <span
                      class="badge"
                      :class="selectedTask.survey.type === 'PUBLIC' ? 'bg-success' : 'bg-warning'"
                    >
                      {{ selectedTask.survey.type }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Statut</th>
                  <td>
                    <span
                      class="badge"
                      :class="{
                        'bg-soft-primary': selectedTask.survey.status === 'draft',
                        'bg-soft-success': selectedTask.survey.status === 'published',
                        'bg-soft-warning': selectedTask.survey.status === 'archived',
                        'bg-soft-secondary': selectedTask.survey.status === 'review',
                        'bg-soft-danger': selectedTask.survey.status === 'closed',
                      }"
                    >
                      {{ selectedTask.survey.status }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Date de début</th>
                  <td>{{ new Date(selectedTask.survey.startDate).toLocaleDateString('fr-FR') }}</td>
                </tr>
                <tr>
                  <th scope="row">Date de fin</th>
                  <td>{{ new Date(selectedTask.survey.endDate).toLocaleDateString('fr-FR') }}</td>
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
.detail-dialog {
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(50, 50, 93, 0.25);
  background: #fff;
}

/* Header */
.dialog-header {
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
