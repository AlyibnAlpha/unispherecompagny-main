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
  BCardBody,
  BCard,
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
    BCardBody,
    BCard,
  },
  data() {
    const orderData = ref([])
    const ajout = ref(false)
    const optionl = ref([])
    const loading = ref(false)
    const loadings = ref(false)
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
  <div>
    <BRow>
      <BCol cols="12">
        <div class="d-flex justify-content-between">
          <BButton variant="success" class="waves-effect waves-light mb-3" @click="ajout = true"
            >Créer une Subscriptions</BButton
          >

          <q-dialog v-model="ajout" transition-show="scale" transition-hide="fade">
            <q-card
              style="
                width: 800px;
                max-width: 90vw;
                height: auto;
                border-radius: 20px;
                overflow: hidden;
              "
              class="shadow-lg"
            >
              <!-- Titre -->
              <q-card-section
                class="q-pa-md text-white flex items-center justify-center"
                style="background: linear-gradient(135deg, #0d6efd, #6610f2)"
              >
                <q-icon name="group_add" size="28px" class="q-mr-sm" />
                <div class="text-h6 text-center">Subscriptions</div>
              </q-card-section>

              <!-- Formulaire -->
              <div class="q-pa-lg">
                <BForm style="margin: 1px 10px">
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
                  <div v-if="loadings" class="d-flex justify-content-end mt-4">
                    <q-spinner-dots color="green" size="20px" class="q-mr-sm" />
                  </div>
                  <div v-else class="d-flex justify-content-end mt-2">
                    <BButton variant="success" class="px-5" @click="Add"> Enregistrer </BButton>
                  </div>
                </BForm>
              </div>
            </q-card>
          </q-dialog>
        </div>

        <div
          class="ttable table-centered datatable dt-responsive nowrap table-card-list dataTable no-footer dtr-inline"
        >
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
                class="badge"
                :class="{
                  'bg-success': data.item.status === 'active',
                  'bg-danger':
                    data.item.status === 'inactive' ||
                    data.item.status === 'Annuler' ||
                    data.item.status === 'expired',
                  'bg-warning': data.item.status === 'En attend',
                }"
                >{{ data.item.status }}</span
              >
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
      <q-card class="modern-dialog" style="width: 800px; max-width: 90vw">
        <!-- Header -->
        <q-card-section class="dialog-header row items-center q-pa-sm">
          <div class="q-ml-sm">
            <span v-if="loading" class="skeleton skeleton-title"></span>
            <div v-else class="text-h6 text-warning">{{ selectedTask?.plan }}</div>
            <div class="text-caption text-warning">Détails de la subscription</div>
          </div>
          <q-space />
        </q-card-section>

        <q-separator color="grey-3" />
        <q-card-section>
          <BRow class="d-flexjustify-content-center">
            <BCol md="4" cols="xl-4">
              <BCard
                no-body
                class="shadow-sm rounded-4 stat-card shadow-warning"
                style="height: 90px"
              >
                <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                  <div>
                    <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-building-fill text-warning fs-3 me-2"></i>
                      <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                      <h4 v-else class="fw-bold mb-0 fs-3">
                        {{ selectedTask?.businessAccount?.companyName }}
                      </h4>
                    </div>
                  </div>
                </BCardBody>
              </BCard>
            </BCol>
            <BCol md="4" cols="xl-4">
              <BCard
                no-body
                class="shadow-sm rounded-4 stat-card shadow-warning"
                style="height: 90px"
              >
                <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                  <div>
                    <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-person text-warning fs-3 me-2"></i>
                      <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                      <h4 v-else class="fw-bold mb-0 fs-3">
                        {{ selectedTask?.businessAccount?.lastName }}
                        {{ selectedTask?.businessAccount?.firstName }}
                      </h4>
                    </div>
                  </div>
                </BCardBody>
              </BCard>
            </BCol>
            <BCol md="4" cols="xl-4">
              <BCard
                no-body
                class="shadow-sm rounded-4 stat-card shadow-warning"
                style="height: 90px"
              >
                <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                  <div>
                    <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-envelope-at text-warning fs-3 me-2"></i>
                      <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                      <span v-else class="fw-bold mb-0" style="font-size: 12px">
                        {{ selectedTask?.businessAccount?.user[0].email }}
                      </span>
                    </div>
                  </div>
                </BCardBody>
              </BCard>
            </BCol>
          </BRow>
        </q-card-section>

        <!-- Content -->
        <q-card-section class="dialog-content">
          <div class="info-row px-2">
            <span class="label">transactionId:</span>
            <span v-if="loading" class="skeleton skeleton-title"></span>
            <p v-else class="value px-2">
              {{ selectedTask?.transactionId || 'Pas de om' }}
            </p>
          </div>

          <div class="info-row">
            <span class="label px-2">Date de début :</span>
            <span v-if="loading" class="skeleton skeleton-title"></span>
            <span v-else class="value px-2">{{
              new Date(selectedTask?.startAt).toLocaleDateString('fr-FR')
            }}</span>
          </div>

          <div class="info-row">
            <span class="label px-2">Date de fin :</span>
            <span v-if="loading" class="skeleton skeleton-title"></span>
            <span v-else class="value px-2">{{
              new Date(selectedTask?.endAt).toLocaleDateString('fr-FR')
            }}</span>
          </div>
          <div class="info-row">
            <span class="label px-2">Statut :</span>
            <span v-if="loading" class="skeleton skeleton-title"></span>
            <q-badge
              v-else
              :color="selectedTask?.status === 'expired' ? 'red' : 'green'"
              class="chip px-2"
            >
              {{ selectedTask?.status === 'expired' ? 'Expirer' : 'Active' }}
            </q-badge>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<style lang="scss">
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

/* Skeleton loading */
.skeleton {
  display: inline-block;
  height: 1em;
  width: 80px;
  background: #e0e0e0;
  border-radius: 4px;
}

.skeleton-title {
  width: 150px;
  height: 1.2em;
  margin-bottom: 4px;
}
.progress-nav {
  position: relative;
  display: flex;
  align-items: center;
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
.stat-card {
  transition: all 0.4s ease-in-out;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #fdfdfd, #f5f5f5);
  position: relative;
  overflow: hidden;
}
.stat-card:hover {
  transform: translateY(-6px);
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
</style>
