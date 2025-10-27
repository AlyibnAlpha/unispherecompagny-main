<script>
import { api } from 'src/boot/axios'
import { onMounted, ref, watch } from 'vue'
import Multiselect from '@vueform/multiselect'
import Swal from 'sweetalert2'
import {
  BRow,
  BCol,
  BCard,
  BCardBody,
  BCardTitle,
  BForm,
  BFormGroup,
  BFormInput,
  BButton,
} from 'bootstrap-vue-next'

/**
 * Profile component
 */
export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardTitle,
    BForm,
    BFormGroup,
    BFormInput,
    Multiselect,
    BButton,
  },
  setup() {
    const formget = ref({
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
          notifications: false,
          language: '',
        },
      },
    })

    const formUpdate = ref(JSON.parse(JSON.stringify(formget.value)))
    const optionls = ref([])
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    const showPasswordModal = ref(false)

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
      formget.value = resp.data
      console.log(resp.data)

      formUpdate.value = JSON.parse(JSON.stringify(resp.data))
    }
    const updateProfile = async () => {
      try {
        // Créer un objet qui contient uniquement les champs modifiés
        const payload = {}

        for (const key in formUpdate.value.participantProfile) {
          if (formUpdate.value.participantProfile[key] !== formget.value.participantProfile[key]) {
            if (!payload.participantProfile) payload.participantProfile = {}
            payload.participantProfile[key] = formUpdate.value.participantProfile[key]
          }
        }

        // Comparer aussi les champs de niveau racine (ex: email)
        for (const key in formUpdate.value) {
          if (key !== 'participantProfile' && formUpdate.value[key] !== formget.value[key]) {
            payload[key] = formUpdate.value[key]
          }
        }

        // Vérifier si quelque chose a changé
        if (Object.keys(payload).length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Aucune modification',
            text: 'Vous n’avez rien changé.',
            timer: 2000,
          })
          return
        }

        // Envoi du payload partiel
        await api.put(`/users/edit/${formget.value.id}`, payload)

        // Rafraîchir après succès
        await getdd()

        Swal.fire({
          icon: 'success',
          title: 'Enregistré avec succès',
          showConfirmButton: true,
          timer: 2000,
        })
      } catch (e) {
        console.error(e)

        Swal.fire({
          icon: 'error',
          title: e.response.data.message || 'Erreur lors de la mise à jour',
          showConfirmButton: true,
          timer: 2000,
        })
      }
    }
    const changePassword = async () => {
      if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
        Swal.fire({
          icon: 'warning',
          title: 'Champs manquants',
          text: 'Veuillez remplir tous les champs',
        })
        showPasswordModal.value = false
        return
      }

      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Les mots de passe ne correspondent pas',
        })
        showPasswordModal.value = false
        return
      }

      try {
        await api.post('/reset-password', {
          password: passwordForm.value.newPassword,
        })

        Swal.fire({
          icon: 'success',
          title: 'Mot de passe changé avec succès',
          timer: 2000,
        })

        showPasswordModal.value = false
        passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
      } catch (e) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: e.response?.data?.message || 'Impossible de changer le mot de passe',
        })
        showPasswordModal.value = false
      }
    }

    watch(
      () => formUpdate.value.participantProfile.lastName,
      (newVal) => {
        localStorage.setItem('nom', newVal)
      },
    )
    onMounted(() => {
      categories()
      getdd()
      const storedLastName = localStorage.getItem('nom')
      if (storedLastName) {
        formUpdate.value.participantProfile.lastName = storedLastName
      }
    })
    return {
      showPasswordModal,
      passwordForm,
      changePassword,
      updateProfile,
      optionls,
      formget,
      formUpdate,
      optionl,
      shakeFirstName: false,
      shakeLastName: false,
      shakePhone: false,
      shakeBirthDate: false,
      btnHover: false,
    }
  },
}
</script>

<template>
  <div>
    <BRow class="mb-4">
      <BCol cols="xl-4">
        <BCard
          no-body
          class="h-100 shadow-lg"
          style="
            border-radius: 25px;
            background: linear-gradient(135deg, #f0f4ff, #e0f7fa);
            transition: all 0.5s ease;
          "
        >
          <BCardBody>
            <div class="text-center profile-header">
              <div>
                <img
                  src="/icon.png"
                  alt="avatar"
                  class="avatar-lg rounded-circle img-thumbnail profile-avatar"
                />
              </div>
              <h5 class="mt-3 mb-1 fw-bold">
                {{ formget.participantProfile?.firstName }}
                {{ formget.participantProfile?.lastName }}
              </h5>
              <p class="text-muted">{{ formget.participantProfile?.professionType }}</p>
            </div>

            <hr class="my-4" />

            <div class="text-muted profile-info">
              <h5 class="font-size-16 mb-3 fw-bold">Vos informations</h5>

              <div class="table-responsive mt-2">
                <div class="info-row">
                  <p class="mb-1">Genre :</p>
                  <h5 class="font-size-16">
                    {{ formget.participantProfile?.gender === 'M' ? 'Homme' : 'Femme' }}
                  </h5>
                </div>
                <div class="info-row mt-3">
                  <p class="mb-1">Mobile :</p>
                  <h5 class="font-size-16">{{ formget.participantProfile?.phone }}</h5>
                </div>
                <div class="info-row mt-3">
                  <p class="mb-1">E-mail :</p>
                  <h5 class="font-size-16">{{ formget.email }}</h5>
                </div>
                <div class="info-row mt-3">
                  <p class="mb-1">Localisation :</p>
                  <h5 class="font-size-16">
                    {{ formget.participantProfile?.city }},
                    {{ formget.participantProfile?.country }}
                  </h5>
                </div>
                <!--<div class="info-row mt-3">
                  <a
                    href="#"
                    class="font-size-16 text-warning fw-bold"
                    @click="showPasswordModal = true"
                  >
                    Changer votre mot de passe
                  </a>
                </div>-->
              </div>
            </div>
          </BCardBody>
        </BCard>
        <q-dialog v-model="showPasswordModal">
          <q-card class="q-pa-md" style="width: 400px; max-width: 90vw; border-radius: 20px">
            <q-card-section>
              <div class="text-h6 text-primary text-center fw-bold">Changer le mot de passe</div>
            </q-card-section>
            <q-card-section>
              <BForm @submit.prevent="changePassword">
                <BFormGroup label-for="cur" class="floating-label position-relative">
                  <BFormInput
                    id="cur"
                    class="form-control-modern"
                    type="password"
                    v-model="passwordForm.currentPassword"
                    placeholder=" "
                  />
                  <label for="cur">Mot de passe actuel</label>
                </BFormGroup>

                <BFormGroup label-for="new" class="floating-label position-relative">
                  <BFormInput
                    id="new"
                    class="form-control-modern"
                    type="password"
                    v-model="passwordForm.newPassword"
                    placeholder=" "
                  />
                  <label for="new">Nouveau mot de passe</label>
                </BFormGroup>

                <BFormGroup label-for="conf" class="floating-label position-relative">
                  <BFormInput
                    id="conf"
                    class="form-control-modern"
                    type="password"
                    v-model="passwordForm.confirmPassword"
                    placeholder=" "
                  />
                  <label for="conf">Confirmer le mot de passe</label>
                </BFormGroup>

                <div class="text-center mt-4">
                  <BButton type="submit" class="btn-modern px-5 py-2 fw-bold">Changer</BButton>
                </div>
              </BForm>
            </q-card-section>
          </q-card>
        </q-dialog>
      </BCol>

      <BCol cols="xl-8">
        <BCard
          no-body
          class="mb-4 shadow-lg"
          style="
            border-radius: 25px;
            background: linear-gradient(135deg, #f0f4ff, #e0f7fa);
            transition: background 0.5s ease;
            margin-top: 15px;
          "
        >
          <BCardBody>
            <BCardTitle class="mb-5 text-center text-primary fw-bold" style="font-size: 1.8rem">
              Modifier le profil
            </BCardTitle>

            <BForm @submit.prevent="updateProfile">
              <BRow class="mb-4">
                <BCol md="6">
                  <BFormGroup label-for="firstName" class="floating-label position-relative">
                    <BFormInput
                      id="firstName"
                      v-model="formUpdate.participantProfile.firstName"
                      placeholder=" "
                      class="form-control-modern"
                    />
                    <label for="firstName">Prénom</label>
                  </BFormGroup>
                </BCol>

                <BCol md="6">
                  <BFormGroup label-for="lastName" class="floating-label position-relative">
                    <BFormInput
                      id="lastName"
                      v-model="formUpdate.participantProfile.lastName"
                      placeholder=" "
                      class="form-control-modern"
                    />
                    <label for="lastName">Nom</label>
                  </BFormGroup>
                </BCol>
              </BRow>

              <BRow class="mb-4">
                <BCol md="6">
                  <BFormGroup label-for="phone" class="floating-label position-relative">
                    <BFormInput
                      id="phone"
                      v-model="formUpdate.participantProfile.phone"
                      placeholder=" "
                      class="form-control-modern"
                    />
                    <label for="phone">Téléphone</label>
                  </BFormGroup>
                </BCol>

                <BCol md="6">
                  <BFormGroup label-for="birthDate" class="floating-label position-relative">
                    <BFormInput
                      id="birthDate"
                      v-model="formUpdate.participantProfile.birthDate"
                      type="date"
                      placeholder=" "
                      class="form-control-modern"
                    />
                    <label for="birthDate">Date de naissance</label>
                  </BFormGroup>
                </BCol>
              </BRow>

              <BFormGroup
                label="Pays"
                label-for="pays"
                class="mb-5 floating-label position-relative"
              >
                <Multiselect
                  :options="optionl"
                  v-model="formUpdate.participantProfile.country"
                  placeholder=" "
                  track-by="value"
                  label="label"
                  class="form-control-modern"
                />
                <label for="pays">Pays</label>
              </BFormGroup>
              <BRow class="mb-4">
                <BCol md="6">
                  <BFormGroup label-for="ty" class="floating-label position-relative">
                    <BFormInput
                      id="ty"
                      v-model="formUpdate.participantProfile.professionType"
                      placeholder=" "
                      class="form-control-modern"
                    />
                    <label for="ty">Type de profession</label>
                  </BFormGroup>
                </BCol>

                <BCol md="6">
                  <BFormGroup label-for="secteur" class="floating-label position-relative">
                    <Multiselect
                      id="secteur"
                      :options="optionls"
                      v-model="formUpdate.participantProfile.professionSector"
                      placeholder=" "
                      track-by="value"
                      label="label"
                      class="form-control-modern"
                    />
                    <label for="secteur">Secteur de profession</label>
                  </BFormGroup>
                </BCol>
              </BRow>

              <div class="text-center">
                <BButton type="submit" class="btn-modern px-5 py-2 fw-bold"> Enregistrer </BButton>
              </div>
            </BForm>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </div>
</template>

<style scoped>
/* Ton style existant intégré */
.form-focus:focus {
  box-shadow: 0 0 8px rgba(13, 110, 253, 0.4);
  border-color: #0d6efd !important;
  transition: all 0.3s ease;
}

.btn-gradient {
  background: linear-gradient(135deg, #0d6efd, #6610f2);
  color: #fff;
  transition: all 0.3s ease;
}

.btn-gradient:hover {
  background: linear-gradient(135deg, #6610f2, #0d6efd);
  transform: translateY(-2px);
}

/* Champs modernes avec floating label */
.floating-label {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-control-modern {
  border-radius: 50px;
  border: 1px solid #0d6efd;
  padding: 0.75rem 1rem 0.75rem 3rem;
  transition: all 0.3s ease;
}

.form-control-modern:focus,
.form-control-modern:not(:placeholder-shown) {
  border-color: #6610f2;
  box-shadow: 0 0 10px rgba(102, 16, 242, 0.3);
}

.floating-label label {
  position: absolute;
  top: 50%;
  left: 3rem;
  transform: translateY(-50%);
  color: #6c757d;
  pointer-events: none;
  transition: all 0.3s ease;
}

.form-control-modern:focus + label,
.form-control-modern:not(:placeholder-shown) + label {
  top: -10px;
  left: 2.5rem;
  font-size: 0.8rem;
  color: #6610f2;
  background: #f0f4f8;
  padding: 0 5px;
}

/* Icônes animées */
.icon-field {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #0d6efd;
  transition: all 0.3s ease;
}

.form-control-modern:focus ~ .icon-field {
  color: #6610f2;
  transform: translateY(-50%) scale(1.2);
}

/* Bouton moderne */
.btn-modern {
  background: linear-gradient(135deg, #90caf9, #80deea);
  color: #fff;
  border-radius: 50px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.btn-modern:hover {
  background: linear-gradient(135deg, #80deea, #90caf9);
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.btn-modern:active {
  transform: translateY(0);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}
/*-------------------------------------------*/
/* Avatar */
.profile-avatar {
  width: 120px;
  height: 120px;
  border: 4px solid #90caf9;
  transition: all 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(102, 16, 242, 0.3);
}

/* Titres */
.profile-header h5 {
  color: #0d6efd;
}

.profile-header p {
  font-style: italic;
}

/* Info rows */
.info-row p {
  font-weight: 500;
  color: #6c757d;
}

.info-row h5 {
  color: #884de7;
}

/* Ligne de séparation */
hr {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

/* Hover léger sur carte */
.BCard:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}
</style>
