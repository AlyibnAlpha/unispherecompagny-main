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
  <div>
    <BRow class="d-flexjustify-content-center">
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
              <div
                class="ttable table-centered datatable dt-responsive nowrap table-card-list dataTable no-footer dtr-inline"
              >
                <BRow>
                  <BCol sm="12" md="6">
                    <div id="tickets-table_length" class="dataTables_length">
                      <label class="d-inline-flex align-items-center">
                        Trier:
                        <BFormSelect
                          v-model="perPage"
                          size="sm"
                          :options="pageOptions"
                        ></BFormSelect>
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

                  <template v-slot:cell(birthDate)="data">
                    <a href="#" class="text-warning">{{
                      getAge(data.item.participantProfile.birthDate)
                    }}</a>
                  </template>

                  <template v-slot:cell(phone)="data">
                    <a href="#" class="text-body">{{ data.item.participantProfile.phone }}</a>
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

                  <template v-slot:cell(country)="data">
                    <a href="#" class="text-body">{{
                      data.item.participantProfile.city +
                      ' , ' +
                      data.item.participantProfile.country
                    }}</a>
                  </template>
                  <template v-slot:cell(enabled)="data">
                    <a
                      href="#"
                      class="badge"
                      :class="{
                        'bg-success': data.item.enabled === true,

                        'bg-danger': data.item.enabled === null || data.item.enabled === false,
                      }"
                      >{{
                        data.item.enabled === null || data.item.enabled === false
                          ? 'Non Activé'
                          : 'Activé'
                      }}</a
                    >
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
                <q-dialog v-model="ajout">
                  <q-card
                    class="contact-dashboard-dialog"
                    style="width: 800px; max-width: 90vw; height: 550px; max-height: 80vw"
                  >
                    <!-- Header -->
                    <q-card-section
                      class="dialog-header row items-center"
                      style="background: white"
                    >
                      <div class="header-text q-ml-md">
                        <div v-if="loadingx" class="skeleton skeleton-title"></div>
                        <div v-else class="name text-warning">{{ detailData?.email }}</div>
                        <div class="subtitle text-warning">Détail</div>
                      </div>
                      <q-space />
                    </q-card-section>

                    <q-separator />
                    <q-card-section>
                      <BRow class="d-flex justify-content-center">
                        <BCol md="6" cols="xl-6">
                          <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                            <BCardBody
                              class="d-flex justify-content-between align-items-center p-3 bg-light"
                            >
                              <div>
                                <div class="d-flex align-items-center mb-2">
                                  <i class="bi bi-building text-warning fs-3 me-2"></i>
                                  <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                                  <h4 v-else class="fw-bold mb-0 fs-2">
                                    <CountToComponent
                                      :startVal="0"
                                      :endVal="statss.sondage"
                                      :duration="2000"
                                    />
                                  </h4>
                                </div>

                                <span
                                  class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                                  >Sondages</span
                                >
                              </div>
                            </BCardBody>
                          </BCard>
                        </BCol>

                        <BCol md="6" cols="xl-6">
                          <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
                            <BCardBody
                              class="d-flex justify-content-between align-items-center p-3 bg-light"
                            >
                              <div>
                                <div class="d-flex align-items-center mb-2">
                                  <i class="bi bi-building text-success fs-3 me-2"></i>
                                  <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                                  <h4 v-else class="fw-bold mb-0 fs-2">
                                    <CountToComponent
                                      :startVal="0"
                                      :endVal="statss.sondageP"
                                      :duration="2000"
                                    />
                                  </h4>
                                </div>
                                <span
                                  class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                                  >Réponses</span
                                >
                              </div>
                            </BCardBody>
                          </BCard>
                        </BCol>
                      </BRow>
                    </q-card-section>

                    <!-- Content -->
                    <q-card-section class="dialog-content">
                      <BRow class="d-flex">
                        <BCol md="6" cols="xl-6">
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
                        </BCol>
                        <BCol md="6" cols="xl-6">
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
                        </BCol>
                      </BRow>
                      <BRow>
                        <BCol md="6" cols="xl-6">
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
                        </BCol>
                        <BCol md="6" cols="xl-6">
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
                        </BCol>
                      </BRow>

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
            </BTab>
            <BTab title-item-class="d-flex align-items-center">
              <template #title>
                <i class="bi bi-building text-warning fs-3 me-2"></i>Business</template
              >
              <div
                class="ttable table-centered datatable dt-responsive nowrap table-card-list dataTable no-footer dtr-inline"
              >
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
                <BTable
                  v-else
                  table-class="table table-centered datatable table-card-list"
                  thead-tr-class="bg-transparent"
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
                    <a
                      href="#"
                      class="badge"
                      :class="{
                        'bg-info': data.item.businessAccount.gender === 'M',

                        'bg-pink': data.item.businessAccount.gender === 'F',
                      }"
                      >{{ data.item.businessAccount.gender === 'M' ? 'Homme' : 'Femme' }}</a
                    >
                  </template>

                  <template v-slot:cell(position)="data">
                    <a href="#" class="text-body">{{ data.item.businessAccount.position }}</a>
                  </template>

                  <template v-slot:cell(country)="data">
                    <a href="#" class="text-body">{{ data.item.businessAccount.country }}</a>
                  </template>
                  <template v-slot:cell(enabled)="data">
                    <a
                      href="#"
                      class="badge"
                      :class="{
                        'bg-success': data.item.enabled === true,

                        'bg-danger': data.item.enabled === null || data.item.enabled === false,
                      }"
                      >{{
                        data.item.enabled === null || data.item.enabled === false
                          ? 'Non Activé'
                          : 'Activé'
                      }}</a
                    >
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
                <q-dialog v-model="ajouts">
                  <q-card
                    class="business-dashboard-dialog"
                    style="width: 800px; max-width: 90vw; height: 500px; max-height: 80vw"
                  >
                    <!-- Header -->
                    <q-card-section class="dialog-header row items-center q-pa-sm">
                      <div class="q-ml-sm">
                        <span v-if="loadingx" class="skeleton skeleton-title"></span>
                        <div v-else class="text-h6 text-warning">{{ detailData?.email }}</div>
                        <div class="text-caption text-warning">Détails de l'utilisateur</div>
                      </div>
                      <q-space />
                    </q-card-section>

                    <q-separator color="grey-3" />
                    <q-card-section>
                      <BRow class="d-flex justify-content-center">
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
                                      :endVal="stats.sondage"
                                      :duration="2000"
                                    />
                                  </h4>
                                </div>

                                <span
                                  class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                                  >Sondages</span
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
                                      :endVal="stats.sondageP"
                                      :duration="2000"
                                    />
                                  </h4>
                                </div>
                                <span
                                  class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                                  >Sondages Publier</span
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
                                      :endVal="stats.ReponseN"
                                      :duration="2000"
                                    />
                                  </h4>
                                </div>
                                <span
                                  class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                                  >Réponses</span
                                >
                              </div>
                            </BCardBody>
                          </BCard>
                        </BCol>
                      </BRow>
                    </q-card-section>

                    <q-card-section class="dialog-content">
                      <BRow>
                        <BCol md="4" cols="xl-4">
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
                        </BCol>
                        <BCol md="4" cols="xl-4">
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
                        </BCol>
                        <BCol md="4" cols="xl-4">
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
                        </BCol>
                      </BRow>

                      <BRow>
                        <BCol md="4" cols="xl-4">
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
                        </BCol>
                        <BCol md="4" cols="xl-4">
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
                        </BCol>
                        <BCol md="4" cols="xl-4">
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
                        </BCol>
                      </BRow>
                    </q-card-section>

                    <!-- Actions -->
                  </q-card>
                </q-dialog>
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
            </BTab>
          </BTabs>
        </div>
      </BCol>
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
.business-dashboard-dialog {
  width: 800px;
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .dialog-header {
    padding: 16px;

    .header-text {
      .name {
        font-weight: 700;
        font-size: 1.3rem;
      }
      .subtitle {
        font-size: 0.85rem;
        opacity: 0.85;
      }
    }

    q-btn {
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
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

  .dialog-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .info-card {
      display: flex;
      align-items: center;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 10px 14px;
      transition: all 0.2s;

      &:hover {
        background: #e9ecef;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      }

      .icon {
        color: #0d6efd;
        margin-right: 12px;
      }

      .info-text {
        display: flex;
        flex-direction: column;

        .label {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .value {
          font-weight: 600;
          font-size: 1rem;
          color: #212529;
        }

        .skeleton {
          height: 18px;
          width: 130px;
        }
      }
    }
  }
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
.contact-dashboard-dialog {
  width: 460px;
  max-width: 90vw;
  border-radius: 14px;
  overflow: hidden;

  .dialog-header {
    padding: 16px;
    .header-text {
      .name {
        font-weight: 700;
        font-size: 1.3rem;
      }
      .subtitle {
        font-size: 0.85rem;
        opacity: 0.8;
      }
    }
    q-btn {
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .dialog-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .info-card {
      display: flex;
      align-items: center;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 10px 14px;
      transition: all 0.2s;
      cursor: default;

      &:hover {
        background: #e9ecef;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .icon {
        color: #0d6efd;
        margin-right: 12px;
      }

      .info-text {
        display: flex;
        flex-direction: column;

        .label {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .value {
          font-weight: 600;
          font-size: 1rem;
          color: #212529;
        }

        .skeleton {
          height: 18px;
          width: 130px;
        }
      }
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
