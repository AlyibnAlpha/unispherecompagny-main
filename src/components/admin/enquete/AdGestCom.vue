<script>
import { onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BFormInput,
  BPagination,
  BFormSelect,
  BTable,
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
    BButton,
    CountToComponent,
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
  <div class="modern-admin-page">
    <!-- Header moderne -->
    <div class="modern-page-header">
      <div class="header-left">
        <h1 class="page-title-modern">
          <i class="bi bi-shield-lock-fill"></i>
          Gestion des Administrateurs
        </h1>
        <p class="page-subtitle-modern">Gérez les comptes administrateurs et leurs permissions</p>
      </div>
      <div class="header-right">
        <button class="btn-header-action" @click="ajout = true">
          <i class="bi bi-plus-circle"></i>
          Créer un Administrateur
        </button>
      </div>
    </div>

    <!-- Cartes de statistiques modernes -->
    <div class="stats-grid-modern">
      <div class="stat-card-modern stat-card-primary">
        <div class="stat-icon-wrapper">
          <i class="bi bi-people-fill"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">
            <CountToComponent :startVal="0" :endVal="totalBusinnes" :duration="2000" />
          </h3>
          <p class="stat-label">Total Administrateurs</p>
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
          <p class="stat-label">Activés</p>
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
          <p class="stat-label">Non Activés</p>
        </div>
        <div class="stat-progress-bar"></div>
      </div>
    </div>
    <!-- Tableau moderne -->
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
            placeholder="Rechercher un administrateur..."
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
              <p class="mt-3 text-muted">Aucun Administrateur</p>
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
              <template v-slot:cell(position)="data">
                <span
                  :style="{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    background: data.item.admin.isSuperAdmin === true ? '#fef3c7' : '#dbeafe',
                    color: data.item.admin.isSuperAdmin === true ? '#d97706' : '#2563eb'
                  }"
                >
                  {{
                    data.item.admin.isSuperAdmin === true
                      ? 'Super Admin'
                      : 'Admin'
                  }}
                </span>
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
                <span
                  :style="{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    background: data.item.admin.gender === 'M' ? '#dbeafe' : '#fce7f3',
                    color: data.item.admin.gender === 'M' ? '#2563eb' : '#ec4899'
                  }"
                >
                  {{ data.item.admin.gender === 'M' ? 'Homme' : 'Femme' }}
                </span>
              </template>

              <template v-slot:cell(country)="data">
                <a href="#" class="text-body">{{ data.item.admin.country }}</a>
              </template>
              <template v-slot:cell(enabled)="data">
                <span
                  :style="{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    background: data.item.enabled === true ? '#d1fae5' : '#fee2e2',
                    color: data.item.enabled === true ? '#059669' : '#dc2626'
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
                <div class="action-buttons">
                  <button
                    class="action-btn action-btn-info"
                    @click="openDetailModals(data.item)"
                    title="Détails"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    class="action-btn action-btn-warning"
                    @click="openEditModal(data.item)"
                    title="Modifier"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>

                  <button
                    v-if="data.item.enabled === null || data.item.enabled === false"
                    class="action-btn action-btn-success"
                    @click="Active(data.item.id)"
                    title="Activer"
                  >
                    <q-spinner-orbit color="white" size="14px" v-if="loadings" />
                    <i v-else class="bi bi-check-circle"></i>
                  </button>

                  <button
                    v-if="data.item.enabled === true"
                    class="action-btn action-btn-danger"
                    @click="Desact(data.item.id)"
                    title="Désactiver"
                  >
                    <q-spinner-orbit color="white" size="14px" v-if="loadings" />
                    <i v-else class="bi bi-x-circle"></i>
                  </button>
                </div>
              </template>
        </BTable>
      </div>

      <!-- Pagination moderne -->
      <div class="pagination-container">
        <BPagination v-model="currentPages" :total-rows="rowss" :per-page="perPages" class="modern-pagination" />
      </div>
    </div>

    <!-- Modal d'ajout -->
    <q-dialog v-model="ajout" transition-show="scale" transition-hide="fade">
              <q-card class="modern-modal-card">
                <!-- Header -->
                <q-card-section class="dialog-header row items-center">
                  <div class="header-text q-ml-md">
                    <div class="name">Ajouter un Administrateur</div>
                    <div class="subtitle">Créer un nouveau compte administrateur</div>
                  </div>
                  <q-space />
                </q-card-section>

                <!-- Formulaire -->
                <q-card-section class="modal-form-section">
                  <BForm>
                    <div class="form-section-title">Informations de connexion</div>
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
                    </BRow>

                    <div class="form-section-title">Informations personnelles</div>
                    <BRow>
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
                      <BCol cols="6">
                        <div class="radio-group-modern">
                          <span class="radio-group-label">Genre</span>
                          <div class="radio-options">
                            <div class="radio-option">
                              <input
                                v-model="formule.adminAccount.gender"
                                type="radio"
                                value="M"
                                name="gender"
                                id="gender-m"
                              />
                              <label for="gender-m">
                                <i class="bi bi-gender-male"></i>
                                Homme
                              </label>
                            </div>
                            <div class="radio-option">
                              <input
                                v-model="formule.adminAccount.gender"
                                type="radio"
                                value="F"
                                name="gender"
                                id="gender-f"
                              />
                              <label for="gender-f">
                                <i class="bi bi-gender-female"></i>
                                Femme
                              </label>
                            </div>
                          </div>
                        </div>
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
                      <BCol cols="12">
                        <div class="form-switch-modern">
                          <div class="switch-label">
                            <i class="bi bi-shield-fill-check"></i>
                            <div class="switch-text">
                              <div class="title">Super Administrateur</div>
                              <div class="description">Accès complet à toutes les fonctionnalités</div>
                            </div>
                          </div>
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="isSuperAdmin"
                            v-model="formule.adminAccount.isSuperAdmin"
                          />
                        </div>
                      </BCol>

                      <!-- Permissions -->
                      <BCol cols="12">
                        <div class="form-section-title">
                          <i class="bi bi-key-fill"></i>
                          Permissions
                        </div>
                        <div class="form-check-group">
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="view_logs"
                              v-model="formule.adminAccount.permissions.view_logs"
                            />
                            <label class="form-check-label" for="view_logs">
                              Voir les logs
                            </label>
                          </div>

                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="export_data"
                              v-model="formule.adminAccount.permissions.export_data"
                            />
                            <label class="form-check-label" for="export_data">
                              Exporter les données
                            </label>
                          </div>

                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="manage_tasks"
                              v-model="formule.adminAccount.permissions.manage_tasks"
                            />
                            <label class="form-check-label" for="manage_tasks">
                              Gérer les tâches
                            </label>
                          </div>

                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="manage_users"
                              v-model="formule.adminAccount.permissions.manage_users"
                            />
                            <label class="form-check-label" for="manage_users">
                              Gérer les utilisateurs
                            </label>
                          </div>

                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="manage_reports"
                              v-model="formule.adminAccount.permissions.manage_reports"
                            />
                            <label class="form-check-label" for="manage_reports">
                              Gérer les rapports
                            </label>
                          </div>

                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="manage_surveys"
                              v-model="formule.adminAccount.permissions.manage_surveys"
                            />
                            <label class="form-check-label" for="manage_surveys">
                              Gérer les sondages
                            </label>
                          </div>

                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="manage_permissions"
                              v-model="formule.adminAccount.permissions.manage_permissions"
                            />
                            <label class="form-check-label" for="manage_permissions">
                              Gérer les permissions
                            </label>
                          </div>

                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="manage_targeting_rules"
                              v-model="formule.adminAccount.permissions.manage_targeting_rules"
                            />
                            <label class="form-check-label" for="manage_targeting_rules">
                              Gérer les règles de ciblage
                            </label>
                          </div>
                        </div>
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
                </q-card-section>
              </q-card>
            </q-dialog>
            <q-dialog v-model="edit" transition-show="scale" transition-hide="fade">
              <q-card class="modern-modal-card">
                <!-- Header -->
                <q-card-section class="dialog-header row items-center">
                  <div class="header-text q-ml-md">
                    <div class="name">{{ detailData?.email }}</div>
                    <div class="subtitle">Modifier le compte administrateur</div>
                  </div>
                  <q-space />
                </q-card-section>

                <!-- Formulaire -->
                <q-card-section class="modal-form-section">
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
                </q-card-section>
              </q-card>
            </q-dialog>

            <q-dialog v-model="ajouts">
              <q-card class="modern-modal-card">
                <!-- Header -->
                <q-card-section class="dialog-header row items-center">
                  <div class="header-text q-ml-md">
                    <div v-if="loadingx" class="skeleton skeleton-title"></div>
                    <div v-else class="name">{{ detailData?.email }}</div>
                    <div class="subtitle">Détails de l'Administrateur</div>
                  </div>
                  <q-space />
                </q-card-section>

                <q-separator />
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

                <q-card-section class="dialog-content">
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

                  <div class="info-card">
                    <i class="bi bi-postcard-fill icon" style="font-size: 20px"></i>
                    <div class="info-text">
                      <div class="label">Position</div>
                      <div v-if="loadingx" class="skeleton skeleton-text"></div>
                      <div v-else class="value">
                        {{ detailData.admin?.position }}
                      </div>
                    </div>
                  </div>

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
  </div>
</template>

<style lang="scss">
@import '../../../css/admin/users-management.scss';
@import '../../../css/admin/tables-shared.scss';
@import '../../../css/admin/badges.scss';
</style>

