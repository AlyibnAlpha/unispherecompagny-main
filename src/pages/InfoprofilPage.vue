<template>
  <div class="profile-wizard-container">
    <!-- Header avec logo et progression -->
    <div class="wizard-header">
      <div class="wizard-logo">
        <i class="bi bi-person-circle"></i>
        <h1>Complétez votre profil</h1>
      </div>
      <div class="wizard-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${(step / 5) * 100}%` }"></div>
        </div>
        <span class="progress-text">Étape {{ step }} sur 5</span>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="wizard-content">
      <div class="wizard-card">
            <q-stepper
              v-model="step"
              vertical
              color="green"
              done-color="green"
              animated
              style="height: auto; font-size: medium"
            >
              <q-step
                :name="1"
                title="Bienvenue sur Unisphere compagny !"
                icon="settings"
                :done="step > 1"
                style="font-size: medium"
              >
                <div clas="">
                  Commençons par quelques questions basiques. Veuillez confirmer que vous lu la
                  politique de confidentialité.
                </div>
                <div style="gap: 1rem; margin-top: 25px">
                  <span
                    >J’accepte les Conditions générales et je reconnais avoir lu la
                    <router-link>politique de confidentialité</router-link> .</span
                  >
                </div>
                <q-stepper-navigation>
                  <button class="edu-btn btn-medium" @click="step = 2">
                    Continue <i class="icon-4"></i>
                  </button>
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="2"
                title="Remplisez votre profil"
                icon="create_new_folder"
                :done="step > 2"
                ><form class="rnt-contact-form rwt-dynamic-form">
                  <div class="login-form-box">
                    <div class="row">
                      <div class="form-group col-lg-6">
                        <label for="firstName">Prénom</label>
                        <q-input
                          outlined
                          type="text"
                          v-model="form.participantProfile.firstName"
                          name="firstName"
                          id="firstName"
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div class="form-group col-lg-6">
                        <label for="lastName">Nom</label>
                        <q-input
                          outlined
                          type="text"
                          v-model="form.participantProfile.lastName"
                          name="lastName"
                          id="lastName"
                          placeholder="Votre Nom"
                        />
                      </div>
                    </div>

                    <div class="row">
                      <div class="form-group col-lg-6">
                        <label for="nu">Numero</label>
                        <q-input
                          outlined
                          type="text"
                          v-model="form.participantProfile.phone"
                          name="nu"
                          id="nu"
                          placeholder="Votre numero"
                        />
                      </div>
                      <div class="form-group col-lg-6">
                        <label for="reg-date">Votre date naissance</label>
                        <q-input
                          outlined
                          type="date"
                          v-model="form.participantProfile.birthDate"
                          name="reg-date"
                          id="reg-date"
                          placeholder="Votre date de naissance"
                        />
                      </div>
                    </div>
                  </div>
                </form>

                <q-stepper-navigation>
                  <q-btn @click="step = 1" flat color="grey" label="Retour" />
                  <button class="edu-btn btn-medium" @click="step = 3">
                    Continuer <i class="bi bi-arrow-right"></i>
                  </button>
                </q-stepper-navigation>
              </q-step>

              <q-step :name="3" title="Votre Pofession ?" icon="create_new_folder" :done="step > 3">
                <div class="login-form-box">
                  <div class="row">
                    <div class="col-lg-12 form-group">
                      <label for="reg-name">Choissez vote secteur</label>
                      <Multiselect
                        v-model="levals"
                        :options="optionls"
                        track-by="value"
                        label="label"
                        placeholder="Sélectionne"
                        :multiple="true"
                        :searchable="true"
                        :close-on-select="false"
                        :clear-on-select="false"
                        :preserve-search="true"
                        :hide-selected="true"
                      />
                    </div>
                  </div>
                </div>
                <q-stepper-navigation>
                  <q-btn @click="step = 2" flat color="grey" label="Retour" />
                  <button class="edu-btn btn-medium" @click="step = 4">
                    Continuer <i class="bi bi-arrow-right"></i>
                  </button>
                </q-stepper-navigation>
              </q-step>

              <q-step :name="4" title="Votre langue ?" icon="create_new_folder" :done="step > 4">
                <div class="language-select-wrapper">
                  <label class="language-label">Sélectionnez votre langue</label>
                  <q-select
                    outlined
                    v-model="selectedLanguage"
                    :options="languageOptions"
                    option-value="value"
                    option-label="label"
                    class="modern-language-select"
                  >
                    <template v-slot:selected>
                      <div v-if="selectedLanguage" class="selected-language">
                        <span class="language-flag">{{ selectedLanguage.flag }}</span>
                        <span class="language-name">{{ selectedLanguage.label }}</span>
                      </div>
                    </template>
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps" class="language-option">
                        <q-item-section>
                          <div class="language-item">
                            <span class="language-flag">{{ scope.opt.flag }}</span>
                            <span class="language-name">{{ scope.opt.label }}</span>
                          </div>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <q-stepper-navigation>
                  <q-btn @click="step = 3" flat color="grey" label="Retour" />
                  <button class="edu-btn btn-medium" @click="step = 5">
                    Continuer <i class="bi bi-arrow-right"></i>
                  </button>
                </q-stepper-navigation>
              </q-step>

              <q-step :name="5" title="Completer votre profil" icon="add_comment" :done="step > 5">
                Félicitations ! Si vous avez le temps, votre première enquête vous attend dès
                maintenant sur la page de votre compte Unisphere compagny !

                <q-stepper-navigation>
                  <q-btn @click="step = 4" flat color="grey" label="Retour" />
                  <button class="edu-btn btn-medium" @click="step = 6; createParty()">
                    Enregistrer <i class="bi bi-check-circle"></i>
                  </button>
                </q-stepper-navigation>
              </q-step>
            </q-stepper>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { LocalStorage, Notify, useQuasar } from 'quasar'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
export default {
  components: {
    Multiselect,
  },
  setup() {
    const languageOptions = [
      { label: 'Français', value: 'fr', flag: '🇫🇷' },
      { label: 'English', value: 'en', flag: '🇬🇧' },
      { label: 'Español', value: 'es', flag: '🇪🇸' },
      { label: 'Deutsch', value: 'de', flag: '🇩🇪' },
      { label: 'Italiano', value: 'it', flag: '🇮🇹' },
      { label: 'Português', value: 'pt', flag: '🇵🇹' },
    ]
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
    const optionls = ref([])
    const leval = ref([])
    const levals = ref([])
    const selectedLanguage = ref(languageOptions[0])
    const form = ref({
      participantProfile: {
        firstName: '',
        lastName: '',
        phone: '',
        birthDate: '',
        professionSector: '',
        preferences: {
          notifications: true,
          language: 'fr',
        },
      },
    })
    const router = useRouter()
    const lq = useQuasar()
    let timer
    onBeforeUnmount(() => {
      if (timer !== void 0) {
        clearTimeout(timer)
        lq.loading.hide()
      }
    })
    const categories = async () => {
      try {
        const response = await api.get('/front/surveys/categories/all')
        optionls.value = response.data.map((item) => ({
          label: item.name,
          value: item.name,
        }))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    const getdd = async () => {
      const resp = await api.get('/users/me')
      form.value.participantProfile.phone = resp.data.participantProfile.phone
      form.value.participantProfile.firstName = resp.data.participantProfile.firstName
      form.value.participantProfile.lastName = resp.data.participantProfile.lastName
      form.value.participantProfile.birthDate = resp.data.participantProfile.birthDate
    }

    const createParty = async () => {
      try {
        form.value.participantProfile.professionSector = levals.value
        form.value.participantProfile.preferences.language = selectedLanguage.value.value
        const resp = await api.get('/users/me')
        LocalStorage.set('nom', resp.data.participantProfile.lastName)
        lq.loading.show()
        timer = setTimeout(() => {
          lq.loading.hide()
          timer = void 0
        }, 6000)
        await api.put(`/users/edit/${resp.data.id}`, form.value)

        router.push('/participant/enquetes-encours').then(() => {
          window.location.reload()
        })
      } catch (error) {
        console.error('Status:', error.response?.status)
        console.error('Headers:', error.response?.headers)

        Notify.create({
          type: 'negative',
          message: error.response?.data,
        })
      }
    }

    onMounted(() => {
      getdd()
      categories()
    })
    return {
      createParty,
      step: ref(1),
      languageOptions,
      selectedLanguage,
      form,
      optionl,
      leval,
      levals,
      optionls,
    }
  },
}
</script>

<style lang="scss">
@import '../css/profile-wizard.scss';
  
</style>
