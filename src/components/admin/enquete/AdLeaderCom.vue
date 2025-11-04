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
    BTable,
    CountToComponent,
  },
  data() {
    const orderData = ref([])
    const orderDatas = ref([])
    const detailData = ref([])
    const optionl = ref([])
    const loading = ref(false)
    const loadings = ref(false)
    const loadingx = ref(false)

    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/admin/leaderboard')
        orderData.value = response.data.leaderboard

        const responses = await api.get('/admin/leaderboard/stats')
        orderDatas.value = responses.data
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }
    const Add = async () => {
      try {
        loadings.value = true
        await api.post('/admin/leaderboard/recalculate')
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Le leaderboard a été recalculé avec succès.',
          showConfirmButton: false,
          timer: 2000,
          background: '#f8f9fa',
          color: '#333',
          width: '400px',
        })
        gets()
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text:
            error.response?.data?.message ||
            'Une erreur est survenue lors du recalcul. Veuillez réessayer plus tard.',
          showConfirmButton: true,
          background: '#f8f9fa',
          color: '#333',
          width: '400px',
        })
        console.error(error)
      } finally {
        loadings.value = false
      }
    }

    onMounted(() => {
      gets()
    })
    return {
      Add,
      orderDatas,
      activeTabss: 0,
      optionl,
      detailData,
      orderData,
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
          key: 'participant',
          label: 'Nom',
          sortable: true,
        },

        {
          key: 'ranks',
          label: 'Rang',
        },
        {
          key: 'totalPoints',
          label: 'Total Points',
          sortable: true,
        },
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
    totalParticipants() {
      return this.orderDatas.totalParticipants
    },
    topScore() {
      return this.orderDatas.topScore
    },
    averagePoints() {
      return this.orderDatas.averagePoints
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
    <!-- En-tête de section moderne -->
    <div class="section-header-modern mb-4">
      <div class="section-title-wrapper">
        <div class="section-icon-modern">
          <i class="bi bi-trophy-fill"></i>
        </div>
        <div class="section-title-content">
          <h3 class="section-title-modern">Leaderboard</h3>
          <p class="section-subtitle-modern">Classement et compétition entre participants</p>
        </div>
      </div>
    </div>

    <!-- Cartes de statistiques modernes -->
    <BRow class="g-3 mb-4">
      <BCol md="4">
        <div class="modern-stat-card stat-warning">
          <div class="stat-icon">
            <i class="bi bi-people-fill"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">
              <CountToComponent :startVal="0" :endVal="totalParticipants" :duration="2000" />
            </h3>
            <p class="stat-label">Participants</p>
          </div>
        </div>
      </BCol>
      <BCol md="4">
        <div class="modern-stat-card stat-info">
          <div class="stat-icon">
            <i class="bi bi-graph-up-arrow"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">
              <CountToComponent :startVal="0" :endVal="averagePoints" :duration="2000" />
            </h3>
            <p class="stat-label">Moyenne des Points</p>
          </div>
        </div>
      </BCol>
      <BCol md="4">
        <div class="modern-stat-card stat-success">
          <div class="stat-icon">
            <i class="bi bi-award-fill"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">
              <CountToComponent :startVal="0" :endVal="topScore" :duration="2000" />
            </h3>
            <p class="stat-label">Top Points</p>
          </div>
        </div>
      </BCol>
    </BRow>
    <!-- Section tableau -->
    <BRow>
      <BCol cols="12">
        <div class="table-section-card">
          <!-- En-tête avec bouton -->
          <div class="table-header-section">
            <div class="table-title-group">
              <div class="table-icon-wrapper">
                <i class="bi bi-list-ol"></i>
              </div>
              <div>
                <h4 class="table-main-title">Classement des Participants</h4>
                <p class="table-subtitle">Liste complète du leaderboard</p>
              </div>
            </div>
            <button v-if="loadings" class="btn-recalculate-modern" disabled>
              <q-spinner-dots color="white" size="20px" />
            </button>
            <button v-else class="btn-recalculate-modern" @click="Add">
              <i class="bi bi-arrow-clockwise me-2"></i>
              Recalculer Leaderboard
            </button>
          </div>

          <!-- Contenu du tableau -->
          <div class="table-content-section">
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
              <label class="d-inline-flex align-items-center">
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
          <p class="mt-3 text-muted">Aucune Classements</p>
        </div>
        <BTable
          v-else
          table-class="table table-centered datatable table-card-list"
          thead-tr-class="bg-transparent"
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
          <template v-slot:cell(participant)="data">
            <a href="#" class="text-body"
              >{{
                data.item.participant.user.length === 0
                  ? 'aucun'
                  : data.item.participant.user[0].email
              }}
              ({{ data.item.participant.firstName }} {{ data.item.participant.lastName }})</a
            >
          </template>

          <template v-slot:cell(ranks)="data">
            <div
              class="badge badge-pill font-size-12"
              :class="{
                'bg-soft-gold': data.item.ranks === 1,
                'bg-soft-silver': data.item.ranks === 2,
                'bg-soft-bronze': data.item.ranks === 3,
                'bg-soft-info': data.item.ranks > 3,
              }"
            >
              {{ data.item.ranks }}
            </div>
          </template>

          <template v-slot:cell(totalPoints)="data">
            <a href="#" class="text-success">{{ data.item.totalPoints }} points</a>
          </template>
        </BTable>
          </div>
          
          <!-- Pagination -->
          <div class="table-footer-section">
            <BPagination 
              v-model="currentPage" 
              :total-rows="rows" 
              :per-page="perPage"
              class="modern-pagination"
            />
          </div>
        </div>
      </BCol>
    </BRow>
  </div>
</template>
<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
@import '../../../css/admin/badges.scss';
@import '../../../css/admin/leaderboard.scss';
</style>

