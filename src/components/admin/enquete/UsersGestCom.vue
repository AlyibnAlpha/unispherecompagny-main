<script>
import { onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BFormInput,
  BPagination,
  BFormSelect,
  BTable,
  BTabs,
  BTab,
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
    BFormInput,
    BPagination,
    BFormSelect,
    BTable,
    BTabs,
    BTab,
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
    const stats = ref({
      sondage: '',
      sondageP: '',
      ReponseN: '',
    })
    const statss = ref({
      sondage: 0,
      sondageP: 0,
    })

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
        const response = await api.get('/admin/users')
        orderData.value = response.data.filter((top) => top.participantProfile !== null)
        orderDatas.value = response.data.filter((top) => top.businessAccount !== null)
        console.log(orderDatas)
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }

    const Active = async (idact) => {
      try {
        loadings.value = true
        await api.post(`/admin/users/${idact}/activate`)
        Swal.fire({
          icon: 'success',
          title: 'ACtivé avec success',
          showConfirmButton: true,
          timer: 2000,
        })
        gets()
      } catch (error) {
        console.log(error)
        Notify.create({
          type: 'danger',
          message: "Une erreur est survenue lors de l'ativation.",
          timeout: 3000,
        })
      } finally {
        loadings.value = false
      }
    }
    const Desact = async (idact) => {
      try {
        loadings.value = true
        await api.post(`/admin/users/${idact}/deactivate`)
        Swal.fire({
          icon: 'success',
          title: 'Désactiver avec success',
          showConfirmButton: true,
          timer: 2000,
        })
        gets()
      } catch (error) {
        console.log(error)
        Notify.create({
          type: 'danger',
          message: "Une erreur est survenue lors de l'ativation.",
          timeout: 3000,
        })
      } finally {
        loadings.value = false

        gets()
      }
    }
    const openDetailModal = async (idy) => {
      try {
        ajout.value = true
        loadingx.value = true
        const response = await api.get(`/admin/users/${idy.id}`)
        detailData.value = response.data

        const res = await api.get('/admin/dashboard/overview')

        statss.value.sondage = res.data.survey_participants?.filter(
          (e) => e.participantProfile?.user[0].email === idy.email && e.survey !== null,
        ).length
        console.log(statss.value.sondage)
        statss.value.sondageP =
          res.data?.surveys
            ?.flatMap((s) => s.responses) // récupère tous les responses de chaque sondage
            ?.filter((r) => r.user?.email === idy.email)?.length ?? 0 // garde ceux de l'utilisateur
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
    const openDetailModals = async (idy) => {
      try {
        loadingx.value = true
        ajouts.value = true
        const response = await api.get(`/admin/users/${idy.id}`)
        detailData.value = response.data

        const res = await api.get('/admin/dashboard/overview')
        stats.value.sondage = res.data.surveys.filter((e) => e.user.email === idy.email).length
        stats.value.sondageP = res.data.surveys.filter(
          (e) => e.user.email === idy.email && e.isPublished === true,
        ).length
        const rep = res.data.surveys.filter((e) => e.user.email === idy.email)
        stats.value.ReponseN = rep.reduce(
          (acc, item) =>
            acc +
            (item.responses
              ? item.responses.reduce(
                  (a, r) => a + (r.responseDetails ? r.responseDetails.length : 0),
                  0,
                )
              : 0),
          0,
        )
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

    onMounted(() => {
      gets()
    })
    return {
      statss,
      stats,
      activeTabss: 0,
      ajout,
      ajouts,
      optionl,
      detailData,
      openDetailModal,
      openDetailModals,
      Active,
      Desact,
      getAge,
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
      totalRowss: 1,
      currentPages: 1,
      perPages: 10,
      pageOptionss: [10, 25, 50, 100],
      filters: null,
      filterOns: [],
      sortBys: 'age',
      sortDescs: false,
      fieldss: [
        {
          key: 'check',
          label: '',
        },

        {
          key: 'companyName',
          label: 'Compagnie',
        },
        {
          key: 'lastName',
          label: 'Nom',
          sortable: true,
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
          key: 'position',
          label: 'Métier',
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
      progressBarValues: 15,
      activeTabs: 1,
      activeTabArrows: 2,
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
    rowss() {
      return this.orderDatas.length
    },
    totalParticipants() {
      return this.orderData.length
    },
    totalBusinnes() {
      return this.orderDatas.length
    },
    totalParticipantsA() {
      return this.orderData.filter((p) => p.enabled === true).length
    },
    totalParticipantsAN() {
      return this.orderData.filter((p) => p.enabled === null || p.enabled === false).length
    },
    totalBusinnesA() {
      return this.orderDatas.filter((p) => p.enabled === true).length
    },
    totalBusinnesAN() {
      return this.orderDatas.filter((p) => p.enabled === null || p.enabled === false).length
    },
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.orderData.length
    this.totalRowss = this.orderDatas.length
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
  <div class="modern-admin-page">
    <!-- Header moderne -->
    <div class="modern-page-header">
      <div class="header-left">
        <h1 class="page-title-modern">
          <i class="bi bi-people-fill"></i>
          Gestion des Utilisateurs
        </h1>
        <p class="page-subtitle-modern">Gérez les comptes Business et Participants</p>
      </div>
    </div>

    <!-- Cartes de statistiques modernes -->
    <div class="stats-grid-modern stats-grid-6">
      <div class="stat-card-modern stat-card-warning">
        <div class="stat-icon-wrapper">
          <i class="bi bi-person-fill"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">
            <CountToComponent :startVal="0" :endVal="totalParticipants" :duration="2000" />
          </h3>
          <p class="stat-label">Participants</p>
        </div>
        <div class="stat-progress-bar"></div>
      </div>

      <div class="stat-card-modern stat-card-info">
        <div class="stat-icon-wrapper">
          <i class="bi bi-building-fill"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">
            <CountToComponent :startVal="0" :endVal="totalBusinnes" :duration="2000" />
          </h3>
          <p class="stat-label">Business</p>
        </div>
        <div class="stat-progress-bar"></div>
      </div>

      <div class="stat-card-modern stat-card-success">
        <div class="stat-icon-wrapper">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">
            <CountToComponent :startVal="0" :endVal="totalParticipantsA" :duration="2000" />
          </h3>
          <p class="stat-label">Participants Activés</p>
        </div>
        <div class="stat-progress-bar"></div>
      </div>

      <div class="stat-card-modern stat-card-danger">
        <div class="stat-icon-wrapper">
          <i class="bi bi-x-circle-fill"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">
            <CountToComponent :startVal="0" :endVal="totalParticipantsAN" :duration="2000" />
          </h3>
          <p class="stat-label">Participants Non Activés</p>
        </div>
        <div class="stat-progress-bar"></div>
      </div>

      <div class="stat-card-modern stat-card-success">
        <div class="stat-icon-wrapper">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">
            <CountToComponent :startVal="0" :endVal="totalBusinnesA" :duration="2000" />
          </h3>
          <p class="stat-label">Business Activés</p>
        </div>
        <div class="stat-progress-bar"></div>
      </div>

      <div class="stat-card-modern stat-card-danger">
        <div class="stat-icon-wrapper">
          <i class="bi bi-x-circle-fill"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">
            <CountToComponent :startVal="0" :endVal="totalBusinnesAN" :duration="2000" />
          </h3>
          <p class="stat-label">Business Non Activés</p>
        </div>
        <div class="stat-progress-bar"></div>
      </div>
    </div>

    <BRow class="d-none">
      <BCol md="2" cols="xl-2">
        <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
          <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
            <div>
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-people text-warning fs-3 me-2"></i>
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
      <BCol md="2" cols="xl-2">
        <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
          <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
            <div>
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-people text-warning fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="totalBusinnes" :duration="2000" />
                </h4>
              </div>

              <span class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                >Businnes</span
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
                <i class="bi bi-people text-success fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="totalParticipantsA" :duration="2000" />
                </h4>
              </div>
              <span class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                >Participants Activé</span
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
                <i class="bi bi-people text-danger fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="totalParticipantsAN" :duration="2000" />
                </h4>
              </div>

              <span class="badge bg-danger-subtle text-danger fw-semibold px-1 py-1 rounded-pill"
                >Participants Non Activé</span
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
                <i class="bi bi-people text-success fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="totalBusinnesA" :duration="2000" />
                </h4>
              </div>
              <span class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                >Business Activé</span
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
                <i class="bi bi-people text-danger fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="totalBusinnesAN" :duration="2000" />
                </h4>
              </div>

              <span class="badge bg-danger-subtle text-danger fw-semibold px-1 py-1 rounded-pill"
                >Business Non Activé</span
              >
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
    <BRow>
      <BCol cols="12">
        <div class="tabs-morphing-container">
          <BTabs
            v-model="activeTabss"
            content-class="mt-3"
            pills
            class="morph-tabs"
            nav-class="justify-content-center"
          >
            <BTab title-item-class="d-flex align-items-center" active>
              <template #title>
                <i class="bi bi-people text-warning fs-3 me-2"></i>Participants</template
              >
              <div class="table-container-modern">
                <div class="table-toolbar">
                  <div class="table-control-item">
                    <BFormSelect v-model="perPage" :options="pageOptions" class="modern-select"></BFormSelect>
                  </div>
                  <div class="search-wrapper-table">
                    <i class="bi bi-search search-icon-table"></i>
                    <BFormInput
                      v-model="filter"
                      type="search"
                      placeholder="Rechercher un participant..."
                      class="search-input-table"
                    ></BFormInput>
                  </div>
                </div>
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
                  <template v-slot:cell(lastName)="data">
                    <a href="#" class="text-body">{{ data.item.participantProfile.lastName }}</a>
                  </template>

                  <template v-slot:cell(birthDate)="data">
                    <a href="#" class="text-warning">{{
                      getAge(data.item.participantProfile.birthDate)
                    }}</a>
                  </template>

                  <template v-slot:cell(phone)="data">
                    <a href="#" class="text-body">{{ data.item.participantProfile.phone }}</a>
                  </template>

                  <template v-slot:cell(gender)="data">
                    <span
                      class="badge badge-pill font-size-12"
                      :class="{
                        'bg-soft-primary': data.item.participantProfile.gender === 'M',
                        'bg-soft-danger': data.item.participantProfile.gender === 'F',
                      }"
                    >
                      {{ data.item.participantProfile.gender === 'M' ? 'Homme' : 'Femme' }}
                    </span>
                  </template>

                  <template v-slot:cell(country)="data">
                    <a href="#" class="text-body">{{
                      data.item.participantProfile.city +
                      ' , ' +
                      data.item.participantProfile.country
                    }}</a>
                  </template>
                  <template v-slot:cell(enabled)="data">
                    <span
                      class="badge badge-pill font-size-12"
                      :class="{
                        'bg-soft-success': data.item.enabled === true,
                        'bg-soft-danger': data.item.enabled === null || data.item.enabled === false,
                      }"
                    >
                      {{
                        data.item.enabled === null || data.item.enabled === false
                          ? 'Non Activé'
                          : 'Activé'
                      }}
                    </span>
                  </template>
                  <template v-slot:cell(action)="data">
                    <ul class="list-inline mb-0">
                      <li class="list-inline-item">
                        <a
                          href="#"
                          class="px-2 text-info"
                          @click.prevent="openDetailModal(data.item)"
                          title="Détails"
                        >
                          <i class="bi bi-eye" style="font-size: 18px"></i>
                        </a>
                      </li>

                      <li class="list-inline-item">
                        <a
                          v-if="data.item.enabled === null || data.item.enabled === false"
                          href="#"
                          class="px-2 text-success"
                          @click.prevent="Active(data.item)"
                          title="active"
                        >
                          <q-spinner-orbit color="green" size="18px" v-if="loading" />
                          <i v-else class="uil uil-check font-size-18"></i>
                        </a>
                      </li>

                      <li class="list-inline-item">
                        <a
                          v-if="data.item.enabled === true"
                          href="#"
                          class="px-2 text-danger"
                          @click.prevent="Desact(data.item.id)"
                          title="Désactiver"
                        >
                          <q-spinner-orbit color="red" size="18px" v-if="loading" />
                          <i v-else class="uil uil-exclamation-octagon font-size-18"></i>
                        </a>
                      </li>
                    </ul>
                  </template>
                  </BTable>
                </div>

                <!-- Pagination moderne -->
                <div class="pagination-container">
                  <BPagination v-model="currentPage" :total-rows="rows" :per-page="perPage" class="modern-pagination" />
                </div>
              </div>
                <q-dialog v-model="ajout">
                  <q-card class="modern-modal-card">
                    <!-- Header -->
                    <q-card-section class="dialog-header row items-center">
                      <div class="header-text q-ml-md">
                        <div v-if="loadingx" class="skeleton skeleton-title"></div>
                        <div v-else class="name">{{ detailData?.email }}</div>
                        <div class="subtitle">Détails du Participant</div>
                      </div>
                      <q-space />
                    </q-card-section>

                    <q-separator />
                    <q-card-section class="modal-stats-section">
                      <div class="modal-stats-grid">
                        <div class="modal-stat-card modal-stat-warning">
                          <div class="modal-stat-icon">
                            <i class="bi bi-clipboard-data-fill"></i>
                          </div>
                          <div class="modal-stat-content">
                            <div v-if="loadingx" class="skeleton skeleton-title"></div>
                            <div v-else class="modal-stat-value">
                              <CountToComponent
                                :startVal="0"
                                :endVal="statss.sondage"
                                :duration="2000"
                              />
                            </div>
                            <div class="modal-stat-label">Sondages</div>
                          </div>
                        </div>

                        <div class="modal-stat-card modal-stat-success">
                          <div class="modal-stat-icon">
                            <i class="bi bi-check-circle-fill"></i>
                          </div>
                          <div class="modal-stat-content">
                            <div v-if="loadingx" class="skeleton skeleton-title"></div>
                            <div v-else class="modal-stat-value">
                              <CountToComponent
                                :startVal="0"
                                :endVal="statss.sondageP"
                                :duration="2000"
                              />
                            </div>
                            <div class="modal-stat-label">Réponses</div>
                          </div>
                        </div>
                      </div>
                    </q-card-section>

                    <!-- Content -->
                    <q-card-section class="dialog-content">
                      <div class="info-card">
                        <q-icon name="badge" size="20px" class="icon" />
                        <div class="info-text">
                          <div class="label">Nom</div>
                          <div v-if="loadingx" class="skeleton skeleton-text"></div>
                          <div v-else class="value">
                            {{ detailData.participantProfile?.lastName }}
                            {{ detailData.participantProfile?.firstName }}
                          </div>
                        </div>
                      </div>

                      <div class="info-card">
                        <q-icon name="cake" size="20px" class="icon" />
                        <div class="info-text">
                          <div class="label">Âge</div>
                          <div v-if="loadingx" class="skeleton skeleton-text"></div>
                          <div v-else class="value">
                            {{ getAge(detailData.participantProfile?.birthDate) }}
                          </div>
                        </div>
                      </div>

                      <div class="info-card">
                        <q-icon name="phone" size="20px" class="icon" />
                        <div class="info-text">
                          <div class="label">Téléphone</div>
                          <div v-if="loadingx" class="skeleton skeleton-text"></div>
                          <div v-else class="value">
                            {{ detailData.participantProfile?.phone }}
                          </div>
                        </div>
                      </div>

                      <div class="info-card">
                        <q-icon name="wc" size="20px" class="icon" />
                        <div class="info-text">
                          <div class="label">Genre</div>
                          <div v-if="loadingx" class="skeleton skeleton-text"></div>
                          <div v-else class="value">
                            {{
                              detailData.participantProfile?.gender === 'M' ? 'Homme' : 'Femme'
                            }}
                          </div>
                        </div>
                      </div>

                      <div class="info-card">
                        <q-icon name="place" size="20px" class="icon" />
                        <div class="info-text">
                          <div class="label">Localité</div>
                          <div v-if="loadingx" class="skeleton skeleton-text"></div>
                          <div v-else class="value">
                            {{ detailData.participantProfile?.city }},
                            {{ detailData.participantProfile?.country }}
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-dialog>
            </BTab>
            <BTab title-item-class="d-flex align-items-center">
              <template #title>
                <i class="bi bi-building text-warning fs-3 me-2"></i>Business</template
              >
              <div class="table-container-modern">
                <div class="table-toolbar">
                  <div class="table-control-item">
                    <BFormSelect v-model="perPages" :options="pageOptionss" class="modern-select"></BFormSelect>
                  </div>
                  <div class="search-wrapper-table">
                    <i class="bi bi-search search-icon-table"></i>
                    <BFormInput
                      v-model="filters"
                      type="search"
                      placeholder="Rechercher un business..."
                      class="search-input-table"
                    ></BFormInput>
                  </div>
                </div>
                <div v-if="loading" class="text-center my-5">
                  <q-spinner-ball color="green" size="50px" />
                </div>
                <div
                  v-else-if="Array.isArray(orderDatas) && orderDatas.length === 0"
                  class="text-center py-5"
                >
                  <i class="uil uil-folder-open text-muted" style="font-size: 3rem"></i>
                  <p class="mt-3 text-muted">Aucun Businnes</p>
                </div>
                <div v-else class="table-wrapper">
                  <BTable
                    table-class="modern-table"
                    thead-tr-class="table-header"
                  :items="orderDatas"
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
                  <template v-slot:cell(companyName)="data">
                    <a href="#" class="text-body">{{ data.item.businessAccount.companyName }}</a>
                  </template>

                  <template v-slot:cell(lastName)="data">
                    <a href="#" class="text-warning">{{ data.item.businessAccount.lastName }}</a>
                  </template>

                  <template v-slot:cell(phone)="data">
                    <a href="#" class="text-body">{{ data.item.businessAccount.phone }}</a>
                  </template>

                  <template v-slot:cell(gender)="data">
                    <span
                      class="badge badge-pill font-size-12"
                      :class="{
                        'bg-soft-primary': data.item.businessAccount.gender === 'M',
                        'bg-soft-danger': data.item.businessAccount.gender === 'F',
                      }"
                    >
                      {{ data.item.businessAccount.gender === 'M' ? 'Homme' : 'Femme' }}
                    </span>
                  </template>

                  <template v-slot:cell(position)="data">
                    <a href="#" class="text-body">{{ data.item.businessAccount.position }}</a>
                  </template>

                  <template v-slot:cell(country)="data">
                    <a href="#" class="text-body">{{ data.item.businessAccount.country }}</a>
                  </template>
                  <template v-slot:cell(enabled)="data">
                    <span
                      class="badge badge-pill font-size-12"
                      :class="{
                        'bg-soft-success': data.item.enabled === true,
                        'bg-soft-danger': data.item.enabled === null || data.item.enabled === false,
                      }"
                    >
                      {{
                        data.item.enabled === null || data.item.enabled === false
                          ? 'Non Activé'
                          : 'Activé'
                      }}
                    </span>
                  </template>
                  <template v-slot:cell(action)="data">
                    <ul class="list-inline mb-0">
                      <li class="list-inline-item">
                        <a
                          href="#"
                          class="px-2 text-info"
                          @click.prevent="openDetailModals(data.item)"
                          title="Détails"
                        >
                          <i class="bi bi-eye" style="font-size: 18px"></i>
                        </a>
                      </li>

                      <li class="list-inline-item">
                        <a
                          v-if="data.item.enabled === null || data.item.enabled === false"
                          href="#"
                          class="px-2 text-success"
                          @click.prevent="Active(data.item.id)"
                          title="active"
                        >
                          <q-spinner-orbit color="green" size="18px" v-if="loadings" />
                          <i v-else class="uil uil-check font-size-18"></i>
                        </a>
                      </li>

                      <li class="list-inline-item">
                        <a
                          v-if="data.item.enabled === true"
                          href="#"
                          class="px-2 text-danger"
                          @click.prevent="Desact(data.item.id)"
                          title="Désactiver"
                        >
                          <q-spinner-orbit color="red" size="18px" v-if="loadings" />
                          <i v-else class="uil uil-exclamation-octagon font-size-18"></i>
                        </a>
                      </li>
                    </ul>
                  </template>
                  </BTable>
                </div>

                <!-- Pagination moderne -->
                <div class="pagination-container">
                  <BPagination v-model="currentPages" :total-rows="rowss" :per-page="perPages" class="modern-pagination" />
                </div>
              </div>
                <q-dialog v-model="ajouts">
                  <q-card class="modern-modal-card">
                    <!-- Header -->
                    <q-card-section class="dialog-header row items-center">
                      <div class="header-text q-ml-md">
                        <div v-if="loadingx" class="skeleton skeleton-title"></div>
                        <div v-else class="name">{{ detailData?.email }}</div>
                        <div class="subtitle">Détails du Business</div>
                      </div>
                      <q-space />
                    </q-card-section>

                    <q-separator color="grey-3" />
                    <q-card-section class="modal-stats-section">
                      <div class="modal-stats-grid modal-stats-grid-3">
                        <div class="modal-stat-card modal-stat-warning">
                          <div class="modal-stat-icon">
                            <i class="bi bi-clipboard-data-fill"></i>
                          </div>
                          <div class="modal-stat-content">
                            <div v-if="loadingx" class="skeleton skeleton-title"></div>
                            <div v-else class="modal-stat-value">
                              <CountToComponent
                                :startVal="0"
                                :endVal="stats.sondage"
                                :duration="2000"
                              />
                            </div>
                            <div class="modal-stat-label">Sondages</div>
                          </div>
                        </div>

                        <div class="modal-stat-card modal-stat-success">
                          <div class="modal-stat-icon">
                            <i class="bi bi-check-circle-fill"></i>
                          </div>
                          <div class="modal-stat-content">
                            <div v-if="loadingx" class="skeleton skeleton-title"></div>
                            <div v-else class="modal-stat-value">
                              <CountToComponent
                                :startVal="0"
                                :endVal="stats.sondageP"
                                :duration="2000"
                              />
                            </div>
                            <div class="modal-stat-label">Sondages Publiés</div>
                          </div>
                        </div>

                        <div class="modal-stat-card modal-stat-info">
                          <div class="modal-stat-icon">
                            <i class="bi bi-chat-dots-fill"></i>
                          </div>
                          <div class="modal-stat-content">
                            <div v-if="loadingx" class="skeleton skeleton-title"></div>
                            <div v-else class="modal-stat-value">
                              <CountToComponent
                                :startVal="0"
                                :endVal="stats.ReponseN"
                                :duration="2000"
                              />
                            </div>
                            <div class="modal-stat-label">Réponses</div>
                          </div>
                        </div>
                      </div>
                    </q-card-section>

                    <q-card-section class="dialog-content dialog-content-3col">
                      <div class="info-card">
                        <q-icon name="corporate_fare" size="20px" class="icon" />
                        <div class="info-text">
                          <div class="label">Compagnie</div>
                          <div v-if="loadingx" class="skeleton skeleton-text"></div>
                          <div v-else class="value">
                            {{ detailData.businessAccount?.companyName }}
                          </div>
                        </div>
                      </div>

                      <div class="info-card">
                        <q-icon name="person" size="20px" class="icon" />
                        <div class="info-text">
                          <div class="label">Nom d'utilisateur</div>
                          <div v-if="loadingx" class="skeleton skeleton-text"></div>
                          <div v-else class="value">
                            {{ detailData.businessAccount?.lastName }}
                            {{ detailData.businessAccount?.firstName }}
                          </div>
                        </div>
                      </div>

                      <div class="info-card">
                        <i class="bi bi-postcard-fill icon" style="font-size: 20px"></i>
                        <div class="info-text">
                          <div class="label">Métier</div>
                          <div v-if="loadingx" class="skeleton skeleton-text"></div>
                          <div v-else class="value">
                            {{ detailData.businessAccount?.position }}
                          </div>
                        </div>
                      </div>

                      <div class="info-card">
                        <q-icon name="phone" size="20px" class="icon" />
                        <div class="info-text">
                          <div class="label">Téléphone</div>
                          <div v-if="loadingx" class="skeleton skeleton-text"></div>
                          <div v-else class="value">
                            {{ detailData.businessAccount?.phone }}
                          </div>
                        </div>
                      </div>

                      <div class="info-card">
                        <q-icon name="wc" size="20px" class="icon" />
                        <div class="info-text">
                          <div class="label">Genre</div>
                          <div v-if="loadingx" class="skeleton skeleton-text"></div>
                          <div v-else class="value">
                            {{ detailData.businessAccount?.gender === 'M' ? 'Homme' : 'Femme' }}
                          </div>
                        </div>
                      </div>

                      <div class="info-card">
                        <i class="bi bi-geo-alt icon" style="font-size: 20px"></i>
                        <div class="info-text">
                          <div class="label">Localité</div>
                          <div v-if="loadingx" class="skeleton skeleton-text"></div>
                          <div v-else class="value">
                            {{ detailData.businessAccount?.country }}
                          </div>
                        </div>
                      </div>
                    </q-card-section>

                    <!-- Actions -->
                    <q-card-actions align="right">
                      <q-btn
                        v-close-popup
                        flat
                        label="Fermer"
                        color="primary"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
            </BTab>
          </BTabs>
        </div>
      </BCol>
    </BRow>
  </div>
</template>
<style lang="scss">
@import '../../../css/admin/users-management.scss';
@import '../../../css/admin/tables-shared.scss';
@import '../../../css/admin/badges.scss';

// ✅ Tous les styles sont maintenant dans users-management.scss
</style>

