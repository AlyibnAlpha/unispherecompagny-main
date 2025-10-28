<script>
import { api } from 'src/boot/axios'
import { onMounted, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import {
  BForm,
  BFormInput,
} from 'bootstrap-vue-next'

/**
 * Profile component
 */
export default {
  components: {
    BForm,
    BFormInput,
  },
  setup() {
    const formget = ref({
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
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    const showPasswordModal = ref(false)

    const formUpdate = ref(JSON.parse(JSON.stringify(formget.value)))

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

        for (const key in formUpdate.value.businessAccount) {
          if (formUpdate.value.businessAccount[key] !== formget.value.businessAccount[key]) {
            if (!payload.businessAccount) payload.businessAccount = {}
            payload.businessAccount[key] = formUpdate.value.businessAccount[key]
          }
        }

        // Comparer aussi les champs de niveau racine (ex: email)
        for (const key in formUpdate.value) {
          if (key !== 'businessAccount' && formUpdate.value[key] !== formget.value[key]) {
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
          title: 'Erreur lors de la mise à jour',
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
        await api.put('/reset-password', {
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
      () => formUpdate.value.businessAccount.lastName,
      (newVal) => {
        localStorage.setItem('nom', newVal)
      },
    )
    onMounted(() => {
      getdd()
      const storedLastName = localStorage.getItem('nom')
      if (storedLastName) {
        formUpdate.value.businessAccount.lastName = storedLastName
      }
    })
    return {
      showPasswordModal,
      passwordForm,
      changePassword,
      updateProfile,
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
  <div class="modern-admin-page">
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
          <h1 class="hero-name">{{ formget.businessAccount?.firstName }} {{ formget.businessAccount?.lastName }}</h1>
          <p class="hero-position">
            <i class="bi bi-briefcase-fill me-2"></i>
            {{ formget.businessAccount?.position || 'Business Account' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="quick-stats-grid">
      <div class="stat-card-profile">
        <div class="stat-icon-wrapper stat-purple">
          <i class="bi bi-building-fill"></i>
        </div>
        <div class="stat-details">
          <span class="stat-label">Compagnie</span>
          <span class="stat-value">{{ formget.businessAccount?.companyName || 'Non renseigné' }}</span>
        </div>
      </div>

      <div class="stat-card-profile">
        <div class="stat-icon-wrapper stat-orange">
          <i class="bi bi-hash"></i>
        </div>
        <div class="stat-details">
          <span class="stat-label">Numéro de référence</span>
          <span class="stat-value">{{ formget.businessAccount?.vatNumber || 'Non renseigné' }}</span>
        </div>
      </div>

      <div class="stat-card-profile">
        <div class="stat-icon-wrapper stat-blue">
          <i class="bi bi-envelope-fill"></i>
        </div>
        <div class="stat-details">
          <span class="stat-label">Email</span>
          <span class="stat-value">{{ formget.email }}</span>
        </div>
      </div>

      <div class="stat-card-profile">
        <div class="stat-icon-wrapper stat-green">
          <i class="bi bi-telephone-fill"></i>
        </div>
        <div class="stat-details">
          <span class="stat-label">Mobile</span>
          <span class="stat-value">{{ formget.businessAccount?.phone || 'Non renseigné' }}</span>
        </div>
      </div>

      <div class="stat-card-profile">
        <div class="stat-icon-wrapper stat-purple">
          <i class="bi bi-geo-alt-fill"></i>
        </div>
        <div class="stat-details">
          <span class="stat-label">Pays</span>
          <span class="stat-value">{{ formget.businessAccount?.country || 'Non renseigné' }}</span>
        </div>
      </div>

      <div class="stat-card-profile">
        <div class="stat-icon-wrapper stat-blue">
          <i class="bi bi-gender-ambiguous"></i>
        </div>
        <div class="stat-details">
          <span class="stat-label">Genre</span>
          <span class="stat-value">{{ formget.businessAccount?.gender || 'Non renseigné' }}</span>
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
          Mettez à jour vos informations professionnelles
        </div>
      </div>

      <BForm @submit.prevent="updateProfile" class="profile-form-modern">
        <div class="form-grid-2">
          <div class="input-group-profile">
            <div class="input-icon">
              <i class="bi bi-building"></i>
            </div>
            <div class="input-wrapper">
              <label for="companyName">Compagnie</label>
              <BFormInput
                id="companyName"
                v-model="formUpdate.businessAccount.companyName"
                placeholder="Nom de la compagnie"
              />
            </div>
          </div>

          <div class="input-group-profile">
            <div class="input-icon">
              <i class="bi bi-hash"></i>
            </div>
            <div class="input-wrapper">
              <label for="vatNumber">Numéro de référence</label>
              <BFormInput
                id="vatNumber"
                v-model="formUpdate.businessAccount.vatNumber"
                placeholder="Numéro de référence"
              />
            </div>
          </div>

          <div class="input-group-profile">
            <div class="input-icon">
              <i class="bi bi-person"></i>
            </div>
            <div class="input-wrapper">
              <label for="firstName">Prénom</label>
              <BFormInput
                id="firstName"
                v-model="formUpdate.businessAccount.firstName"
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
                v-model="formUpdate.businessAccount.lastName"
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
                v-model="formUpdate.businessAccount.phone"
                placeholder="Votre numéro"
              />
            </div>
          </div>

          <div class="input-group-profile">
            <div class="input-icon">
              <i class="bi bi-briefcase"></i>
            </div>
            <div class="input-wrapper">
              <label for="position">Position</label>
              <BFormInput
                id="position"
                v-model="formUpdate.businessAccount.position"
                placeholder="Votre position"
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
  </div>
</template>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
@import '../../../css/admin/modern-shared.scss';
@import '../../../css/admin/profile.scss';

// ✅ Tous les styles sont maintenant dans les fichiers SCSS partagés
</style>
