<template>
  <div class="profile-wizard-container">
    <!-- Header avec logo et progression -->
    <div class="wizard-header">
      <div class="wizard-logo">
        <i class="bi bi-building"></i>
        <h1>Complétez votre profil Business</h1>
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
            <div class="text-body1">
              Commençons par quelques questions basiques. Veuillez confirmer que vous lu la
              politique de confidentialité.
            </div>
            <div style="gap: 1rem; margin-top: 25px">
              <span
                >J'accepte les Conditions générales et je reconnais avoir lu la
                <router-link>politique de confidentialité</router-link> .</span
              >
            </div>
            <q-stepper-navigation>
              <button class="edu-btn btn-medium" @click="step = 2">
                Continuer <i class="bi bi-arrow-right"></i>
              </button>
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="2"
            title="Remplisez votre profil"
            icon="create_new_folder"
            :done="step > 2"
          >
            <form class="rnt-contact-form rwt-dynamic-form">
              <div class="login-form-box">
                <div class="row">
                  <div class="form-group col-lg-6">
                    <label for="reg-numero">Compagny</label>
                    <q-input
                      outlined
                      type="text"
                      v-model="form.businessAccount.companyName"
                      name="reg-numero"
                      id="reg-numero"
                      placeholder="Votre nom de compagny"
                    />
                  </div>
                  <div class="form-group col-lg-6">
                    <label for="reg-date">Numero de Matricule de la compagny</label>
                    <q-input
                      outlined
                      type="text"
                      v-model="form.businessAccount.vatNumber"
                      name="reg-date"
                      id="reg-date"
                      placeholder="Numero de Matricule de la compagny"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-lg-6">
                    <label for="reg-p">Prenom</label>
                    <q-input
                      outlined
                      type="text"
                      v-model="form.businessAccount.firstName"
                      name="reg-p"
                      id="reg-"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div class="form-group col-lg-6">
                    <label for="reg-nom">Nom</label>
                    <q-input
                      outlined
                      type="text"
                      v-model="form.businessAccount.lastName"
                      name="reg-nom"
                      id="reg-nom"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-lg-6">
                    <label for="vp">Payes</label>
                    <q-select
                      square
                      outlined
                      v-model="levals"
                      :options="optionl"
                      name="vp"
                      id="vp"
                      placeholder="Votre Ville et Payes"
                    />
                  </div>
                  <div class="form-group col-lg-6">
                    <label for="reg-nb">Numero</label>
                    <q-input
                      outlined
                      type="text"
                      v-model="form.businessAccount.phone"
                      name="reg-nb"
                      id="reg-nb"
                      placeholder="Votre nom"
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

          <q-step :name="3" title="Votre Profession ?" icon="create_new_folder" :done="step > 3">
            <div class="login-form-box">
              <div class="row">
                <div class="col-lg-12">
                  <q-input
                    outlined
                    type="text"
                    v-model="form.businessAccount.position"
                    name="reg-name"
                    id="reg-name"
                    placeholder="Le poste que vous occupez"
                  />
                </div>
                <div class="col-lg-12" style="margin-top: 3rem">
                  <div class="row">
                    <div class="col-lg-3">
                      <label for="reg-name">Homme</label>
                      <q-radio v-model="form.businessAccount.gender" val="M" color="teal" />
                    </div>
                    <div class="col-lg-3">
                      <label for="reg-name">Femme</label>
                      <q-radio v-model="form.businessAccount.gender" val="F" color="teal" />
                    </div>
                  </div>
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

          <q-step :name="4" title="Votre adresse ?" icon="create_new_folder" :done="step > 4">
            <div class="login-form-box">
              <div class="row">
                <div class="col-lg-12">
                  <q-input
                    outlined
                    type="text"
                    v-model="form.businessAccount.billingAddress"
                    name="reg-ville"
                    id="reg-ville"
                    placeholder="Votre adresse"
                  />
                </div>
              </div>
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
export default {
  setup() {
    const optionl = [
      { label: 'Français', value: 'FR' },
      { label: 'English', value: 'EN' },
      { label: 'Español', value: 'ES' },
      { label: 'Italiano', value: 'IT' },
      { label: 'Português', value: 'PT' },
      { label: 'MALI', value: 'ML' },
    ]
    const form = ref({
      businessAccount: {
        companyName: '',
        vatNumber: '',
        firstName: '',
        lastName: '',
        position: '',
        country: '',
        gender: '',
        phone: '',
        billingAddress: '',
      },
    })
    const router = useRouter()
    const levals = ref([])

    const lq = useQuasar()
    let timer
    onBeforeUnmount(() => {
      if (timer !== void 0) {
        clearTimeout(timer)
        lq.loading.hide()
      }
    })

    const gets = async () => {
      const resp = await api.get('/users/me')
      form.value.businessAccount.companyName = resp.data.businessAccount.companyName
      form.value.businessAccount.vatNumber = resp.data.businessAccount.vatNumber
      form.value.businessAccount.firstName = resp.data.businessAccount.firstName
      form.value.businessAccount.lastName = resp.data.businessAccount.lastName
      levals.value = resp.data.businessAccount.country
      form.value.businessAccount.phone = resp.data.businessAccount.phone
    }

    const createParty = async () => {
      try {
        form.value.businessAccount.country = levals.value.value
        const resp = await api.get('/users/me')
        LocalStorage.set('nom', resp.data.businessAccount.companyName)
        await api.put(`/users/edit/${resp.data.id}`, form.value)
        lq.loading.show()
        timer = setTimeout(() => {
          lq.loading.hide()
          timer = void 0
        }, 6000)
        router.push(`/admin/enquetes-mes`).then(() => {
          window.location.reload()
        })
      } catch (error) {
        console.error('Status:', error.response?.status)
        console.error('Headers:', error.response?.headers)

        Notify.create({
          type: 'negative',
          message: error.response?.data.message,
        })
      }
    }

    onMounted(() => {
      gets()
    })
    return {
      createParty,
      step: ref(1),
      form,
      optionl,
      levals,
    }
  },
}
</script>

<style lang="scss">
@import '../css/profile-wizard.scss';
</style>
