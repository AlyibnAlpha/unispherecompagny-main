<script>
import { computed, onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BButton,
  BFormInput,
  BPagination,
  BFormSelect,
  BTable,
  BCardBody,
  BCard,
  BForm,
} from 'bootstrap-vue-next'
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
    BCardBody,
    BCard,
    BTable,
    BForm,
  },
  data() {
    const orderData = ref([])
    const ajout = ref(false)
    const loading = ref(false)
    const loadings = ref(false)
    const expired = ref(false)
    const optionl2 = ref([
      { label: 'Mensuelle - 1 mois', value: 'Mensuelle' },
      { label: 'Standard - 3 mois', value: 'Standard' },
      { label: 'Premium - 6 mois', value: 'Premium' },
      { label: 'Entreprise - 12 mois', value: 'Entreprise' },
    ])

    const form = ref({
      transaction_id: '',
      plan: '',
      planty: '',
    })

    const getsstatus = async () => {
      const response = await api.get('/business/subscription/status')
      if (response.data.status === 'expired') {
        expired.value = true
      }
    }
    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/business/subscription/history')
        orderData.value = response.data.subscriptions_history
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }

    const Add = async () => {
      try {
        loadings.value = true
        if (!form.value.transaction_id) {
          Notify.create({
            type: 'warning',
            message: 'Veuillez remplir se champs.',
            timeout: 5000,
          })

          return
        }

        await api.post('/business/subscription/initiate', form.value.plan)
        await api.post('/business/subscription/webhook', form.value.transaction_id)
        gets()
        Swal.fire({
          icon: 'success',
          title: 'Abonnements effectuée avec success',
          showConfirmButton: true,
          timer: 5000,
        })
        ajout.value = false
      } catch (error) {
        console.error(error)
      } finally {
        loadings.value = true
      }
    }

    const planConfig = {
      Mensuelle: {
        price: '6000 CFA',
        description: 'Idéal pour tester nos services sur un mois.',
        icon: 'bi bi-box',
        colorClass: 'bg-primary text-white',
        badgeClass: 'bg-primary-subtle text-primary',
        btnVariant: 'primary',
        type: 'Basique',
      },
      Standard: {
        price: '15.000 CFA',
        description: 'Une formule simple pour 3 mois.',
        icon: 'bi bi-star',
        colorClass: 'bg-info text-white',
        badgeClass: 'bg-info-subtle text-info',
        btnVariant: 'info',
        type: 'Populaire',
      },
      Premium: {
        price: '30.000 CFA',
        description: 'Profitez de 6 mois avec plus d’avantages.',
        icon: 'bi bi-lightning-charge-fill',
        colorClass: 'bg-success text-white',
        badgeClass: 'bg-success-subtle text-success',
        btnVariant: 'success',
        type: 'Recommandé',
      },
      Entreprise: {
        price: '60.000 CFA',
        description: 'Une solution complète sur 12 mois.',
        icon: 'bi bi-building',
        colorClass: 'bg-danger text-white',
        badgeClass: 'bg-danger-subtle text-danger',
        btnVariant: 'danger',
        type: 'Premium',
      },
    }

    const subscriptions = computed(() =>
      optionl2.value.map((plan, index) => ({
        id: index + 1,
        name: plan.label,
        types: plan.value,
        ...planConfig[plan.value], // injecte la config correspondante
      })),
    )

    onMounted(() => {
      getsstatus()
      gets()
    })
    return {
      ajout,
      optionl2,
      Add,
      subscriptions,
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
          key: 'check',
          label: '',
        },

        {
          key: 'plan',
          label: 'Plan de souscription',
          sortable: true,
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
      loadings,
      expired,
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
    openForm(sub) {
      this.form.planty = sub.name
      this.form.plan = sub.types
      console.log(this.form.plan)
      this.ajout = true
    },
  },
}
</script>

<template>
  <div>
    <BRow v-if="expired" class="gy-4">
      <BCol md="3" v-for="sub in subscriptions" :key="sub.id">
        <BCard no-body class="sub-card shadow-sm rounded-4">
          <BCardBody class="p-4 d-flex flex-column align-items-center text-center">
            <!-- Icône avec fond -->
            <div class="icon-box mb-3" :class="sub.colorClass">
              <i :class="sub.icon"></i>
            </div>

            <!-- Nom du plan -->
            <h5 class="fw-bold mb-2">{{ sub.name }}</h5>

            <!-- Prix -->
            <h3 class="fw-bold text-dark mb-3">
              {{ sub.price }} <small class="text-muted"></small>
            </h3>

            <!-- Description -->
            <p class="text-muted small mb-3">{{ sub.description }}</p>

            <!-- Badges -->
            <div class="mb-3">
              <span class="badge fw-semibold px-3 py-1 rounded-pill" :class="sub.badgeClass">
                {{ sub.type }}
              </span>
            </div>

            <!-- Bouton -->
            <BButton
              :variant="sub.btnVariant"
              @click="openForm(sub)"
              class="px-4 py-2 rounded-pill fw-semibold shadow-sm"
            >
              S'abonner
            </BButton>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
    <BRow>
      <BCol cols="12">
        <div class="d-flex justify-content-between">
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
                <BRow>
                  <BCol cols="12" class="mb-4">
                    <div class="p-3 rounded bg-light">
                      <h6 class="fw-bold mb-1 text-primary">{{ form.planty }}</h6>
                      <p class="small text-muted mb-0">
                        {{ subscriptions.find((s) => s.name === form.planty)?.description }}
                      </p>
                      <p class="text-success fw-semibold mt-2">
                        Prix : {{ subscriptions.find((s) => s.name === form.planty)?.price }}
                      </p>
                    </div>
                  </BCol>
                </BRow>
                <BRow>
                  <BCol cols="12">
                    <div class="alert alert-info py-2 px-3 rounded-3 small">
                      💡 Pour valider votre abonnement :
                      <ul class="mb-0">
                        <li>
                          Effectuez le paiement du plan choisis sur
                          <span class="text-warning">Orange Money au +223 777777</span>.
                        </li>
                        <li>Renseignez ici le N°Transaction reçu.</li>
                        <li>Validez pour activer votre abonnement.</li>
                      </ul>
                    </div>
                  </BCol>
                </BRow>
                <BForm style="margin: 1px 10px">
                  <BRow>
                    <BCol cols="12" class="mb-4 floating-label">
                      <BFormInput
                        id="title"
                        v-model="form.transaction_id"
                        type="text"
                        class="form-control form-control-modern"
                        placeholder=" "
                        required
                      />
                      <label for="title">N°Transaction</label>
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
  </div>
</template>
<style lang="scss">
.sub-card {
  transition: all 0.3s ease-in-out;
  background: #fff;
  border: 1px solid #f0f0f0;
}
.sub-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: rgba(0, 0, 0, 0.08);
}
.icon-box {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
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
</style>
