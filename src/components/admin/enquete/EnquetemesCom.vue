<script>
import { chatData, chatMessagesData, groupData } from '../enquete/utils3.js'
import { onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BButton,
  BFormInput,
  BPagination,
  BFormSelect,
  BTable,
  BDropdown,
  BDropdownItem,
} from 'bootstrap-vue-next'
import Step1 from './actions/Step1Ac.vue'
import Step2 from './actions/Step2Ac.vue'
import Step3 from './actions/Step3Ac.vue'
import Step4Ac from './actions/Step4Ac.vue'
import Step5Ac from './actions/Step5Ac.vue'

import simplebar from 'simplebar-vue'
import { api } from 'src/boot/axios.js'
import { useRegisterStore } from 'src/stores/useRegisterStore.js'
import Swal from 'sweetalert2'
import { useAuthStore } from 'src/stores/auth.js'
import { useRouter } from 'vue-router'
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
    Step1,
    Step2,
    Step3,
    Step4Ac,
    simplebar,
    BDropdown,
    BDropdownItem,

    Step5Ac,
  },
  data() {
    const orderData = ref([])
    const edit = ref(false)
    const editingSurvey = ref(null)
    const detail = ref(false)
    const listdetail = ref([])
    const store = useRegisterStore()
    const authStore = useAuthStore()
    const ajout = ref(false)
    const route = useRouter()
    const categories = ref([])
    const loading = ref(true)

    const getcaetory = async () => {
      const role = authStore.roles[0]
      if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
        const response = await api.get('/admin/survey-categories')
        categories.value = response.data.categories.map((cat) => ({
          label: cat.name,
          value: cat.id,
        }))
      } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
        const response = await api.get('/admin/survey-categories')
        categories.value = response.data.categories.map((cat) => ({
          label: cat.name,
          value: cat.id,
        }))
      }
    }

    const gets = async () => {
      try {
        const role = authStore.roles[0]
        let response
        if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          response = await api.get('/surveys')
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          response = await api.get('/admin/surveys')
        }
        orderData.value = response.data.sort((a, b) => b.id - a.id)
      } catch (error) {
        console.error('Error fetching surveys:', error)
        orderData.value = []
      } finally {
        loading.value = false
      }
    }
    const deleteSurvey = async (surveyId) => {
      Swal.fire({
        title: 'Etes vous sur?',
        text: 'Voulez-vous supprimmer le sondage',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      }).then(async (result) => {
        if (result.value) {
          try {
            await api.delete(`/surveys/${surveyId}`)
            gets()
            Swal.fire('Deleted!', 'Le sondage a été supprimer avec success.', 'success')
          } catch (error) {
            console.error('Error deleting survey:', error)
            Swal.fire(
              'Error!',
              error.response.data.message ||
                "Une erreur s'est produite lors de la suppression du sondage.",
              'error',
            )
          }
        }
      })
    }
    const creaOpenModal = () => {
      store.setIdSurvey(null)
      ajout.value = true
    }
    const openEditModal = (survey) => {
      editingSurvey.value = { ...survey }
      store.setIdSurvey(editingSurvey.value.id.toString())
      setTimeout(() => {
        const role = authStore.roles[0]
        if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          route.push(`/admin/enquetes-modification/${editingSurvey.value.slug}`)
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          route.push(`/business/enquetes-modification/${editingSurvey.value.slug}`)
        }
      }, 500)
      this.activeTab = 1
      this.progressBarValue = 15
    }

    const openDetailModal = (survey) => {
      const id = survey ? survey.slug : null
      const role = authStore.roles[0]
      if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
        route.push(`/admin/enquetes-details/${id}`)
      } else if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
        route.push(`/business/enquetes-details/${id}`)
      }
    }
    const step3Ref = ref(0)

    const refreshStep3 = async () => {
      step3Ref.value++
    }

    onMounted(() => {
      gets()
      getcaetory()
    })
    return {
      gets,
      openEditModal,
      deleteSurvey,
      openDetailModal,
      refreshStep3,
      step3Ref,
      detail,
      listdetail,
      orderData,
      edit,
      editingSurvey,
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: 'age',
      sortDesc: false,
      ajout,
      chat: ref(false),
      chatData: chatData,
      groupData: groupData,
      chatMessagesData,
      loading,
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
          key: 'startDate',
          label: 'date de création',
          sortable: true,
        },
        {
          key: 'endDate',
          label: 'date de fin',
          sortable: true,
        },
        {
          key: 'status',
          label: 'Status',
          sortable: true,
        },
        'action',
      ],
      progressBarValue: 10,
      activeTab: 1,
      activeTabArrow: 2,
      creaOpenModal,
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
    toggleWizard(tab, value) {
      this.activeTab = tab
      this.progressBarValue = value
    },

    toggleTabWizard(tab) {
      this.activeTabArrow = tab
    },
    closeModal() {
      this.edit = false
      this.ajout = false
      this.gets()
    },
  },
}
</script>

<template>
  <div class="modern-enquete-container">
    <BRow>
      <BCol cols="12">
        <div class="page-header">
          <div class="header-content">
            <h2 class="page-title">Gestion des Enquêtes</h2>
            <p class="page-subtitle">Créez et gérez vos enquêtes en toute simplicité</p>
          </div>
          <BButton variant="success" class="modern-create-btn" @click="creaOpenModal">
            <i class="bi bi-plus-circle me-2"></i>
            Créer une enquête
          </BButton>
        </div>

          <q-dialog v-model="ajout">
            <q-card class="modern-wizard-card">
              <!-- Titre -->
              <q-card-section class="wizard-header">
                <div class="wizard-title">
                  <i class="bi bi-clipboard-data me-2"></i>
                  Créez une enquête
                </div>
                <div class="wizard-subtitle">Suivez les étapes pour créer votre enquête</div>
              </q-card-section>

              <!-- Étapes modernes -->
              <div class="wizard-steps-container">
                <div class="wizard-progress">
                  <div class="progress-line" :style="{ width: `${progressBarValue}%` }"></div>
                </div>

                <div class="wizard-steps">
                  <div class="wizard-step" :class="{ active: activeTab >= 1, completed: activeTab > 1 }">
                    <div class="step-icon">
                      <i class="bi bi-gear-fill" v-if="activeTab >= 1"></i>
                      <i class="bi bi-gear" v-else></i>
                    </div>
                    <div class="step-content">
                      <div class="step-title">Installation</div>
                      <div class="step-description">Configuration initiale</div>
                    </div>
                    <div class="step-arrow" v-if="activeTab < 5">
                      <i class="bi bi-arrow-right"></i>
                    </div>
                  </div>

                  <div class="wizard-step" :class="{ active: activeTab >= 2, completed: activeTab > 2 }">
                    <div class="step-icon">
                      <i class="bi bi-people-fill" v-if="activeTab >= 2"></i>
                      <i class="bi bi-people" v-else></i>
                    </div>
                    <div class="step-content">
                      <div class="step-title">Choisissez votre public</div>
                      <div class="step-description">Définir la cible</div>
                    </div>
                    <div class="step-arrow" v-if="activeTab < 5">
                      <i class="bi bi-arrow-right"></i>
                    </div>
                  </div>

                  <div class="wizard-step" :class="{ active: activeTab >= 3, completed: activeTab > 3 }">
                    <div class="step-icon">
                      <i class="bi bi-hammer-fill" v-if="activeTab >= 3"></i>
                      <i class="bi bi-hammer" v-else></i>
                    </div>
                    <div class="step-content">
                      <div class="step-title">Construire une enquête</div>
                      <div class="step-description">Créer les questions</div>
                    </div>
                    <div class="step-arrow" v-if="activeTab < 5">
                      <i class="bi bi-arrow-right"></i>
                    </div>
                  </div>

                  <div class="wizard-step" :class="{ active: activeTab >= 4, completed: activeTab > 4 }">
                    <div class="step-icon">
                      <i class="bi bi-rocket-fill" v-if="activeTab >= 4"></i>
                      <i class="bi bi-rocket" v-else></i>
                    </div>
                    <div class="step-content">
                      <div class="step-title">Lancement</div>
                      <div class="step-description">Publier l'enquête</div>
                    </div>
                    <div class="step-arrow" v-if="activeTab < 5">
                      <i class="bi bi-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contenu dynamique selon l'étape -->
              <q-card-section>
                <div v-show="activeTab === 1">
                  <Step1 @refreshTable="gets()" @onNext="toggleWizard(2, 30)" />
                </div>
                <div v-show="activeTab === 2">
                  <Step2
                    @refreshGroups="refreshStep3()"
                    @onBack="toggleWizard(1, 10)"
                    @onNext="toggleWizard(3, 50)"
                  />
                </div>
                <div v-show="activeTab === 3">
                  <Step4Ac
                    :refreshTrigger="step3Ref"
                    @onBack="toggleWizard(2, 30)"
                    @onNext="toggleWizard(4, 70)"
                  />
                </div>
                <div v-show="activeTab === 4">
                  <Step3 @onBack="toggleWizard(3, 50)" @onNext="toggleWizard(5, 100)" />
                </div>
                <div v-show="activeTab === 5">
                  <Step5Ac @onBack="toggleWizard(4, 70)" @onNext="closeModal()" />
                </div>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
        <div class="modern-table-container">
          <div class="table-controls">
            <BRow>
              <BCol sm="12" md="6">
                <div class="table-control-item">
                  <label class="control-label">
                    <i class="bi bi-sort-down me-2"></i>
                    Trier:
                  </label>
                  <BFormSelect v-model="perPage" size="sm" :options="pageOptions" class="modern-select"></BFormSelect>
                </div>
              </BCol>
              <BCol sm="12" md="6">
                <div class="table-control-item search-control">
                  <label class="control-label">
                    <i class="bi bi-search me-2"></i>
                    Recherche:
                  </label>
                  <BFormInput
                    v-model="filter"
                    type="search"
                    placeholder="Rechercher une enquête..."
                    class="modern-search-input"
                  ></BFormInput>
                </div>
              </BCol>
            </BRow>
          </div>
          <div v-if="loading" class="loading-state">
            <q-spinner-ball color="green" size="50px" />
            <p class="loading-text">Chargement des enquêtes...</p>
          </div>
          <div
            v-else-if="Array.isArray(orderData) && orderData.length === 0"
            class="empty-state"
          >
            <i class="bi bi-clipboard-data empty-icon"></i>
            <h4 class="empty-title">Aucune enquête trouvée</h4>
            <p class="empty-description">Commencez par créer votre première enquête</p>
          </div>
          <div v-else class="table-wrapper">
            <BTable
              table-class="modern-table"
              thead-tr-class="table-header"
              :items="orderData"
              :fields="fields"
              responsive="sm"
              :per-page="perPage"
              :current-page="currentPage"
              :filter="filter"
              :filter-included-fields="filterOn"
              @filtered="onFiltered"
            >
            <template v-slot:cell(check)="data">
              <div class="custom-control custom-checkbox text-center">
                <input
                  type="checkbox"
                  class="form-check-input"
                  :id="`contacusercheck${data.item.id}`"
                />
              </div>
            </template>

            <template v-slot:cell(title)="data">
              <a href="#" class="text-body">{{ data.item.title }}</a>
            </template>

            <template v-slot:cell(startDate)="data">
              <a href="#" class="text-body">{{
                new Date(data.item.startDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              }}</a>
            </template>
            <template v-slot:cell(endDate)="data">
              <a href="#" class="text-body">{{
                new Date(data.item.endDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              }}</a>
            </template>
            <template v-slot:cell(status)="data">
              <span
                class="modern-status-badge"
                :class="{
                  'status-draft': data.item.status === 'draft',
                  'status-published': data.item.status === 'published',
                  'status-archived': data.item.status === 'archived',
                  'status-review': data.item.status === 'review',
                  'status-closed': data.item.status === 'closed',
                }"
              >
                {{ data.item.status }}
              </span>
            </template>
            <template v-slot:cell(action)="data">
              <div class="action-buttons">
                <button
                  class="action-btn view-btn"
                  @click="openDetailModal(data.item)"
                  title="Voir les statistiques"
                >
                  <i class="bi bi-eye"></i>
                </button>

                <button
                  class="action-btn edit-btn"
                  @click="openEditModal(data.item)"
                  title="Modifier"
                >
                  <i class="bi bi-pencil"></i>
                </button>

                <button
                  class="action-btn chat-btn"
                  @click="chat = !chat"
                  title="Chat IA"
                >
                  <i class="bi bi-robot"></i>
                </button>

                <button
                  class="action-btn delete-btn"
                  @click="deleteSurvey(data.item.id)"
                  title="Supprimer"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </template>
          </BTable>
          </div>
        </div>
        <div class="pagination-container">
          <BPagination v-model="currentPage" :total-rows="rows" :per-page="perPage" class="modern-pagination" />
        </div>
      </BCol>
    </BRow>

    <q-dialog v-model="chat" persistent>
      <q-card style="width: 700px; max-width: 80vw" class="bg-white text-black">
        <q-card-section class="q-pa-md row items-center">
          <div class="col-lg-6">
            <div class="text-h6">Chat</div>
          </div>
          <div class="col-lg-6" style="text-align: end">
            <q-btn flat round icon="close" @click="chat = false" />
          </div>
        </q-card-section>

        <q-separator />

        <div class="px-lg-2 chat-users">
          <div class="chat-conversation p-3">
            <simplebar data-simplebar style="height: 550px">
              <ul class="list-unstyled mb-0">
                <li
                  v-for="data of chatMessagesData"
                  :key="data.id"
                  :class="{ right: `${data.align}` === 'right' }"
                >
                  <div class="conversation-list">
                    <div class="ctext-wrap">
                      <div class="ctext-wrap-content">
                        <h5 class="font-size-14 conversation-name d-flex justify-content-between">
                          <a href="#" class="nav-link">{{ data.name }}</a>
                          <span class="d-inline-block font-size-12 text-muted ms-2">{{
                            data.time
                          }}</span>
                        </h5>
                        <p class="mb-0">{{ data.message }}</p>
                      </div>
                      <BDropdown class="align-self-start" variant="white">
                        <template #button-content>
                          <i class="uil uil-ellipsis-v"></i>
                        </template>
                        <BDropdownItem href="#">Copy</BDropdownItem>
                        <BDropdownItem href="#">Save</BDropdownItem>
                        <BDropdownItem href="#">Forward</BDropdownItem>
                        <BDropdownItem href="#">Delete</BDropdownItem>
                      </BDropdown>
                    </div>
                  </div>
                </li>
              </ul>
            </simplebar>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';

/* Modern Enquete Container */
.modern-enquete-container {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  .header-content {
    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .page-subtitle {
      font-size: 1rem;
      color: #64748b;
      margin: 0;
    }
  }
}

/* Modern Create Button */
.modern-create-btn {
  background: linear-gradient(135deg, #34c38f, #2ea3f2);
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 10px rgba(46, 163, 242, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #2ea3f2, #34c38f);
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(46, 163, 242, 0.4);
  }

  &:active {
    transform: scale(0.96);
  }
}

/* Modern Wizard Card */
.modern-wizard-card {
  width: 900px;
  max-width: 95vw;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.wizard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;

  .wizard-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .wizard-subtitle {
    font-size: 1rem;
    opacity: 0.9;
  }
}

/* Wizard Steps Container */
.wizard-steps-container {
  padding: 2rem;
  background: #f8fafc;
}

.wizard-progress {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin-bottom: 2rem;
  position: relative;

  .progress-line {
    height: 100%;
    background: linear-gradient(135deg, #34c38f, #2ea3f2);
    border-radius: 2px;
    transition: width 0.3s ease;
  }
}

.wizard-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.wizard-step {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  flex: 1;
  position: relative;

  &.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  }

  &.completed {
    background: linear-gradient(135deg, #34c38f, #2ea3f2);
    color: white;
  }

  .step-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    font-size: 1.2rem;
  }

  .step-content {
    flex: 1;

    .step-title {
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }

    .step-description {
      font-size: 0.75rem;
      opacity: 0.8;
    }
  }

  .step-arrow {
    color: #94a3b8;
    font-size: 1.2rem;
  }

  &.active .step-arrow,
  &.completed .step-arrow {
    color: white;
  }
}

/* Modern Table Container */
.modern-table-container {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin-top: 2rem;
}

.table-controls {
  padding: 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;

  .table-control-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .control-label {
      font-weight: 600;
      color: #475569;
      margin: 0;
      display: flex;
      align-items: center;
    }

    &.search-control {
      justify-content: flex-end;
    }
  }
}

.modern-select {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 0.5rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
}

.modern-search-input {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  background: white;
  transition: all 0.2s ease;
  min-width: 250px;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    outline: none;
  }
}

/* Loading and Empty States */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;

  .loading-text {
    margin-top: 1rem;
    color: #64748b;
    font-weight: 500;
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;

  .empty-icon {
    font-size: 4rem;
    color: #cbd5e1;
    margin-bottom: 1rem;
  }

  .empty-title {
    color: #374151;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .empty-description {
    color: #6b7280;
    margin: 0;
  }
}

/* Modern Table */
.table-wrapper {
  overflow-x: auto;
}

.modern-table {
  .table {
    margin-bottom: 0;
    border-collapse: separate;
    border-spacing: 0;

    .table-header {
      background: #f8fafc;

      th {
        border: none;
        padding: 1rem 0.75rem;
        font-weight: 600;
        font-size: 0.875rem;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 2px solid #e2e8f0;
      }
    }

    tbody {
      tr {
        transition: all 0.2s ease;
        border-bottom: 1px solid #f1f5f9;

        &:hover {
          background: #f8fafc;
          transform: scale(1.01);
        }

        td {
          border: none;
          padding: 1rem 0.75rem;
          vertical-align: middle;
        }
      }
    }
  }
}

/* Modern Status Badges */
.modern-status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &.status-draft {
    background: linear-gradient(135deg, #6b7280, #4b5563);
    color: #ffffff;
  }

  &.status-published {
    background: linear-gradient(135deg, #10b981, #059669);
    color: #ffffff;
  }

  &.status-archived {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #ffffff;
  }

  &.status-review {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: #ffffff;
  }

  &.status-closed {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: #ffffff;
  }
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }

  &.view-btn {
    background: #dbeafe;
    color: #2563eb;

    &:hover {
      background: #bfdbfe;
    }
  }

  &.edit-btn {
    background: #fef3c7;
    color: #d97706;

    &:hover {
      background: #fde68a;
    }
  }

  &.chat-btn {
    background: #e0e7ff;
    color: #7c3aed;

    &:hover {
      background: #c7d2fe;
    }
  }

  &.delete-btn {
    background: #fee2e2;
    color: #dc2626;

    &:hover {
      background: #fecaca;
    }
  }
}

/* Pagination */
.pagination-container {
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  background: #f8fafc;
}

.modern-pagination {
  .page-link {
    border-radius: 8px;
    margin: 0 0.25rem;
    border: 1px solid #d1d5db;
    color: #374151;
    transition: all 0.2s ease;

    &:hover {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }
  }

  .page-item.active .page-link {
    background: #667eea;
    border-color: #667eea;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .wizard-steps {
    flex-direction: column;
    gap: 1rem;
  }

  .wizard-step {
    .step-arrow {
      display: none;
    }
  }

  .table-controls {
    .table-control-item {
      flex-direction: column;
      align-items: flex-start;

      &.search-control {
        align-items: flex-end;
      }
    }
  }

  .modern-search-input {
    min-width: 200px;
  }
}
</style>
