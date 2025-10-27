<template>
  <div class="gap-bottom-equal edu-about-area about-style-2 ifh">
    <div class="container edublink-animated-shape align-items-center">
      <div class="g-5 align-items-center">
        <div class="about-image-gallery">
          <ul class="shape-group">
            <MouseMove
              addClassName="shape-1"
              dataDepth="2"
              imgSrc="/images/about/shape-38.png"
              data-aos-delay="500"
              data-aos="fade"
              data-aos-duration="200"
            />
            <MouseMove
              addClassName="shape-2"
              dataDepth="-2"
              imgSrc="/images/about/shape-37.png"
              data-aos-delay="500"
              data-aos="fade"
              data-aos-duration="200"
            />
            <MouseMove
              addClassName="shape-3"
              dataDepth="1.8"
              imgSrc="/images/about/shape-04.png"
              data-aos-delay="500"
              data-aos="fade"
              data-aos-duration="200"
            />
          </ul>
          <div class="q-pa-md">
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
                  <button class="edu-btn btn-medium" @click="step = 3">
                    Continue <i class="icon-4"></i>
                  </button>
                  <q-btn @click="step = 1" color="grey" label="Back" class="q-ml-sm" />
                </q-stepper-navigation>
              </q-step>

              <q-step :name="3" title="Votre Pofession ?" icon="create_new_folder" :done="step > 4">
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
                  <button class="edu-btn btn-medium" @click="step = 4">
                    Continue <i class="icon-4"></i>
                  </button>
                  <q-btn @click="step = 2" color="grey" label="Back" class="q-ml-sm" />
                </q-stepper-navigation>
              </q-step>

              <q-step :name="4" title="Votre langue ?" icon="create_new_folder" :done="step > 5">
                <q-select
                  square
                  outlined
                  v-model="form.participantProfile.preferences.language"
                  :options="languageOptions"
                  label="Square outlined"
                />

                <q-stepper-navigation>
                  <button class="edu-btn btn-medium" @click="step = 5">
                    Continue <i class="icon-4"></i>
                  </button>
                  <q-btn @click="step = 3" color="grey" label="Back" class="q-ml-sm" />
                </q-stepper-navigation>
              </q-step>

              <q-step :name="5" title="Completer votre profil" icon="add_comment">
                Félicitations ! Si vous avez le temps, votre première enquête vous attend dès
                maintenant sur la page de votre compte Unisphere compagny !

                <q-stepper-navigation>
                  <button class="edu-btn btn-medium" @click="createParty">
                    Enregistre <i class="icon-4"></i>
                  </button>
                  <q-btn @click="step = 4" color="grey" label="Back" class="q-ml-sm" />
                </q-stepper-navigation>
              </q-step>
            </q-stepper>
          </div>
        </div>
      </div>
      <ul class="shape-group">
        <MouseMove
          addClassName="shape-1 circle"
          dataDepth="-2.3"
          data-aos-delay="500"
          data-aos="fade"
          data-aos-duration="200"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import MouseMove from 'src/components/animation/MouseMove.vue'
import parallaxAnimation from '/common/parallaxAnimation.js'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { LocalStorage, Notify, useQuasar } from 'quasar'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
export default {
  components: {
    MouseMove,
    Multiselect,
  },
  mounted() {
    parallaxAnimation()
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
      form,
      optionl,
      leval,
      levals,
      optionls,
    }
  },
}
</script>

<style scoped>
@import '../css/app.scss';
.ifh {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f4ff, #e0f7fa);
}
</style>
