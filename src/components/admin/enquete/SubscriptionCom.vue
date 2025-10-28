<script>
import { onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BButton,
  BFormInput,
  BPagination,
  BFormSelect,
  BTable,
  BForm,
} from 'bootstrap-vue-next'
import Multiselect from '@vueform/multiselect'
import { api } from 'src/boot/axios'
import Swal from 'sweetalert2'
import { Notify } from 'quasar'

/**
 * Orders component
 */
export default {
  components: {
    BRow,
    BCol,
    BButton,
    BFormInput,
    BPagination,
    BFormSelect,
    BTable,
    BForm,
    Multiselect,
  },
  data() {
    const orderData = ref([])
    const ajout = ref(false)
    const optionl = ref([])
    const loading = ref(false)
    const loadings = ref(false)
    const stats = ref({
      total: 0,
      active: 0,
      expired: 0,
      pending: 0,
    })
    const optionl2 = ref([
      { label: 'Mensuelle - 1 mois', value: 'Mensuelle' },
      { label: 'Standard - 3 mois', value: 'Standard' },
      { label: 'Premium - 6 mois', value: 'Premium' },
      { label: 'Entreprise - 12 mois', value: 'Entreprise' },
    ])
    const optionel3 = ref([
      { label: 'active', value: 'active' },
      { label: 'inactive', value: 'inactive' },
      { label: 'Annuler', value: 'Annuler' },
      { label: 'En attend', value: 'En attend' },
      { label: 'Expiré', value: 'Expiré' },
    ])
    const form = ref({
      businessId: '',
      plan: '',
      startAt: '',
      endAt: '',
      status: '',
      transactionId: '',
    })
    const getsBusiness = async () => {
      const response = await api.get('/admin/users')
      const lest = response.data.filter((user) => user.businessAccount !== null)
      console.log(lest)
      optionl.value = lest.map((business) => ({
        label: business.email + ' ( ' + business.businessAccount.companyName + ')',
        value: business.id,
      }))
    }
    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/admin/subscription')
        orderData.value = response.data.subscriptions
        
        // Calculer les statistiques
        stats.value.total = orderData.value.length
        stats.value.active = orderData.value.filter(s => s.status === 'active').length
        stats.value.expired = orderData.value.filter(s => s.status === 'expired').length
        stats.value.pending = orderData.value.filter(s => s.status === 'En attend').length
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }

    const Add = async () => {
      try {
        loadings.value = true
        if (
          !form.value.businessId ||
          !form.value.transactionId ||
          !form.value.plan ||
          !form.value.status ||
          !form.value.startAt ||
          !form.value.endAt
        ) {
          Notify.create({
            type: 'warning',
            message: 'Veuillez remplir tous les champs obligatoires.',
            timeout: 3000,
          })

          return
        }
        const payload = { ...form.value }

        // Conversion en ISO string avec heure
        if (payload.startAt) {
          payload.startAt = new Date(payload.startAt).toISOString()
        }
        if (payload.endAt) {
          payload.endAt = new Date(payload.endAt).toISOString()
        }
        await api.post('/admin/subscription', payload)
        gets()
        Swal.fire({
          icon: 'success',
          title: 'Enregistre avec success',
          showConfirmButton: true,
          timer: 2000,
        })
        ajout.value = false
      } catch (error) {
        console.error(error)
      } finally {
        loadings.value = true
      }
    }

    const Active = async (idact) => {
      try {
        loadings.value = true
        await api.post(`/admin/subscription/${idact}/activate`)
        Swal.fire({
          icon: 'success',
          title: 'ACtivé avec success',
          showConfirmButton: true,
          timer: 2000,
        })
      } catch (error) {
        console.log(error)
        Notify.create({
          type: 'danger',
          message: "Une erreur est survenue lors de l'cativation.",
          timeout: 3000,
        })
      } finally {
        loadings.value = false
      }
    }
    const Desact = async (idact) => {
      try {
        loadings.value = true
        await api.post(`/admin/subscription/${idact}/expire`)
        Swal.fire({
          icon: 'success',
          title: 'Désactiver avec success',
          showConfirmButton: true,
          timer: 2000,
        })
      } catch (error) {
        console.log(error)
        Notify.create({
          type: 'danger',
          message: "Une erreur est survenue lors de l'cativation.",
          timeout: 3000,
        })
      } finally {
        loadings.value = false

        gets()
      }
    }
    const selectedTask = ref(null)
    const opendMdet = ref(false)

    const openDetailModal = async (index) => {
      const response = await api.get(`/admin/subscription/${index}`)
      selectedTask.value = response.data
      opendMdet.value = true
    }

    onMounted(() => {
      gets()
      getsBusiness()
    })
    return {
      stats,
      openDetailModal,
      selectedTask,
      opendMdet,
      ajout,
      optionl,
      optionl2,
      optionel3,
      Add,
      Active,
      Desact,
      orderData,
      form,
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: 'age',
      sortDesc: false,
      chat: ref(false),
      fields: [
        {
          key: 'transactionId',
          label: 'N°Transaction',
          sortable: true,
        },

        {
          key: 'plan',
          label: 'Plan de souscription',
        },
        {
          key: 'startAt',
          label: 'Date de début',
          sortable: true,
        },
        {
          key: 'endAt',
          label: 'Date de fin',
          sortable: true,
        },
        {
          key: 'status',
          label: 'Statut',
          sortable: true,
        },
        'action',
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
  <div class="modern-admin-page">
    <!-- Hero Header -->
    <div class="subscription-hero-header">
      <div class="hero-background"></div>
      <div class="hero-content">
        <div class="hero-icon-wrapper">
          <i class="bi bi-credit-card-2-front-fill"></i>
        </div>
        <div class="hero-info">
          <h1 class="hero-title">Gestion des Abonnements</h1>
          <p class="hero-subtitle">Créez et gérez les abonnements des comptes business</p>
        </div>
        <BButton variant="success" class="hero-action-btn" @click="ajout = true">
          <i class="bi bi-plus-circle-fill me-2"></i>
          Créer un abonnement
        </BButton>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid-modern stats-grid-4">
      <div class="stat-card-modern stat-card-primary">
        <div class="stat-icon-wrapper">
          <i class="bi bi-credit-card-fill"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ stats.total }}</h3>
          <p class="stat-label">Total Abonnements</p>
        </div>
      </div>

      <div class="stat-card-modern stat-card-success">
        <div class="stat-icon-wrapper">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ stats.active }}</h3>
          <p class="stat-label">Actifs</p>
        </div>
      </div>

      <div class="stat-card-modern stat-card-danger">
        <div class="stat-icon-wrapper">
          <i class="bi bi-x-circle-fill"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ stats.expired }}</h3>
          <p class="stat-label">Expirés</p>
        </div>
      </div>

      <div class="stat-card-modern stat-card-warning">
        <div class="stat-icon-wrapper">
          <i class="bi bi-clock-fill"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ stats.pending }}</h3>
          <p class="stat-label">En attente</p>
        </div>
      </div>
    </div>

    <BRow>
      <BCol cols="12">

          <q-dialog v-model="ajout" transition-show="scale" transition-hide="fade">
            <q-card class="modern-modal-card">
              <!-- Header moderne -->
              <div class="modern-modal-header">
                <div class="modal-header-content">
                  <div class="modal-icon">
                    <i class="bi bi-credit-card-2-front"></i>
                  </div>
                  <div class="modal-title-section">
                    <h3 class="modal-title">Nouvelle Subscription</h3>
                    <p class="modal-subtitle">Créez un abonnement pour un compte business</p>
                  </div>
                </div>
                <button class="modal-close-btn" @click="ajout = false">
                  <i class="bi bi-x"></i>
                </button>
              </div>

              <!-- Formulaire -->
              <div class="modern-modal-body">
                <BForm>
                  <BRow>
                    <BCol cols="12" class="mb-4 floating-label">
                      <Multiselect
                        v-model="form.businessId"
                        :searchable="true"
                        :close-on-select="true"
                        :clear-on-select="false"
                        :options="optionl"
                        id="businessId"
                        class="form-control form-control-modern"
                        placeholder=" "
                        required
                      />
                      <label for="businessId">N°Business ID</label>
                    </BCol>
                    <BCol cols="12" class="mb-4 floating-label">
                      <BFormInput
                        id="title"
                        v-model="form.transactionId"
                        type="text"
                        class="form-control form-control-modern"
                        placeholder=" "
                        required
                      />
                      <label for="title">N°Transaction</label>
                    </BCol>

                    <BCol cols="12" class="mb-4 floating-label">
                      <Multiselect
                        v-model="form.plan"
                        placeholder="Choisir un plan"
                        :options="optionl2"
                        id="plan"
                        class="form-control form-control-modern"
                        required
                      />
                      <label for="plan">Plan d'abonnement</label>
                    </BCol>
                    <BCol cols="12" class="mb-4 floating-label">
                      <Multiselect
                        id="st"
                        v-model="form.status"
                        :options="optionel3"
                        placeholder="Choisir un secteur"
                        class="form-control form-control-modern"
                        required
                      />
                      <label for="st">Status</label>
                    </BCol>

                    <BCol cols="12" md="6" class="mb-4 floating-label">
                      <BFormInput
                        v-model="form.startAt"
                        class="w-100 form-control-modern"
                        placeholder=" "
                        type="date"
                        required
                      />
                      <label>Date de début</label>
                    </BCol>

                    <BCol cols="12" md="6" class="mb-4 floating-label">
                      <BFormInput
                        v-model="form.endAt"
                        type="date"
                        class="w-100 form-control form-control-modern"
                        placeholder=" "
                        required
                      />
                      <label>Date de fin</label>
                    </BCol>
                  </BRow>

                  <!-- Bouton -->
                </BForm>
              </div>

              <!-- Footer moderne -->
              <div class="modern-modal-footer">
                <button class="modal-btn modal-btn-cancel" @click="ajout = false">
                  <i class="bi bi-x-circle me-2"></i>
                  Annuler
                </button>
                <button v-if="loadings" class="modal-btn modal-btn-primary" disabled>
                  <q-spinner-dots color="white" size="20px" class="me-2" />
                  Enregistrement...
                </button>
                <button v-else class="modal-btn modal-btn-primary" @click="Add">
                  <i class="bi bi-check-circle me-2"></i>
                  Enregistrer
                </button>
              </div>
            </q-card>
          </q-dialog>

        <!-- Tableau moderne -->
        <div class="modern-table-container">
          <BRow>
            <BCol sm="12" md="6">
              <div id="tickets-table_length" class="dataTables_length">
                <label class="d-inline-flex align-items-center">
                  Trier:
                  <BFormSelect v-model="perPage" size="sm" :options="pageOptions"></BFormSelect>
                </label>
              </div>
            </BCol>
            <BCol sm="12" md="6">
              <div id="tickets-table_filter" class="dataTables_filter text-md-end">
                <label class="d-inline-flex ali[plugin:vite:vue] Invalid end tag.
/home/aly/Bureau/unispherecompagny-main/src/components/admin/enquete/SubscriptionCom.vue:663:11
661 |              </q-badge>
662 |            </div>
663 |            </BRow>
    |             ^
664 |          </div>
665 |        </q-card>
gn-items-center">
                  Recherche:
                  <BFormInput
                    v-model="filter"
                    type="search"
                    placeholder="Recherche..."
                    class="form-control form-control-sm ms-2"
                  ></BFormInput>
                </label>
              </div>
            </BCol>
          </BRow>
          <div v-if="loading" class="text-center my-5">
            <q-spinner-ball color="green" size="50px" />
          </div>
          <div
            v-else-if="Array.isArray(orderData) && orderData.length === 0"
            class="text-center py-5"
          >
            <i class="uil uil-folder-open text-muted" style="font-size: 3rem"></i>
            <p class="mt-3 text-muted">Aucun abonnement</p>
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
          >
            <template v-slot:cell(transactionId)="data">
              <a href="#" class="text-body">{{ data.item.transactionId }}</a>
            </template>

            <template v-slot:cell(plan)="data">
              <a
                href="#"
                :class="{
                  'text-primary': data.item.plan === 'Entreprise',
                  'text-success': data.item.plan === 'Premium',
                  'text-warning': data.item.plan === 'Standard',
                  'text-info': data.item.plan === 'Mensuelle',
                }"
                >{{ data.item.plan }}</a
              >
            </template>
            <template v-slot:cell(startAt)="data">
              <a href="#" class="text-body">{{
                new Date(data.item.startAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              }}</a>
            </template>
            <template v-slot:cell(endAt)="data">
              <a href="#" class="text-body">{{
                new Date(data.item.endAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              }}</a>
            </template>

            <template v-slot:cell(status)="data">
              <span
                :style="{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  background: data.item.status === 'active' ? '#d1fae5' : 
                             (data.item.status === 'En attend' ? '#fef3c7' : '#fee2e2'),
                  color: data.item.status === 'active' ? '#059669' : 
                        (data.item.status === 'En attend' ? '#d97706' : '#dc2626')
                }"
              >
                {{ data.item.status === 'active' ? 'Actif' : 
                   (data.item.status === 'expired' ? 'Expiré' : 
                   (data.item.status === 'Annuler' ? 'Annulé' : data.item.status)) }}
              </span>
            </template>

            <template v-slot:cell(action)="data">
              <ul class="list-inline mb-0">
                <li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-info"
                    @click.prevent="openDetailModal(data.item.id)"
                    title="stastique"
                  >
                    <i class="bi bi-eye" style="font-size: 18px"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a
                    v-if="
                      data.item.status !== 'active' && data.item.endAt > new Date().toISOString()
                    "
                    href="#"
                    class="px-2 text-success"
                    @click.prevent="Active(data.item.id)"
                    title="active"
                  >
                    <q-spinner-orbit color="green" size="18px" v-if="loading" />
                    <i v-else class="uil uil-check font-size-18"></i>
                  </a>
                </li>

                <li class="list-inline-item">
                  <a
                    v-if="data.item.status === 'active'"
                    href="#"
                    class="px-2 text-danger"
                    @click.prevent="Desact(data.item.id)"
                    title="Désactiver"
                  >
                    <q-spinner-orbit color="red" size="18px" v-if="loading" />
                    <i v-else class="uil uil-exclamation-octagon font-size-18"></i>
                  </a>
                </li>
              </ul>
            </template>
          </BTable>
          </div>
        </div>
        <BRow>
          <BCol>
            <div class="dataTables_paginate paging_simple_numbers float-end">
              <ul class="pagination pagination-rounded">
                <BPagination v-model="currentPage" :total-rows="rows" :per-page="perPage" />
              </ul>
            </div>
          </BCol>
        </BRow>
      </BCol>
    </BRow>
    <q-dialog v-model="opendMdet">
      <q-card class="modern-modal-card" style="max-width: 900px;">
        <!-- Header -->
        <q-card-section class="dialog-header row items-center">
          <div class="header-text q-ml-md">
            <div v-if="loading" class="skeleton skeleton-title"></div>
            <div v-else class="name" style="font-size: 1.3rem;">{{ selectedTask?.plan }}</div>
            <div class="subtitle">Détails de la subscription</div>
          </div>
          <q-space />
        </q-card-section>

        <q-separator />

        <!-- Stats Section -->
        <q-card-section class="modal-stats-section" style="padding: 20px 30px;">
          <div class="modal-stats-grid modal-stats-grid-3">
            <div class="modal-stat-card modal-stat-warning">
              <div class="modal-stat-icon" style="font-size: 1.3rem;">
                <i class="bi bi-building-fill"></i>
              </div>
              <div class="modal-stat-content">
                <div v-if="loadingx" class="skeleton skeleton-title"></div>
                <div v-else class="modal-stat-value" style="font-size: 1rem;">
                  {{ selectedTask?.businessAccount?.companyName }}
                </div>
                <div class="modal-stat-label" style="font-size: 0.8rem;">Entreprise</div>
              </div>
            </div>

            <div class="modal-stat-card modal-stat-info">
              <div class="modal-stat-icon" style="font-size: 1.3rem;">
                <i class="bi bi-person"></i>
              </div>
              <div class="modal-stat-content">
                <div v-if="loadingx" class="skeleton skeleton-title"></div>
                <div v-else class="modal-stat-value" style="font-size: 1rem;">
                  {{ selectedTask?.businessAccount?.lastName }}
                  {{ selectedTask?.businessAccount?.firstName }}
                </div>
                <div class="modal-stat-label" style="font-size: 0.8rem;">Contact</div>
              </div>
            </div>

            <div class="modal-stat-card modal-stat-success">
              <div class="modal-stat-icon" style="font-size: 1.3rem;">
                <i class="bi bi-envelope-at"></i>
              </div>
              <div class="modal-stat-content">
                <div v-if="loadingx" class="skeleton skeleton-title"></div>
                <div v-else class="modal-stat-value" style="font-size: 0.85rem;">
                  {{ selectedTask?.businessAccount?.user[0].email }}
                </div>
                <div class="modal-stat-label" style="font-size: 0.8rem;">Email</div>
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- Content -->
        <q-card-section class="dialog-content">
          <div class="info-card">
            <q-icon name="tag" size="18px" class="icon" />
            <div class="info-text">
              <div class="label" style="font-size: 0.8rem;">Transaction ID</div>
              <div v-if="loading" class="skeleton skeleton-text"></div>
              <div v-else class="value" style="font-size: 0.9rem;">
                {{ selectedTask?.transactionId || 'N/A' }}
              </div>
            </div>
          </div>

          <div class="info-card">
            <q-icon name="calendar_today" size="18px" class="icon" />
            <div class="info-text">
              <div class="label" style="font-size: 0.8rem;">Date de début</div>
              <div v-if="loading" class="skeleton skeleton-text"></div>
              <div v-else class="value" style="font-size: 0.9rem;">
                {{ new Date(selectedTask?.startAt).toLocaleDateString('fr-FR') }}
              </div>
            </div>
          </div>

          <div class="info-card">
            <q-icon name="event" size="18px" class="icon" />
            <div class="info-text">
              <div class="label" style="font-size: 0.8rem;">Date de fin</div>
              <div v-if="loading" class="skeleton skeleton-text"></div>
              <div v-else class="value" style="font-size: 0.9rem;">
                {{ new Date(selectedTask?.endAt).toLocaleDateString('fr-FR') }}
              </div>
            </div>
          </div>

          <div class="info-card">
            <q-icon 
              :name="selectedTask?.status === 'expired' ? 'cancel' : 'check_circle'" 
              size="18px" 
              class="icon" 
              :style="{ color: selectedTask?.status === 'expired' ? '#ef4444' : '#10b981' }"
            />
            <div class="info-text">
              <div class="label" style="font-size: 0.8rem;">Statut</div>
              <div v-if="loading" class="skeleton skeleton-text"></div>
              <div v-else class="value" style="font-size: 0.9rem;">
                <span 
                  :style="{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    background: selectedTask?.status === 'expired' ? '#fee2e2' : '#d1fae5',
                    color: selectedTask?.status === 'expired' ? '#dc2626' : '#059669'
                  }"
                >
                  {{ selectedTask?.status === 'expired' ? 'Expiré' : 'Actif' }}
                </span>
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            label="Fermer"
            color="primary"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<style lang="scss">
@import '../../../css/admin/subscriptions.scss';
@import '../../../css/admin/tables-shared.scss';
@import '../../../css/admin/badges.scss';
@import '../../../css/admin/users-management.scss';

// ✅ Tous les styles sont maintenant dans les fichiers SCSS partagés
</style>

