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
  BForm,
} from 'bootstrap-vue-next'

import { api } from 'src/boot/axios'
import Swal from 'sweetalert2'
import { Notify } from 'quasar'
import CountToComponent from 'src/components/common/CountToComponent.vue'
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
    BForm,
    CountToComponent,
  },
  data() {
    const orderData = ref([])
    const ajout = ref(false)
    const loading = ref(false)
    const loadings = ref(false)
    const form = ref({
      name: '',
      description: '',
      status: false,
    })
    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/admin/survey-categories')
        orderData.value = response.data.categories
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }
    const formu = ref({
      id: '',
      name: '',
      description: '',
      status: false,
    })
    const edit = ref(false)
    const editingSurvey = ref(null)

    const Add = async () => {
      try {
        loadings.value = true
        if (!form.value.name) {
          Notify.create({
            type: 'warning',
            message: 'Veuillez remplir tous les champs obligatoires.',
            timeout: 3000,
          })

          return
        }
        await api.post('/admin/survey-categories', form.value)

        Swal.fire({
          icon: 'success',
          title: 'Enregistre avec success',
          showConfirmButton: true,
          timer: 2000,
        })
      } catch (error) {
        console.error(error)
      } finally {
        gets()
        loadings.value = false
        form.value = {
          name: '',
          description: '',
          status: false,
        }
        ajout.value = false
      }
    }

    const Edit = async () => {
      try {
        loadings.value = true
        await api.put(`/admin/survey-categories/${formu.value.id}`, formu.value)
        Swal.fire({
          icon: 'success',
          title: 'Enregistre avec success',
          showConfirmButton: true,
          timer: 2000,
        })
      } catch (error) {
        console.error(error)
      } finally {
        gets()
        loadings.value = false
        edit.value = false
      }
    }
    const openEditModal = (survey) => {
      formu.value = { ...survey }
      setTimeout(() => {
        edit.value = true
      }, 500)
      this.activeTab = 1
      this.progressBarValue = 15
    }
    const deleteRow = (index) => {
      Swal.fire({
        title: 'Etes vous sur?',
        text: 'Voulez-vous supprimmer la categorie de sondage?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      }).then(async (result) => {
        if (result.value) {
          await api.delete(`/admin/survey-categories/${index}`)
          gets()
          Swal.fire('Deleted!', 'La catégorue a été supprimer avec success.', 'success')
        }
      })
    }
    const selectedTask = ref([])
    const selct = ref(null)
    const opendMdet = ref(false)
    const loadingx = ref(false)

    const openDetailModal = async (index) => {
      try {
        loadingx.value = true
        const response = await api.get(`/admin/survey-categories/${index}`)
        selct.value = response.data
        selectedTask.value = response.data.surveys
        opendMdet.value = true
      } catch (error) {
        console.error(error)
      } finally {
        loadingx.value = false
      }
    }
    onMounted(() => {
      gets()
    })
    return {
      selct,
      selectedTask,
      opendMdet,
      openDetailModal,
      ajout,
      openEditModal,
      Add,
      Edit,
      deleteRow,
      orderData,
      form,
      formu,
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
      totalRowss: 1,
      currentPages: 1,
      perPages: 10,
      pageOptionss: [10, 25, 50, 100],
      filters: null,
      filterOns: [],
      sortBys: 'age',
      sortDescs: false,
      loading,
      loadings,
      chat: ref(false),
      fields: [
        {
          key: 'check',
          label: '',
        },

        {
          key: 'name',
          label: 'Titre',
          sortable: true,
        },

        {
          key: 'status',
          label: 'Status',
          sortable: true,
        },

        'action',
      ],
      fieldss: [
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
          key: 'type',
          label: 'Type',
          sortable: true,
        },

        {
          key: 'status',
          label: 'Status',
          sortable: true,
        },
      ],
      progressBarValue: 15,
      activeTab: 1,
      activeTabArrow: 2,
      progressBarValues: 15,
      activeTabs: 1,
      activeTabArrows: 2,
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
    rowss() {
      return this.selectedTask.length
    },
    totalSurvey() {
      return this.selectedTask.length
    },
    totalSurveyPu() {
      return this.selectedTask.filter((p) => p.type === 'PUBLIC').length
    },
    totalSurveyBu() {
      return this.selectedTask.filter((p) => p.type === 'BUSINESS').length
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
    onFiltereds(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRowss = filteredItems.length
      this.currentPages = 1
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
            <h2 class="page-title">Gestion des Catégories</h2>
            <p class="page-subtitle">Créez et gérez vos catégories de sondages</p>
          </div>
          <BButton variant="success" class="modern-create-btn" @click="ajout = true">
            <i class="bi bi-plus-circle me-2"></i>
            Créer une catégorie
          </BButton>
        </div>

        <q-dialog v-model="ajout" transition-show="scale" transition-hide="fade">
            <q-card class="modern-modal-card">
              <!-- Header moderne -->
              <div class="modern-modal-header">
                <div class="modal-header-content">
                  <div class="modal-icon">
                    <i class="bi bi-folder-plus"></i>
                  </div>
                  <div class="modal-title-section">
                    <h3 class="modal-title">Nouvelle Catégorie</h3>
                    <p class="modal-subtitle">Créez une catégorie pour organiser vos sondages</p>
                  </div>
                </div>
                <button class="modal-close-btn" @click="ajout = false">
                  <i class="bi bi-x"></i>
                </button>
              </div>

              <!-- Formulaire -->
              <div class="modern-modal-body">
                <BForm>
                  <BRow>
                    <!-- Nom -->
                    <BCol cols="12" class="mb-4 floating-label">
                      <input
                        id="title"
                        v-model="form.name"
                        type="text"
                        class="form-control form-control-modern"
                        placeholder=" "
                      />
                      <label for="title">Nom de la Catégories</label>
                    </BCol>

                    <!-- Description -->
                    <BCol cols="12" class="mb-4 floating-label">
                      <textarea
                        id="desc"
                        v-model="form.description"
                        class="form-control form-control-modern"
                        rows="3"
                        placeholder=" "
                      ></textarea>
                      <label for="desc">Description</label>
                    </BCol>

                    <!-- Ville -->
                    <BCol cols="12" md="6" class="mb-4 floating-label" style="margin-top: 5px">
                      <div class="form-check form-switch mb-4 gap-2 d-flex align-items-center">
                        <input
                          class="form-check-input form-control form-control-modern"
                          type="checkbox"
                          id="publishCheck"
                          v-model="form.status"
                          style="width: 50px; height: 25px"
                        />
                        <label class="form-check-label fw-semibold" for="publishCheck">
                          Catégories pour les entreprise
                        </label>
                      </div>
                    </BCol>
                  </BRow>

                  <!-- Boutons -->
                  <div class="modal-footer-actions">
                    <button class="modal-btn modal-btn-cancel" @click="ajout = false">
                      <i class="bi bi-x-circle me-2"></i>
                      Annuler
                    </button>
                    <button v-if="loadings" class="modal-btn modal-btn-primary" disabled>
                      <q-spinner-dots color="white" size="20px" class="me-2" />
                      Enregistrement...
                    </button>
                    <button v-else class="modal-btn modal-btn-primary" @click="Add">
                      <i class="bi bi-check-circle me-2"></i>
                      Enregistrer
                    </button>
                  </div>
                </BForm>
              </div>
            </q-card>
        </q-dialog>

        <div class="modern-table-container">
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
          <div v-if="loading" class="loading-state">
            <q-spinner-ball color="green" size="50px" />
            <p class="loading-text">Chargement des catégories...</p>
          </div>
          <div
            v-else-if="Array.isArray(orderData) && orderData.length === 0"
            class="empty-state"
          >
            <i class="bi bi-folder-open empty-icon"></i>
            <h4 class="empty-title">Aucune catégorie trouvée</h4>
            <p class="empty-description">Commencez par créer votre première catégorie</p>
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

            <template v-slot:cell(name)="data">
              <a href="#" class="text-body">{{ data.item.name }}</a>
            </template>

            <template v-slot:cell(status)="data">
              <div
                class="badge badge-pill font-size-12"
                :class="{
                  'bg-soft-success': data.item.status === true,
                  'bg-soft-danger': data.item.status === false,
                }"
              >
                {{ data.item.status ? 'Actif' : 'Inactif' }}
              </div>
            </template>

            <template v-slot:cell(action)="data">
              <ul class="list-inline mb-0">
                <li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-info"
                    @click.prevent="openDetailModal(data.item.id)"
                    title="Voir les statistiques"
                  >
                    <i class="bi bi-eye" style="font-size: 18px"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-warning"
                    @click.prevent="openEditModal(data.item)"
                    title="Modifier"
                  >
                    <i class="uil uil-pen font-size-18"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-danger"
                    @click.prevent="deleteRow(data.item.id)"
                    title="Supprimer"
                  >
                    <i class="uil uil-trash-alt font-size-18"></i>
                  </a>
                </li>
              </ul>
            </template>
            </BTable>
          </div>
          <div class="pagination-container">
            <BPagination v-model="currentPage" :total-rows="rows" :per-page="perPage" class="modern-pagination" />
          </div>
        </div>
      </BCol>
    </BRow>
    <q-dialog v-model="opendMdet">
      <q-card class="modern-modal-card modern-detail-modal">
        <!-- Header moderne -->
        <div class="modern-modal-header">
          <div class="modal-header-content">
            <div class="modal-icon modal-icon-info">
              <i class="bi bi-info-circle"></i>
            </div>
            <div class="modal-title-section">
              <h3 class="modal-title">
                {{ selct?.name }}
                <span
                  class="detail-status-badge"
                  :class="selct?.status ? 'badge-active' : 'badge-inactive'"
                >
                  {{ selct?.status ? 'Actif' : 'Inactif' }}
                </span>
              </h3>
              <p class="modal-subtitle">{{ selct?.description }}</p>
            </div>
          </div>
          <button class="modal-close-btn" @click="opendMdet = false">
            <i class="bi bi-x"></i>
          </button>
        </div>

        <div class="modern-modal-body detail-modal-body">
          <!-- Stats Grid Moderne -->
          <div class="detail-stats-grid">
            <div class="detail-stat-card stat-card-primary">
              <div class="stat-card-icon">
                <i class="bi bi-clipboard-data"></i>
              </div>
              <div class="stat-card-content">
                <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                <h4 v-else class="stat-card-value">
                  <CountToComponent :startVal="0" :endVal="totalSurvey" :duration="2000" />
                </h4>
                <p class="stat-card-label">Sondages liés</p>
              </div>
            </div>

            <div class="detail-stat-card stat-card-success">
              <div class="stat-card-icon">
                <i class="bi bi-globe"></i>
              </div>
              <div class="stat-card-content">
                <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                <h4 v-else class="stat-card-value">
                  <CountToComponent :startVal="0" :endVal="totalSurveyPu" :duration="2000" />
                </h4>
                <p class="stat-card-label">Sondages Public</p>
              </div>
            </div>

            <div class="detail-stat-card stat-card-warning">
              <div class="stat-card-icon">
                <i class="bi bi-briefcase"></i>
              </div>
              <div class="stat-card-content">
                <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                <h4 v-else class="stat-card-value">
                  <CountToComponent :startVal="0" :endVal="totalSurveyBu" :duration="2000" />
                </h4>
                <p class="stat-card-label">Sondages Business</p>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="detail-table-section">
            <h3 class="detail-section-title">
              <i class="bi bi-list-ul me-2"></i>
              Sondages Liés
            </h3>
            <div class="modern-table-container">
              <BRow>
                <BCol sm="12" md="6">
                  <div id="tickets-table_length" class="dataTables_length">
                    <label class="d-inline-flex align-items-center">
                      Trier:
                      <BFormSelect
                        v-model="perPages"
                        size="sm"
                        :options="pageOptionss"
                      ></BFormSelect>
                    </label>
                  </div>
                </BCol>
                <BCol sm="12" md="6">
                  <div id="tickets-table_filter" class="dataTables_filter text-md-end">
                    <label class="d-inline-flex align-items-center">
                      Recherche:
                      <BFormInput
                        v-model="filters"
                        type="search"
                        placeholder="Recherche..."
                        class="form-control form-control-sm ms-2"
                      ></BFormInput>
                    </label>
                  </div>
                </BCol>
              </BRow>
            
            <div v-if="loadingx" class="text-center my-5">
                <q-spinner-ball color="green" size="50px" />
              </div>
              <div
                v-else-if="Array.isArray(selectedTask) && selectedTask.length === 0"
                class="text-center py-5"
              >
                <i class="uil uil-folder-open text-muted" style="font-size: 3rem"></i>
                <p class="mt-3 text-muted">Aucun Sondage relié</p>
              </div>
              <BTable
                v-else
                table-class="table table-centered datatable table-card-list"
                thead-tr-class="bg-transparent"
                :items="selectedTask"
                :fields="fieldss"
                responsive="sm"
                :per-page="perPages"
                :current-page="currentPages"
                :filter="filters"
                :filter-included-fields="filterOns"
                @filtered="onFiltereds"
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

                <template v-slot:cell(type)="data">
                  <a
                    href="#"
                    class="badge badge-pill font-size-12"
                    :class="{
                      'bg-soft-warning': data.item.type === 'BUSINESS',
                      'bg-soft-success': data.item.type === 'PUBLIC',
                    }"
                    >{{ data.item.type }}</a
                  >
                </template>

                <template v-slot:cell(status)="data">
                  <a
                    href="#"
                    class="badge badge-pill font-size-12"
                    :class="{
                      'bg-soft-primary': data.item.status === 'draft',
                      'bg-soft-success': data.item.status === 'published',
                      'bg-soft-warning': data.item.status === 'archived',
                      'bg-soft-secondary': data.item.status === 'review',
                      'bg-soft-danger': data.item.status === 'closed',
                    }"
                    >{{ data.item.status }}</a
                  >
                </template>
              </BTable>
            
            <BRow>
              <BCol>
                <div class="dataTables_paginate paging_simple_numbers float-end">
                  <ul class="pagination pagination-rounded">
                    <BPagination v-model="currentPags" :total-rows="rowss" :per-page="perPages" />
                  </ul>
                </div>
              </BCol>
            </BRow>
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="edit" transition-show="scale" transition-hide="fade">
      <q-card class="modern-modal-card">
        <!-- Header moderne -->
        <div class="modern-modal-header">
          <div class="modal-header-content">
            <div class="modal-icon modal-icon-warning">
              <i class="bi bi-pencil-square"></i>
            </div>
            <div class="modal-title-section">
              <h3 class="modal-title">Modifier la Catégorie</h3>
              <p class="modal-subtitle">Modifiez les informations de la catégorie</p>
            </div>
          </div>
          <button class="modal-close-btn" @click="edit = false">
            <i class="bi bi-x"></i>
          </button>
        </div>

        <!-- Formulaire -->
        <div class="modern-modal-body">
          <BForm>
            <BRow>
              <!-- Nom -->
              <BCol cols="12" class="mb-4 floating-label">
                <input
                  id="title"
                  v-model="formu.name"
                  type="text"
                  class="form-control form-control-modern"
                  placeholder=" "
                />
                <label for="title">Nom de la Catégories</label>
              </BCol>

              <!-- Description -->
              <BCol cols="12" class="mb-4 floating-label">
                <textarea
                  id="desc"
                  v-model="formu.description"
                  class="form-control form-control-modern"
                  rows="3"
                  placeholder=" "
                ></textarea>
                <label for="desc">Description</label>
              </BCol>

              <BCol cols="12" class="mb-4 floating-label">
                <input
                  class="form-check-input form-control form-control-modern"
                  type="checkbox"
                  id="publishCheck"
                  v-model="formu.status"
                  style="width: 50px; height: 25px"
                />
                <label class="form-check-label fw-semibold" for="publishCheck">
                  Catégories pour les entreprise
                </label>
              </BCol>
            </BRow>

            <!-- Boutons -->
            <div class="modal-footer-actions">
              <button class="modal-btn modal-btn-cancel" @click="edit = false">
                <i class="bi bi-x-circle me-2"></i>
                Annuler
              </button>
              <button v-if="loadings" class="modal-btn modal-btn-warning" disabled>
                <q-spinner-dots color="white" size="20px" class="me-2" />
                Enregistrement...
              </button>
              <button v-else class="modal-btn modal-btn-warning" @click="Edit">
                <i class="bi bi-check-circle me-2"></i>
                Enregistrer
              </button>
            </div>
          </BForm>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
@import '../../../css/modern-cards.scss';
@import '../../../css/admin/tables-shared.scss';
@import '../../../css/admin/categories.scss';
@import '../../../css/admin/badges.scss';

// ✅ Tous les styles sont maintenant dans les fichiers SCSS partagés
</style>
