<script>
import { onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BFormInput,
  BPagination,
  BFormSelect,
  BTable,
  BCardBody,
  BCard,
  BButton,
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
    BTable,
    BCardBody,
    BCard,
    BButton,
    CountToComponent,
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
        const response = await api.get('/admin/leaderboard')
        orderData.value = response.data.leaderboard

        const responses = await api.get('/admin/leaderboard/stats')
        orderDatas.value = responses.data
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }
    const Add = async () => {
      try {
        loadings.value = true
        await api.post('/admin/leaderboard/recalculate')
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Le leaderboard a été recalculé avec succès.',
          showConfirmButton: false,
          timer: 2000,
          background: '#f8f9fa',
          color: '#333',
          width: '400px',
        })
        gets()
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text:
            error.response?.data?.message ||
            'Une erreur est survenue lors du recalcul. Veuillez réessayer plus tard.',
          showConfirmButton: true,
          background: '#f8f9fa',
          color: '#333',
          width: '400px',
        })
        console.error(error)
      } finally {
        loadings.value = false
      }
    }

    onMounted(() => {
      gets()
    })
    return {
      Add,
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
          key: 'check',
          label: '',
        },

        {
          key: 'participant',
          label: 'Nom',
          sortable: true,
        },

        {
          key: 'ranks',
          label: 'Rang',
        },
        {
          key: 'totalPoints',
          label: 'Total Points',
          sortable: true,
        },
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
    totalParticipants() {
      return this.orderDatas.totalParticipants
    },
    topScore() {
      return this.orderDatas.topScore
    },
    averagePoints() {
      return this.orderDatas.averagePoints
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
    <BRow class="d-flexjustify-content-center">
      <BCol md="4" cols="xl-4">
        <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
          <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
            <div>
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-coin text-warning fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="totalParticipants" :duration="2000" />
                </h4>
              </div>

              <span class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                >Participants</span
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
                <i class="bi bi-bookmark-check text-warning fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="averagePoints" :duration="2000" />
                </h4>
              </div>

              <span class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                >Moyennes des Points</span
              >
            </div>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol md="4" cols="xl-4">
        <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
          <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
            <div>
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-coin text-success fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="topScore" :duration="2000" />
                </h4>
              </div>
              <span class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                >Top Points</span
              >
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
    <BRow>
      <BCol cols="12">
        <div class="d-flex justify-content-between">
          <div v-if="loadings" class="d-flex justify-content-end mt-4">
            <q-spinner-dots color="green" size="20px" class="q-mr-sm" />
          </div>
          <BButton
            v-else
            variant="success"
            class="waves-effect waves-light mb-3 btn-success"
            @click="Add"
            >Recalculer Leaderboard</BButton
          >
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
          v-else-if="Array.isArray(orderData) && orderData.length === 0"
          class="text-center py-5"
        >
          <i class="uil uil-folder-open text-muted" style="font-size: 3rem"></i>
          <p class="mt-3 text-muted">Aucune Classements</p>
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
          <template v-slot:cell(participant)="data">
            <a href="#" class="text-body"
              >{{
                data.item.participant.user.length === 0
                  ? 'aucun'
                  : data.item.participant.user[0].email
              }}
              ({{ data.item.participant.firstName }} {{ data.item.participant.lastName }})</a
            >
          </template>

          <template v-slot:cell(ranks)="data">
            <a
              href="#"
              class="badge"
              :class="{
                'bg-gold': data.item.ranks === 1,
                'bg-silver': data.item.ranks === 2,
                'bg-bronze': data.item.ranks === 3,
                'bg-primary': data.item.ranks > 3,
              }"
              >{{ data.item.ranks }}</a
            >
          </template>

          <template v-slot:cell(totalPoints)="data">
            <a href="#" class="text-success">{{ data.item.totalPoints }} points</a>
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
  </div>
</template>
<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
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
