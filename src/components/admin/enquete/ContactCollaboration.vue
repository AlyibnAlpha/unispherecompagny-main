<script>
import { onMounted, ref } from 'vue'
import { BFormInput, BPagination } from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
import Swal from 'sweetalert2'
/**
 * Corporate Contacts component - Modern version
 */
export default {
  components: {
    BFormInput,
    BPagination,
  },
  data() {
    const orderData = ref([])
    const loading = ref(false)

    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/corporate-contacts')
        orderData.value = response.data
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }
    const formu = ref({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone_number: '',
      role: '',
      country: '',
      planSize: '',
      responses: '',
      createdAt: '',
      companyName: '',
      employees: '',
    })
    const edit = ref(false)
    const editingSurvey = ref(null)
    const getInitials = (firstName, lastName) => {
      if (!firstName && !lastName) return '?'
      const f = firstName ? firstName[0].toUpperCase() : ''
      const l = lastName ? lastName[0].toUpperCase() : ''
      return f + l
    }

    const openEditModal = (survey) => {
      formu.value = { ...survey }
      console.log()
      setTimeout(() => {
        edit.value = true
      }, 500)
      this.activeTab = 1
      this.progressBarValue = 15
    }
    const deleteRow = (index) => {
      edit.value = false
      Swal.fire({
        title: 'Etes vous sur?',
        text: 'Voulez-vous supprimmer le paricipant',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      }).then(async (result) => {
        if (result.value) {
          await api.delete(`/corporate-contacts/${index}`)
          gets()
          Swal.fire('Deleted!', 'Le participants a été supprimer avec success.', 'success')
        }
      })
    }
    const truncateMessage = (message, length = 120) => {
      if (!message) return ''
      return message.length > length ? message.substring(0, length) + '...' : message
    }

    const formatDate = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    }

    const formatTime = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    onMounted(() => {
      gets()
    })
    return {
      openEditModal,
      getInitials,
      deleteRow,
      orderData,
      formu,
      edit,
      editingSurvey,
      totalRows: 1,
      currentPage: 1,
      perPage: 12,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: 'age',
      sortDesc: false,
      chat: ref(false),
      loading,
      truncateMessage,
      formatDate,
      formatTime,
    }
  },
  computed: {
    filteredContacts() {
      if (!this.filter) return this.orderData
      const search = this.filter.toLowerCase()
      return this.orderData.filter(
        (contact) =>
          contact.email?.toLowerCase().includes(search) ||
          contact.companyName?.toLowerCase().includes(search) ||
          contact.role?.toLowerCase().includes(search) ||
          contact.responses?.toLowerCase().includes(search) ||
          `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(search)
      )
    },
    paginatedContacts() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredContacts.slice(start, end)
    },
  },
  mounted() {
    this.totalRows = this.orderData.length
  },
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  },
}
</script>

<template>
  <div class="modern-admin-page">
    <!-- Header Section -->
    <div class="header-card mb-4">
      <div class="section-header-modern">
        <div class="section-title-wrapper">
          <div class="section-icon-modern">
            <i class="bi bi-building"></i>
          </div>
          <div class="section-title-content">
            <h3 class="section-title-modern">Contacts Collaborations</h3>
            <p class="section-subtitle-modern">Gérez les demandes de collaboration d'entreprises</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="contacts-section-card">
      <div class="contacts-toolbar">
        <div class="search-wrapper">
          <i class="bi bi-search search-icon"></i>
          <BFormInput
            v-model="filter"
            type="search"
            placeholder="Rechercher par entreprise, email, rôle..."
            class="modern-search-input"
          />
        </div>
        <div class="toolbar-actions">
          <span class="results-count">{{ filteredContacts.length }} contact(s)</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <q-spinner-dots color="primary" size="50px" />
        <p>Chargement des contacts...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredContacts.length === 0" class="empty-state-modern">
        <i class="bi bi-inbox empty-icon"></i>
        <h3>Aucun contact</h3>
        <p v-if="filter">Aucun résultat pour votre recherche</p>
        <p v-else>Vous n'avez reçu aucune demande de collaboration pour le moment</p>
      </div>

      <!-- Contacts Grid -->
      <div v-else class="contacts-grid">
        <div
          v-for="contact in paginatedContacts"
          :key="contact.id"
          class="corporate-card"
          @click="openEditModal(contact)"
        >
          <div class="corporate-card-header">
            <div class="corporate-avatar">
              <span>{{ getInitials(contact.firstName, contact.lastName) }}</span>
            </div>
            <div class="corporate-info">
              <h4 class="corporate-name">{{ contact.firstName }} {{ contact.lastName }}</h4>
              <div class="corporate-company">
                <i class="bi bi-building me-1"></i>
                {{ contact.companyName }}
              </div>
            </div>
            <button class="btn-delete-contact" @click.stop="deleteRow(contact.id)" title="Supprimer">
              <i class="bi bi-trash"></i>
            </button>
          </div>

          <div class="corporate-card-body">
            <div class="corporate-meta-grid">
              <div class="meta-item">
                <i class="bi bi-person-badge"></i>
                <span>{{ contact.role }}</span>
              </div>
              <div class="meta-item">
                <i class="bi bi-envelope"></i>
                <span>{{ contact.email }}</span>
              </div>
              <div class="meta-item">
                <i class="bi bi-telephone"></i>
                <span>{{ contact.phone_number }}</span>
              </div>
              <div class="meta-item">
                <i class="bi bi-globe"></i>
                <span>{{ contact.country }}</span>
              </div>
            </div>
            <div class="corporate-plan">
              <i class="bi bi-box me-2"></i>
              <strong>{{ contact.planSize }}</strong>
            </div>
            <p class="corporate-message">{{ truncateMessage(contact.responses) }}</p>
          </div>

          <div class="corporate-card-footer">
            <span class="corporate-date">
              <i class="bi bi-calendar3 me-1"></i>
              {{ formatDate(contact.createdAt) }}
            </span>
            <span class="corporate-time">
              <i class="bi bi-clock me-1"></i>
              {{ formatTime(contact.createdAt) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && filteredContacts.length > 0" class="pagination-wrapper">
        <BPagination
          v-model="currentPage"
          :total-rows="filteredContacts.length"
          :per-page="perPage"
          class="modern-pagination"
        />
      </div>
    </div>

    <!-- Modal de détails moderne -->
    <q-dialog v-model="edit" transition-show="scale" transition-hide="fade">
      <q-card class="corporate-detail-modal">
        <!-- Header -->
        <div class="modal-header-corporate">
          <div class="modal-header-left">
            <div class="modal-avatar-large">
              <span>{{ getInitials(formu.firstName, formu.lastName) }}</span>
            </div>
            <div class="modal-user-info">
              <h3 class="modal-user-name">{{ formu.firstName }} {{ formu.lastName }}</h3>
              <div class="modal-company">
                <i class="bi bi-building me-2"></i>
                {{ formu.companyName }}
              </div>
            </div>
          </div>
          <button class="modal-close-btn-corporate" @click="edit = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Info Grid -->
        <div class="modal-info-grid">
          <div class="info-item">
            <i class="bi bi-person-badge"></i>
            <div>
              <span class="info-label">Rôle</span>
              <span class="info-value">{{ formu.role }}</span>
            </div>
          </div>
          <div class="info-item">
            <i class="bi bi-envelope"></i>
            <div>
              <span class="info-label">Email</span>
              <a :href="`mailto:${formu.email}`" class="info-value">{{ formu.email }}</a>
            </div>
          </div>
          <div class="info-item">
            <i class="bi bi-telephone"></i>
            <div>
              <span class="info-label">Téléphone</span>
              <span class="info-value">{{ formu.phone_number }}</span>
            </div>
          </div>
          <div class="info-item">
            <i class="bi bi-globe"></i>
            <div>
              <span class="info-label">Pays</span>
              <span class="info-value">{{ formu.country }}</span>
            </div>
          </div>
        </div>

        <!-- Plan -->
        <div class="modal-plan-section">
          <div class="plan-header">
            <i class="bi bi-box me-2"></i>
            <span>Plan demandé</span>
          </div>
          <div class="plan-value">{{ formu.planSize }}</div>
        </div>

        <!-- Message -->
        <div class="modal-message-section">
          <div class="message-header">
            <i class="bi bi-file-text me-2"></i>
            <span>Message</span>
          </div>
          <div class="message-content">
            <p>{{ formu.responses }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-footer-corporate">
          <button class="btn-modal-delete" @click="deleteRow(formu.id)">
            <i class="bi bi-trash me-2"></i>
            Supprimer
          </button>
          <button class="btn-modal-close" @click="edit = false">
            <i class="bi bi-x-circle me-2"></i>
            Fermer
          </button>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
@import '../../../css/admin/modern-shared.scss';
@import '../../../css/admin/contacts.scss';

// ✅ Tous les styles sont maintenant dans les fichiers SCSS partagés
// Ajoutez ici uniquement les styles spécifiques à ce composant si nécessaire
</style>
