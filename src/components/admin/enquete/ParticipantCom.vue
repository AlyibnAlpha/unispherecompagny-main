<script>
import { computed, onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BButton,
  BFormInput,
  BPagination,
  BFormSelect,
  BTable,
  BForm,
} from 'bootstrap-vue-next'
import Multiselect from '@vueform/multiselect'
import { api } from 'src/boot/axios'
import Swal from 'sweetalert2'
import { useAuthStore } from 'src/stores/auth'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
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
    Multiselect,
  },
  data() {
    const orderData = ref([])
    const ajout = ref(false)
    const authStore = useAuthStore()
    const loading = ref(false)
    const loadings = ref(false)
    const route = useRouter()
    const options = [
      { label: 'Genre', value: 'Genre' },
      { label: 'Age', value: 'Age' },
      { label: 'Localité', value: 'Localité' },
      { label: 'Secteur', value: 'Secteur' },
    ]
    const availableOptions = computed(() => {
      return options.filter((opt) => !selectedCriteria.value.includes(opt.value ?? opt))
    })
    const selectedCriteria = ref([])
    const newCriterion = ref([])
    const showCriteriaDropdown = ref(false)

    const addCriterion = (crits) => {
      crits.forEach((crit) => {
        // Si c'est un objet avec value (depuis options) ou juste un string (nouveau tag)
        const value = crit.value ?? crit
        if (!selectedCriteria.value.includes(value)) {
          selectedCriteria.value.push(value)
        }
      })
      newCriterion.value = []
    }

    const handleAddCriterion = (value) => {
      addCriterion([value])
      showCriteriaDropdown.value = false
    }

    const removeCriterion = (value) => {
      selectedCriteria.value = selectedCriteria.value.filter((c) => c !== value)
    }

    const selectedCriteriaEdit = ref([]) // critères sélectionnés dans l'édition
    const newCriterionEdit = ref([]) // nouveau critère à ajouter
    const showCriteriaDropdownEdit = ref(false)
    const availableOptionsEdit = computed(() => {
      return options.filter((opt) => !selectedCriteriaEdit.value.includes(opt.value ?? opt))
    })

    const addCriterionEdit = (crits) => {
      crits.forEach((crit) => {
        const value = crit.value ?? crit
        if (!selectedCriteriaEdit.value.includes(value)) {
          selectedCriteriaEdit.value.push(value)
        }
      })
      newCriterionEdit.value = []
    }

    const handleAddCriterionEdit = (value) => {
      addCriterionEdit([value])
      showCriteriaDropdownEdit.value = false
    }

    const removeCriterionEdit = (value) => {
      selectedCriteriaEdit.value = selectedCriteriaEdit.value.filter((c) => c !== value)
    }

    const form = ref({
      name: '',
      description: '',
      criteria: {
        age: {
          min: '',
          max: '',
        },
        gender: '',
        location: {
          city: '',
          country: '',
        },
        profession: {
          type: '',
          sector: '',
        },
      },
    })
    const gets = async () => {
      try {
        loading.value = true
        const role = authStore.roles[0]
        if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          const response = await api.get('/participants-groups')
          orderData.value = response.data
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          const response = await api.get('/admin/participants-groups')
          orderData.value = response.data
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        loading.value = false
      }
    }
    const formu = ref({
      name: '',
      description: '',
      criteria: {
        age: {
          min: null,
          max: null,
        },
        gender: '',
        location: {
          city: '',
          country: '',
        },
        profession: {
          type: '',
          sector: '',
        },
      },
    })
    const edit = ref(false)
    const editingSurvey = ref(null)
    const optionl2 = ref([])
    const optionl = [
      { label: 'Français', value: 'FR' },
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
    const categories = async () => {
      try {
        loading.value = true
        const role = authStore.roles[0]
        if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          const response = await api.get('/business/survey-categories')
          optionl2.value = response.data.categories.map((item) => ({
            label: item.name,
            value: item.name,
          }))
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          const response = await api.get('/admin/survey-categories')
          optionl2.value = response.data.categories.map((item) => ({
            label: item.name,
            value: item.name,
          }))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        loading.value = false
      }
    }
    const Add = async () => {
      try {
        if (!form.value.name || !form.value.description) {
          Notify.create({
            type: 'warning',
            message: 'Veuillez remplir les champs obligatoires.',
            timeout: 3000,
          })

          return
        }
        loadings.value = true
        const role = authStore.roles[0]
        if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          console.log(form.value)
          await api.post('/participants-groups', form.value)
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          await api.post('/admin/participants-groups', form.value)
        }

        Swal.fire({
          icon: 'success',
          title: 'Enregistre avec success',
          showConfirmButton: true,
          timer: 2000,
        })
        gets()
        ajout.value = false
      } catch (error) {
        console.error(error)
        Notify.create(
          {
            type: 'negative',
            message: 'Erreur survenue lors de la création',
          },
          5000,
        )
      } finally {
        loadings.value = false
      }
    }

    const Edit = async () => {
      try {
        loadings.value = true
        await api.put(`/participants-groups/${formu.value.id}`, formu.value)
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
        edit.value = false
      }
    }
    const openEditModal = (survey) => {
      const defaultCriteria = {
        age: { min: null, max: null },
        gender: '',
        location: { city: '', country: '' },
        profession: { type: '', sector: '' },
      }

      const defaults = {
        id: null,
        name: '',
        description: '',
        criteria: defaultCriteria,
      }
      const safeSurvey = survey || {}
      formu.value = {
        ...defaults,
        ...safeSurvey,
        criteria: {
          ...defaultCriteria,
          ...(safeSurvey.criteria || {}),
          age: {
            ...defaultCriteria.age,
            ...(safeSurvey?.criteria?.age || {}),
          },
          location: {
            ...defaultCriteria.location,
            ...(safeSurvey?.criteria?.location || {}),
          },
          profession: {
            ...defaultCriteria.profession,
            ...(safeSurvey?.criteria?.profession || {}),
          },
        },
      }

      selectedCriteriaEdit.value = []
      if (formu.value.criteria.gender) selectedCriteriaEdit.value.push('Genre')
      if (formu.value.criteria.age.min || formu.value.criteria.age.max)
        selectedCriteriaEdit.value.push('Age')
      if (formu.value.criteria.location.city || formu.value.criteria.location.country)
        selectedCriteriaEdit.value.push('Localité')
      if (formu.value.criteria.profession.sector?.length) selectedCriteriaEdit.value.push('Secteur')
      setTimeout(() => {
        edit.value = true
      }, 500)
      this.activeTab = 1
      this.progressBarValue = 15
    }
    const deleteRow = (index) => {
      Swal.fire({
        title: 'Etes vous sur?',
        text: 'Voulez-vous supprimmer le paricipant',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      }).then(async (result) => {
        if (result.value) {
          await api.delete(`/participants-groups/${index}`)
          gets()
          Swal.fire('Deleted!', 'Le participants a été supprimer avec success.', 'success')
        }
      })
    }
    const openDetailModal = (survey) => {
      const role = authStore.roles[0]
      if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
        route.push(`/admin/paticipant-groupe/details/${survey}`)
      } else if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
        route.push(`/business/paticipant-groupe/details/${survey}`)
      }
    }
    onMounted(() => {
      gets()
      categories()
    })
    return {
      addCriterionEdit,
      handleAddCriterionEdit,
      removeCriterionEdit,
      selectedCriteriaEdit,
      newCriterionEdit,
      showCriteriaDropdownEdit,
      availableOptionsEdit,
      availableOptions,
      addCriterion,
      handleAddCriterion,
      removeCriterion,
      newCriterion,
      selectedCriteria,
      showCriteriaDropdown,
      options,
      ajout,
      openDetailModal,
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
      optionl,
      optionl2,
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
          key: 'description',
          label: 'Description',
        },
        {
          key: 'profession',
          label: 'Secteur',
          sortable: true,
        },
        {
          key: 'location',
          label: 'Localiter',
          sortable: true,
        },
        {
          key: 'manager',
          label: 'Auteur',
          sortable: true,
        },

        'action',
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
  <div class="modern-enquete-container">
    <BRow>
      <BCol cols="12">
        <div class="page-header">
          <div class="header-content">
            <h2 class="page-title">Gestion des Participants</h2>
            <p class="page-subtitle">Créez et gérez vos groupes de participants</p>
          </div>
          <BButton variant="success" class="modern-create-btn" @click="ajout = true">
            <i class="bi bi-people me-2"></i>
            Créer un groupe
          </BButton>
        </div>

        <q-dialog v-model="ajout" transition-show="scale" transition-hide="fade">
          <q-card class="modern-modal-card">
            <!-- Header moderne -->
            <div class="modern-modal-header">
              <div class="modal-header-content">
                <div class="modal-icon">
                  <i class="bi bi-people-fill"></i>
                </div>
                <div class="modal-title-section">
                  <h3 class="modal-title">Nouveau Groupe de Participants</h3>
                  <p class="modal-subtitle">Définissez les critères pour cibler vos participants</p>
                </div>
              </div>
              <button class="modal-close-btn" @click="ajout = false">
                <i class="bi bi-x"></i>
              </button>
            </div>

            <!-- Formulaire -->
            <div class="modern-modal-body">
              <BForm>
                <div class="info-section">
                  <h4>
                    <i class="bi bi-info-circle-fill"></i>
                    Informations générales
                  </h4>
                <BRow>
                  <!-- Nom -->
                  <BCol cols="6" md="6" class="mb-2 floating-label">
                    <input
                      id="title"
                      v-model="form.name"
                      type="text"
                      class="form-control-modern"
                      placeholder=" "
                    />
                    <label for="title">Nom du participant</label>
                  </BCol>

                  <!-- Description -->
                  <BCol cols="6" md="6" class="mb-2 floating-label">
                    <textarea
                      id="desc"
                      v-model="form.description"
                      class="form-control-modern"
                      rows="1"
                      placeholder=" "
                    ></textarea>
                    <label for="desc">Description</label>
                  </BCol>
                </BRow>
                </div>

                <div class="info-section mb-4">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="section-title mb-0">
                      <i class="bi bi-sliders me-2"></i>
                      Critères de sélection
                    </h5>
                    <div class="dropdown">
                      <button
                        type="button"
                        class="btn-add-criteria-dropdown"
                        @click="showCriteriaDropdown = !showCriteriaDropdown"
                      >
                        <i class="bi bi-plus-circle me-2"></i>
                        Ajouter un critère
                        <i class="bi bi-chevron-down ms-2"></i>
                      </button>
                      <div v-if="showCriteriaDropdown" class="criteria-dropdown-menu">
                        <button
                          v-for="option in availableOptions"
                          :key="option.value"
                          type="button"
                          class="criteria-dropdown-item"
                          @click="handleAddCriterion(option.value)"
                          :disabled="selectedCriteria.includes(option.value)"
                        >
                          <i
                            class="bi bi-check-circle me-2"
                            v-if="selectedCriteria.includes(option.value)"
                          ></i>
                          <i class="bi bi-circle me-2" v-else></i>
                          {{ option.label }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Section dynamique des critères -->
                  <div
                    v-for="(crit, index) in selectedCriteria"
                    :key="index"
                    class="criteria-card mb-3"
                  >
                    <div class="criteria-card-header">
                      <div class="criteria-title">
                        <i class="bi bi-filter-circle me-2"></i>
                        <strong>{{ crit }}</strong>
                      </div>
                      <button
                        type="button"
                        class="btn-delete-criteria"
                        @click="removeCriterion(crit)"
                        title="Supprimer ce critère"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>

                    <!-- Champs dynamiques selon le critère -->
                    <div class="criteria-card-body">
                      <template v-if="crit === 'Genre'">
                        <BRow>
                          <BCol cols="12">
                            <div class="gender-options">
                              <button
                                type="button"
                                class="gender-option"
                                :class="{ active: form.criteria.gender === 'H' }"
                                @click="form.criteria.gender = 'H'"
                              >
                                <i class="bi bi-gender-male me-2"></i>
                                Homme
                              </button>
                              <button
                                type="button"
                                class="gender-option"
                                :class="{ active: form.criteria.gender === 'F' }"
                                @click="form.criteria.gender = 'F'"
                              >
                                <i class="bi bi-gender-female me-2"></i>
                                Femme
                              </button>
                            </div>
                          </BCol>
                        </BRow>
                      </template>

                      <template v-else-if="crit === 'Age'">
                        <div class="row">
                          <div class="col-md-6 mb-2">
                            <input
                              v-model="form.criteria.age.min"
                              type="number"
                              class="form-control-modern"
                              placeholder="Âge minimum"
                            />
                          </div>
                          <div class="col-md-6 mb-2">
                            <input
                              v-model="form.criteria.age.max"
                              type="number"
                              class="form-control-modern"
                              placeholder="Âge maximum"
                            />
                          </div>
                        </div>
                      </template>

                      <template v-else-if="crit === 'Localité'">
                        <div class="row">
                          <div class="col-md-6 mb-2">
                            <input
                              v-model="form.criteria.location.city"
                              type="text"
                              class="form-control-modern"
                              placeholder="Ville"
                            />
                          </div>
                          <div class="col-md-6 mb-2">
                            <Multiselect
                              v-model="form.criteria.location.country"
                              :options="optionl"
                              placeholder="Pays"
                              class="form-control-modern"
                            />
                          </div>
                        </div>
                      </template>

                      <template v-else-if="crit === 'Secteur'">
                        <div class="row">
                          <div class="col-md-6 mb-2">
                            <input
                              v-model="form.criteria.profession.type"
                              type="text"
                              class="form-control-modern"
                              placeholder="Type de profession"
                            />
                          </div>
                          <div class="col-md-6 mb-2">
                            <Multiselect
                              v-model="form.criteria.profession.sector"
                              :options="optionl2"
                              placeholder="Sélectionner un secteur"
                              class="form-control-modern"
                            />
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>

                <!-- Boutons -->
                <div class="modal-footer-actions">
                  <button class="modal-btn modal-btn-cancel" @click="ajout = false">
                    <i class="bi bi-x-circle me-2"></i>
                    Annuler
                  </button>
                  <button v-if="loadings" class="modal-btn modal-btn-primary" disabled>
                    <q-spinner-dots color="white" size="20px" class="me-2" />
                    Enregistrement...
                  </button>
                  <button v-else class="modal-btn modal-btn-primary" @click="Add">
                    <i class="bi bi-check-circle me-2"></i>
                    Enregistrer
                  </button>
                </div>
              </BForm>
            </div>
          </q-card>
        </q-dialog>

        <div class="modern-table-container">
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
          <div v-if="loading" class="loading-state">
            <q-spinner-ball color="green" size="50px" />
            <p class="loading-text">Chargement des groupes...</p>
          </div>
          <div v-else-if="Array.isArray(orderData) && orderData.length === 0" class="empty-state">
            <i class="bi bi-people empty-icon"></i>
            <h4 class="empty-title">Aucun groupe trouvé</h4>
            <p class="empty-description">
              Commencez par créer votre premier groupe de participants
            </p>
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

              <template v-slot:cell(name)="data">
                <a href="#" class="text-body">{{ data.item.name }}</a>
              </template>

              <template v-slot:cell(description)="data">
                <a href="#" class="text-body">{{
                  data.item.description.length > 50
                    ? data.item.description.substring(0, 50) + '...'
                    : data.item.description
                }}</a>
              </template>
              <template v-slot:cell(profession)="data">
                <a href="#" class="text-body">{{
                  Array.isArray(data.item.criteria.profession.sector)
                    ? data.item.criteria.profession.sector.join(', ')
                    : data.item.criteria.profession.sector || '—'
                }}</a>
              </template>
              <template v-slot:cell(location)="data">
                <a href="#" class="text-body">{{ data.item.criteria.location.country }}</a>
              </template>
              <template v-slot:cell(manager)="data">
                <a href="#" class="text-warning">
                  {{
                    data.item.manager.businessAccount?.lastName ||
                    data.item.manager.admin?.lastName
                  }}-{{ data.item.manager.email }}</a
                >
              </template>

              <template v-slot:cell(action)="data">
                <ul class="list-inline mb-0">
                  <li class="list-inline-item">
                    <a
                      href="#"
                      class="px-2 text-info"
                      @click.prevent="openDetailModal(data.item.id)"
                      title="Voir les détails"
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
                      <i class="uil uil-pen font-size-18"></i>
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a
                      href="#"
                      class="px-2 text-danger"
                      @click.prevent="deleteRow(data.item.id)"
                      title="Supprimer"
                    >
                      <i class="uil uil-trash-alt font-size-18"></i>
                    </a>
                  </li>
                </ul>
              </template>
            </BTable>
          </div>
          <div class="pagination-container">
            <BPagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              class="modern-pagination"
            />
          </div>
        </div>
      </BCol>
    </BRow>
    <q-dialog v-model="edit" transition-show="scale" transition-hide="fade">
      <q-card class="modern-modal-card">
        <!-- Header moderne -->
        <div class="modern-modal-header">
          <div class="modal-header-content">
            <div class="modal-icon modal-icon-warning">
              <i class="bi bi-pencil-square"></i>
            </div>
            <div class="modal-title-section">
              <h3 class="modal-title">Modifier le Groupe</h3>
              <p class="modal-subtitle">Modifiez les critères du groupe de participants</p>
            </div>
          </div>
          <button class="modal-close-btn" @click="edit = false">
            <i class="bi bi-x"></i>
          </button>
        </div>

        <!-- Formulaire -->
        <div class="modern-modal-body">
          <BForm>
            <div class="info-section">
              <h4>
                <i class="bi bi-info-circle-fill"></i>
                Informations générales
              </h4>
            <BRow>
              <!-- Nom -->
              <BCol cols="6" md="6" class="mb-2 floating-label">
                <input
                  id="title"
                  v-model="formu.name"
                  type="text"
                  class="form-control-modern"
                  placeholder=" "
                />
                <label for="title">Nom du participant</label>
              </BCol>

              <!-- Description -->
              <BCol cols="6" md="6" class="mb-2 floating-label">
                <textarea
                  id="desc"
                  v-model="formu.description"
                  class="form-control-modern"
                  rows="1"
                  placeholder=" "
                ></textarea>
                <label for="desc">Description</label>
              </BCol>
            </BRow>
            </div>

            <div class="info-section mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="section-title mb-0">
                  <i class="bi bi-sliders me-2"></i>
                  Critères de sélection
                </h5>
                <div class="dropdown">
                  <button
                    type="button"
                    class="btn-add-criteria-dropdown"
                    @click="showCriteriaDropdownEdit = !showCriteriaDropdownEdit"
                  >
                    <i class="bi bi-plus-circle me-2"></i>
                    Ajouter un critère
                    <i class="bi bi-chevron-down ms-2"></i>
                  </button>
                  <div v-if="showCriteriaDropdownEdit" class="criteria-dropdown-menu">
                    <button
                      v-for="option in availableOptionsEdit"
                      :key="option.value"
                      type="button"
                      class="criteria-dropdown-item"
                      @click="handleAddCriterionEdit(option.value)"
                      :disabled="selectedCriteriaEdit.includes(option.value)"
                    >
                      <i
                        class="bi bi-check-circle me-2"
                        v-if="selectedCriteriaEdit.includes(option.value)"
                      ></i>
                      <i class="bi bi-circle me-2" v-else></i>
                      {{ option.label }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Section dynamique des critères -->
              <div
                v-for="(crit, index) in selectedCriteriaEdit"
                :key="index"
                class="criteria-card mb-3"
              >
                <div class="criteria-card-header">
                  <div class="criteria-title">
                    <i class="bi bi-filter-circle me-2"></i>
                    <strong>{{ crit }}</strong>
                  </div>
                  <button
                    type="button"
                    class="btn-delete-criteria"
                    @click="removeCriterionEdit(crit)"
                    title="Supprimer ce critère"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>

                <!-- Champs dynamiques selon le critère -->
                <div class="criteria-card-body">
                  <template v-if="crit === 'Genre'">
                    <BRow>
                      <BCol cols="12">
                        <div class="gender-options">
                          <button
                            type="button"
                            class="gender-option"
                            :class="{ active: formu.criteria.gender === 'H' }"
                            @click="formu.criteria.gender = 'H'"
                          >
                            <i class="bi bi-gender-male me-2"></i>
                            Homme
                          </button>
                          <button
                            type="button"
                            class="gender-option"
                            :class="{ active: formu.criteria.gender === 'F' }"
                            @click="formu.criteria.gender = 'F'"
                          >
                            <i class="bi bi-gender-female me-2"></i>
                            Femme
                          </button>
                        </div>
                      </BCol>
                    </BRow>
                  </template>

                  <template v-else-if="crit === 'Age'">
                    <div class="row">
                      <div class="col-md-6 mb-2">
                        <input
                          v-model="formu.criteria.age.min"
                          type="number"
                          class="form-control-modern"
                          placeholder="Âge minimum"
                        />
                      </div>
                      <div class="col-md-6 mb-2">
                        <input
                          v-model="formu.criteria.age.max"
                          type="number"
                          class="form-control-modern"
                          placeholder="Âge maximum"
                        />
                      </div>
                    </div>
                  </template>

                  <template v-else-if="crit === 'Localité'">
                    <div class="row">
                      <div class="col-md-6 mb-2">
                        <input
                          v-model="formu.criteria.location.city"
                          type="text"
                          class="form-control-modern"
                          placeholder="Ville"
                        />
                      </div>
                      <div class="col-md-6 mb-2">
                        <Multiselect
                          v-model="formu.criteria.location.country"
                          :options="optionl"
                          placeholder="Pays"
                          class="form-control-modern"
                        />
                      </div>
                    </div>
                  </template>

                  <template v-else-if="crit === 'Secteur'">
                    <div class="row">
                      <div class="col-md-6 mb-2">
                        <input
                          v-model="formu.criteria.profession.type"
                          type="text"
                          class="form-control-modern"
                          placeholder="Type de profession"
                        />
                      </div>
                      <div class="col-md-6 mb-2">
                        <Multiselect
                          v-model="formu.criteria.profession.sector"
                          :options="optionl2"
                          placeholder="Sélectionner un secteur"
                          class="form-control-modern"
                        />
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- Boutons -->
            <div class="modal-footer-actions">
              <button class="modal-btn modal-btn-cancel" @click="edit = false">
                <i class="bi bi-x-circle me-2"></i>
                Annuler
              </button>
              <button v-if="loadings" class="modal-btn modal-btn-warning" disabled>
                <q-spinner-dots color="white" size="20px" class="me-2" />
                Enregistrement...
              </button>
              <button v-else class="modal-btn modal-btn-warning" @click="Edit">
                <i class="bi bi-check-circle me-2"></i>
                Enregistrer
              </button>
            </div>
          </BForm>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

