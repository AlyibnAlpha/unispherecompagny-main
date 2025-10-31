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
    const ajout = ref(false)
    const ajouts = ref(false)
    const optionl = ref([])
    const loading = ref(false)
    const loadings = ref(false)
    const loadingx = ref(false)

    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/participants/points/transactions')
        orderData.value = response.data.transactions
        const res = await api.get('/participants/points/stats')
        orderDatas.value = res.data
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      gets()
    })
    return {
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
          key: 'description',
          label: 'Description',
          sortable: true,
        },

        {
          key: 'points',
          label: 'Points',
          sortable: true,
        },
        {
          key: 'createdAt',
          label: 'Date',
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

    totalgagne() {
      return this.orderDatas.totalEarned
    },
    totaldepense() {
      return this.orderDatas.totalSpent
    },
    totalPoints() {
      return this.orderDatas.currentBalance
    },
    totalinviatation() {
      return this.orderDatas.bySource?.invitation
    },
    totalBonus() {
      return this.orderDatas.bySource?.leaderboard_bonus
    },
    totalsondageCom() {
      return this.orderDatas.bySource?.survey
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
    <div class="transactions-header-modern">
      <div class="header-left">
        <h2 class="transactions-title-modern">
          <i class="bi bi-receipt me-2"></i>
          Mes Transactions
        </h2>
        <p class="transactions-subtitle">Suivez l'historique de vos points</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <BRow class="d-flex justify-content-center mb-4">
      <BCol md="4" lg="4" xl="4">
        <div class="stat-card-transaction stat-warning">
          <div class="stat-icon">
            <i class="bi bi-coin"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              <CountToComponent :startVal="0" :endVal="totalPoints" :duration="2000" />
            </div>
            <div class="stat-label">Points Actuels</div>
          </div>
        </div>
      </BCol>
      <BCol md="4" lg="4" xl="4">
        <div class="stat-card-transaction stat-blue">
          <div class="stat-icon">
            <i class="bi bi-clipboard-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              <CountToComponent :startVal="0" :endVal="totalsondageCom" :duration="2000" />
            </div>
            <div class="stat-label">Sondages</div>
          </div>
        </div>
      </BCol>
      <BCol md="4" lg="4" xl="4">
        <div class="stat-card-transaction stat-success">
          <div class="stat-icon">
            <i class="bi bi-arrow-up-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              <CountToComponent :startVal="0" :endVal="totalgagne" :duration="2000" />
            </div>
            <div class="stat-label">Points Gagnés</div>
          </div>
        </div>
      </BCol>
      <BCol md="4" lg="4" xl="4">
        <div class="stat-card-transaction stat-danger">
          <div class="stat-icon">
            <i class="bi bi-arrow-down-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              <CountToComponent :startVal="0" :endVal="totaldepense" :duration="2000" />
            </div>
            <div class="stat-label">Points Dépensés</div>
          </div>
        </div>
      </BCol>
      <BCol md="4" lg="4" xl="4">
        <div class="stat-card-transaction stat-purple">
          <div class="stat-icon">
            <i class="bi bi-gift"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              <CountToComponent :startVal="0" :endVal="totalBonus" :duration="2000" />
            </div>
            <div class="stat-label">Bonus</div>
          </div>
        </div>
      </BCol>
      <BCol md="4" lg="4" xl="4">
        <div class="stat-card-transaction stat-orange">
          <div class="stat-icon">
            <i class="bi bi-people"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              <CountToComponent :startVal="0" :endVal="totalinviatation" :duration="2000" />
            </div>
            <div class="stat-label">Parrainages</div>
          </div>
        </div>
      </BCol>
    </BRow>

    <!-- Table Section -->
    <div class="transactions-table-section">
      <BRow>
        <BCol cols="12">
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
          <p class="mt-3 text-muted">Aucune Transactions</p>
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
          <template v-slot:cell(description)="data">
            <a href="#" class="text-warning">{{ data.item.description }}</a>
          </template>
          <template v-slot:cell(points)="data">
            <a href="#" :class="[data.item.points < 0 ? 'text-danger' : 'text-success']"
              >{{ data.item.points }} pts</a
            >
          </template>

          <template v-slot:cell(createdAt)="data">
            <a href="#" class="text-body">{{
              new Date(data.item.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            }}</a>
          </template>
        </BTable>
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
    </div>
  </div>
</template>
