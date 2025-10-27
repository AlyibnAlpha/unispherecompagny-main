<script>
import { onMounted, ref } from 'vue'
import { BFormInput, BPagination } from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
import Swal from 'sweetalert2'
/**
 * Orders component
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
        const response = await api.get('/contact-us')
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
      subject: '',
      createdAt: '',
      message: '',
    })
    const edit = ref(false)
    const editingSurvey = ref(null)

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
          await api.delete(`/contact-us/${index}`)
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
          contact.subject?.toLowerCase().includes(search) ||
          contact.message?.toLowerCase().includes(search) ||
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
    // Set the initial number of items
    this.totalRows = this.orderData.length
  },
  methods: {
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
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
            <i class="bi bi-envelope-fill"></i>
          </div>
          <div class="section-title-content">
            <h3 class="section-title-modern">Messages de Contact</h3>
            <p class="section-subtitle-modern">Gérez les messages reçus via le formulaire de contact</p>
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
            placeholder="Rechercher par email, sujet ou message..."
            class="modern-search-input"
          />
        </div>
        <div class="toolbar-actions">
          <span class="results-count">{{ filteredContacts.length }} message(s)</span>
        </div>
      </div>
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <q-spinner-dots color="primary" size="50px" />
        <p>Chargement des messages...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredContacts.length === 0" class="empty-state-modern">
        <i class="bi bi-inbox empty-icon"></i>
        <h3>Aucun message</h3>
        <p v-if="filter">Aucun résultat pour votre recherche</p>
        <p v-else>Vous n'avez reçu aucun message pour le moment</p>
      </div>

      <!-- Contacts Grid -->
      <div v-else class="contacts-grid">
        <div
          v-for="contact in paginatedContacts"
          :key="contact.id"
          class="contact-card"
          @click="openEditModal(contact)"
        >
          <div class="contact-card-header">
            <div class="contact-avatar">
              <i class="bi bi-person-fill"></i>
            </div>
            <div class="contact-info">
              <h4 class="contact-name">{{ contact.firstName }} {{ contact.lastName }}</h4>
              <a :href="`mailto:${contact.email}`" class="contact-email" @click.stop>
                <i class="bi bi-envelope me-1"></i>
                {{ contact.email }}
              </a>
            </div>
            <button class="btn-delete-contact" @click.stop="deleteRow(contact.id)" title="Supprimer">
              <i class="bi bi-trash"></i>
            </button>
          </div>

          <div class="contact-card-body">
            <div class="contact-subject">
              <i class="bi bi-chat-left-text me-2"></i>
              <strong>{{ contact.subject }}</strong>
            </div>
            <p class="contact-message">{{ truncateMessage(contact.message) }}</p>
          </div>

          <div class="contact-card-footer">
            <span class="contact-date">
              <i class="bi bi-calendar3 me-1"></i>
              {{ formatDate(contact.createdAt) }}
            </span>
            <span class="contact-time">
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
      <q-card class="contact-detail-modal">
        <!-- Header avec gradient -->
        <div class="modal-header-contact">
          <div class="modal-header-left">
            <div class="modal-avatar-large">
              <i class="bi bi-person-fill"></i>
            </div>
            <div class="modal-user-info">
              <h3 class="modal-user-name">{{ formu.firstName }} {{ formu.lastName }}</h3>
              <a :href="`mailto:${formu.email}`" class="modal-user-email">
                <i class="bi bi-envelope-fill me-2"></i>
                {{ formu.email }}
              </a>
            </div>
          </div>
          <button class="modal-close-btn-contact" @click="edit = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Sujet et métadonnées -->
        <div class="modal-subject-section">
          <div class="subject-wrapper">
            <div class="subject-icon">
              <i class="bi bi-chat-left-text-fill"></i>
            </div>
            <div class="subject-content">
              <span class="subject-label">Sujet</span>
              <h4 class="subject-title">{{ formu.subject }}</h4>
            </div>
          </div>
          <div class="subject-meta">
            <div class="meta-item-modal">
              <i class="bi bi-calendar3"></i>
              <span>{{ formatDate(formu.createdAt) }}</span>
            </div>
            <div class="meta-item-modal">
              <i class="bi bi-clock"></i>
              <span>{{ formatTime(formu.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Message -->
        <div class="modal-message-section">
          <div class="message-header">
            <i class="bi bi-file-text me-2"></i>
            <span>Message</span>
          </div>
          <div class="message-content">
            <p>{{ formu.message }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-footer-contact">
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
