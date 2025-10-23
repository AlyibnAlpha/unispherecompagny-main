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
  BCardBody,
  BCard,
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
    BCardBody,
    BCard,
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
  <div>
    <BRow>
      <BCol cols="12">
        <div class="d-flex justify-content-between">
          <BButton
            variant="success"
            class="waves-effect waves-light mb-3 btn-success"
            @click="ajout = true"
            >Créer vos Catégories</BButton
          >

          <q-dialog v-model="ajout" transition-show="scale" transition-hide="fade">
            <q-card
              style="width: 800px; max-width: 90vw; border-radius: 20px; overflow: hidden"
              class="shadow-lg"
            >
              <!-- Titre -->
              <q-card-section
                class="q-pa-md text-white flex items-center justify-center"
                style="background: linear-gradient(135deg, #0d6efd, #6610f2)"
              >
                <q-icon name="group_add" size="28px" class="q-mr-sm" />
                <div class="text-h6 text-center">Catégories de sondage</div>
              </q-card-section>

              <!-- Formulaire -->
              <div class="q-pa-lg">
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

                  <!-- Bouton -->
                  <div v-if="loadings" class="d-flex justify-content-end mt-4">
                    <q-spinner-dots color="green" size="20px" class="q-mr-sm" />
                  </div>
                  <div v-else class="d-flex justify-content-end mt-4">
                    <BButton variant="success" class="px-5" @click="Add"> Enregistrer </BButton>
                  </div>
                </BForm>
              </div>
            </q-card>
          </q-dialog>
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
            <p class="mt-3 text-muted">Aucune Catégories d'enquêtes</p>
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
              <a
                href="#"
                class="badge"
                :class="{
                  'bg-success': data.item.status === true,
                  'bg-danger': data.item.status === false,
                }"
                >{{ data.item.status }}</a
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
                <li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-warning"
                    @click.prevent="openEditModal(data.item)"
                    title="Edit"
                  >
                    <i class="uil uil-pen font-size-18"></i>
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
      <q-card class="modern-dialog" style="width: 1000px; max-width: 100vw">
        <!-- Header -->
        <q-card-section class="row items-center q-pa-sm">
          <div class="q-ml-sm">
            <span v-if="loading" class="skeleton skeleton-title"></span>
            <div v-else class="text-h6 text-warning">
              {{ selct?.name }}
              <q-badge :color="selct?.status ? 'green' : 'red'" class="chip">{{
                selct?.status
              }}</q-badge>
            </div>
            <div class="text-caption text-white-8">{{ selct?.description }}</div>
          </div>
          <q-space />
        </q-card-section>

        <q-separator color="grey-3" />
        <div class="px-3" style="max-height: 70vh; overflow-y: auto">
          <q-card-section>
            <BRow class="d-flexjustify-content-center">
              <BCol md="4" cols="xl-4">
                <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                  <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                    <div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-building-fill text-warning fs-3 me-2"></i>
                        <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                        <h4 v-else class="fw-bold mb-0 fs-3">
                          <CountToComponent :startVal="0" :endVal="totalSurvey" :duration="2000" />
                        </h4>
                      </div>
                      <span
                        class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                        >Sondages liée</span
                      >
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>
              <BCol md="4" cols="xl-4">
                <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                  <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                    <div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-building-fill text-warning fs-3 me-2"></i>
                        <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                        <h4 v-else class="fw-bold mb-0 fs-3">
                          <CountToComponent
                            :startVal="0"
                            :endVal="totalSurveyPu"
                            :duration="2000"
                          />
                        </h4>
                      </div>
                      <span
                        class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                        >Sondages Public</span
                      >
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>
              <BCol md="4" cols="xl-4">
                <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                  <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                    <div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-building-fill text-warning fs-3 me-2"></i>
                        <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                        <h4 v-else class="fw-bold mb-0 fs-3">
                          <CountToComponent
                            :startVal="0"
                            :endVal="totalSurveyBu"
                            :duration="2000"
                          />
                        </h4>
                      </div>
                      <span
                        class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                        >Sondages Business</span
                      >
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>
            </BRow>
          </q-card-section>

          <!-- Content -->
          <q-card-section class="dialog-content">
            <div
              class="ttable table-centered datatable dt-responsive nowrap table-card-list dataTable no-footer dtr-inline"
            >
              <h4 class="text-warning">Sondages Liés</h4>
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
            </div>
            <BRow>
              <BCol>
                <div class="dataTables_paginate paging_simple_numbers float-end">
                  <ul class="pagination pagination-rounded">
                    <BPagination v-model="currentPags" :total-rows="rowss" :per-page="perPages" />
                  </ul>
                </div>
              </BCol>
            </BRow>
          </q-card-section>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="edit" transition-show="scale" transition-hide="fade">
      <q-card
        style="width: 800px; max-width: 90vw; border-radius: 20px; overflow: hidden"
        class="shadow-lg"
      >
        <!-- Titre -->
        <q-card-section
          class="q-pa-md text-white flex items-center justify-center"
          style="background: linear-gradient(135deg, #0d6efd, #6610f2)"
        >
          <div class="text-h6 text-center">Modifier</div>
        </q-card-section>

        <!-- Formulaire -->
        <div class="q-pa-lg">
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

            <!-- Bouton -->
            <div v-if="loadings" class="d-flex justify-content-end mt-4">
              <q-spinner-dots color="green" size="20px" class="q-mr-sm" />
            </div>
            <div v-else class="d-flex justify-content-end mt-4">
              <BButton variant="success" class="px-5" @click="Edit"> Enregistrer </BButton>
            </div>
          </BForm>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<style>
@import '../../../css/assets/scss/app2.scss';
.stat-card {
  transition: all 0.4s ease-in-out;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #fdfdfd, #f5f5f5);
  position: relative;
  overflow: hidden;
}
.stat-card:hover {
  transform: translateY(-6px);
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

.form-control.form-control-modern {
  border-radius: 12px;
  border: 2px solid #e0e7ff;
  padding: 0.9rem 1rem;
  width: 100%;
  transition: all 0.3s ease;
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

.form-control.form-control-modern:focus + label,
.form-control.form-control-modern:not(:placeholder-shown) + label {
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
