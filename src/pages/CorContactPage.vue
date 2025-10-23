<template>
  <div id="main-wrapper" class="main-wrapper">
    <HeaderOne />

    <BreadCrumbTwo title="Contactez nous pour une collaboration" />

    <section class="contact-us-area" style="margin-bottom: 130px">
      <div class="container">
        <div class="row g-5">
          <div class="col-xl-4 col-lg-6">
            <div class="contact-us-info">
              <h3 class="heading-title">Vous pouvez nous contacter</h3>
              <ul class="address-list">
                <li>
                  <h5 class="title">Address</h5>
                  <p>Studio 76d, Riley Ford, North Michael chester, CF99 6QQ</p>
                </li>
                <li>
                  <h5 class="title">Email</h5>
                  <p>
                    <a href="mailto:edublink@example.com" target="_blank">edublink@example.com</a>
                  </p>
                </li>
                <li>
                  <h5 class="title">Phone</h5>
                  <p><a href="tel:+0914135548598">(+091) 413 554 8598</a></p>
                </li>
              </ul>
              <ul class="social-share">
                <li>
                  <a href="#"><i class="icon-share-alt"></i></a>
                </li>
                <li>
                  <a href="#"><i class="icon-facebook"></i></a>
                </li>
                <li>
                  <a href="#"><i class="icon-twitter"></i></a>
                </li>
                <li>
                  <a href="#"><i class="icon-linkedin2"></i></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-xl-8 col-lg-6">
            <div class="contact-form form-style-2">
              <div class="section-title">
                <h4 class="title">Contact</h4>
              </div>

              <form
                class="rnt-contact-form rwt-dynamic-form"
                ref="form"
                @submit.prevent="sendEmail"
              >
                <div class="row row--10">
                  <div class="form-group col-12">
                    <div class="row">
                      <div class="col-6">
                        <input
                          type="text"
                          name="fullname"
                          v-model="form.firstName"
                          placeholder="Votre Prénom"
                          required
                          @invalid="setCustomMessage($event, 'Veuillez entrer votre prénom.')"
                          @input="clearCustomMessage($event)"
                        />
                      </div>
                      <div class="col-6">
                        <input
                          type="text"
                          name="fullname2"
                          v-model="form.lastName"
                          placeholder="Votre Nom"
                          @invalid="setCustomMessage($event, 'Veuillez entrer votre Nom.')"
                          @input="clearCustomMessage($event)"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="form-group col-12">
                    <div class="row">
                      <div class="col-6">
                        <input
                          type="email"
                          name="email"
                          v-model="form.email"
                          placeholder="Entre votre email"
                          required
                          @invalid="setCustomMessage($event, 'Veuillez entrer votre email.')"
                          @input="clearCustomMessage($event)"
                        />
                      </div>
                      <div class="col-6">
                        <input
                          type="tel"
                          v-model="form.phone_number"
                          name="phone"
                          placeholder="Numero de téléphone"
                          required
                          @invalid="
                            setCustomMessage($event, 'Veuillez entrer votre numéro de téléphone.')
                          "
                          @input="clearCustomMessage($event)"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="form-group col-12">
                    <div class="row">
                      <div class="col-6">
                        <input
                          type="text"
                          name="role"
                          v-model="form.role"
                          placeholder="Votre Role"
                          required
                          @invalid="setCustomMessage($event, 'Veuillez entrer votre role.')"
                          @input="clearCustomMessage($event)"
                        />
                      </div>
                      <div class="col-6">
                        <input
                          type="text"
                          name="payes"
                          v-model="form.country"
                          placeholder="Votre localisation"
                          required
                          @invalid="setCustomMessage($event, 'Veuillez entrer votre localisation.')"
                          @input="clearCustomMessage($event)"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="form-group col-12">
                    <div class="row">
                      <div class="col-6">
                        <input
                          type="text"
                          name="org"
                          v-model="form.companyName"
                          placeholder="Votre organisation "
                          required
                          @invalid="setCustomMessage($event, 'Veuillez entrer votre compagnie.')"
                          @input="clearCustomMessage($event)"
                        />
                      </div>
                      <div class="col-6">
                        <input
                          type="text"
                          name="org2"
                          v-model="form.employees"
                          placeholder="Votre nombre d'employées "
                        />
                      </div>
                    </div>
                  </div>

                  <div class="form-group col-12">
                    <input
                      type="text"
                      name="subject"
                      v-model="form.planSize"
                      placeholder="Votre sujet"
                      required
                      @invalid="setCustomMessage($event, 'Veuillez entrer votre sujet.')"
                      @input="clearCustomMessage($event)"
                    />
                  </div>
                  <div class="form-group col-12">
                    <textarea
                      name="message"
                      cols="30"
                      v-model="form.responses"
                      rows="4"
                      placeholder="Votre message"
                      required
                      @invalid="setCustomMessage($event, 'Veuillez entrer votre message.')"
                      @input="clearCustomMessage($event)"
                    ></textarea>
                  </div>
                  <div class="form-group col-12">
                    <button
                      class="rn-btn edu-btn btn-medium submit-btn"
                      name="submit"
                      type="submit"
                    >
                      Envoyez votre Message <i class="icon-4"></i>
                    </button>
                    <div v-if="showResult" class="col-12 success-msg">
                      <p>{{ resultText }}</p>
                    </div>
                  </div>
                </div>
              </form>

              <ul class="shape-group">
                <MouseMove
                  addClassName="shape-1"
                  dataDepth="1"
                  imgSrc="/images/about/shape-13.png"
                />
                <MouseMove
                  addClassName="shape-2"
                  dataDepth="-1"
                  imgSrc="/images/counterup/shape-02.png"
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FooterOne />
    <ScrollToTop />
  </div>
</template>

<script>
import MouseMove from '../components/animation/MouseMove.vue'
import BreadCrumbTwo from '../components/common/BreadCrumbTwo.vue'
import HeaderOne from '../components/header/HeaderOne.vue'
import FooterOne from '../components/footer/FooterOne.vue'
import ScrollToTop from '../components/footer/ScrollToTop.vue'
import { ref } from 'vue'
import { api } from 'src/boot/axios'

export default {
  components: {
    HeaderOne,
    BreadCrumbTwo,
    MouseMove,
    FooterOne,
    ScrollToTop,
  },
  data() {
    const form = ref({
      firstName: '',
      lastName: '',
      phone_number: '',
      role: '',
      country: '',
      email: '',
      subject: '',
      responses: '',
      companyName: '',
      employees: '',
      privacyConsent: true,
      planSize: '',
    })
    const setCustomMessage = (event, message) => {
      event.target.setCustomValidity(message)
    }

    const clearCustomMessage = (event) => {
      event.target.setCustomValidity('')
    }
    const resultText = ref('')
    const showResult = ref(false)
    const isError = ref(false)
    const sendEmail = (e) => {
      api.post('/corporate-contacts', form.value).then(
        () => {
          showResult.value = true
          isError.value = false
          resultText.value =
            'Votre messege a été reçus avec success. Nous vous contacterons bientôt.'
          setTimeout(() => {
            this.showResult = false
          }, 5000)
          e.target.reset()
        },
        (error) => {
          this.showResult = true
          isError.value = true
          resultText.value = 'Erreur lors de l’envoi du message. Réessayez.'

          setTimeout(() => {
            this.showResult = false
          }, 5000)
          console.error('FAILED...', error.text)
        },
      )
    }
    return {
      sendEmail,
      form,
      resultText,
      showResult,
      isError,
      setCustomMessage,
      clearCustomMessage,
    }
  },

  head() {
    return {
      title: 'Contact',
    }
  },
}
</script>
<style>
@import '../css/app.scss';
</style>
