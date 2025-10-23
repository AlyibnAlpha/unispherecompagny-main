<template>
  <BRow style="height: 300px">
    <BCol cols="12" class="d-flex justify-content-center">
      <BCard class="shadow-sm rounded-3 p-4 w-75">
        <div class="text-center">
          <h2 class="text-success mb-3">
            <i class="bi bi-check2-all"></i>
          </h2>
          <h3 class="mb-4">Choisissez vos groupes de participants</h3>

          <BRow class="form-group mb-3">
            <BCol>
              <Multiselect
                name="lang"
                id="lang"
                square
                outlined
                v-model="part"
                mode="tags"
                :options="orderData"
                :searchable="true"
                :close-on-select="true"
                :clear-on-select="false"
                placeholder="Sélectionnez ou ajoutez un groupe"
              />
            </BCol>
          </BRow>
          <BButton
            variant="success"
            class="waves-effect waves-light mb-3"
            @click="ajout = !ajout"
            >{{ ajout ? 'Fermer' : 'Créer vos participants' }}</BButton
          >

          <!-- Formulaire -->
          <div v-if="ajout" class="mt-4 text-start">
            <BForm>
              <BRow>
                <BRow>
                  <BCol cols="12" class="mb-2">
                    <h4>Informations générales</h4>
                  </BCol>
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
                <!-- Nom -->

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
                        v-model="forms.criteria.gender"
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
                            v-model="forms.criteria.age.min"
                            type="number"
                            class="form-control-modern"
                            placeholder="Âge minimum"
                          />
                        </div>
                        <div class="col-md-6 mb-2">
                          <input
                            v-model="forms.criteria.age.max"
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
                            v-model="forms.criteria.location.city"
                            type="text"
                            class="form-control-modern"
                            placeholder="Ville"
                          />
                        </div>
                        <div class="col-md-6 mb-2">
                          <Multiselect
                            v-model="forms.criteria.location.country"
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
                            v-model="forms.criteria.profession.type"
                            type="text"
                            class="form-control-modern"
                            placeholder="Type de profession"
                          />
                        </div>
                        <div class="col-md-6 mb-2">
                          <Multiselect
                            v-model="forms.criteria.profession.sector"
                            :options="optionl2"
                            placeholder="Sélectionner un secteur"
                            class="form-control-modern"
                          />
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </BRow>

              <!-- Bouton -->
              <div class="d-flex justify-content-end mt-4">
                <BButton variant="success" class="px-5" @click="Adds"> Enregistrer </BButton>
              </div>
            </BForm>
          </div>
        </div>
      </BCard>
    </BCol>
  </BRow>
  <div v-if="!ajout" class="d-flex justify-content-between mt-4 w-100">
    <BButton variant="outline-secondary" class="px-4" @click="$emit('onBack')"> ⬅ Retour </BButton>
    <q-spinner-dots v-if="loadings" color="green" size="20px" class="q-mr-sm" />
    <BButton v-else variant="success" class="px-4" @click="handleNext"> Suivant ➡ </BButton>
  </div>
</template>
<script>
import { BButton, BCol, BRow } from 'bootstrap-vue-next'
import Multiselect from '@vueform/multiselect'
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'
import { useRegisterStore } from 'src/stores/useRegisterStore'
import { Notify } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
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
        Notify.create(
          {
            type: 'negative',
            message: 'Veillez choisir les participants cibler ou créer des participants  ',
          },
          8000,
        )
        return false
      }

      try {
        await api
          .post(`/admin/welcome-surveys/${store.idsurveyw}/assign-participants`, {
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
          message: error.response.data.message || "Erreur lors de l'assignation des participants.",
        })
        return false
      } finally {
        loadings.value = false
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
          try {
            await api.post('/participants-groups', forms.value)
            Notify.create({
              type: 'positive',
              message: 'Opération effectuée avec succès !',
              timeout: 5000, // durée en ms
            })
          } catch (error) {
            console.error('Error creating participant group:', error)
            Notify.create({
              type: 'negative',
              message:
                error.response?.data?.message ||
                'Une erreur est survenue lors de la création du groupe de participants.',
              timeout: 5000,
            })
          }
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          try {
            await api.post('/admin/participants-groups', forms.value)
            Notify.create({
              type: 'positive',
              message: 'Opération effectuée avec succès !',
              timeout: 5000, // durée en ms
            })
          } catch (error) {
            console.error('Error creating participant group:', error)
            Notify.create({
              type: 'negative',
              message:
                error.response?.data?.message ||
                'Une erreur est survenue lors de la création du groupe de participants.',
              timeout: 5000,
            })
          }
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
      }
    }

    const handleNext = () => {
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
      part,
      handleNext,
      Add,
      Adds,
      ajout,
      forms,
      optionl,
      optionl2,
      loadings,
    }
  },
  emits: ['onBack', 'onNext'],
}
</script>
<style scoped>
.btn-primary {
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
