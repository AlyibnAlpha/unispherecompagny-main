<script>
import { onMounted, ref } from 'vue'
import { BRow, BCol, BFormInput, BPagination, BFormSelect, BTable } from 'bootstrap-vue-next'
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
    BFormInput,
    BPagination,
    BFormSelect,
    BTable,
  },
  data() {
    const orderData = ref([])
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
        const response = await api.get('/admin/reward-redemptions')
        orderData.value = response.data.redemptions
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }

    const openDetailModal = async (id) => {
      try {
        loadingx.value = true
        const response = await api.get(`/admin/reward-redemptions/${id}`)
        detailData.value = response.data
        console.log(detailData.value)
        ajout.value = true
      } catch (error) {
        console.log(error)
      } finally {
        loadingx.value = false
      }
    }

    const Active = async (idact) => {
      try {
        loadings.value = true
        await api.patch(`/admin/reward-redemptions/${idact}/status`, {
          status: 'delivered',
        })
        Swal.fire({
          icon: 'success',
          title: 'ACtivé avec success',
          showConfirmButton: true,
          timer: 2000,
        })
        gets()
      } catch (error) {
        console.log(error)
        Notify.create({
          type: 'danger',
          message: error.response.data.message || "Une erreur est survenue lors de l'ativation.",
          timeout: 3000,
        })
      } finally {
        loadings.value = false
      }
    }
    const Desact = async (idact) => {
      try {
        loadings.value = true
        await api.patch(`/admin/reward-redemptions/${idact}/status`, {
          status: 'cancelled',
        })
        Swal.fire({
          icon: 'success',
          title: 'Désactiver avec success',
          showConfirmButton: true,
          timer: 2000,
        })
        gets()
      } catch (error) {
        console.log(error)
        Notify.create({
          type: 'danger',
          message: error.response.data.message || "Une erreur est survenue lors de l'ativation.",
          timeout: 3000,
        })
      } finally {
        loadings.value = false
      }
    }

    onMounted(() => {
      gets()
    })
    return {
      openDetailModal,
      Active,
      Desact,
      activeTabss: 0,
      ajout,
      ajouts,
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
          key: 'reward',
          label: 'Catalogue',
          sortable: true,
        },
        {
          key: 'pointsRequired',
          label: 'Points Requis',
          sortable: true,
        },

        {
          key: 'redeemedAt',
          label: 'Date de demande',
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
    <!-- En-tête moderne -->
    <div class="section-header-modern mb-4">
      <div class="section-title-wrapper">
        <div class="section-icon-modern">
          <i class="bi bi-arrow-left-right"></i>
        </div>
        <div class="section-title-content">
          <h3 class="section-title-modern">Échanges de Récompenses</h3>
          <p class="section-subtitle-modern">Gérez les demandes d'échange de récompenses</p>
        </div>
      </div>
    </div>

    <BRow>
      <BCol cols="12">
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
          <p class="mt-3 text-muted">Aucune Catalogue</p>
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
          <template v-slot:cell(reward)="data">
            <a href="#" class="text-body">{{ data.item.reward.name }}</a>
          </template>

          <template v-slot:cell(pointsRequired)="data">
            <a href="#" class="text-success">{{ data.item.reward.pointsRequired }} points</a>
          </template>

          <template v-slot:cell(redeemedAt)="data">
            <a href="#" class="text-warning">{{
              new Date(data.item.redeemedAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            }}</a>
          </template>

          <template v-slot:cell(status)="data">
            <div
              class="badge badge-pill font-size-12"
              :class="{
                'bg-soft-success': data.item.status === 'delivered',
                'bg-soft-warning': data.item.status === 'pending',
                'bg-soft-danger': data.item.status === 'cancelled',
              }"
            >
              {{
                data.item.status === 'pending'
                  ? 'En attente'
                  : data.item.status === 'delivered'
                    ? 'Livré'
                    : data.item.status === 'cancelled'
                      ? 'Annulé'
                      : 'Inconnu'
              }}
            </div>
          </template>

          <template v-slot:cell(action)="data">
            <ul class="list-inline mb-0">
              <li class="list-inline-item">
                <a
                  href="#"
                  class="px-2 text-info"
                  @click.prevent="openDetailModal(data.item.id)"
                  title="Détails"
                >
                  <i class="bi bi-eye" style="font-size: 18px"></i>
                </a>
              </li>

              <li class="list-inline-item">
                <a
                  v-if="data.item.status === 'pending'"
                  href="#"
                  class="px-2 text-success"
                  @click.prevent="Active(data.item.id)"
                  title="active"
                >
                  <q-spinner-orbit color="green" size="18px" v-if="loadings" />
                  <i v-else class="uil uil-check font-size-18"></i>
                </a>
              </li>

              <li class="list-inline-item">
                <a
                  v-if="data.item.status === 'pending'"
                  href="#"
                  class="px-2 text-danger"
                  @click.prevent="Desact(data.item.id)"
                  title="Désactiver"
                >
                  <q-spinner-orbit color="red" size="18px" v-if="loadings" />
                  <i v-else class="uil uil-exclamation-octagon font-size-18"></i>
                </a>
              </li>
            </ul>
          </template>
        </BTable>
        <q-dialog v-model="ajout">
          <q-card class="modern-dialog-card modern-dialog-details">
            <!-- En-tête moderne -->
            <q-card-section class="modern-dialog-header">
              <div class="dialog-header-content">
                <div class="dialog-icon dialog-icon-info">
                  <i class="bi bi-receipt"></i>
                </div>
                <div class="dialog-title-wrapper">
                  <span v-if="loadingx" class="skeleton skeleton-title"></span>
                  <h5 v-else class="dialog-title">Rédemption #{{ detailData.id }}</h5>
                  <p class="dialog-subtitle">Détails de la demande d'échange</p>
                </div>
              </div>
              <q-btn flat round dense icon="close" v-close-popup class="dialog-close-btn" />
            </q-card-section>

            <!-- Informations de la récompense -->
            <q-card-section class="details-section">
              <h6 class="section-title-small">
                <i class="bi bi-gift-fill me-2"></i>
                Informations de la récompense
              </h6>
              <BRow class="g-3">
                <BCol cols="12" md="6">
                  <div class="info-card-modern">
                    <div class="info-label">
                      <i class="bi bi-tag-fill me-2"></i>
                      Récompense
                    </div>
                    <div class="info-value">
                      <span v-if="loadingx" class="skeleton skeleton-text"></span>
                      <span v-else>{{ detailData.reward?.name || 'Aucune donnée' }}</span>
                    </div>
                  </div>
                </BCol>

                <BCol cols="12" md="6">
                  <div class="info-card-modern">
                    <div class="info-label">
                      <i class="bi bi-calendar-event me-2"></i>
                      Date de demande
                    </div>
                    <div class="info-value">
                      <span v-if="loadingx" class="skeleton skeleton-text"></span>
                      <span v-else>
                        {{
                          new Date(detailData.redeemedAt).toLocaleString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        }}
                      </span>
                    </div>
                  </div>
                </BCol>

                <BCol cols="12">
                  <div class="info-card-modern">
                    <div class="info-label">
                      <i class="bi bi-info-circle-fill me-2"></i>
                      Statut
                    </div>
                    <div class="info-value">
                      <span v-if="loadingx" class="skeleton skeleton-text"></span>
                      <div
                        v-else
                        class="badge badge-pill font-size-12"
                        :class="{
                          'bg-soft-warning': detailData.status === 'pending',
                          'bg-soft-success': detailData.status === 'delivered',
                          'bg-soft-danger': detailData.status === 'cancelled',
                        }"
                      >
                        {{
                          detailData.status === 'pending'
                            ? 'En attente'
                            : detailData.status === 'delivered'
                              ? 'Livré'
                              : 'Annulé'
                        }}
                      </div>
                    </div>
                  </div>
                </BCol>
              </BRow>
            </q-card-section>

            <!-- Informations du participant -->
            <q-card-section class="details-section">
              <h6 class="section-title-small">
                <i class="bi bi-person-fill me-2"></i>
                Informations du participant
              </h6>
              <div v-if="detailData.participant">
                <BRow class="g-3">
                  <BCol cols="12" md="6">
                    <div class="info-card-modern">
                      <div class="info-label">
                        <i class="bi bi-person-badge me-2"></i>
                        Nom complet
                      </div>
                      <div class="info-value">
                        {{ detailData.participant.firstName }} {{ detailData.participant.lastName }}
                      </div>
                    </div>
                  </BCol>

                  <BCol cols="12" md="6">
                    <div class="info-card-modern">
                      <div class="info-label">
                        <i class="bi bi-telephone-fill me-2"></i>
                        Téléphone
                      </div>
                      <div class="info-value">
                        {{ detailData.participant.phone || 'Non renseigné' }}
                      </div>
                    </div>
                  </BCol>

                  <BCol cols="12" md="6">
                    <div class="info-card-modern">
                      <div class="info-label">
                        <i class="bi bi-cake2-fill me-2"></i>
                        Date de naissance
                      </div>
                      <div class="info-value">
                        {{
                          new Date(detailData.participant.birthDate).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        }}
                      </div>
                    </div>
                  </BCol>

                  <BCol cols="12" md="6">
                    <div class="info-card-modern">
                      <div class="info-label">
                        <i class="bi bi-envelope-fill me-2"></i>
                        Email
                      </div>
                      <div class="info-value">
                        {{ detailData.participant.email || 'Non renseigné' }}
                      </div>
                    </div>
                  </BCol>
                </BRow>
              </div>
              <div v-else class="alert alert-warning">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Aucun participant associé à cette rédemption.
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

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
@import '../../../css/assets/scss/app2.scss';
@import '../../../css/admin/badges.scss';
@import '../../../css/admin/reward-redemption.scss';
</style>
