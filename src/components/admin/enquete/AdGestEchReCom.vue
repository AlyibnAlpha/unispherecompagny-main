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
  <div>
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
            <a
              href="#"
              class="badge text-white"
              :class="{
                'bg-success': data.item.status === 'delivered',
                'bg-warning': data.item.status === 'pending',
                'bg-danger': data.item.status === 'cancelled',
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
            </a>
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
          <q-card class="modern-dialog" style="width: 700px; max-width: 90vw">
            <!-- Header -->
            <q-card-section class="dialog-header row items-center q-pa-sm">
              <div class="q-ml-sm">
                <div class="text-h6 text-warning">Détail de la rédemption</div>
                <div class="text-caption text-warning">Identifiant : #{{ detailData.id }}</div>
              </div>
              <q-space />
            </q-card-section>

            <q-separator color="grey-3" />

            <!-- Contenu principal -->
            <q-card-section class="dialog-content">
              <div class="info-row">
                <span class="label">Récompense :</span>
                <span v-if="loadingx" class="skeleton skeleton-title"></span>
                <span v-else class="value">{{ detailData.reward?.name || 'Aucune donnée' }}</span>
              </div>

              <div class="info-row">
                <span class="label">Date de demande :</span>
                <span v-if="loadingx" class="skeleton skeleton-title"></span>
                <span v-else class="value">
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

              <div class="info-row">
                <span class="label">Statut :</span>
                <span v-if="loadingx" class="skeleton skeleton-title"></span>
                <span
                  v-else
                  class="badge"
                  :class="{
                    'bg-warning': detailData.status === 'pending',
                    'bg-success': detailData.status === 'delivered',
                    'bg-danger': detailData.status === 'cancelled',
                  }"
                >
                  {{
                    detailData.status === 'pending'
                      ? 'En attente'
                      : detailData.status === ' delivered'
                        ? 'Livré'
                        : 'Annuler'
                  }}
                </span>
              </div>
            </q-card-section>

            <q-separator color="grey-3" />

            <!-- Section du participant -->
            <q-card-section class="dialog-content">
              <div class="text-subtitle1 q-mb-sm">Informations du participant</div>
              <div v-if="detailData.participant" class="q-mt-sm">
                <div class="info-row">
                  <span class="label">Nom complet :</span>
                  <span class="value">
                    {{ detailData.participant.firstName }} {{ detailData.participant.lastName }}
                  </span>
                </div>

                <div class="info-row mt-2">
                  <span class="label">Téléphone :</span>
                  <span class="value">{{ detailData.participant.phone || 'Non renseigné' }}</span>
                </div>

                <div class="info-row mt-2">
                  <span class="label">Date de naissance :</span>
                  <span class="value">
                    {{
                      new Date(detailData.participant.birthDate).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    }}
                  </span>
                </div>

                <div class="info-row mt-2">
                  <span class="label">Email :</span>
                  <span class="value">{{ detailData.participant.email || 'Non renseigné' }}</span>
                </div>
              </div>
              <div v-else>
                <q-banner dense class="bg-grey-3 text-grey-8 q-pa-sm">
                  Aucun participant associé à cette rédemption.
                </q-banner>
              </div>
            </q-card-section>

            <q-separator color="grey-3" />

            <!-- Actions -->
            <q-card-actions align="right" class="dialog-actions">
              <q-btn flat color="primary" label="Fermer" v-close-popup />
            </q-card-actions>
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
      </BCol>
    </BRow>
  </div>
</template>
<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
.stat-card {
  transition: all 0.4s ease-in-out;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #fdfdfd, #f5f5f5);
  position: relative;
  overflow: hidden;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
}

.shadow-warning:hover {
  border-color: #f1c40f;
  background-color: linear-gradient(135deg, #f8dc9f, #fff3cc);
  box-shadow: 0 0 18px rgba(241, 196, 15, 0.6);
}
.shadow-success:hover {
  border-color: #2ecc71;
  background: linear-gradient(135deg, #2ecc71, #d4f5e6);
  box-shadow: 0 0 18px rgba(46, 204, 113, 0.6);
}
.shadow-danger:hover {
  border-color: #e74c3c;
  background: linear-gradient(135deg, #ffecec, #ffd9d6);
  box-shadow: 0 0 18px rgba(231, 76, 60, 0.6);
}
.tabs-morphing-container {
  position: relative;
  padding: 20px;
  border-radius: 30px;
  overflow: hidden;
  z-index: 0;
  background: linear-gradient(135deg, #f8f9ff, #eef2ff);
}

/* Les onglets */
.morph-tabs .nav-tabs {
  border: none;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* Chaque onglet */
.morph-tabs .nav-link {
  border-radius: 12px;
  padding: 10px 20px;
  margin: 0 5px;
  color: #444;
  transition: all 0.3s ease-in-out;
}

/* Hover */
.morph-tabs .nav-link:hover {
  background: rgba(99, 102, 241, 0.1); /* indigo clair */
  color: #4f46e5;
}

/* Actif */
.morph-tabs .nav-link.active {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff !important;
  box-shadow: 0 3px 8px rgba(79, 70, 229, 0.3);
  transform: scale(1.05);
}

.progress {
  width: 100%;
  position: absolute;
  height: 4px;
}

.wizard-steps {
  position: relative;
  z-index: 3;
  width: 100%;

  .wizard-step {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    border: 3px solid;
    display: flex;
    justify-content: center;
    z-index: 9;
    position: relative;
    background: white;
  }
}

.step-arrow-nav {
  .nav-link {
    background: #f3f2ee;
    padding: 4px 0;
    border-radius: 0 !important;
  }
}

.wizard {
  .nav-link:not(.active) {
    color: #f3f2ee;

    .wizard-icon {
      color: #a5a5a5;
    }
  }
}

[data-bs-theme='dark'] {
  .wizard-steps .wizard-step:not(.active) {
    background: var(--bs-input-bg);
  }

  .step-arrow-nav {
    .nav-link:not(.active) {
      background: var(--bs-input-bg);
    }
  }
}
/* === Boutons modernes === */
.btn-success {
  background: linear-gradient(135deg, #34c38f, #2ea3f2);
  border: none;
  border-radius: 50px;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(46, 163, 242, 0.3);

  &:hover {
    background: linear-gradient(135deg, #2ea3f2, #34c38f);
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(46, 163, 242, 0.4);
  }

  &:active {
    transform: scale(0.96);
  }
}

/* === Table améliorée === */
.table tbody tr {
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #f9fcff;
    box-shadow: #1f6bad33 0px 4px 8px;
    transform: scale(1.01);
  }
}

/* Icônes d'action */
.list-inline-item a {
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2) rotate(-5deg);
    opacity: 0.8;
  }
}

/* === Dialogues avec animation === */
.q-dialog__inner {
  animation: fadeScale 0.35s ease forwards;
}

@keyframes fadeScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* === Inputs flottants modernes === */
.form-control {
  border-radius: 12px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2ea3f2;
    box-shadow: 0 0 8px rgba(46, 163, 242, 0.4);
    transform: scale(1.01);
  }
}

.bg-gradient {
  background: linear-gradient(135deg, #0d6efd, #6610f2);
}

/* === Champs modernes avec floating label === */
.floating-label {
  position: relative;
}

.form-control.form-control-modern {
  border-radius: 12px;
  border: 2px solid #e0e7ff;
  padding: 0.9rem 1rem;
  width: 100%;
  transition: all 0.3s ease;
  background: #fff;
}

.form-control.form-control-modern:focus {
  border-color: #10d0f2;
  box-shadow: 0 0 8px rgba(102, 16, 242, 0.25);
  transform: scale(1.01);
}

/* Labels flottants */
.floating-label label {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1rem;
  transition: all 0.3s ease;
  pointer-events: none;
  background: white;
  padding: 0 5px;
}

.form-control-modern:focus + label,
.form-control-modern:not(:placeholder-shown) + label {
  top: -10px;
  left: 10px;
  font-size: 0.8rem;
  color: #10d0f2;
}

/* Multiselect alignement */
.multiselect {
  border-radius: 12px !important;
  border: 2px solid #e0e7ff !important;
  padding: 6px 10px;
  transition: all 0.3s ease;
}
.multiselect:focus-within {
  border-color: #10d0f2 !important;
  box-shadow: 0 0 8px rgba(102, 16, 242, 0.25);
}
/* Card principal du dialog */
.modern-dialog {
  width: 500px;
  max-width: 90vw;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

/* Header du dialog */
.dialog-header {
  padding: 16px 20px;
}

/* Section du contenu */
.dialog-content {
  padding: 20px;
  background-color: #f9faff;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.08);
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
    }

    .label {
      font-weight: 600;
      color: #4b4b4b;
    }

    .value {
      color: #333;
    }
  }
}

/* Actions du dialog */
.dialog-actions {
  padding: 12px 20px;
  background-color: #fafafa;

  .q-btn {
    border-radius: 12px;
    min-width: 100px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }
  }
}

/* Animation d'ouverture */
.q-dialog__inner {
  animation: fadeScale 0.35s ease forwards;
}

@keyframes fadeScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.skeleton {
  display: inline-block;
  height: 1em;
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
.skeleton-title {
  width: 60%;
  height: 24px;
}
.skeleton-text {
  width: 100%;
  height: 16px;
  margin: 6px 0;
}
.bg-pink {
  background-color: #ff69b4; /* rose */
  color: white; /* texte blanc pour le contraste */
}
</style>
