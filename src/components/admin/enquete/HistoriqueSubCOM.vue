<script>
import { onMounted, ref } from 'vue'
import { BRow, BCol, BFormInput, BPagination, BFormSelect, BTable } from 'bootstrap-vue-next'

import { api } from 'src/boot/axios'

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
  },
  data() {
    const orderData = ref([])
    const ajout = ref(false)
    const optionl = ref([])
    const loading = ref(false)

    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/admin/subscription')
        orderData.value = response.data.subscriptions
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
      ajout,
      optionl,

      orderData,
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
          key: 'check',
          label: '',
        },

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
      ],
      progressBarValue: 15,
      activeTab: 1,
      activeTabArrow: 2,
      loading,
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
  <div class="modern-enquete-container">
    <BRow>
      <BCol cols="12">
        <div class="page-header">
          <div class="header-content">
            <div class="header-icon">
              <i class="bi bi-clock-history"></i>
            </div>
            <div>
              <h2 class="page-title">Historique des Abonnements</h2>
              <p class="page-subtitle">Consultez l'historique complet des abonnements</p>
            </div>
          </div>
        </div>

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
            <p class="mt-3 text-muted">Aucune Subscriptions</p>
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

            <template v-slot:cell(transactionId)="data">
              <a href="#" class="text-body">{{ data.item.transactionId }}</a>
            </template>
          </BTable>
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
        </div>
      </BCol>
    </BRow>
  </div>
</template>

<style lang="scss">
@import '../../../css/admin/subscriptions.scss';
@import '../../../css/admin/tables-shared.scss';
@import '../../../css/admin/badges.scss';

// ✅ Tous les styles sont maintenant dans les fichiers SCSS partagés
</style>
