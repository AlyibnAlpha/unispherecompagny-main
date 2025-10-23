<script>
import { onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BFormInput,
  BPagination,
  BFormSelect,
  BCardBody,
  BCard,
} from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
import CountToComponent from 'src/components/common/CountToComponent.vue'
import Swal from 'sweetalert2'

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
    CountToComponent,
    BCardBody,
    BCard,
  },
  data() {
    const orderData = ref([])
    const orderDatas = ref([])
    const detailData = ref([])
    const ajout = ref(false)
    const ajouts = ref(false)
    const optionl = ref([])
    const loading = ref(false)
    const loadings = ref(false)
    const loadingx = ref(false)
    const current = ref(0)

    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/participants/rewards')
        current.value = response.data.currentPoints
        orderData.value = response.data.rewards

        const res = await api.get('/participants/rewards/redemptions/stats')
        orderDatas.value = res.data
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }
    const openDetailModals = async (data) => {
      try {
        loadings.value = true
        await api.post(`/participants/rewards/${data.id}/redeem`)
        Swal.fire({
          title: 'Succès',
          text: 'Récompense réclamée avec succès !',
          icon: 'success',
          confirmButtonText: 'OK',
        })
      } catch (error) {
        console.log(error)
        Swal.fire({
          title: 'Erreur',
          text:
            error.response?.data?.error ||
            'Une erreur est survenue lors de la réclamation de la récompense.',
          icon: 'error',
          confirmButtonText: 'OK',
        })
      } finally {
        loadings.value = false
      }
    }

    onMounted(() => {
      gets()
    })
    return {
      current,
      openDetailModals,
      activeTabss: 0,
      ajout,
      ajouts,
      optionl,
      detailData,
      orderData,
      orderDatas,
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
          key: 'check',
          label: '',
        },

        {
          key: 'lastName',
          label: 'Nom',
          sortable: true,
        },

        {
          key: 'birthDate',
          label: 'Âges',
        },
        {
          key: 'phone',
          label: 'Numéro',
          sortable: true,
        },
        {
          key: 'gender',
          label: 'Genre',
          sortable: true,
        },
        {
          key: 'country',
          label: 'Localité',
          sortable: true,
        },
        {
          key: 'enabled',
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

    filteredData() {
      if (!this.filter) return this.orderData
      const search = this.filter.toLowerCase()
      return this.orderData.filter((item) => item.name.toLowerCase().includes(search))
    },

    paginatedData() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredData.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.perPage)
    },
    totalgagne() {
      return this.orderDatas.totalPointsSpent
    },
    totaldepense() {
      return this.orderDatas.deliveredRedemptions
    },
    totalRecompense() {
      return this.orderDatas.totalRedemptions
    },
    totalPending() {
      return this.orderDatas.pendingRedemptions
    },
    totalCurennt() {
      return this.current
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
    <BRow class="d-flex justify-content-center">
      <BCol md="3" cols="xl-3">
        <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
          <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
            <div>
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-coin text-warning fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="totalCurennt" :duration="2000" />
                </h4>
              </div>

              <span class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                >Points Actuelles</span
              >
            </div>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol md="3" cols="xl-3">
        <BCard no-body class="shadow-sm rounded-4 stat-card shadow-danger">
          <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
            <div>
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-coin text-danger fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="totalgagne" :duration="2000" />
                </h4>
              </div>
              <span class="badge bg-danger-subtle text-danger fw-semibold px-3 py-1 rounded-pill"
                >Points dépensé</span
              >
            </div>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol md="2" cols="xl-2">
        <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
          <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
            <div>
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-bookmark-check text-success fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="totalRecompense" :duration="2000" />
                </h4>
              </div>

              <span class="badge bg-success-subtle text-success fw-semibold px-2 py-1 rounded-pill"
                >Récomponses</span
              >
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <BCol md="2" cols="xl-2">
        <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
          <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
            <div>
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-coin text-warning fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="totalPending" :duration="2000" />
                </h4>
              </div>

              <span class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                >En attante</span
              >
            </div>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol md="2" cols="xl-2">
        <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
          <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
            <div>
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-coin text-success fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="totaldepense" :duration="2000" />
                </h4>
              </div>

              <span class="badge bg-success-subtle text-success fw-semibold px-1 py-1 rounded-pill"
                >Récomponses livré</span
              >
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
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
          <p class="mt-3 text-muted">Aucune Catalogue</p>
        </div>
        <BRow v-else>
          <BCol v-for="reward in paginatedData" :key="reward.id" cols="12" md="4" lg="4">
            <BCard class="reward-card shadow-sm">
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
                    <q-spinner-dots v-if="loadings" color="orange" size="20px" class="q-mr-sm" />

                    <a
                      v-else
                      href="#"
                      class="text-warning"
                      @click.prevent="openDetailModals(reward)"
                      title="Détails"
                    >
                      <i class="bi bi-arrow-repeat fs-5"></i>
                    </a>
                  </li>
                </ul>
              </BCardBody>
            </BCard>
          </BCol>
        </BRow>
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
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
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
</style>
