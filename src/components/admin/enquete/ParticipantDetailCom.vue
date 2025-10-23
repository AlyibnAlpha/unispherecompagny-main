<script>
import { onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BFormInput,
  BPagination,
  BFormSelect,
  BTable,
  BCard,
  BCardBody,
} from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth'
import { useRoute } from 'vue-router'
import CountToComponent from 'src/components/common/CountToComponent.vue'
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
    BCard,
    BCardBody,
    CountToComponent,
  },
  data() {
    const orderData = ref([])
    const authStore = useAuthStore()
    const Alldata = ref([])
    const loading = ref(false)
    const loadings = ref(false)
    const route = useRoute()
    const id = ref(route.params.id)
    function truncate(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    }

    const getAge = (birthDateString) => {
      const birthDate = new Date(birthDateString)
      const today = new Date()

      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      // Vérifie si l'anniversaire n'est pas encore passé cette année
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      return `${age} ans`
    }

    const gets = async () => {
      try {
        loading.value = true
        const role = authStore.roles[0]
        if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          const response = await api.get(`/participants-groups/${id.value}`)
          Alldata.value = response.data
          orderData.value = response.data.surveyParticipants
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          const response = await api.get(`/admin/participants-groups/${id.value}`)

          Alldata.value = response.data
          const found = response.data.surveyParticipants.filter((item) => item.survey !== null)
          orderData.value = found
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      gets()
    })
    return {
      truncate,
      getAge,
      orderData,
      Alldata,
      id,
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
          label: 'Participant',
          sortable: true,
        },

        {
          key: 'title',
          label: 'Sondage lié',
        },
        {
          key: 'gender',
          label: 'Genre',
          sortable: true,
        },
        {
          key: 'birthDate',
          label: 'Âge',
          sortable: true,
        },
        {
          key: 'notified',
          label: 'Notificattion',
          sortable: true,
        },
        {
          key: 'notifiedAt',
          label: 'Date de notification',
          sortable: true,
        },
        {
          key: 'hasResponded',
          label: 'Status de réponse',
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
      loading,
      loadings,
    }
  },
  computed: {
    /**
     * Total no. of records
     */
    totalParticipants() {
      return this.orderData.length
    },
    // Total de ceux qui ont répondu
    totalResponded() {
      return this.orderData.filter((p) => p.hasResponded === true).length
    },
    // Total de ceux qui n'ont pas répondu
    totalNotResponded() {
      return this.orderData.filter((p) => p.hasResponded === false).length
    },
    totalNotNotified() {
      return this.orderData.filter((p) => p.hasResponded === false).length
    },
    totalNotified() {
      return this.orderData.filter((p) => p.hasResponded === true).length
    },
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
      <BRow class="d-flex justify-content-between align-items-center">
        <BCol cols="auto"
          ><a href="javascript:void(0)" class="btn btn-link text-muted" @click="$router.back()">
            <h4><i class="uil uil-arrow-left me-1"></i> Retour</h4>
          </a></BCol
        ></BRow
      >
      <BRow class="align-items-stretch">
        <BCol cols="12" md="9" order="2" class="h-100">
          <BRow>
            <BCol md="4" cols="xl-4">
              <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                  <div>
                    <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-people text-warning fs-3 me-2"></i>
                      <h4 class="fw-bold mb-0 fs-2">
                        <CountToComponent
                          :startVal="0"
                          :endVal="totalParticipants"
                          :duration="2000"
                        />
                      </h4>
                    </div>

                    <span
                      class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                      >Participants</span
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
                      <i class="bi bi-pencil-square text-success fs-3 me-2"></i>
                      <h4 class="fw-bold mb-0 fs-2">
                        <CountToComponent :startVal="0" :endVal="totalResponded" :duration="2000" />
                      </h4>
                    </div>
                    <span
                      class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                      >Répondus</span
                    >
                  </div>
                </BCardBody>
              </BCard>
            </BCol>
            <BCol md="2" cols="xl-2">
              <BCard no-body class="shadow-sm rounded-4 stat-card shadow-danger">
                <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                  <div>
                    <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-ui-checks-grid text-danger fs-3 me-2"></i>
                      <h4 class="fw-bold mb-0 fs-2">
                        <CountToComponent
                          :startVal="0"
                          :endVal="totalNotResponded"
                          :duration="2000"
                        />
                      </h4>
                    </div>

                    <span
                      class="badge bg-danger-subtle text-danger fw-semibold px-1 py-1 rounded-pill"
                      >Non Répondus</span
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
                      <i class="bi bi-pencil-square text-success fs-3 me-2"></i>
                      <h4 class="fw-bold mb-0 fs-2">
                        <CountToComponent
                          :startVal="0"
                          :endVal="totalNotNotified"
                          :duration="2000"
                        />
                      </h4>
                    </div>
                    <span
                      class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                      >Notifier</span
                    >
                  </div>
                </BCardBody>
              </BCard>
            </BCol>
            <BCol md="2" cols="xl-2">
              <BCard no-body class="shadow-sm rounded-4 stat-card shadow-danger">
                <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                  <div>
                    <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-ui-checks-grid text-danger fs-3 me-2"></i>
                      <h4 class="fw-bold mb-0 fs-2">
                        <CountToComponent
                          :startVal="0"
                          :endVal="totalNotNotified"
                          :duration="2000"
                        />
                      </h4>
                    </div>

                    <span
                      class="badge bg-danger-subtle text-danger fw-semibold px-1 py-1 rounded-pill"
                      >Non Notifier</span
                    >
                  </div>
                </BCardBody>
              </BCard>
            </BCol>
          </BRow>
          <hr />
          <BCol cols="12">
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
                        class="form-control-sm ms-2"
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
                <p class="mt-3 text-muted">Aucun Participants</p>
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

                <template v-slot:cell(lastName)="data">
                  <a href="#" class="text-body">{{ data.item.participantProfile.lastName }}</a>
                </template>

                <template v-slot:cell(title)="data">
                  <a href="#" class="text-body"
                    >{{
                      data.item.survey?.title
                        ? data.item.survey.title.length > 50
                          ? data.item.survey.title.substring(0, 50) + '...'
                          : data.item.survey.title
                        : '—'
                    }}
                  </a>
                </template>

                <template v-slot:cell(gender)="data">
                  <a
                    href="#"
                    class="badge"
                    :class="{
                      'bg-info': data.item.participantProfile.gender === 'M',

                      'bg-pink': data.item.participantProfile.gender === 'F',
                    }"
                    >{{ data.item.participantProfile.gender === 'M' ? 'Homme' : 'Femme' }}</a
                  >
                </template>

                <template v-slot:cell(birthDate)="data">
                  <a href="#" class="text-warning">{{
                    getAge(data.item.participantProfile.birthDate)
                  }}</a>
                </template>

                <template v-slot:cell(notified)="data">
                  <a
                    href="#"
                    class="badge"
                    :class="{
                      'bg-success': data.item.notified === true,

                      'bg-danger': data.item.notified === false,
                    }"
                    >{{ data.item.notified === false ? 'Non Notifier' : 'Notifiée' }}</a
                  >
                </template>

                <template v-slot:cell(notifiedAt)="data">
                  <a href="#" class="text-body">{{
                    data.item.notifiedAt === null
                      ? '---'
                      : new Date(data.item.notifiedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                  }}</a>
                </template>

                <template v-slot:cell(hasResponded)="data">
                  <a
                    href="#"
                    class="badge"
                    :class="{
                      'bg-success': data.item.hasResponded === true,

                      'bg-danger': data.item.hasResponded === false,
                    }"
                    >{{ data.item.hasResponded === false ? 'Non répondus' : 'Répondus' }}</a
                  >
                </template>
                <template v-slot:cell(status)="data">
                  <a
                    href="#"
                    class="badge"
                    :class="{
                      'bg-success': data.item.status === 'completed',
                      'bg-warning': data.item.status === 'in_progress',
                      'bg-danger': data.item.status === 'not_started',
                    }"
                    >{{
                      data.item.status === 'completed'
                        ? 'Completer'
                        : data.item.status === 'in_progress'
                          ? 'En cours'
                          : 'Non répondus'
                    }}</a
                  >
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
        </BCol>
        <BCol cols="12" md="3" order="1" class="border-end d-flex flex-column p-2">
          <BRow class="g-0">
            <BCol lg="12" md="12" sm="12">
              <BCard
                no-body
                class="shadow-sm rounded-4 stat-card shadow-warning d-flex flex-column"
              >
                <BCardBody class="d-flex flex-column p-4" style="width: 100%">
                  <div class="sidebar-content">
                    <div class="d-flex align-items-center mb-3">
                      <h2 class="fw-bold mb-0 py-1 me-2" style="font-size: 15px">
                        <span class="text-warning text-truncate text-wrap">{{
                          truncate(Alldata?.name, 50)
                        }}</span>
                      </h2>
                    </div>

                    <span
                      class="text-wrap text-black fw-semibold py-1 px-2 rounded-pill mb-2"
                      style="font-size: smaller"
                      >{{ truncate(Alldata?.description, 300) }}</span
                    >
                  </div>
                  <div class="sidebar-content"></div>
                </BCardBody>
              </BCard>
            </BCol>
            <BCol lg="12" md="12" sm="12">
              <!-- 🔹 Carte du créateur du sondage BUSINESS -->
              <BCard
                v-if="Alldata.manager?.businessAccount"
                class="shadow-sm border-0 mt-3 rounded-4"
              >
                <div class="p-3 d-flex align-items-center gap-3">
                  <!-- Avatar généré automatiquement -->
                  <img
                    :src="`https://ui-avatars.com/api/?name=${Alldata.manager?.businessAccount?.firstName}+${Alldata.manager?.businessAccount?.lastName}&background=random`"
                    alt="Avatar créateur"
                    class="rounded-circle shadow-sm"
                    style="width: 60px; height: 60px; object-fit: cover"
                  />
                  <div>
                    <!-- Nom et prénom -->
                    <h5 class="mb-1 fw-bold text-primary">
                      {{ Alldata.manager?.businessAccount?.firstName }}
                      {{ Alldata.manager?.businessAccount?.lastName }}
                    </h5>
                  </div>
                </div>
              </BCard>
              <!-- 🔹 Carte du créateur ADMIN -->
              <BCard v-if="Alldata.manager?.admin" class="shadow-sm border-0 mt-3 rounded-4">
                <div class="p-3 d-flex align-items-center gap-3">
                  <!-- Avatar généré automatiquement -->
                  <img
                    :src="`https://ui-avatars.com/api/?name=${Alldata.manager?.admin?.firstName}+${Alldata.manager?.admin?.lastName}&background=random`"
                    alt="Avatar créateur"
                    class="rounded-circle shadow-sm"
                    style="width: 60px; height: 60px; object-fit: cover"
                  />

                  <div>
                    <!-- Nom et prénom -->
                    <h5 class="mb-1 fw-bold text-primary">
                      {{ Alldata.manager?.admin?.firstName }} {{ Alldata.manager?.admin?.lastName }}
                    </h5>
                  </div>
                </div>
              </BCard>
            </BCol>
            <BCol lg="12" md="12" sm="12">
              <!-- 🔹 Carte du créateur du sondage BUSINESS -->
              <BCard class="shadow-sm border-0 mt-3 rounded-4">
                <div class="p-3 d-flex align-items-center gap-3">
                  <!-- Avatar généré automatiquement -->

                  <div>
                    <h5 class="mb-1 fw-bold text-warning">Critères</h5>

                    <p v-if="Alldata.criteria?.age" class="mb-1 text-muted small">
                      <i class="bi bi-person-up me-2"></i>
                      Minimum:{{ Alldata.criteria?.age?.min }}ans -Maximum:
                      {{ Alldata.criteria?.age?.max }}
                    </p>

                    <!-- Email -->
                    <p v-if="Alldata.criteria?.location" class="mb-1 text-muted small">
                      <i class="bi bi-geo-alt me-2"></i>
                      Ville:{{ Alldata.criteria?.location?.city }} - Pays:
                      {{ Alldata.criteria?.location?.country }}
                    </p>

                    <!-- Téléphone -->
                    <p v-if="Alldata.criteria?.profession" class="mb-1 text-muted small">
                      <i class="bi bi-building me-2"></i>
                      Secteur: {{ Alldata.criteria?.profession?.sector }}
                    </p>
                  </div>
                </div>
              </BCard>
            </BCol>
          </BRow>
        </BCol>
      </BRow>
    </BRow>
  </div>
</template>

<style lang="scss">
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
  box-shadow: 0 0 8px #06cff3;
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
.bg-pink {
  background-color: #ff69b4; /* rose */
  color: white; /* texte blanc pour le contraste */
}
</style>
