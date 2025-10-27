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
  <div class="modern-admin-page">
    <!-- En-tête moderne -->
    <div class="section-header-modern mb-4">
      <div class="section-title-wrapper">
        <div class="section-icon-modern">
          <i class="bi bi-gift-fill"></i>
        </div>
        <div class="section-title-content">
          <h3 class="section-title-modern">Catalogue des Récompenses</h3>
          <p class="section-subtitle-modern">Gérez les récompenses disponibles pour les participants</p>
        </div>
      </div>
      <BButton class="btn-add-gradient" @click="ajout = true">
        <i class="bi bi-plus-circle me-2"></i>
        Créer une Récompense
      </BButton>
    </div>

    <BRow>
      <BCol cols="12">
        <div class="d-flex justify-content-between">

          <q-dialog v-model="ajout" transition-show="scale" transition-hide="fade">
            <q-card class="modern-dialog-card">
              <!-- En-tête moderne -->
              <q-card-section class="modern-dialog-header">
                <div class="dialog-header-content">
                  <div class="dialog-icon">
                    <i class="bi bi-gift-fill"></i>
                  </div>
                  <div class="dialog-title-wrapper">
                    <h5 class="dialog-title">Créer une Récompense</h5>
                    <p class="dialog-subtitle">Ajoutez une nouvelle récompense au catalogue</p>
                  </div>
                </div>
                <q-btn flat round dense icon="close" v-close-popup class="dialog-close-btn" />
              </q-card-section>

              <!-- Formulaire -->
              <div class="q-pa-lg modern-form-content">
                <BForm>
                  <!-- Section Informations -->
                  <div class="form-section mb-4">
                    <h6 class="form-section-title">
                      <i class="bi bi-info-circle-fill me-2"></i>
                      Informations de la récompense
                    </h6>
                    <BRow>
                      <BCol cols="12" class="mb-4 floating-label">
                        <input
                          id="title"
                          v-model="form.name"
                          type="text"
                          class="form-control form-control-modern"
                          placeholder=" "
                        />
                        <label for="title">Titre de la récompense</label>
                      </BCol>

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

                      <BCol cols="12" class="mb-4 floating-label">
                        <input
                          class="form-control form-control-modern"
                          type="number"
                          id="publishCheck"
                          v-model="form.pointsRequired"
                          placeholder=" "
                        />
                        <label class="form-check-label fw-semibold" for="publishCheck">
                          Points requis
                        </label>
                      </BCol>
                    </BRow>
                  </div>

                  <!-- Boutons -->
                  <div class="d-flex justify-content-end gap-2 mt-4">
                    <BButton @click="ajout = false" class="px-4 btn-cancel-modern">
                      <i class="bi bi-x-circle me-2"></i>
                      Annuler
                    </BButton>
                    <BButton v-if="loadings" variant="success" class="px-5 btn-submit-modern" disabled>
                      <q-spinner-dots color="white" size="20px" class="me-2" />
                      Enregistrement...
                    </BButton>
                    <BButton v-else variant="success" class="px-5 btn-submit-modern" @click="Add">
                      <i class="bi bi-check-circle me-2"></i>
                      Enregistrer
                    </BButton>
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
          <BCol v-for="reward in paginatedData" :key="reward.id" cols="12" md="6" lg="4" class="mb-4">
            <div class="reward-card-premium">
              <!-- Badge points en haut à droite -->
              <div class="points-badge">
                <div class="points-badge-inner">
                  <i class="bi bi-star-fill"></i>
                  <CountToComponent
                    :startVal="0"
                    :endVal="reward.pointsRequired"
                    :duration="1500"
                  />
                </div>
              </div>

              <!-- Boutons d'action en haut à gauche -->
              <div class="card-actions-overlay">
                <button 
                  class="action-btn-circle action-info" 
                  @click.prevent="openDetailModals(reward)"
                  title="Voir les détails"
                >
                  <i class="bi bi-eye-fill"></i>
                </button>
                <button 
                  class="action-btn-circle action-edit" 
                  @click.prevent="openEditModal(reward)"
                  title="Modifier"
                >
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button 
                  class="action-btn-circle action-delete" 
                  @click.prevent="deleteRow(reward.id)"
                  title="Supprimer"
                >
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
              
              <!-- Icône centrale -->
              <div class="reward-icon-large">
                <div class="icon-circle">
                  <i class="bi bi-gift-fill"></i>
                </div>
              </div>
              
              <!-- Contenu -->
              <div class="reward-content">
                <h4 class="reward-name">{{ reward.name }}</h4>
                <p class="reward-desc" v-if="reward.description">
                  {{ reward.description }}
                </p>
                <p class="reward-desc-empty" v-else>
                  Aucune description disponible
                </p>
              </div>
            </div>
          </BCol>
        </BRow>
        <q-dialog v-model="edit" transition-show="scale" transition-hide="fade">
          <q-card class="modern-dialog-card">
            <!-- En-tête moderne -->
            <q-card-section class="modern-dialog-header">
              <div class="dialog-header-content">
                <div class="dialog-icon dialog-icon-edit">
                  <i class="bi bi-pencil-fill"></i>
                </div>
                <div class="dialog-title-wrapper">
                  <h5 class="dialog-title">Modifier la Récompense</h5>
                  <p class="dialog-subtitle">Modifiez les informations de la récompense</p>
                </div>
              </div>
              <q-btn flat round dense icon="close" v-close-popup class="dialog-close-btn" />
            </q-card-section>

            <!-- Formulaire -->
            <div class="q-pa-lg modern-form-content">
              <BForm>
                <!-- Section Informations -->
                <div class="form-section mb-4">
                  <h6 class="form-section-title">
                    <i class="bi bi-info-circle-fill me-2"></i>
                    Informations de la récompense
                  </h6>
                  <BRow>
                    <BCol cols="12" class="mb-4 floating-label">
                      <input
                        id="title-edit"
                        v-model="formu.name"
                        type="text"
                        class="form-control form-control-modern"
                        placeholder=" "
                      />
                      <label for="title-edit">Titre de la récompense</label>
                    </BCol>

                    <BCol cols="12" class="mb-4 floating-label">
                      <textarea
                        id="desc-edit"
                        v-model="formu.description"
                        class="form-control form-control-modern"
                        rows="3"
                        placeholder=" "
                      ></textarea>
                      <label for="desc-edit">Description</label>
                    </BCol>

                    <BCol cols="12" class="mb-4 floating-label">
                      <input
                        class="form-control form-control-modern"
                        type="number"
                        id="points-edit"
                        v-model="formu.pointsRequired"
                        placeholder=" "
                      />
                      <label class="form-check-label fw-semibold" for="points-edit">
                        Points requis
                      </label>
                    </BCol>
                  </BRow>
                </div>

                <!-- Boutons -->
                <div class="d-flex justify-content-end gap-2 mt-4">
                  <BButton @click="edit = false" class="px-4 btn-cancel-modern">
                    <i class="bi bi-x-circle me-2"></i>
                    Annuler
                  </BButton>
                  <BButton v-if="loadings" variant="success" class="px-5 btn-submit-modern" disabled>
                    <q-spinner-dots color="white" size="20px" class="me-2" />
                    Enregistrement...
                  </BButton>
                  <BButton v-else variant="success" class="px-5 btn-submit-modern" @click="Edit">
                    <i class="bi bi-check-circle me-2"></i>
                    Enregistrer
                  </BButton>
                </div>
              </BForm>
            </div>
          </q-card>
        </q-dialog>
        <q-dialog v-model="ajouts">
          <q-card class="modern-dialog-card modern-dialog-details">
            <!-- En-tête moderne -->
            <q-card-section class="modern-dialog-header">
              <div class="dialog-header-content">
                <div class="dialog-icon dialog-icon-info">
                  <i class="bi bi-info-circle-fill"></i>
                </div>
                <div class="dialog-title-wrapper">
                  <span v-if="loadingx" class="skeleton skeleton-title"></span>
                  <h5 v-else class="dialog-title">{{ detailData.reward?.name }}</h5>
                  <p class="dialog-subtitle">Détails de la récompense</p>
                </div>
              </div>
              <q-btn flat round dense icon="close" v-close-popup class="dialog-close-btn" />
            </q-card-section>

            <!-- Statistiques -->
            <q-card-section class="stats-section">
              <BRow class="g-3">
                <BCol cols="12" md="4">
                  <div class="stat-card-modern stat-warning">
                    <div class="stat-icon">
                      <i class="bi bi-gift-fill"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">
                        <span v-if="loadingx" class="skeleton skeleton-title"></span>
                        <CountToComponent
                          v-else
                          :startVal="0"
                          :endVal="detailData.stats.totalRedemptions"
                          :duration="2000"
                        />
                      </div>
                      <div class="stat-label">Total Récompenses</div>
                    </div>
                  </div>
                </BCol>

                <BCol cols="12" md="4">
                  <div class="stat-card-modern stat-success">
                    <div class="stat-icon">
                      <i class="bi bi-check-circle-fill"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">
                        <span v-if="loadingx" class="skeleton skeleton-title"></span>
                        <CountToComponent
                          v-else
                          :startVal="0"
                          :endVal="detailData.stats.deliveredRedemptions"
                          :duration="2000"
                        />
                      </div>
                      <div class="stat-label">Livrées</div>
                    </div>
                  </div>
                </BCol>

                <BCol cols="12" md="4">
                  <div class="stat-card-modern stat-info">
                    <div class="stat-icon">
                      <i class="bi bi-clock-fill"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">
                        <span v-if="loadingx" class="skeleton skeleton-title"></span>
                        <CountToComponent
                          v-else
                          :startVal="0"
                          :endVal="detailData.stats.pendingRedemptions"
                          :duration="2000"
                        />
                      </div>
                      <div class="stat-label">En attente</div>
                    </div>
                  </div>
                </BCol>
              </BRow>
            </q-card-section>

            <!-- Informations détaillées -->
            <q-card-section class="details-section">
              <BRow class="g-3">
                <BCol cols="12" md="6">
                  <div class="info-card-modern">
                    <div class="info-label">
                      <i class="bi bi-text-left me-2"></i>
                      Description
                    </div>
                    <div class="info-value">
                      <span v-if="loadingx" class="skeleton skeleton-text"></span>
                      <span v-else>{{ detailData.reward?.description || 'Aucune description' }}</span>
                    </div>
                  </div>
                </BCol>

                <BCol cols="12" md="6">
                  <div class="info-card-modern">
                    <div class="info-label">
                      <i class="bi bi-coin me-2"></i>
                      Points Requis
                    </div>
                    <div class="info-value">
                      <span v-if="loadingx" class="skeleton skeleton-text"></span>
                      <span v-else class="text-warning fw-bold">{{ detailData.reward?.pointsRequired }} pts</span>
                    </div>
                  </div>
                </BCol>

                <BCol cols="12" md="6">
                  <div class="info-card-modern">
                    <div class="info-label">
                      <i class="bi bi-calendar-event me-2"></i>
                      Date de création
                    </div>
                    <div class="info-value">
                      <span v-if="loadingx" class="skeleton skeleton-text"></span>
                      <span v-else>
                        {{
                          new Date(detailData.reward?.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        }}
                      </span>
                    </div>
                  </div>
                </BCol>

                <BCol cols="12" md="6">
                  <div class="info-card-modern">
                    <div class="info-label">
                      <i class="bi bi-list-check me-2"></i>
                      Nombre de rachats
                    </div>
                    <div class="info-value">
                      <span v-if="loadingx" class="skeleton skeleton-text"></span>
                      <span v-else>
                        {{ detailData.reward?.rewardRedemptions?.length || 0 }}
                      </span>
                    </div>
                  </div>
                </BCol>
              </BRow>
            </q-card-section>
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

  .btn-add-gradient {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-weight: 700;
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
      background: linear-gradient(135deg, #764ba2, #667eea);
    }

    &:active {
      transform: translateY(0);
    }

    i {
      font-size: 1.1rem;
    }
  }
}

/* === Cartes de récompenses premium === */
.reward-card-premium {
  position: relative;
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 2px solid #f1f5f9;
  overflow: visible;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.12);
    border-color: #667eea;

    .icon-circle {
      transform: scale(1.08);
      background: linear-gradient(135deg, #667eea, #764ba2);
    }

    .card-actions-overlay {
      opacity: 1;
      transform: translateY(0);
    }

    .points-badge {
      transform: scale(1.05);
    }
  }

  /* Badge points en haut à droite */
  .points-badge {
    position: absolute;
    top: -12px;
    right: -12px;
    z-index: 10;
    transition: all 0.4s ease;

    .points-badge-inner {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: white;
      padding: 0.75rem 1.25rem;
      border-radius: 50px;
      font-weight: 800;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 8px 24px rgba(251, 191, 36, 0.4);
      border: 3px solid white;

      i {
        font-size: 1rem;
      }
    }
  }

  /* Boutons d'action en overlay */
  .card-actions-overlay {
    position: absolute;
    top: 1rem;
    left: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.4s ease;
    z-index: 5;

    .action-btn-circle {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      font-size: 1rem;

      &:hover {
        transform: scale(1.1);
      }

      &.action-info {
        background: rgba(59, 130, 246, 0.9);
        color: white;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);

        &:hover {
          background: #3b82f6;
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
        }
      }

      &.action-edit {
        background: rgba(102, 126, 234, 0.9);
        color: white;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);

        &:hover {
          background: #667eea;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
      }

      &.action-delete {
        background: rgba(239, 68, 68, 0.9);
        color: white;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);

        &:hover {
          background: #ef4444;
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.6);
        }
      }
    }
  }

  /* Icône centrale grande */
  .reward-icon-large {
    margin-bottom: 1.5rem;

    .icon-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      color: #667eea;
      transition: all 0.4s ease;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      position: relative;

      &::before {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea, #764ba2);
        opacity: 0;
        transition: opacity 0.4s ease;
        z-index: -1;
      }
    }
  }

  /* Contenu */
  .reward-content {
    text-align: center;
    width: 100%;

    .reward-name {
      font-size: 1.4rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.75rem 0;
      line-height: 1.3;
    }

    .reward-desc {
      font-size: 0.9rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    .reward-desc-empty {
      font-size: 0.85rem;
      color: #94a3b8;
      font-style: italic;
      margin: 0;
    }
  }
}

/* === Modaux modernes === */
.modern-dialog-card {
  width: 70vw !important;
  max-width: 1000px !important;
  margin: 20px auto;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modern-dialog-header {
  background: linear-gradient(135deg, rgb(240, 244, 255), rgb(224, 247, 250));
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;

  .dialog-header-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;

    .dialog-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      flex-shrink: 0;

      &.dialog-icon-edit {
        background: linear-gradient(135deg, #f59e0b, #d97706);
      }
    }

    .dialog-title-wrapper {
      .dialog-title {
        font-size: 1.4rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 0.25rem 0;
      }

      .dialog-subtitle {
        font-size: 0.9rem;
        color: #64748b;
        margin: 0;
      }
    }
  }

  .dialog-close-btn {
    color: #64748b;
    transition: all 0.3s ease;

    &:hover {
      color: #ef4444;
      transform: rotate(90deg);
    }
  }
}

/* === Formulaire moderne === */
.modern-form-content {
  background: #f8fafc;
  border-radius: 0 0 24px 24px;
}

.form-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  }

  .form-section-title {
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #e2e8f0;
    display: flex;
    align-items: center;

    i {
      color: #667eea;
    }
  }
}

.btn-cancel-modern {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-weight: 700;
  color: #64748b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
    background: #f8fafc;
    color: #475569;
  }

  &:active {
    transform: translateY(0);
  }
}

.btn-submit-modern {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  border-radius: 12px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
    background: linear-gradient(135deg, #059669, #10b981);
  }

  &:active {
    transform: translateY(0);
  }
}

/* === Modal de détails === */
.modern-dialog-card.modern-dialog-details {
  width: 55vw !important;
  max-width: 900px !important;
  max-height: 90vh !important;
  overflow-y: auto;

  .dialog-icon-info {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
  }

  .stats-section {
    background: #f8fafc;
    padding: 1.5rem;

    .stat-card-modern {
      background: white;
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.875rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      border-left: 4px solid;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      }

      &.stat-warning {
        border-left-color: #f59e0b;

        .stat-icon {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
        }

        .stat-value {
          color: #f59e0b;
        }
      }

      &.stat-success {
        border-left-color: #10b981;

        .stat-icon {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .stat-value {
          color: #10b981;
        }
      }

      &.stat-info {
        border-left-color: #3b82f6;

        .stat-icon {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .stat-value {
          color: #3b82f6;
        }
      }

      .stat-icon {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.3rem;
        flex-shrink: 0;
      }

      .stat-content {
        flex: 1;

        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 0.4rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }
    }
  }

  .details-section {
    background: white;
    padding: 1.5rem;

    .info-card-modern {
      background: #f8fafc;
      border-radius: 12px;
      padding: 1rem;
      border: 2px solid #e2e8f0;
      transition: all 0.3s ease;

      &:hover {
        border-color: #667eea;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
      }

      .info-label {
        font-size: 0.75rem;
        color: #64748b;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.6rem;
        display: flex;
        align-items: center;

        i {
          color: #667eea;
        }
      }

      .info-value {
        font-size: 0.9rem;
        color: #1e293b;
        font-weight: 600;
        line-height: 1.5;
      }
    }
  }
}

.shadow-danger:hover {
  border-color: #e74c3c;
  background: linear-gradient(135deg, #ffecec, #ffd9d6);
  box-shadow: 0 0 18px rgba(231, 76, 60, 0.6);
}
</style>
