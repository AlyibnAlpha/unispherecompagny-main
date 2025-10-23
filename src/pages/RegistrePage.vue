<template>
  <div id="main-wrapper" class="main-wrapper">
    <section class="account-page-area section-gap-equal">
      <div class="container position-relative">
        <div class="row g-5">
          <div class="col-lg-5">
            <div class="banner-content">
              <h1 class="title">
                <strong>
                  Opinion <br />
                  <span class="color-secondary">publique</span></strong
                >
              </h1>
              <p>
                Nos outils et nos données vous aident à identifier et à définir votre audience
                cible, puis à dresser un portrait de ce qui les caractérise avec une granularité
                unique. Découvrez-en davantage sur votre audience et re-contactez les groupes cibles
                avec des questions supplémentaires spécialement conçues pour vous.
              </p>
            </div>
          </div>
          <div class="col-lg-7">
            <div class="login-form-box">
              <q-tabs v-model="tab" align="justify" narrow-indicator class="q-mb-lg">
                <div class="row">
                  <div class="col">
                    <q-tab class="text-white btn-green" name="Client" label="Client" />
                  </div>
                  <div class="col">
                    <q-tab class="text-white btn-green" name="Business" label="Business" />
                  </div>
                </div>
                <q-tab-panels
                  v-model="tab"
                  animated
                  transition-prev="scale"
                  transition-next="scale"
                  class="text-green"
                >
                  <q-tab-panel name="Client">
                    <h3 class="title">Inscription</h3>
                    <p>
                      Avez vous déjà un compte?
                      <router-link to="/login">Connectez-vous</router-link>
                    </p>
                    <q-form @submit.prevent="createParty">
                      <div class="row form-group">
                        <div class="col-6">
                          <div class="form-group">
                            <label for="Prenom">Prenom</label>
                            <input
                              type="text"
                              v-model="form.participantProfile.firstName"
                              name="Prenom"
                              id="Prenom"
                              placeholder="Prenom"
                              required
                              @invalid="setCustomMessage($event, 'Veuillez entrer votre prénom.')"
                              @input="clearCustomMessage($event)"
                            />
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-group">
                            <label for="Nom">Nom</label>
                            <input
                              type="text"
                              v-model="form.participantProfile.lastName"
                              name="Nom"
                              id="Nom"
                              placeholder="Nom"
                              required
                              @invalid="setCustomMessage($event, 'Veuillez entrer votre nom.')"
                              @input="clearCustomMessage($event)"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <label for="rd">Date de naissance</label>
                        <input
                          type="date"
                          v-model="form.participantProfile.birthDate"
                          name="ed"
                          id="rd"
                          placeholder="Votre de naissance"
                          required
                          @invalid="
                            setCustomMessage($event, 'Veuillez entrer votre date de naissance.')
                          "
                          @input="clearCustomMessage($event)"
                        />
                      </div>
                      <div class="form-group">
                        <label class="me-3 mb-0" style="min-width: 80px">Genre</label>
                        <div class="d-flex align-items-center mb-5 gap-4">
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="radio"
                              id="homme"
                              value="M"
                              v-model="form.participantProfile.gender"
                              required
                              @invalid="
                                setCustomMessage($event, 'Veuillez sélectionner votre genre.')
                              "
                              @input="clearCustomMessage($event)"
                            />
                            <label class="form-check-label" for="homme">Homme</label>
                          </div>

                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="radio"
                              id="femme"
                              value="F"
                              v-model="form.participantProfile.gender"
                              required
                              @invalid="
                                setCustomMessage($event, 'Veuillez sélectionner votre genre.')
                              "
                              @input="clearCustomMessage($event)"
                            />
                            <label class="form-check-label" for="femme">Femme</label>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <label for="email">Email*</label>
                        <input
                          type="email"
                          v-model="form.email"
                          name="email"
                          id="email"
                          placeholder="Email"
                          required
                          @invalid="
                            setCustomMessage($event, 'Veuillez entrer une adresse email valide.')
                          "
                          @input="clearCustomMessage($event)"
                        />
                      </div>
                      <div class="form-group">
                        <label for="password">Mote de passe*</label>
                        <input
                          :type="showPassword ? 'text' : 'password'"
                          v-model="form.password"
                          name="password"
                          id="password"
                          placeholder="Mote de passe"
                          required
                          minlength="6"
                          @invalid="setCustomMessage($event, 'Veuillez entrer votre mot de passe.')"
                          @input="clearCustomMessage($event)"
                        />
                        <span class="password-show" @click.prevent="showPassword = !showPassword"
                          ><i :class="showPassword ? 'icon-2' : 'icon-76'"></i
                        ></span>
                      </div>
                      <div class="row form-group">
                        <div class="col-6">
                          <div class="form-group">
                            <label for="Vil">Votre Ville</label>
                            <input
                              type="text"
                              v-model="form.participantProfile.city"
                              name="Prenom"
                              id="Vil"
                              placeholder="Ville"
                              required
                              @invalid="setCustomMessage($event, 'Veuillez entrer votre ville.')"
                              @input="clearCustomMessage($event)"
                            />
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-group">
                            <label for="vp">Votre Payes</label>

                            <select
                              v-model="leval"
                              id="vp"
                              required
                              @invalid="
                                setCustomMessage($event, 'Veuillez sélectionner votre pays.')
                              "
                              @input="clearCustomMessage($event)"
                            >
                              <option disabled value="">Sélectionnez votre pays</option>
                              <option v-for="opt in optionl" :key="opt.value" :value="opt.value">
                                {{ opt.label }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <label for="nb">Numero</label>
                        <input
                          type="text"
                          v-model="form.participantProfile.phone"
                          name="nb"
                          id="nb"
                          placeholder="Votre numero de Téléphone"
                          required
                          @invalid="
                            setCustomMessage($event, 'Veuillez entrer votre numéro de téléphone.')
                          "
                          @input="clearCustomMessage($event)"
                        />
                      </div>

                      <div class="form-group">
                        <button type="submit" class="edu-btn btn-medium">
                          Inscription <i class="icon-4"></i>
                        </button>
                      </div>
                    </q-form>
                  </q-tab-panel>

                  <q-tab-panel name="Business">
                    <h3 class="title">Inscription</h3>
                    <p>
                      Avez vous déjà un compte?
                      <router-link to="/login">Connectez-vous</router-link>
                    </p>
                    <q-form @submit.prevent="createBus">
                      <div class="form-group">
                        <label for="compagny">Compagny</label>
                        <input
                          type="text"
                          v-model="formb.businessAccount.companyName"
                          name="compagny"
                          id="compagny"
                          placeholder="Le nom de la compagny"
                          required
                          @invalid="
                            setCustomMessage($event, 'Veuillez entrer le nom de la compagny.')
                          "
                          @input="clearCustomMessage($event)"
                        />
                      </div>
                      <div class="form-group">
                        <label for="nd">Numero de Matricule de la compagny</label>
                        <input
                          type="text"
                          v-model="formb.businessAccount.vatNumber"
                          name="nd"
                          id="nd"
                          placeholder="Numero de Matricule de la compagny"
                          required
                          @invalid="
                            setCustomMessage(
                              $event,
                              'Veuillez entrer le numero de matricule de la compagny.',
                            )
                          "
                          @input="clearCustomMessage($event)"
                        />
                      </div>

                      <div class="row form-group">
                        <div class="col-6">
                          <div class="form-group">
                            <label for="Prenom">Prenom</label>
                            <input
                              type="text"
                              v-model="formb.businessAccount.firstName"
                              name="Prenom"
                              id="Prenom"
                              placeholder="Votre Prenom"
                              required
                              @invalid="setCustomMessage($event, 'Veuillez entrer votre prénom.')"
                              @input="clearCustomMessage($event)"
                            />
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-group">
                            <label for="Nom">Nom</label>
                            <input
                              type="text"
                              v-model="formb.businessAccount.lastName"
                              name="Nom"
                              id="Nom"
                              placeholder="Votre Nom"
                              required
                              @invalid="setCustomMessage($event, 'Veuillez entrer votre nom.')"
                              @input="clearCustomMessage($event)"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row form-group">
                        <div class="col-6">
                          <div class="form-group">
                            <label for="email">Email*</label>
                            <input
                              type="email"
                              v-model="formb.email"
                              name="email"
                              id="email"
                              placeholder="Votre EmaiL"
                              required
                              @invalid="
                                setCustomMessage(
                                  $event,
                                  'Veuillez entrer une adresse email valide.',
                                )
                              "
                              @input="clearCustomMessage($event)"
                            />
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-group">
                            <label for="password">Mote de passe*</label>
                            <input
                              v-model="formb.password"
                              :type="sowPassword ? 'text' : 'password'"
                              name="password"
                              id="password"
                              placeholder="Mote de passe"
                              required
                              minlength="6"
                              @invalid="
                                setCustomMessage($event, 'Veuillez entrer votre mot de passe.')
                              "
                              @input="clearCustomMessage($event)"
                            />
                            <span class="password-show" @click.prevent="sowPassword = !sowPassword"
                              ><i :class="sowPassword ? 'icon-2' : 'icon-76'"></i
                            ></span>
                          </div>
                        </div>
                      </div>
                      <div class="row form-group">
                        <div class="col-6">
                          <div class="form-group">
                            <label for="vp">Votre Payes</label>

                            <select
                              v-model="levals"
                              id="vp"
                              required
                              @invalid="
                                setCustomMessage($event, 'Veuillez sélectionner votre pays.')
                              "
                              @input="clearCustomMessage($event)"
                            >
                              <option disabled value="">Sélectionnez votre pays</option>
                              <option v-for="opt in optionl" :key="opt.value" :value="opt.value">
                                {{ opt.label }}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-group">
                            <label for="nb">Numero</label>
                            <input
                              type="text"
                              v-model="formb.businessAccount.phone"
                              name="nb"
                              id="nb"
                              placeholder="Votre Numero"
                              required
                              @invalid="
                                setCustomMessage(
                                  $event,
                                  'Veuillez entrer votre numéro de téléphone.',
                                )
                              "
                              @input="clearCustomMessage($event)"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row form-group">
                        <div class="col-6">
                          <div class="form-group">
                            <label for="Profession">Profession</label>
                            <input
                              type="text"
                              v-model="formb.profession"
                              name="Profession"
                              id="Profession"
                              placeholder="Votre profession"
                              required
                              @invalid="
                                setCustomMessage($event, 'Veuillez entrer votre profession.')
                              "
                              @input="clearCustomMessage($event)"
                            />
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-group">
                            <label for="inter">Vos préférences</label>
                            <select
                              v-model="formb.interests"
                              id="vp"
                              required
                              @invalid="
                                setCustomMessage($event, 'Veuillez sélectionner votre préférences.')
                              "
                              @input="clearCustomMessage($event)"
                            >
                              <option disabled value="">votre preferences</option>
                              <option
                                v-for="opt in optionslist"
                                :key="opt.value"
                                :value="opt.value"
                              >
                                {{ opt.label }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <button type="submit" class="edu-btn btn-medium">
                          Inscription <i class="icon-4"></i>
                        </button>
                      </div>
                    </q-form>
                  </q-tab-panel>
                </q-tab-panels>
              </q-tabs>
            </div>
          </div>
        </div>
        <ul class="shape-group">
          <MouseMove addClassName="shape-1" dataDepth="2" imgSrc="/images/about/shape-07.png" />
          <MouseMove addClassName="shape-2" dataDepth="-2" imgSrc="/images/about/shape-13.png" />
          <MouseMove addClassName="shape-3" dataDepth="2" imgSrc="/images/counterup/shape-02.png" />
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import MouseMove from '../components/animation/MouseMove.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRegisterStore } from 'src/stores/useRegisterStore'
import { api } from 'src/boot/axios'
import { Notify, useQuasar } from 'quasar'

export default {
  components: {
    MouseMove,
  },
  head() {
    return {
      title: 'Terms & Condition',
    }
  },
  setup() {
    const tab = ref('Client')
    const optionslist = ref([])
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const sowPassword = ref(false)
    const lq = useQuasar()
    const leval = ref([])
    const levals = ref([])
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
    let timer
    const categories = async () => {
      try {
        const response = await api.get('/front/surveys/categories/all')
        optionslist.value = response.data.map((item) => ({
          label: item.name,
          value: item.name,
        }))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    onBeforeUnmount(() => {
      if (timer !== void 0) {
        clearTimeout(timer)
        lq.loading.hide()
      }
    })
    const formb = ref({
      email: '',
      password: '',
      roles: [import.meta.env.VITE_DEFAULT_ROLEB],
      profession: '',
      interests: [],
      purchaseHabits: {
        frequency: 'monthly',
        preferredCategories: [],
      },
      businessAccount: {
        companyName: '',
        vatNumber: '',
        firstName: '',
        lastName: '',
        position: '',
        country: '',
        phone: '',
        billingAddress: '',
        subscriptionPlan: '',
      },
    })

    const form = ref({
      email: '',
      password: '',
      roles: [import.meta.env.VITE_DEFAULT_ROLEP],
      participantProfile: {
        firstName: '',
        lastName: '',
        phone: '',
        birthDate: '',
        country: '',
        gender: '',
        city: '',
        professionType: '',
        professionSector: '',
        preferences: {
          notifications: true,
          language: 'fr',
        },
      },
    })

    const router = useRouter()
    const store = useRegisterStore()

    const createBus = async () => {
      try {
        formb.value.purchaseHabits.preferredCategories = formb.value.interests
        formb.value.businessAccount.country = levals.value
        lq.loading.show()
        timer = setTimeout(() => {
          lq.loading.hide()
          timer = void 0
        }, 6000)
        await api.post('/users/register', formb.value)

        store.setpreniumBUS({
          subscriptionPlan: formb.value.businessAccount.subscriptionPlan,
        })
        store.setCom(formb.value.email, formb.value.password)

        router.push(`/verify-email`)
      } catch (error) {
        console.error('Status:', error.response?.status)
        console.error('Headers:', error.response?.headers)
        console.error('er:', error.response?.data.message)

        Notify.create({
          type: 'negative',
          message: error.response?.data.message,
        })
      }
    }

    const createParty = async () => {
      try {
        form.value.participantProfile.country = leval.value
        lq.loading.show()
        timer = setTimeout(() => {
          lq.loading.hide()
          timer = void 0
        }, 6000)
        await api.post('/users/register', form.value)
        store.setCom(form.value.email, form.value.password)

        router.push(`/verify-email`)
      } catch (error) {
        console.error('Status:', error.response?.status)
        console.error('Headers:', error.response?.headers)
        console.error('Headers:', error.response?.data)
        Notify.create({
          type: 'negative',
          message: error.response?.data.message,
        })
      }
    }
    onMounted(() => {
      showPassword.value = false
      sowPassword.value = false
      categories()
    })
    const setCustomMessage = (event, message) => {
      event.target.setCustomValidity(message)
    }

    const clearCustomMessage = (event) => {
      event.target.setCustomValidity('')
    }
    return {
      setCustomMessage,
      clearCustomMessage,
      createParty,
      createBus,
      formb,
      form,
      firstName,
      lastName,
      email,
      password,
      tab,
      optionslist,
      showPassword,
      sowPassword,
      optionl,
      leval,
      levals,
    }
  },
}
</script>
<style>
@import '../css/app.scss';
.btn-green {
  background-color: #31b978;
  color: white;
  border: 5px solid rgba(100, 100, 100, 0);
  border-radius: 75px;
}
</style>
