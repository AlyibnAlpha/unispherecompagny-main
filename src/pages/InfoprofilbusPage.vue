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
                  <button class="edu-btn btn-medium" @click="step = 3">
                    Continue <i class="icon-4"></i>
                  </button>
                  <q-btn @click="step = 1" color="grey" label="Back" class="q-ml-sm" />
                </q-stepper-navigation>
              </q-step>

              <q-step :name="3" title="Votre Pofession?" icon="create_new_folder" :done="step > 3">
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
                  <button class="edu-btn btn-medium" @click="step = 4">
                    Continue <i class="icon-4"></i>
                  </button>
                  <q-btn @click="step = 2" color="grey" label="Back" class="q-ml-sm" />
                </q-stepper-navigation>
              </q-step>

              <q-step :name="4" title="Votre adresse ?" icon="create_new_folder" :done="step > 5">
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
                  <button class="edu-btn btn-medium" @click="step = 5">
                    Continue <i class="icon-4"></i>
                  </button>
                  <q-btn @click="step = 3" color="grey" label="Back" class="q-ml-sm" />
                </q-stepper-navigation>
              </q-step>

              <q-step :name="5" title="Create an ad" icon="add_comment">
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
export default {
  components: {
    MouseMove,
  },
  mounted() {
    parallaxAnimation()
  },
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
