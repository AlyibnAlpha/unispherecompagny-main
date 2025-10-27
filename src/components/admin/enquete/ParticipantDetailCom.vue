<script>
import { onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BFormInput,
  BPagination,
  BFormSelect,
  BTable,
} from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth'
import { useRoute } from 'vue-router'
import CountToComponent from 'src/components/common/CountToComponent.vue'
/**
 * Orders component
 */
export default {
  components: {
    BRow,
    BCol,
    BFormInput,
    BPagination,
    BFormSelect,
    BTable,
    CountToComponent,
  },
  data() {
    const orderData = ref([])
    const authStore = useAuthStore()
    const Alldata = ref([])
    const loading = ref(false)
    const loadings = ref(false)
    const route = useRoute()
    const id = ref(route.params.id)
    function truncate(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    }

    const getAge = (birthDateString) => {
      const birthDate = new Date(birthDateString)
      const today = new Date()

      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      // Vérifie si l'anniversaire n'est pas encore passé cette année
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      return `${age} ans`
    }

    const gets = async () => {
      try {
        loading.value = true
        const role = authStore.roles[0]
        if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          const response = await api.get(`/participants-groups/${id.value}`)
          Alldata.value = response.data
          orderData.value = response.data.surveyParticipants
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          const response = await api.get(`/admin/participants-groups/${id.value}`)

          Alldata.value = response.data
          const found = response.data.surveyParticipants.filter((item) => item.survey !== null)
          orderData.value = found
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      gets()
    })
    return {
      truncate,
      getAge,
      orderData,
      Alldata,
      id,
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: 'age',
      sortDesc: false,
      fields: [
        {
          key: 'check',
          label: '',
        },
        {
          key: 'lastName',
          label: 'Participant',
          sortable: true,
        },
        {
          key: 'title',
          label: 'Sondage lié',
        },
        {
          key: 'gender',
          label: 'Genre',
          sortable: true,
        },
        {
          key: 'birthDate',
          label: 'Âge',
          sortable: true,
        },
        {
          key: 'notified',
          label: 'Notificattion',
          sortable: true,
        },
        {
          key: 'notifiedAt',
          label: 'Date de notification',
          sortable: true,
        },
        {
          key: 'hasResponded',
          label: 'Status de réponse',
          sortable: true,
        },
        {
          key: 'status',
          label: 'Status',
          sortable: true,
        },
      ],
      progressBarValue: 15,
      activeTab: 1,
      activeTabArrow: 2,
      loading,
      loadings,
    }
  },
  computed: {
    /**
     * Total no. of records
     */
    totalParticipants() {
      return this.orderData.length
    },
    // Total de ceux qui ont répondu
    totalResponded() {
      return this.orderData.filter((p) => p.hasResponded === true).length
    },
    // Total de ceux qui n'ont pas répondu
    totalNotResponded() {
      return this.orderData.filter((p) => p.hasResponded === false).length
    },
    totalNotNotified() {
      return this.orderData.filter((p) => p.hasResponded === false).length
    },
    totalNotified() {
      return this.orderData.filter((p) => p.hasResponded === true).length
    },
    rows() {
      return this.orderData.length
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
  <div class="modern-detail-container">
    <!-- Header moderne -->
    <div class="detail-page-header">
      <button class="back-btn-modern" @click="$router.back()">
        <i class="bi bi-arrow-left"></i>
      </button>
      <div class="header-content">
        <h2 class="page-title">Détails du Groupe</h2>
        <p class="page-subtitle">Consultez les participants et leurs réponses</p>
      </div>
    </div>

    <BRow>
      <BRow class="align-items-stretch">
        <BCol cols="12" md="9" order="2" class="h-100">
          <!-- Stats Grid Moderne -->
          <div class="detail-stats-grid">
            <div class="detail-stat-card stat-card-primary">
              <div class="stat-card-icon">
                <i class="bi bi-people-fill"></i>
              </div>
              <div class="stat-card-content">
                <h4 class="stat-card-value">
                  <CountToComponent :startVal="0" :endVal="totalParticipants" :duration="2000" />
                </h4>
                <p class="stat-card-label">Participants</p>
              </div>
            </div>
            <div class="detail-stat-card stat-card-success">
              <div class="stat-card-icon">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              <div class="stat-card-content">
                <h4 class="stat-card-value">
                  <CountToComponent :startVal="0" :endVal="totalResponded" :duration="2000" />
                </h4>
                <p class="stat-card-label">Répondus</p>
              </div>
            </div>
            <div class="detail-stat-card stat-card-danger">
              <div class="stat-card-icon">
                <i class="bi bi-x-circle-fill"></i>
              </div>
              <div class="stat-card-content">
                <h4 class="stat-card-value">
                  <CountToComponent :startVal="0" :endVal="totalNotResponded" :duration="2000" />
                </h4>
                <p class="stat-card-label">Non Répondus</p>
              </div>
            </div>
            <div class="detail-stat-card stat-card-info">
              <div class="stat-card-icon">
                <i class="bi bi-bell-fill"></i>
              </div>
              <div class="stat-card-content">
                <h4 class="stat-card-value">
                  <CountToComponent :startVal="0" :endVal="totalNotified" :duration="2000" />
                </h4>
                <p class="stat-card-label">Notifiés</p>
              </div>
            </div>
            <div class="detail-stat-card stat-card-warning">
              <div class="stat-card-icon">
                <i class="bi bi-bell-slash-fill"></i>
              </div>
              <div class="stat-card-content">
                <h4 class="stat-card-value">
                  <CountToComponent :startVal="0" :endVal="totalNotNotified" :duration="2000" />
                </h4>
                <p class="stat-card-label">Non Notifiés</p>
              </div>
            </div>
          </div>

          <!-- Titre du tableau -->
          <div class="table-section-header">
            <div class="section-icon">
              <i class="bi bi-people-fill"></i>
            </div>
            <div class="section-title-content">
              <h3 class="section-title">Liste des Participants</h3>
              <p class="section-subtitle">Participants associés à ce groupe</p>
            </div>
          </div>

          <BCol cols="12">
            <div class="modern-table-container">
              <div class="table-controls">
                <BRow>
                  <BCol sm="12" md="6">
                    <div class="table-control-item">
                      <label class="control-label">
                        <i class="bi bi-sort-down me-2"></i>
                        Trier:
                      </label>
                      <BFormSelect v-model="perPage" size="sm" :options="pageOptions" class="modern-select"></BFormSelect>
                    </div>
                  </BCol>
                  <BCol sm="12" md="6">
                    <div class="table-control-item search-control">
                      <label class="control-label">
                        <i class="bi bi-search me-2"></i>
                        Recherche:
                      </label>
                      <BFormInput
                        v-model="filter"
                        type="search"
                        placeholder="Rechercher un participant..."
                        class="modern-search-input"
                      ></BFormInput>
                    </div>
                  </BCol>
                </BRow>
              </div>
              <div v-if="loading" class="text-center my-5">
                <q-spinner-ball color="green" size="50px" />
              </div>
              <div
                v-else-if="Array.isArray(orderData) && orderData.length === 0"
                class="text-center py-5"
              >
                <i class="uil uil-folder-open text-muted" style="font-size: 3rem"></i>
                <p class="mt-3 text-muted">Aucun Participants</p>
              </div>
              <div v-else class="table-wrapper">
                <BTable
                  table-class="modern-table"
                  thead-tr-class="table-header"
                :items="orderData"
                :fields="fields"
                responsive="sm"
                :per-page="perPage"
                :current-page="currentPage"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
              >
                <template v-slot:cell(check)="data">
                  <div class="custom-control custom-checkbox text-center">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :id="`contacusercheck${data.item.id}`"
                    />
                  </div>
                </template>

                <template v-slot:cell(lastName)="data">
                  <a href="#" class="text-body">{{ data.item.participantProfile.lastName }}</a>
                </template>

                <template v-slot:cell(title)="data">
                  <a href="#" class="text-body"
                    >{{
                      data.item.survey?.title
                        ? data.item.survey.title.length > 50
                          ? data.item.survey.title.substring(0, 50) + '...'
                          : data.item.survey.title
                        : '—'
                    }}
                  </a>
                </template>

                <template v-slot:cell(gender)="data">
                  <span 
                    class="badge badge-pill font-size-12"
                    :class="data.item.participantProfile.gender === 'M' ? 'bg-soft-primary' : 'bg-soft-danger'"
                  >
                    {{ data.item.participantProfile.gender === 'M' ? 'Homme' : 'Femme' }}
                  </span>
                </template>

                <template v-slot:cell(birthDate)="data">
                  <span class="badge badge-pill font-size-12 bg-soft-warning">
                    {{ getAge(data.item.participantProfile.birthDate) }}
                  </span>
                </template>

                <template v-slot:cell(notified)="data">
                  <span 
                    class="badge badge-pill font-size-12"
                    :class="data.item.notified ? 'bg-soft-success' : 'bg-soft-danger'"
                  >
                    {{ data.item.notified ? 'Notifié' : 'Non Notifié' }}
                  </span>
                </template>

                <template v-slot:cell(notifiedAt)="data">
                  <a href="#" class="text-body">{{
                    data.item.notifiedAt === null
                      ? '---'
                      : new Date(data.item.notifiedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                  }}</a>
                </template>

                <template v-slot:cell(hasResponded)="data">
                  <span 
                    class="badge badge-pill font-size-12"
                    :class="data.item.hasResponded ? 'bg-soft-success' : 'bg-soft-danger'"
                  >
                    {{ data.item.hasResponded ? 'Répondu' : 'Non Répondu' }}
                  </span>
                </template>
                <template v-slot:cell(status)="data">
                  <span 
                    class="badge badge-pill font-size-12"
                    :class="{
                      'bg-soft-success': data.item.status === 'completed',
                      'bg-soft-warning': data.item.status === 'in_progress',
                      'bg-soft-danger': data.item.status === 'not_started',
                    }"
                  >
                    {{
                      data.item.status === 'completed'
                        ? 'Completer'
                        : data.item.status === 'in_progress'
                          ? 'En cours'
                          : 'Non répondus'
                    }}
                  </span>
                </template>
                </BTable>
              </div>
            </div>
              <div class="pagination-container">
                <BPagination v-model="currentPage" :total-rows="rows" :per-page="perPage" class="modern-pagination" />
              </div>
          </BCol>
        </BCol>
        <BCol cols="12" md="3" order="1" class="sidebar-col">
          <div class="modern-sidebar">
            <!-- Carte du groupe -->
            <div class="sidebar-card group-info-card">
              <div class="card-header-modern">
                <i class="bi bi-folder2-open"></i>
                <h4>Informations du Groupe</h4>
              </div>
              <div class="card-body-modern">
                <h5 class="group-name">{{ Alldata?.name }}</h5>
                <p class="group-description">{{ Alldata?.description }}</p>
              </div>
            </div>
            <!-- Carte du créateur -->
            <div class="sidebar-card creator-card" v-if="Alldata.manager?.businessAccount || Alldata.manager?.admin">
              <div class="card-header-modern">
                <i class="bi bi-person-circle"></i>
                <h4>Créateur</h4>
              </div>
              <div class="card-body-modern">
                <div class="creator-info" v-if="Alldata.manager?.businessAccount">
                  <img
                    :src="`https://ui-avatars.com/api/?name=${Alldata.manager?.businessAccount?.firstName}+${Alldata.manager?.businessAccount?.lastName}&background=random`"
                    alt="Avatar"
                    class="creator-avatar"
                  />
                  <div class="creator-details">
                    <h5 class="creator-name">
                      {{ Alldata.manager?.businessAccount?.firstName }}
                      {{ Alldata.manager?.businessAccount?.lastName }}
                    </h5>
                    <span class="creator-badge">Business</span>
                  </div>
                </div>
                <div class="creator-info" v-if="Alldata.manager?.admin">
                  <img
                    :src="`https://ui-avatars.com/api/?name=${Alldata.manager?.admin?.firstName}+${Alldata.manager?.admin?.lastName}&background=random`"
                    alt="Avatar"
                    class="creator-avatar"
                  />
                  <div class="creator-details">
                    <h5 class="creator-name">
                      {{ Alldata.manager?.admin?.firstName }} {{ Alldata.manager?.admin?.lastName }}
                    </h5>
                    <span class="creator-badge admin-badge">Admin</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Carte des critères -->
            <div class="sidebar-card criteria-card">
              <div class="card-header-modern">
                <i class="bi bi-sliders"></i>
                <h4>Critères de Sélection</h4>
              </div>
              <div class="card-body-modern">
                <div class="criteria-badges">
                  <div v-if="Alldata.criteria?.age" class="criteria-badge age-badge">
                    <i class="bi bi-calendar-range"></i>
                    <span>{{ Alldata.criteria?.age?.min }} - {{ Alldata.criteria?.age?.max }} ans</span>
                  </div>
                  
                  <div v-if="Alldata.criteria?.gender" class="criteria-badge gender-badge">
                    <i class="bi bi-gender-ambiguous"></i>
                    <span>{{ Alldata.criteria?.gender === 'H' ? 'Homme' : 'Femme' }}</span>
                  </div>

                  <div v-if="Alldata.criteria?.location?.city" class="criteria-badge location-badge">
                    <i class="bi bi-geo-alt-fill"></i>
                    <span>{{ Alldata.criteria?.location?.city }}</span>
                  </div>

                  <div v-if="Alldata.criteria?.location?.country" class="criteria-badge country-badge">
                    <i class="bi bi-flag-fill"></i>
                    <span>{{ Alldata.criteria?.location?.country }}</span>
                  </div>

                  <div v-if="Alldata.criteria?.profession?.sector" class="criteria-badge sector-badge">
                    <i class="bi bi-briefcase-fill"></i>
                    <span>{{ Alldata.criteria?.profession?.sector }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BCol>
      </BRow>
    </BRow>
  </div>
</template>

<style lang="scss">
@import '../../../css/modern-cards.scss';
@import '../../../css/admin/tables-shared.scss';
@import '../../../css/admin/participants.scss';
@import '../../../css/admin/badges.scss';

// ✅ Tous les styles sont maintenant dans participants.scss
</style>
