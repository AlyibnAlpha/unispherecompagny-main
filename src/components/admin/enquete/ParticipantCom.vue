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

    const removeCriterion = (value) => {
      selectedCriteria.value = selectedCriteria.value.filter((c) => c !== value)
    }

    const selectedCriteriaEdit = ref([]) // critères sélectionnés dans l'édition
    const newCriterionEdit = ref([]) // nouveau critère à ajouter
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
      removeCriterionEdit,
      selectedCriteriaEdit,
      newCriterionEdit,
      availableOptionsEdit,
      availableOptions,
      addCriterion,
      removeCriterion,
      newCriterion,
      selectedCriteria,
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
  <div>
    <BRow>
      <BCol cols="12">
        <div class="d-flex justify-content-between">
          <BButton variant="success" class="waves-effect waves-light mb-3" @click="ajout = true"
            >Créer vos Groupes</BButton
          >

          <q-dialog v-model="ajout" transition-show="scale" transition-hide="fade">
            <q-card style="width: 800px; max-width: 90vw; border-radius: 20px" class="shadow-lg">
              <!-- Titre -->
              <q-card-section
                class="q-pa-md text-white flex items-center justify-center"
                style="background: linear-gradient(135deg, #0d6efd, #6610f2)"
              >
                <q-icon name="group_add" size="28px" class="q-mr-sm" />
                <div class="text-h6 text-center">Créer un Groupes des Participant</div>
              </q-card-section>

              <!-- Formulaire -->
              <div class="q-pa-lg" style="max-height: 82vh; overflow-y: auto">
                <BForm>
                  <BRow>
                    <BCol cols="12" class="mb-2">
                      <h4>Informations générales</h4>
                    </BCol>
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

                  <BRow>
                    <BCol cols="12" class="mb-3">
                      <h4>Critères</h4>
                    </BCol>
                    <BCol cols="5" class="mb-4 floating-label">
                      <Multiselect
                        id="critère"
                        v-model="newCriterion"
                        :options="availableOptions"
                        :searchable="false"
                        :close-on-select="true"
                        placeholder="Ajouter un critère"
                        class="form-control-modern"
                        mode="tags"
                        @update:model-value="addCriterion"
                      />
                      <label for="critère">Critère</label>
                    </BCol>
                  </BRow>

                  <!-- Section dynamique des critères -->
                  <div
                    v-for="(crit, index) in selectedCriteria"
                    :key="index"
                    class="criteria-section"
                  >
                    <div class="criteria-header">
                      <div class="criteria-label">
                        <strong>{{ crit }}</strong>
                      </div>
                      <q-btn
                        flat
                        round
                        color="red"
                        icon="delete"
                        size="sm"
                        @click="removeCriterion(crit)"
                      />
                    </div>

                    <!-- Champs dynamiques selon le critère -->
                    <div class="criteria-body mt-2">
                      <template v-if="crit === 'Genre'">
                        <Multiselect
                          v-model="form.criteria.gender"
                          :options="[
                            { label: 'Homme', value: 'H' },
                            { label: 'Femme', value: 'F' },
                          ]"
                          placeholder="Sélectionner le genre"
                          class="form-control-modern"
                        />
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

                  <div v-if="loadings" class="d-flex justify-content-end mt-4">
                    <q-spinner-dots color="green" size="20px" class="q-mr-sm" />
                  </div>

                  <!-- Bouton -->
                  <div v-else class="d-flex justify-content-end mt-4">
                    <BButton variant="success" class="px-5" @click="Add"> Enregistrer </BButton>
                  </div>
                </BForm>
              </div>
            </q-card>
          </q-dialog>
        </div>

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
            <p class="mt-3 text-muted">Aucun groupe de participants</p>
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
                  data.item.manager.businessAccount?.lastName || data.item.manager.admin?.lastName
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
                    title="Modification"
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
          <div class="text-h6 text-center">Modifier un Groupe des Participants</div>
        </q-card-section>

        <!-- Formulaire -->
        <div class="q-pa-lg" style="max-height: 82vh; overflow-y: auto">
          <BForm>
            <!-- Nom -->
            <BRow>
              <BCol cols="12" class="mb-4">
                <h4>Informations générales</h4>
              </BCol>
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

            <BCol cols="12" class="mb-3">
              <h4>Critères</h4>
            </BCol>
            <BCol cols="5" class="mb-4 floating-label">
              <Multiselect
                v-model="newCriterionEdit"
                :options="availableOptionsEdit"
                :searchable="false"
                :close-on-select="true"
                placeholder="Ajouter un critère"
                class="form-control-modern"
                mode="tags"
                @update:model-value="addCriterionEdit"
              />
            </BCol>

            <div
              v-for="(crit, index) in selectedCriteriaEdit"
              :key="index"
              class="criteria-section"
            >
              <div class="criteria-header">
                <div class="criteria-label">
                  <strong>{{ crit }}</strong>
                </div>
                <q-btn
                  flat
                  round
                  color="red"
                  icon="delete"
                  size="sm"
                  @click="removeCriterionEdit(crit)"
                />
              </div>

              <div class="criteria-body mt-2">
                <template v-if="crit === 'Genre'">
                  <Multiselect
                    v-model="formu.criteria.gender"
                    :options="[
                      { label: 'Homme', value: 'H' },
                      { label: 'Femme', value: 'F' },
                    ]"
                    placeholder="Sélectionner le genre"
                    class="form-control-modern"
                  />
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
  </div>
</template>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
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
.criteria-section {
  background-color: #e7f3ff;
  border: 1px solid #b6daff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.criteria-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.criteria-label {
  color: #0d6efd;
  font-weight: 600;
  font-size: 1rem;
}
</style>
