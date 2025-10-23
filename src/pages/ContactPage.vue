<template>
  <div id="main-wrapper" class="main-wrapper">
    <HeaderOne />

    <BreadCrumbTwo title="Contact" />

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
                  <div class="form-group col-12">
                    <input
                      type="text"
                      name="fullname2"
                      v-model="form.lastName"
                      placeholder="Votre Nom"
                      required
                      @invalid="setCustomMessage($event, 'Veuillez entrer votre nom.')"
                      @input="clearCustomMessage($event)"
                    />
                  </div>
                  <div class="form-group col-12">
                    <input
                      type="email"
                      name="email"
                      v-model="form.email"
                      placeholder="Entre votre email"
                      required
                      @invalid="
                        setCustomMessage($event, 'Veuillez entrer une adresse email valide.')
                      "
                      @input="clearCustomMessage($event)"
                    />
                  </div>
                  <div class="form-group col-12">
                    <input
                      type="text"
                      name="subject"
                      v-model="form.subject"
                      placeholder="Votre sujet"
                      required
                      @invalid="setCustomMessage($event, 'Veuillez entrer le sujet.')"
                      @input="clearCustomMessage($event)"
                    />
                  </div>
                  <div class="form-group col-12">
                    <input
                      type="text"
                      name="org"
                      v-model="form.organisation_name"
                      placeholder="Votre organisation "
                      required
                      @invalid="
                        setCustomMessage($event, 'Veuillez entrer le nom de votre organisation.')
                      "
                      @input="clearCustomMessage($event)"
                    />
                  </div>
                  <div class="form-group col-12">
                    <textarea
                      name="message"
                      cols="30"
                      rows="4"
                      placeholder="Votre message"
                      v-model="form.message"
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
                      <span :class="isError ? 'badge-error' : 'badge-success'">{{
                        resultText
                      }}</span>
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

    >

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
import { api } from 'src/boot/axios'
import { ref } from 'vue'

export default {
  components: {
    HeaderOne,
    BreadCrumbTwo,
    MouseMove,
    FooterOne,
    ScrollToTop,
  },
  data() {
    const resultText = ref('')
    const showResult = ref(false)
    const isError = ref(false)
    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
      organisation_name: '',
    })
    const setCustomMessage = (event, message) => {
      event.target.setCustomValidity(message)
    }

    const clearCustomMessage = (event) => {
      event.target.setCustomValidity('')
    }
    const sendEmail = async (e) => {
      console.log(form.value)
      await api.post('/contact-us', form.value).then(
        () => {
          showResult.value = true
          isError.value = false
          resultText.value =
            'Votre messege a été reçus avec success. Nous vous contacterons bientôt.'
          setTimeout(() => {
            showResult.value = false
          }, 5000)
          e.target.reset()
        },
        () => {
          this.showResult = true
          isError.value = true
          resultText.value = 'Erreur lors de l’envoi du message. Réessayez.'
          setTimeout(() => {
            this.showResult = false
          }, 5000)
        },
      )
    }
    return {
      setCustomMessage,
      clearCustomMessage,
      sendEmail,
      resultText,
      showResult,
      form,
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
.badge-success {
  display: inline-block;
  background-color: #28a745; /* vert */
  color: white;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 12px; /* arrondi type badge */
}
</style>
