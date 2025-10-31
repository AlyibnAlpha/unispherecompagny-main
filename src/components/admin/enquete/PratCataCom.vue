<script>
import { onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BFormInput,
  BPagination,
  BFormSelect,
} from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
import CountToComponent from 'src/components/common/CountToComponent.vue'
import Swal from 'sweetalert2'

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
    CountToComponent,
  },
  data() {
    const orderData = ref([])
    const orderDatas = ref([])
    const detailData = ref([])
    const ajout = ref(false)
    const ajouts = ref(false)
    const optionl = ref([])
    const loading = ref(false)
    const loadings = ref(false)
    const loadingx = ref(false)
    const current = ref(0)

    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/participants/rewards')
        current.value = response.data.currentPoints
        orderData.value = response.data.rewards

        const res = await api.get('/participants/rewards/redemptions/stats')
        orderDatas.value = res.data
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }
    const openDetailModals = async (data) => {
      try {
        loadings.value = true
        await api.post(`/participants/rewards/${data.id}/redeem`)
        Swal.fire({
          title: 'Succès',
          text: 'Récompense réclamée avec succès !',
          icon: 'success',
          confirmButtonText: 'OK',
        })
      } catch (error) {
        console.log(error)
        Swal.fire({
          title: 'Erreur',
          text:
            error.response?.data?.error ||
            'Une erreur est survenue lors de la réclamation de la récompense.',
          icon: 'error',
          confirmButtonText: 'OK',
        })
      } finally {
        loadings.value = false
      }
    }

    onMounted(() => {
      gets()
    })
    return {
      current,
      openDetailModals,
      activeTabss: 0,
      ajout,
      ajouts,
      optionl,
      detailData,
      orderData,
      orderDatas,
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
          label: 'Nom',
          sortable: true,
        },

        {
          key: 'birthDate',
          label: 'Âges',
        },
        {
          key: 'phone',
          label: 'Numéro',
          sortable: true,
        },
        {
          key: 'gender',
          label: 'Genre',
          sortable: true,
        },
        {
          key: 'country',
          label: 'Localité',
          sortable: true,
        },
        {
          key: 'enabled',
          label: 'Status',
          sortable: true,
        },

        'action',
      ],
      progressBarValue: 15,
      activeTab: 1,
      activeTabArrow: 2,

      loading,
      loadings,
      loadingx,
    }
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.orderData.length
    },

    filteredData() {
      if (!this.filter) return this.orderData
      const search = this.filter.toLowerCase()
      return this.orderData.filter((item) => item.name.toLowerCase().includes(search))
    },

    paginatedData() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredData.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.perPage)
    },
    totalgagne() {
      return this.orderDatas.totalPointsSpent
    },
    totaldepense() {
      return this.orderDatas.deliveredRedemptions
    },
    totalRecompense() {
      return this.orderDatas.totalRedemptions
    },
    totalPending() {
      return this.orderDatas.pendingRedemptions
    },
    totalCurennt() {
      return this.current
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
  <div>
    <!-- Header moderne -->
    <div class="surveys-header-modern">
      <div class="header-left">
        <h2 class="surveys-title-modern">
          <i class="bi bi-gift-fill me-2"></i>
          Catalogue de Récompenses
        </h2>
        <p class="surveys-subtitle">Échangez vos points contre des récompenses</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <BRow class="d-flex justify-content-center mb-4">
      <BCol md="3" cols="xl-3">
        <div class="stat-card-modern stat-primary">
          <div class="stat-icon">
            <i class="bi bi-star-fill"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              <CountToComponent :startVal="0" :endVal="totalCurennt" :duration="2000" />
            </div>
            <div class="stat-label">Points Actuels</div>
          </div>
        </div>
      </BCol>
      <BCol md="3" cols="xl-3">
        <div class="stat-card-modern stat-danger">
          <div class="stat-icon">
            <i class="bi bi-cash-coin"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              <CountToComponent :startVal="0" :endVal="totalgagne" :duration="2000" />
            </div>
            <div class="stat-label">Points Dépensés</div>
          </div>
        </div>
      </BCol>

      <BCol md="3" cols="xl-3">
        <div class="stat-card-modern stat-success">
          <div class="stat-icon">
            <i class="bi bi-gift"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              <CountToComponent :startVal="0" :endVal="totalRecompense" :duration="2000" />
            </div>
            <div class="stat-label">Récompenses</div>
          </div>
        </div>
      </BCol>

      <BCol md="3" cols="xl-3">
        <div class="stat-card-modern stat-warning">
          <div class="stat-icon">
            <i class="bi bi-hourglass-split"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              <CountToComponent :startVal="0" :endVal="totalPending" :duration="2000" />
            </div>
            <div class="stat-label">En Attente</div>
          </div>
        </div>
      </BCol>
    </BRow>
    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filter-item">
        <label>Afficher:</label>
        <BFormSelect v-model="perPage" :options="pageOptions" class="filter-select"></BFormSelect>
      </div>
      <div class="search-box-catalogue">
        <i class="bi bi-search"></i>
        <BFormInput
          v-model="filter"
          type="search"
          placeholder="Rechercher une récompense..."
          class="search-input-catalogue"
        ></BFormInput>
      </div>
    </div>
    <!-- Loading -->
    <div v-if="loading" class="loading-modern">
      <q-spinner-ball color="primary" size="60px" />
      <p>Chargement...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="orderData.length === 0" class="empty-state-modern">
      <i class="bi bi-inbox" style="font-size: 4rem; color: #cbd5e1;"></i>
      <h3>Aucune récompense</h3>
      <p>Le catalogue est vide pour le moment</p>
    </div>

    <!-- Rewards Grid -->
    <BRow v-else class="rewards-grid">
      <BCol v-for="reward in paginatedData" :key="reward.id" sm="6" md="6" lg="3" xl="3" class="mb-4">
        <div class="reward-card-modern">
          <div class="reward-header">
            <div class="reward-icon">
              <i class="bi bi-gift-fill"></i>
            </div>
            <h3 class="reward-title">{{ reward.name }}</h3>
          </div>

          <div class="reward-points">
            <div class="points-badge">
              <i class="bi bi-star-fill"></i>
              <span class="points-value">
                <CountToComponent :startVal="0" :endVal="reward.pointsRequired" :duration="1500" />
              </span>
              <span class="points-label">points</span>
            </div>
          </div>

          <div class="reward-actions">
            <button
              @click="openDetailModals(reward)"
              class="btn-redeem"
              :disabled="loadings || totalCurennt < reward.pointsRequired"
            >
              <q-spinner-dots v-if="loadings" color="white" size="20px" />
              <template v-else>
                <i class="bi bi-arrow-repeat me-2"></i>
                Échanger
              </template>
            </button>
            <div v-if="totalCurennt < reward.pointsRequired" class="insufficient-points">
              <i class="bi bi-exclamation-circle me-1"></i>
              Points insuffisants
            </div>
          </div>
        </div>
      </BCol>
    </BRow>

    <!-- Pagination -->
    <BRow class="mt-4" v-if="filteredData.length > perPage">
      <BCol lg="12">
        <BPagination
          class="pagination-modern"
          v-model="currentPage"
          :total-rows="filteredData.length"
          :per-page="perPage"
          pills
        ></BPagination>
      </BCol>
    </BRow>
  </div>
</template>
