<script>
import { api } from 'src/boot/axios'
import { onMounted, ref, watch } from 'vue'
import Multiselect from '@vueform/multiselect'
import Swal from 'sweetalert2'
import {
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
  <div class="surveys-modern-container">
    <!-- Hero Profile Header -->
    <div class="profile-hero-header">
      <div class="hero-background"></div>
      <div class="hero-content">
        <div class="hero-avatar-wrapper">
          <img src="/icon.png" alt="avatar" class="hero-avatar" />
          <div class="avatar-badge">
            <i class="bi bi-patch-check-fill"></i>
          </div>
        </div>
        <div class="hero-info">
          <h1 class="hero-name">{{ formget.participantProfile?.firstName }} {{ formget.participantProfile?.lastName }}</h1>
          <p class="hero-position">
            <i class="bi bi-briefcase-fill me-2"></i>
            {{ formget.participantProfile?.professionType || 'Participant' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="quick-stats-grid">
      <div class="stat-card-profile">
        <div class="stat-icon-wrapper stat-purple">
          <i class="bi bi-envelope-fill"></i>
        </div>
        <div class="stat-details">
          <span class="stat-label">Email</span>
          <span class="stat-value">{{ formget.email }}</span>
        </div>
      </div>

      <div class="stat-card-profile">
        <div class="stat-icon-wrapper stat-blue">
          <i class="bi bi-telephone-fill"></i>
        </div>
        <div class="stat-details">
          <span class="stat-label">Mobile</span>
          <span class="stat-value">{{ formget.participantProfile?.phone || 'Non renseigné' }}</span>
        </div>
      </div>

      <div class="stat-card-profile">
        <div class="stat-icon-wrapper stat-green">
          <i class="bi bi-geo-alt-fill"></i>
        </div>
        <div class="stat-details">
          <span class="stat-label">Localisation</span>
          <span class="stat-value">{{ formget.participantProfile?.city }}, {{ formget.participantProfile?.country }}</span>
        </div>
      </div>

      <div class="stat-card-profile">
        <div class="stat-icon-wrapper stat-orange">
          <i class="bi bi-gender-ambiguous"></i>
        </div>
        <div class="stat-details">
          <span class="stat-label">Genre</span>
          <span class="stat-value">{{ formget.participantProfile?.gender === 'M' ? 'Homme' : 'Femme' }}</span>
        </div>
      </div>
    </div>

    <!-- Edit Profile Section -->
    <div class="profile-edit-section">
      <div class="section-header-profile">
        <div class="section-title-profile">
          <i class="bi bi-pencil-square me-2"></i>
          Modifier mes informations
        </div>
        <div class="section-subtitle-profile">
          Mettez à jour vos informations personnelles
        </div>
      </div>

      <BForm @submit.prevent="updateProfile" class="profile-form-modern">
        <div class="form-grid-2">
          <div class="input-group-profile">
            <div class="input-icon">
              <i class="bi bi-person"></i>
            </div>
            <div class="input-wrapper">
              <label for="firstName">Prénom</label>
              <BFormInput
                id="firstName"
                v-model="formUpdate.participantProfile.firstName"
                placeholder="Votre prénom"
              />
            </div>
          </div>

          <div class="input-group-profile">
            <div class="input-icon">
              <i class="bi bi-person-fill"></i>
            </div>
            <div class="input-wrapper">
              <label for="lastName">Nom</label>
              <BFormInput
                id="lastName"
                v-model="formUpdate.participantProfile.lastName"
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div class="input-group-profile">
            <div class="input-icon">
              <i class="bi bi-telephone"></i>
            </div>
            <div class="input-wrapper">
              <label for="phone">Téléphone</label>
              <BFormInput
                id="phone"
                v-model="formUpdate.participantProfile.phone"
                placeholder="Votre numéro"
              />
            </div>
          </div>

          <div class="input-group-profile">
            <div class="input-icon">
              <i class="bi bi-calendar"></i>
            </div>
            <div class="input-wrapper">
              <label for="birthDate">Date de naissance</label>
              <BFormInput
                id="birthDate"
                v-model="formUpdate.participantProfile.birthDate"
                type="date"
                placeholder="Votre date de naissance"
              />
            </div>
          </div>

          <div class="input-group-profile">
            <div class="input-icon">
              <i class="bi bi-globe"></i>
            </div>
            <div class="input-wrapper">
              <label for="country">Pays</label>
              <Multiselect
                id="country"
                :options="optionl"
                v-model="formUpdate.participantProfile.country"
                placeholder="Sélectionnez votre pays"
                track-by="value"
                label="label"
              />
            </div>
          </div>

          <div class="input-group-profile">
            <div class="input-icon">
              <i class="bi bi-geo-alt"></i>
            </div>
            <div class="input-wrapper">
              <label for="city">Ville</label>
              <BFormInput
                id="city"
                v-model="formUpdate.participantProfile.city"
                placeholder="Votre ville"
              />
            </div>
          </div>

          <div class="input-group-profile">
            <div class="input-icon">
              <i class="bi bi-briefcase"></i>
            </div>
            <div class="input-wrapper">
              <label for="professionType">Type de profession</label>
              <BFormInput
                id="professionType"
                v-model="formUpdate.participantProfile.professionType"
                placeholder="Votre profession"
              />
            </div>
          </div>

          <div class="input-group-profile">
            <div class="input-icon">
              <i class="bi bi-building"></i>
            </div>
            <div class="input-wrapper">
              <label for="professionSector">Secteur de profession</label>
              <Multiselect
                id="professionSector"
                :options="optionls"
                v-model="formUpdate.participantProfile.professionSector"
                placeholder="Sélectionnez votre secteur"
                track-by="value"
                label="label"
              />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-save-profile">
            <i class="bi bi-check-circle-fill me-2"></i>
            Enregistrer les modifications
          </button>
        </div>
      </BForm>
    </div>

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
  </div>
</template>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
@import 'src/css/participant/surveys.scss';

/* === Hero Profile Header === */
.profile-hero-header {
  position: relative;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

  .hero-background {
    height: 180px;
    background: linear-gradient(135deg, #34c38f 0%, #2ea3f2 100%);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100px;
      background: linear-gradient(to bottom, transparent, white);
    }
  }

  .hero-content {
    position: relative;
    padding: 0 2rem 2rem 2rem;
    margin-top: -80px;
    display: flex;
    align-items: flex-end;
    gap: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }

  .hero-avatar-wrapper {
    position: relative;
    flex-shrink: 0;

    .hero-avatar {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      border: 6px solid white;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      object-fit: cover;
      background: white;
    }

    .avatar-badge {
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 36px;
      height: 36px;
      background: #10b981;
      border-radius: 50%;
      border: 4px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.2rem;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
    }
  }

  .hero-info {
    flex: 1;
    padding-bottom: 0.5rem;

    .hero-name {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
      line-height: 1.2;
    }

    .hero-position {
      font-size: 1.1rem;
      color: #64748b;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;

      @media (max-width: 768px) {
        justify-content: center;
      }

      i {
        color: #667eea;
      }
    }
  }
}

/* === Quick Stats Grid === */
.quick-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card-profile {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-4px);
  }

  .stat-icon-wrapper {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    flex-shrink: 0;

    &.stat-purple {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    }

    &.stat-blue {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
    }

    &.stat-green {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    &.stat-orange {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }
  }

  .stat-details {
    flex: 1;
    min-width: 0;

    .stat-label {
      display: block;
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      display: block;
      font-size: 1rem;
      color: #1e293b;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

/* === Profile Edit Section === */
.profile-edit-section {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

  .section-header-profile {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid #e2e8f0;

    .section-title-profile {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #34c38f, #2ea3f2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;

      i {
        background: linear-gradient(135deg, #34c38f, #2ea3f2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    .section-subtitle-profile {
      font-size: 0.95rem;
      color: #64748b;
      font-weight: 500;
    }
  }
}

.profile-form-modern {
  .form-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .input-group-profile {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem;
    transition: all 0.3s ease;

    &:hover {
      border-color: #cbd5e1;
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    }

    &:focus-within {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      background: white;
    }

    .input-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: linear-gradient(135deg, #34c38f, #2ea3f2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.2rem;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(46, 163, 242, 0.3);
    }

    .input-wrapper {
      flex: 1;
      min-width: 0;

      label {
        display: block;
        font-size: 0.8rem;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.5rem;
      }

      input,
      .multiselect {
        width: 100%;
        border: none;
        background: transparent;
        padding: 0;
        font-size: 0.95rem;
        color: #1e293b;
        font-weight: 600;

        &:focus {
          outline: none;
        }

        &::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }
      }

      .multiselect {
        --ms-border-color: transparent;
        --ms-ring-color: transparent;
        --ms-bg: transparent;
      }
    }
  }

  .form-actions {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 2px solid #e2e8f0;
    display: flex;
    justify-content: center;
  }

  .btn-save-profile {
    background: linear-gradient(135deg, #34c38f, #2ea3f2);
    border: none;
    border-radius: 50px;
    padding: 1rem 3rem;
    color: white;
    font-weight: 700;
    font-size: 1rem;
    box-shadow: 0 4px 12px rgba(46, 163, 242, 0.3);
    transition: all 0.3s ease;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      background: linear-gradient(135deg, #2ea3f2, #34c38f);
      box-shadow: 0 6px 16px rgba(46, 163, 242, 0.4);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }

    i {
      font-size: 1.2rem;
    }
  }
}

// Modal password
.btn-modern {
  background: linear-gradient(135deg, #34c38f, #2ea3f2);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 32px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(46, 163, 242, 0.3);
  }
}

/* === Responsive === */
@media (max-width: 768px) {
  .quick-stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
