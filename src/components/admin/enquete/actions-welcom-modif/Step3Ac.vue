<template>
  <div class="step-form-container">
    <!-- Description -->
    <p class="text-muted mb-4" style="font-size: 0.9375rem;">Sélectionnez ou créez des groupes pour cibler votre enquête</p>

    <!-- Sélection des groupes -->
    <div class="selection-card mb-4">
      <label class="form-label fw-semibold mb-3">
        <i class="bi bi-funnel me-2"></i>
        Groupes sélectionnés
      </label>
      <Multiselect
        name="lang"
        id="lang"
        v-model="part"
        mode="tags"
        :options="orderData"
        :searchable="true"
        :close-on-select="false"
        :clear-on-select="false"
        placeholder="Rechercher et sélectionner des groupes..."
        class="form-control-modern"
      />
    </div>

    <!-- Bouton créer -->
    <div v-if="!ajout" class="mb-4">
      <button
        class="btn-create-group-outline"
        @click="ajout = true"
      >
        <i class="bi bi-plus-circle me-2"></i>
        Créer un nouveau groupe
      </button>
    </div>

    <!-- Formulaire de création -->
    <div v-if="ajout" class="creation-form">
      <div class="form-header mb-4">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-1 fw-bold">
              <i class="bi bi-person-plus me-2"></i>
              Créer un nouveau groupe
            </h4>
            <p class="text-muted mb-0">Remplissez les informations pour créer un groupe de participants</p>
          </div>
          <button
            class="btn-close-form"
            @click="ajout = false"
            title="Fermer le formulaire"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <BForm>
        <div class="info-section mb-4">
          <h5 class="section-title">
            <i class="bi bi-info-circle me-2"></i>
            Informations générales
          </h5>
          <BRow>
                  <!-- Nom -->
                  <BCol cols="6" md="6" class="mb-2 floating-label">
                    <input
                      id="title"
                      v-model="forms.name"
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
                      v-model="forms.description"
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
                  :key="option"
                  class="criteria-dropdown-item"
                  @click="addCriterion(option); showCriteriaDropdown = false"
                  :disabled="selectedCriteria.includes(option)"
                >
                  <i class="bi bi-check-circle me-2" v-if="selectedCriteria.includes(option)"></i>
                  <i class="bi bi-circle me-2" v-else></i>
                  {{ option }}
                </button>
              </div>
            </div>
          </div>
          <BRow>

            <!-- Section dynamique des critères -->
            <BCol cols="12">
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
                              :class="{ active: forms.criteria.gender === 'H' }"
                              @click="forms.criteria.gender = 'H'"
                            >
                              <i class="bi bi-gender-male me-2"></i>
                              Homme
                            </button>
                            <button
                              type="button"
                              class="gender-option"
                              :class="{ active: forms.criteria.gender === 'F' }"
                              @click="forms.criteria.gender = 'F'"
                            >
                              <i class="bi bi-gender-female me-2"></i>
                              Femme
                            </button>
                          </div>
                        </BCol>
                      </BRow>
                    </template>

                    <template v-else-if="crit === 'Age'">
                      <BRow>
                        <BCol cols="12" md="6" class="mb-3 mb-md-0">
                          <input
                            v-model="forms.criteria.age.min"
                            type="number"
                            class="form-control-modern"
                            placeholder="Âge minimum"
                          />
                        </BCol>
                        <BCol cols="12" md="6">
                          <input
                            v-model="forms.criteria.age.max"
                            type="number"
                            class="form-control-modern"
                            placeholder="Âge maximum"
                          />
                        </BCol>
                      </BRow>
                    </template>

                    <template v-else-if="crit === 'Localité'">
                      <BRow>
                        <BCol cols="12" md="6" class="mb-3 mb-md-0">
                          <input
                            v-model="forms.criteria.location.city"
                            type="text"
                            class="form-control-modern"
                            placeholder="Ville"
                          />
                        </BCol>
                        <BCol cols="12" md="6">
                          <Multiselect
                            v-model="forms.criteria.location.country"
                            :options="optionl"
                            placeholder="Pays"
                            class="form-control-modern"
                          />
                        </BCol>
                      </BRow>
                    </template>

                    <template v-else-if="crit === 'Secteur'">
                      <BRow>
                        <BCol cols="12" md="6" class="mb-3 mb-md-0">
                          <input
                            v-model="forms.criteria.profession.type"
                            type="text"
                            class="form-control-modern"
                            placeholder="Type de profession"
                          />
                        </BCol>
                        <BCol cols="12" md="6">
                          <Multiselect
                            v-model="forms.criteria.profession.sector"
                            :options="optionl2"
                            placeholder="Sélectionner un secteur"
                            class="form-control-modern"
                          />
                        </BCol>
                      </BRow>
                    </template>
                </div>
              </div>
            </BCol>
          </BRow>
        </div>

        <!-- Bouton -->
        <div class="d-flex justify-content-end mt-4">
          <button class="btn-save-group" @click="Adds">
            <i class="bi bi-check-circle-fill me-2"></i>
            Enregistrer le groupe
          </button>
        </div>
      </BForm>
    </div>

    <!-- Navigation -->
    <div v-if="!ajout" class="d-flex justify-content-between mt-4 w-100">
      <BButton class="btn-modern btn-secondary-modern" @click="$emit('onBack')"> 
        <i class="bi bi-arrow-left me-2"></i>
        Retour 
      </BButton>
      <q-spinner-dots v-if="loadings" color="green" size="20px" class="q-mr-sm" />
      <BButton v-else class="btn-modern btn-success-modern" @click="handleNext"> 
        Suivant
        <i class="bi bi-arrow-right ms-2"></i>
      </BButton>
    </div>
  </div>
</template>
<script>
import { BButton, BCol, BRow } from 'bootstrap-vue-next'
import Multiselect from '@vueform/multiselect'
import { getCurrentInstance, onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'
import { useRegisterStore } from 'src/stores/useRegisterStore'
import { Notify } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

export default {
  components: {
    BButton,
    BCol,
    BRow,
    Multiselect,
  },
  setup() {
    const orderData = ref([])
    const store = useRegisterStore()
    const part = ref([])
    const aurh = useAuthStore()
    const { emit } = getCurrentInstance()
    const ajout = ref(false)
    const optionl2 = ref([])
    const loadings = ref(false)
    const route = useRoute()
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
    const options = [
      { label: 'Genre', value: 'Genre' },
      { label: 'Age', value: 'Age' },
      { label: 'Localité', value: 'Localité' },
      { label: 'Secteur', value: 'Secteur' },
    ]
    const availableOptions = ['Genre', 'Age', 'Localité', 'Secteur']
    const selectedCriteria = ref([])
    const newCriterion = ref([])
    const showCriteriaDropdown = ref(false)

    const addCriterion = (crit) => {
      if (!selectedCriteria.value.includes(crit)) {
        selectedCriteria.value.push(crit)
      }
    }

    const removeCriterion = (value) => {
      selectedCriteria.value = selectedCriteria.value.filter((c) => c !== value)
    }
    const categories = async () => {
      try {
        const role = aurh.roles[0]
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
      }
    }
    const forms = ref({
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
      const role = aurh.roles[0]
      let response
      if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
        response = await api.get('/business/dashboard/overview')
      } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
        response = await api.get('/admin/dashboard/overview')
      }
      if (response) {
        const categoriesList = response.data.participants_groups.map((item) => ({
          label: item.name,
          value: item.id,
        }))
        // 🔹 Ajouter "All" au début de la liste
        orderData.value = [{ label: 'Tout', value: 'all' }, ...categoriesList]
      }
    }
    const Add = async () => {
      if (part.value === null || part.value.length === 0) {
        return true
      }
      const role = aurh.roles[0]
      if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
        try {
          loadings.value = true
          const id = route.params.id
          const sch = await api.get(`/admin/surveys`)
          const surveys = sch.data.find((s) => s.slug === id)
          store.idsurvey = surveys.id
          await api
            .post(`/surveys/${store.idsurvey}/assign-participants`, {
              participantGroups: part.value,
            })
            .then(() => {
              Notify.create({
                type: 'positive',
                message: 'Participants assignés avec succès',
              })
            })
          return true
        } catch (error) {
          console.error('Error assigning participants:', error)
          Notify.create({
            type: 'negative',
            message: "Erreur lors de l'assignation des participants.",
          })
        } finally {
          loadings.value = false
        }
      } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
        try {
          loadings.value = true
          const id = route.params.id
          const sch = await api.get(`/admin/surveys`)
          const surveys = sch.data.find((s) => s.slug === id)
          store.idsurvey = surveys.id
          await api
            .post(`/admin/surveys/${store.idsurvey}/assign-participants`, {
              participantGroups: part.value,
            })
            .then(() => {
              Notify.create({
                type: 'positive',
                message: 'Participants assignés avec succès',
              })
            })
          return true
        } catch (error) {
          console.error('Error assigning participants:', error)
          Notify.create({
            type: 'negative',
            message: "Erreur lors de l'assignation des participants.",
          })
        } finally {
          loadings.value = false
        }
      }
    }
    const Adds = async () => {
      try {
        if (!forms.value.name || !forms.value.description) {
          Notify.create({
            type: 'warning',
            message: 'Veuillez remplir tous les champs obligatoires.',
            timeout: 3000,
          })

          return
        }
        const role = aurh.roles[0]
        if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          await api.post('/participants-groups', forms.value)
          Notify.create({
            type: 'positive',
            message: 'Opération effectuée avec succès !',
            timeout: 5000, // durée en ms
          })
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          await api.post('/admin/participants-groups', forms.value)
          Notify.create({
            type: 'positive',
            message: 'Opération effectuée avec succès !',
            timeout: 5000, // durée en ms
          })
        }
        gets()
        Swal.fire({
          icon: 'success',
          title: 'Enregistre avec success',
          showConfirmButton: true,
          timer: 2000,
        })
        ajout.value = false
      } catch (error) {
        Notify.create(
          {
            type: 'negative',
            message: 'une erreur est survenue',
          },
          5000,
        )
        console.error(error)
        return false
      }
    }
    const handleNext = async () => {
      const result = Add()
      if (result) {
        emit('onNext')
      }
    }
    onMounted(() => {
      gets()
      categories()
    })
    return {
      removeCriterion,
      addCriterion,
      newCriterion,
      selectedCriteria,
      availableOptions,
      options,
      orderData,
      handleNext,
      part,
      Add,
      ajout,
      Adds,
      forms,
      optionl,
      optionl2,
      loadings,
      showCriteriaDropdown,
    }
  },
  emits: ['onBack', 'close'],
}
</script>
<style>
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
