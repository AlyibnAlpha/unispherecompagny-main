<script>
import { onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BButton,
  BFormInput,
  BPagination,
  BFormSelect,
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
    BForm,
    BCardBody,
    BCard,
    CountToComponent,
  },
  data() {
    const orderData = ref([])
    const detailData = ref([])
    const ajout = ref(false)
    const ajouts = ref(false)
    const loading = ref(false)
    const loadings = ref(false)
    const loadingx = ref(false)
    const form = ref({
      name: '',
      description: '',
      pointsRequired: 0,
    })
    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/admin/rewards')
        orderData.value = response.data.rewards
        console.log(orderData.value)
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
      pointsRequired: 0,
    })
    const edit = ref(false)
    const editingSurvey = ref(null)

    const Add = async () => {
      try {
        loadings.value = true
        if (!form.value.name || !form.value.pointsRequired) {
          Notify.create({
            type: 'warning',
            message: 'Veuillez remplir tous les champs obligatoires.',
            timeout: 3000,
          })

          return
        }
        await api.post('/admin/rewards', form.value)

        Swal.fire({
          icon: 'success',
          title: 'Enregistre avec success',
          showConfirmButton: true,
          timer: 2000,
        })
        form.value = {
          name: '',
          description: '',
          pointsRequired: 0,
        }
        gets()
      } catch (error) {
        console.error(error)
      } finally {
        loadings.value = false
        ajout.value = false
      }
    }

    const Edit = async () => {
      try {
        loadings.value = true
        await api.put(`/admin/rewards/${formu.value.id}`, formu.value)
        Swal.fire({
          icon: 'success',
          title: 'Enregistre avec success',
          showConfirmButton: true,
          timer: 2000,
        })
        gets()
      } catch (error) {
        console.error(error)
      } finally {
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
    const openDetailModals = async (idy) => {
      try {
        loadingx.value = true
        ajouts.value = true
        const response = await api.get(`/admin/rewards/${idy.id}/stats`)
        detailData.value = response.data
      } catch (error) {
        console.log(error)
        Notify.create({
          type: 'danger',
          message: 'Une erreur est survenue.Veillez réssayer.',
          timeout: 3000,
        })
      } finally {
        loadingx.value = false
      }
    }
    const deleteRow = (index) => {
      Swal.fire({
        title: 'Etes vous sur?',
        text: 'Voulez-vous supprimmer se catalogue?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      }).then(async (result) => {
        if (result.value) {
          await api.delete(`/admin/rewards/${index}`)
          gets()
          Swal.fire('Deleted!', 'Le catalogue a été supprimer avec success.', 'success')
        }
      })
    }
    onMounted(() => {
      gets()
    })
    return {
      openDetailModals,
      loadingx,
      ajouts,
      detailData,
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
          key: 'pointsRequired',
          label: 'Points',
          sortable: true,
        },

        'action',
      ],
      progressBarValue: 15,
      activeTab: 1,
      activeTabArrow: 2,
    }
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.orderData.length
    },
    filteredData() {
      if (!this.filter) return this.orderData
      const search = this.filter.toLowerCase()
      return this.orderData.filter((item) => item.name.toLowerCase().includes(search))
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
            >Créer vos Catalogues</BButton
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
                <div class="text-h6 text-center">Catalogue</div>
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
                      <label for="title">Titre</label>
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
                    <BCol cols="12" class="mb-4 floating-label">
                      <input
                        class="form-control form-control-modern"
                        type="number"
                        id="publishCheck"
                        v-model="form.pointsRequired"
                        placeholder=" "
                      />
                      <label class="form-check-label fw-semibold" for="publishCheck">
                        Points requits
                      </label>
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
          v-else-if="Array.isArray(paginatedData) && paginatedData.length === 0"
          class="text-center py-5"
        >
          <i class="uil uil-folder-open text-muted" style="font-size: 3rem"></i>
          <p class="mt-3 text-muted">Aucune Catégories d'enquêtes</p>
        </div>
        <BRow v-else>
          <BCol v-for="reward in paginatedData" :key="reward.id" cols="12" md="4" lg="4">
            <BCard class="reward-card shadow-sm" style="height: 190px">
              <!-- Header: points et titre -->
              <BCardBody
                class="d-flex justify-content-between align-items-center py-2 px-3 card-header"
              >
                <div class="title fw-bold text-truncate">{{ reward.name }}</div>
              </BCardBody>

              <div class="header-separator"></div>

              <!-- Description -->
              <BCardBody class="p-3 description">
                <div class="d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-cash text-success fs-3 me-2"></i>
                    <div class="fw-bold fs-3 text-success me-2">
                      <CountToComponent
                        :startVal="0"
                        :endVal="reward.pointsRequired"
                        :duration="1500"
                      />
                    </div>
                    <span class="fw-bold text-muted fs-3">pts</span>
                  </div>
                </div>
              </BCardBody>

              <div class="header-separator"></div>

              <!-- Actions -->
              <BCardBody class="d-flex justify-content-end align-items-center py-2 px-3 actions">
                <ul class="list-inline mb-0 d-flex align-items-center">
                  <li class="list-inline-item d-flex align-items-center">
                    <a
                      href="#"
                      class="text-info"
                      @click.prevent="openDetailModals(reward)"
                      title="Détails"
                    >
                      <i class="bi bi-eye fs-5"></i>
                    </a>
                  </li>
                  <li class="list-inline-item mx-2">|</li>
                  <li class="list-inline-item d-flex align-items-center">
                    <a
                      href="#"
                      class="text-primary"
                      @click.prevent="openEditModal(reward)"
                      title="Edit"
                    >
                      <i class="uil uil-pen fs-5"></i>
                    </a>
                  </li>
                  <li class="list-inline-item mx-2">|</li>
                  <li class="list-inline-item d-flex align-items-center">
                    <a
                      href="#"
                      class="text-danger"
                      @click.prevent="deleteRow(reward.id)"
                      title="Delete"
                    >
                      <i class="uil uil-trash-alt fs-5"></i>
                    </a>
                  </li>
                </ul>
              </BCardBody>
            </BCard>
          </BCol>
        </BRow>
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
                    <label for="title">Titre</label>
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
                      class="form-control form-control-modern"
                      type="number"
                      id="publishCheck"
                      v-model="formu.pointsRequired"
                      placeholder=" "
                    />
                    <label class="form-check-label fw-semibold" for="publishCheck">
                      Points requits
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
        <q-dialog v-model="ajouts">
          <q-card
            class="modern-dialog"
            style="width: 800px; max-width: 90vw; height: 500px; max-height: 80vw"
          >
            <!-- Header -->
            <q-card-section class="dialog-header row items-center q-pa-sm">
              <div class="q-ml-sm">
                <span v-if="loadingx" class="skeleton skeleton-title"></span>
                <div v-else class="text-h6 text-warning">{{ detailData.reward?.name }}</div>
                <div class="text-caption text-warning">Détails du catalogue</div>
              </div>
              <q-space />
            </q-card-section>

            <q-separator color="grey-3" />
            <q-card-section>
              <BRow class="d-flexjustify-content-center">
                <BCol md="4" cols="xl-4">
                  <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                    <BCardBody
                      class="d-flex justify-content-between align-items-center p-3 bg-light"
                    >
                      <div>
                        <div class="d-flex align-items-center mb-2">
                          <i class="bi bi-people text-warning fs-3 me-2"></i>
                          <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                          <h4 v-else class="fw-bold mb-0 fs-2">
                            <CountToComponent
                              :startVal="0"
                              :endVal="detailData.stats.totalRedemptions"
                              :duration="2000"
                            />
                          </h4>
                        </div>

                        <span
                          class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                          >Récomponses</span
                        >
                      </div>
                    </BCardBody>
                  </BCard>
                </BCol>

                <BCol md="4" cols="xl-4">
                  <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
                    <BCardBody
                      class="d-flex justify-content-between align-items-center p-3 bg-light"
                    >
                      <div>
                        <div class="d-flex align-items-center mb-2">
                          <i class="bi bi-people text-success fs-3 me-2"></i>
                          <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                          <h4 v-else class="fw-bold mb-0 fs-2">
                            <CountToComponent
                              :startVal="0"
                              :endVal="detailData.stats.deliveredRedemptions"
                              :duration="2000"
                            />
                          </h4>
                        </div>
                        <span
                          class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                          >Récomponses Delivrer</span
                        >
                      </div>
                    </BCardBody>
                  </BCard>
                </BCol>

                <BCol md="4" cols="xl-4">
                  <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
                    <BCardBody
                      class="d-flex justify-content-between align-items-center p-3 bg-light"
                    >
                      <div>
                        <div class="d-flex align-items-center mb-2">
                          <i class="bi bi-people text-success fs-3 me-2"></i>
                          <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                          <h4 v-else class="fw-bold mb-0 fs-2">
                            <CountToComponent
                              :startVal="0"
                              :endVal="detailData.stats.pendingRedemptions"
                              :duration="2000"
                            />
                          </h4>
                        </div>
                        <span
                          class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                          >En attente</span
                        >
                      </div>
                    </BCardBody>
                  </BCard>
                </BCol>
              </BRow>
            </q-card-section>

            <!-- Content -->
            <q-card-section class="dialog-content">
              <div class="info-row">
                <span class="label">Description :</span>
                <span v-if="loadingx" class="skeleton skeleton-title"></span>
                <span v-else class="value">{{ detailData.reward?.description }} </span>
              </div>
              <div class="info-row">
                <span class="label">Points Requits:</span>
                <span v-if="loadingx" class="skeleton skeleton-title"></span>
                <span v-else class="value">{{ detailData.reward?.pointsRequired }} pts</span>
              </div>
              <div class="info-row">
                <span class="label">récompenses :</span>
                <span v-if="loadingx" class="skeleton skeleton-title"></span>
                <span v-else class="value">{{
                  detailData.reward?.rewardRedemptions.length === 0
                    ? 0
                    : detailData.reward?.rewardRedemptions
                }}</span>
              </div>
              <div class="info-row">
                <span class="label">Date de création :</span>
                <span v-if="loadingx" class="skeleton skeleton-title"></span>
                <span v-else class="value">
                  {{
                    new Date(detailData.reward?.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  }}</span
                >
              </div>
            </q-card-section>

            <q-separator color="grey-3" />

            <!-- Actions -->
          </q-card>
        </q-dialog>

        <BRow>
          <BCol>
            <div class="dataTables_paginate paging_simple_numbers float-end">
              <ul class="pagination pagination-rounded">
                <BPagination
                  v-model="currentPage"
                  :total-rows="filteredData.length"
                  :per-page="perPage"
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
@import '../../../css/assets/scss/app2.scss';
.reward-card {
  border-radius: 26px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }

  .card-header {
    background: #f5f5f5;
    font-weight: 600;
    .points {
      color: #45f210;
      font-size: 1rem;
    }
    .title {
      font-size: 0.9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
  }

  .header-separator {
    height: 2px;
    background: #e0e0e0;
    margin: 0;
  }

  .description {
    font-size: 0.95rem;
    color: #4b4b4b;
    min-height: 60px;
  }

  .actions {
    ul {
      display: flex;
      align-items: center;

      li {
        a {
          transition: all 0.2s ease-in-out;

          &:hover {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }

        &.mx-2 {
          color: #c0c0c0;
        }
      }
    }
  }
}

/* Séparateur vertical simple */
.actions li.mx-2 {
  font-weight: 600;
  color: #999;
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
.skeleton {
  display: inline-block;
  height: 1em;
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}
.modern-dialog {
  width: 500px;
  max-width: 90vw;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

/* Header du dialog */
.dialog-header {
  padding: 16px 20px;
}

/* Section du contenu */
.dialog-content {
  padding: 20px;
  background-color: #f9faff;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.08);
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
    }

    .label {
      font-weight: 600;
      color: #4b4b4b;
    }

    .value {
      color: #333;
    }
  }
}

/* Actions du dialog */
.dialog-actions {
  padding: 12px 20px;
  background-color: #fafafa;

  .q-btn {
    border-radius: 12px;
    min-width: 100px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }
  }
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
</style>
