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
    CountToComponent,
    BCardBody,
    BCard,
    BButton,
  },
  data() {
    const orderDatas = ref([])
    const detailData = ref([])
    const ajouts = ref(false)
    const ajout = ref(false)
    const edit = ref(false)
    const optionl = ref([])
    const loading = ref(false)
    const loadings = ref(false)
    const sup = ref(0)
    const loadingx = ref(false)
    const optionlp = [
      { label: 'Françe', value: 'FR' },
      { label: 'Engletaire', value: 'EN' },
      { label: 'Espagne', value: 'ES' },
      { label: 'Itali', value: 'IT' },
      { label: 'Portugual', value: 'PT' },
      { label: 'MALI', value: 'ML' },
      { label: "Côte d'ivoire", value: 'CI' },
      { label: 'Sénegal', value: 'SN' },
      { label: 'Gambie', value: 'GM' },
      { label: 'Guinée', value: 'GN' },
      { label: 'Burkina Faso', value: 'BF' },
      { label: 'Togo', value: 'TG' },
      { label: 'Bénin', value: 'BJ' },
      { label: 'Niger', value: 'NE' },
      { label: 'Tchad', value: 'TD' },
      { label: 'Cameroun', value: 'CM' },
      { label: 'Gabon', value: 'GA' },
      { label: 'Congo', value: 'CG' },
      { label: 'République Démocratique du Congo', value: 'CD' },
      { label: 'Angola', value: 'AO' },
      { label: 'Mozambique', value: 'MZ' },
      { label: 'Zambie', value: 'ZM' },
      { label: 'Zimbabwe', value: 'ZW' },
      { label: 'Namibie', value: 'NA' },
      { label: 'Botswana', value: 'BW' },
      { label: 'Soudan', value: 'SD' },
      { label: 'Ethiopie', value: 'ET' },
      { label: 'Somalie', value: 'SO' },
      { label: 'Kenya', value: 'KE' },
      { label: 'Ouganda', value: 'UG' },
      { label: 'Tanzanie', value: 'TZ' },
      { label: 'Rwanda', value: 'RW' },
      { label: 'Burundi', value: 'BI' },
      { label: 'Madagascar', value: 'MG' },
      { label: 'Seychelles', value: 'SC' },
      { label: 'Maurice', value: 'MU' },
      { label: 'Comores', value: 'KM' },
      { label: 'Cap-Vert', value: 'CV' },
      { label: 'Sao Tomé-et-Principe', value: 'ST' },
      { label: 'Guinée-Bissau', value: 'GW' },
      { label: 'Libéria', value: 'LR' },
      { label: 'Sierra Leone', value: 'SL' },
      { label: 'Libye', value: 'LY' },
      { label: 'Algérie', value: 'DZ' },
      { label: 'Maroc', value: 'MA' },
      { label: 'Tunisie', value: 'TN' },
      { label: 'Egypte', value: 'EG' },
      { label: 'Soudan du Sud', value: 'SS' },
      { label: 'Erythrée', value: 'ER' },
    ]

    const formule = ref({
      email: '',
      password: '',
      roles: [import.meta.env.VITE_DEFAULT_ROLEA],
      adminAccount: {
        firstName: '',
        lastName: '',
        phone: '',
        position: '',
        country: '',
        gender: '',
        isSuperAdmin: true,
        permissions: {
          view_logs: true,
          export_data: true,
          manage_tasks: true,
          manage_users: true,
          manage_reports: true,
          manage_surveys: true,
          manage_permissions: true,
          manage_targeting_rules: true,
        },
      },
    })
    const form = ref({
      firstName: '',
      lastName: '',
      phone: '',
      position: '',
      isSuperAdmin: true,
      permissions: {
        view_logs: true,
        export_data: true,
        manage_tasks: true,
        manage_users: true,
        manage_reports: true,
        manage_surveys: true,
        manage_permissions: true,
        manage_targeting_rules: true,
      },
    })
    const stats = ref({
      sondage: '',
      sondageP: '',
      ReponseN: '',
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
        console.log(response.data)
        orderDatas.value = response.data.filter((top) => top.admin !== null)
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
          message: error.response.data.message || "Une erreur est survenue lors de l'ativation.",
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
          message: error.response.data.message || "Une erreur est survenue lors de l'ativation.",
          timeout: 3000,
        })
      } finally {
        loadings.value = false
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
    const Edit = async () => {
      try {
        loadings.value = true
        await api.put(`/users/edit/${sup.value}`, { adminAccount: form.value })
        Swal.fire({
          icon: 'success',
          title: 'Enregistre avec success',
          showConfirmButton: true,
          timer: 2000,
        })
        gets()
      } catch (error) {
        Notify.create({
          type: 'danger',
          message:
            error.response?.data?.message || "Une erreur est survenue lors de l'enregistrement",
          timeout: 6000,
        })
      } finally {
        loadings.value = false
        edit.value = false
      }
    }
    const Add = async () => {
      try {
        loadings.value = true
        await api.post('/users/register', formule.value)
        Swal.fire({
          icon: 'success',
          title: 'Enregistre avec success',
          showConfirmButton: true,
          timer: 2000,
        })
        gets()
        formule.value = {
          email: '',
          password: '',
          roles: [import.meta.env.VITE_DEFAULT_ROLEP],
          adminAccount: {
            firstName: '',
            lastName: '',
            phone: '',
            position: '',
            country: '',
            gender: '',
            isSuperAdmin: false,
            permissions: {
              view_logs: true,
              export_data: true,
              manage_tasks: true,
              manage_users: true,
              manage_reports: true,
              manage_surveys: true,
              manage_permissions: true,
              manage_targeting_rules: true,
            },
          },
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title:
            error.response?.data?.message || "Une erreur est survenue lors de l'enregistrement",
          showConfirmButton: true,
          timer: 6000,
        })
      } finally {
        loadings.value = false
        ajout.value = false
      }
    }

    const openEditModal = async (survey) => {
      const response = await api.get(`/admin/users/${survey.id}`)
      detailData.value = response.data
      sup.value = survey.id
      form.value = { ...survey.admin }

      setTimeout(() => {
        edit.value = true
      }, 500)
      this.activeTab = 1
      this.progressBarValue = 15
    }

    onMounted(() => {
      gets()
    })
    return {
      sup,
      optionlp,
      Add,
      ajout,
      formule,
      form,
      edit,
      stats,
      activeTabss: 0,
      ajouts,
      optionl,
      detailData,
      openDetailModals,
      openEditModal,
      Edit,
      Active,
      Desact,
      getAge,
      orderDatas,
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
          key: 'position',
          label: 'Position',
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

    rowss() {
      return this.orderDatas.length
    },
    totalBusinnes() {
      return this.orderDatas.length
    },

    totalBusinnesA() {
      return this.orderDatas.filter((p) => p.enabled === true).length
    },
    totalBusinnesAN() {
      return this.orderDatas.filter((p) => p.enabled === null).length
    },
  },
  mounted() {
    // Set the initial number of items
    this.totalRowss = this.orderDatas.length
  },
  methods: {
    /**
     * Search the table data with search input
     */

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
    <BRow class="d-flex justify-content-center">
      <BCol md="4" cols="xl-4">
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
                >Administrateurs</span
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
                <i class="bi bi-people text-success fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="totalBusinnesA" :duration="2000" />
                </h4>
              </div>
              <span class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                >Administrateurs Activé</span
              >
            </div>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol md="4" cols="xl-4">
        <BCard no-body class="shadow-sm rounded-4 stat-card shadow-danger">
          <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
            <div>
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-people text-danger fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="totalBusinnesAN" :duration="2000" />
                </h4>
              </div>

              <span class="badge bg-danger-subtle text-danger fw-semibold px-1 py-1 rounded-pill">
                Administrateurs Non Activé</span
              >
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
    <BButton
      variant="success"
      class="waves-effect waves-light mb-3 btn-success"
      @click="ajout = true"
      >Créer un Administrateur</BButton
    >
    <BRow>
      <BCol cols="12">
        <div class="tabs-morphing-container">
          <div
            class="ttable table-centered datatable dt-responsive nowrap table-card-list dataTable no-footer dtr-inline"
          >
            <BRow>
              <BCol sm="12" md="6">
                <div id="tickets-table_length" class="dataTables_length">
                  <label class="d-inline-flex align-items-center">
                    Trier:
                    <BFormSelect v-model="perPages" size="sm" :options="pageOptionss"></BFormSelect>
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
              <p class="mt-3 text-muted">Aucun Administrateur</p>
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
              <template v-slot:cell(position)="data">
                <a
                  href="#"
                  class="badge"
                  :class="{
                    'bg-info': data.item.admin.isSuperAdmin === false,

                    'bg-warning': data.item.admin.isSuperAdmin === true,
                  }"
                  >{{
                    data.item.admin.isSuperAdmin === true
                      ? 'Super Administrateur'
                      : 'Administrateur'
                  }}</a
                >
              </template>

              <template v-slot:cell(lastName)="data">
                <a href="#" class="text-warning"
                  >{{ data.item.admin.lastName }} {{ data.item.admin.firstName }}</a
                >
              </template>

              <template v-slot:cell(phone)="data">
                <a href="#" class="text-body">{{ data.item.admin.phone }}</a>
              </template>

              <template v-slot:cell(gender)="data">
                <a
                  href="#"
                  class="badge"
                  :class="{
                    'bg-info': data.item.admin.gender === 'M',

                    'bg-pink': data.item.admin.gender === 'F',
                  }"
                  >{{ data.item.admin.gender === 'M' ? 'Homme' : 'Femme' }}</a
                >
              </template>

              <template v-slot:cell(country)="data">
                <a href="#" class="text-body">{{ data.item.admin.country }}</a>
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
                      href="#"
                      class="px-2 text-warning"
                      @click.prevent="openEditModal(data.item)"
                      title="Modifier"
                    >
                      <i class="uil uil-pen fs-5"></i>
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
            <q-dialog v-model="ajout" transition-show="scale" transition-hide="fade">
              <q-card style="width: 800px; max-width: 90vw; border-radius: 20px" class="shadow-lg">
                <!-- Titre -->
                <q-card-section
                  class="q-pa-md text-white flex items-center justify-center"
                  style="background: linear-gradient(135deg, #0d6efd, #6610f2)"
                >
                  <div class="text-h6 text-center">Ajouter un compte administrateur</div>
                </q-card-section>

                <!-- Formulaire -->
                <div class="q-pa-lg">
                  <BForm>
                    <BRow>
                      <BCol cols="6" class="mb-4 floating-label">
                        <input
                          v-model="formule.email"
                          type="email"
                          class="form-control form-control-modern"
                          placeholder=" "
                        />
                        <label>Email<span class="text-danger">*</span></label>
                      </BCol>
                      <BCol cols="6" class="mb-4 floating-label">
                        <input
                          v-model="formule.password"
                          type="text"
                          class="form-control form-control-modern"
                          placeholder=" "
                        />
                        <label>Mot de passe<span class="text-danger">*</span></label>
                      </BCol>
                      <!-- Prénom -->
                      <BCol cols="6" class="mb-4 floating-label">
                        <input
                          v-model="formule.adminAccount.firstName"
                          type="text"
                          class="form-control form-control-modern"
                          placeholder=" "
                        />
                        <label>Prénom<span class="text-danger">*</span></label>
                      </BCol>

                      <!-- Nom -->
                      <BCol cols="6" class="mb-4 floating-label">
                        <input
                          v-model="formule.adminAccount.lastName"
                          type="text"
                          class="form-control form-control-modern"
                          placeholder=" "
                        />
                        <label>Nom<span class="text-danger">*</span></label>
                      </BCol>

                      <!-- Téléphone -->
                      <BCol cols="6" class="mb-4 floating-label">
                        <input
                          v-model="formule.adminAccount.phone"
                          type="text"
                          class="form-control form-control-modern"
                          placeholder=" "
                        />
                        <label>Téléphone</label>
                      </BCol>

                      <!-- Poste -->
                      <BCol cols="6" class="mb-4 floating-label">
                        <input
                          v-model="formule.adminAccount.position"
                          type="text"
                          class="form-control form-control-modern"
                          placeholder=" "
                        />
                        <label>Poste</label>
                      </BCol>
                      <BCol cols="6" class="mb-4 mt-3 floating-label">
                        <BRow>
                          <BCol cols="6">
                            <input
                              v-model="formule.adminAccount.gender"
                              type="radio"
                              value="M"
                              name="gender"
                            />
                            Homme
                          </BCol>
                          <BCol cols="6">
                            <input
                              v-model="formule.adminAccount.gender"
                              type="radio"
                              value="F"
                              name="gender"
                            />
                            Femme
                          </BCol>
                        </BRow>
                      </BCol>
                      <BCol cols="6" class="mb-4 floating-label">
                        <Multiselect
                          id="sel"
                          v-model="formule.adminAccount.country"
                          :options="optionlp"
                          :searchable="true"
                          :close-on-select="true"
                          :clear-on-select="false"
                          placeholder="Choisissez les participants"
                          class="form-control-modern"
                        />

                        <label>Votre pays</label>
                      </BCol>

                      <!-- Super Admin -->
                      <BCol cols="12" class="mb-3">
                        <div class="form-check form-switch">
                          <input
                            style="border: 1px solid #0d6efd"
                            class="form-check-input"
                            type="checkbox"
                            id="isSuperAdmin"
                            v-model="formule.adminAccount.isSuperAdmin"
                          />
                          <label class="form-check-label fw-semibold" for="isSuperAdmin">
                            Super Administrateur
                          </label>
                        </div>
                      </BCol>

                      <!-- Permissions -->
                      <BCol cols="12">
                        <h6 class="fw-bold text-primary mb-3">Permissions</h6>
                        <BRow>
                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="view_logs"
                                v-model="formule.adminAccount.permissions.view_logs"
                              />
                              <label class="form-check-label" for="view_logs">
                                Voir les logs
                              </label>
                            </div>
                          </BCol>

                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="export_data"
                                v-model="formule.adminAccount.permissions.export_data"
                              />
                              <label class="form-check-label" for="export_data">
                                Exporter les données
                              </label>
                            </div>
                          </BCol>

                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="manage_tasks"
                                v-model="formule.adminAccount.permissions.manage_tasks"
                              />
                              <label class="form-check-label" for="manage_tasks">
                                Gérer les tâches
                              </label>
                            </div>
                          </BCol>

                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="manage_users"
                                v-model="formule.adminAccount.permissions.manage_users"
                              />
                              <label class="form-check-label" for="manage_users">
                                Gérer les utilisateurs
                              </label>
                            </div>
                          </BCol>

                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="manage_reports"
                                v-model="formule.adminAccount.permissions.manage_reports"
                              />
                              <label class="form-check-label" for="manage_reports">
                                Gérer les rapports
                              </label>
                            </div>
                          </BCol>

                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="manage_surveys"
                                v-model="formule.adminAccount.permissions.manage_surveys"
                              />
                              <label class="form-check-label" for="manage_surveys">
                                Gérer les sondages
                              </label>
                            </div>
                          </BCol>

                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="manage_permissions"
                                v-model="formule.adminAccount.permissions.manage_permissions"
                              />
                              <label class="form-check-label" for="manage_permissions">
                                Gérer les permissions
                              </label>
                            </div>
                          </BCol>

                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="manage_targeting_rules"
                                v-model="formule.adminAccount.permissions.manage_targeting_rules"
                              />
                              <label class="form-check-label" for="manage_targeting_rules">
                                Gérer les règles de ciblage
                              </label>
                            </div>
                          </BCol>
                        </BRow>
                      </BCol>
                    </BRow>

                    <!-- Bouton -->
                    <div v-if="loadings" class="d-flex justify-content-end mt-4">
                      <q-spinner-dots color="green" size="20px" class="q-mr-sm" />
                    </div>
                    <div v-else class="d-flex justify-content-end mt-4">
                      <BButton variant="success" class="px-5" @click="Add">Enregistrer</BButton>
                    </div>
                  </BForm>
                </div>
              </q-card>
            </q-dialog>
            <q-dialog v-model="edit" transition-show="scale" transition-hide="fade">
              <q-card style="width: 800px; max-width: 90vw; border-radius: 20px" class="shadow-lg">
                <!-- Titre -->
                <q-card-section
                  class="q-pa-md text-white flex items-center justify-center"
                  style="background: linear-gradient(135deg, #0d6efd, #6610f2)"
                >
                  <div class="text-h6 text-center">
                    Modifier le compte administrateur - {{ detailData?.email }}
                  </div>
                </q-card-section>

                <!-- Formulaire -->
                <div class="q-pa-lg">
                  <BForm>
                    <BRow>
                      <!-- Prénom -->
                      <BCol cols="6" class="mb-4 floating-label">
                        <input
                          v-model="form.firstName"
                          type="text"
                          class="form-control form-control-modern"
                          placeholder=" "
                        />
                        <label>Prénom</label>
                      </BCol>

                      <!-- Nom -->
                      <BCol cols="6" class="mb-4 floating-label">
                        <input
                          v-model="form.lastName"
                          type="text"
                          class="form-control form-control-modern"
                          placeholder=" "
                        />
                        <label>Nom</label>
                      </BCol>

                      <!-- Téléphone -->
                      <BCol cols="6" class="mb-4 floating-label">
                        <input
                          v-model="form.phone"
                          type="text"
                          class="form-control form-control-modern"
                          placeholder=" "
                        />
                        <label>Téléphone</label>
                      </BCol>

                      <!-- Poste -->
                      <BCol cols="6" class="mb-4 floating-label">
                        <input
                          v-model="form.position"
                          type="text"
                          class="form-control form-control-modern"
                          placeholder=" "
                        />
                        <label>Poste</label>
                      </BCol>

                      <!-- Super Admin -->
                      <BCol cols="12" class="mb-3">
                        <div class="form-check form-switch">
                          <input
                            style="border: 1px solid #0d6efd"
                            class="form-check-input"
                            type="checkbox"
                            id="isSuperAdmin"
                            v-model="form.isSuperAdmin"
                          />
                          <label class="form-check-label fw-semibold" for="isSuperAdmin">
                            Super Administrateur
                          </label>
                        </div>
                      </BCol>

                      <!-- Permissions -->
                      <BCol cols="12">
                        <h6 class="fw-bold text-primary mb-3">Permissions</h6>
                        <BRow>
                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="view_logs"
                                v-model="form.permissions.view_logs"
                              />
                              <label class="form-check-label" for="view_logs">
                                Voir les logs
                              </label>
                            </div>
                          </BCol>

                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="export_data"
                                v-model="form.permissions.export_data"
                              />
                              <label class="form-check-label" for="export_data">
                                Exporter les données
                              </label>
                            </div>
                          </BCol>

                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="manage_tasks"
                                v-model="form.permissions.manage_tasks"
                              />
                              <label class="form-check-label" for="manage_tasks">
                                Gérer les tâches
                              </label>
                            </div>
                          </BCol>

                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="manage_users"
                                v-model="form.permissions.manage_users"
                              />
                              <label class="form-check-label" for="manage_users">
                                Gérer les utilisateurs
                              </label>
                            </div>
                          </BCol>

                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="manage_reports"
                                v-model="form.permissions.manage_reports"
                              />
                              <label class="form-check-label" for="manage_reports">
                                Gérer les rapports
                              </label>
                            </div>
                          </BCol>

                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="manage_surveys"
                                v-model="form.permissions.manage_surveys"
                              />
                              <label class="form-check-label" for="manage_surveys">
                                Gérer les sondages
                              </label>
                            </div>
                          </BCol>

                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="manage_permissions"
                                v-model="form.permissions.manage_permissions"
                              />
                              <label class="form-check-label" for="manage_permissions">
                                Gérer les permissions
                              </label>
                            </div>
                          </BCol>

                          <BCol cols="6" class="mb-2">
                            <div class="form-check">
                              <input
                                style="border: 1px solid #0d6efd"
                                class="form-check-input"
                                type="checkbox"
                                id="manage_targeting_rules"
                                v-model="form.permissions.manage_targeting_rules"
                              />
                              <label class="form-check-label" for="manage_targeting_rules">
                                Gérer les règles de ciblage
                              </label>
                            </div>
                          </BCol>
                        </BRow>
                      </BCol>
                    </BRow>

                    <!-- Bouton -->
                    <div v-if="loading" class="d-flex justify-content-end mt-4">
                      <q-spinner-dots color="green" size="20px" class="q-mr-sm" />
                    </div>
                    <div v-else class="d-flex justify-content-end mt-4">
                      <BButton variant="success" class="px-5" @click="Edit">Enregistrer</BButton>
                    </div>
                  </BForm>
                </div>
              </q-card>
            </q-dialog>

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
                    <BCol md="6" cols="xl-6">
                      <div class="info-card">
                        <q-icon name="person" size="20px" class="icon" />
                        <div class="info-text">
                          <div class="label">Nom d'utilisateur</div>
                          <div v-if="loadingx" class="skeleton skeleton-text"></div>
                          <div v-else class="value">
                            {{ detailData.admin?.lastName }}
                            {{ detailData.admin?.firstName }}
                          </div>
                        </div>
                      </div>
                    </BCol>
                    <BCol md="6" cols="xl-6">
                      <div class="info-card">
                        <i class="bi bi-postcard-fill icon" style="font-size: 20px"></i>
                        <div class="info-text">
                          <div class="label">Positions</div>
                          <div v-if="loadingx" class="skeleton skeleton-text"></div>
                          <div v-else class="value">
                            {{ detailData.admin?.position }}
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
                            {{ detailData.admin?.phone }}
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
                            {{ detailData.admin?.gender === 'M' ? 'Homme' : 'Femme' }}
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
                            {{ detailData.admin?.country }}
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
        </div>
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
    background: linear-gradient(135deg, #0d6efd, #6610f2);
    color: white;
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
