<script>
import { onMounted, ref } from 'vue'
import { BRow, BCol, BFormInput, BPagination, BFormSelect, BTable } from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
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
  },
  data() {
    const orderData = ref([])
    const loading = ref(false)

    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/corporate-contacts')
        orderData.value = response.data
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }
    const formu = ref({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone_number: '',
      role: '',
      country: '',
      planSize: '',
      responses: '',
      createdAt: '',
      companyName: '',
      employees: '',
    })
    const edit = ref(false)
    const editingSurvey = ref(null)
    const getInitials = (firstName, lastName) => {
      if (!firstName && !lastName) return '?'
      const f = firstName ? firstName[0].toUpperCase() : ''
      const l = lastName ? lastName[0].toUpperCase() : ''
      return f + l
    }

    const openEditModal = (survey) => {
      formu.value = { ...survey }
      console.log()
      setTimeout(() => {
        edit.value = true
      }, 500)
      this.activeTab = 1
      this.progressBarValue = 15
    }
    const deleteRow = (index) => {
      edit.value = false
      Swal.fire({
        title: 'Etes vous sur?',
        text: 'Voulez-vous supprimmer le paricipant',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      }).then(async (result) => {
        if (result.value) {
          await api.delete(`/corporate-contacts/${index}`)
          gets()
          Swal.fire('Deleted!', 'Le participants a été supprimer avec success.', 'success')
        }
      })
    }
    onMounted(() => {
      gets()
    })
    return {
      openEditModal,
      getInitials,
      deleteRow,
      orderData,
      formu,
      edit,
      editingSurvey,
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
          key: 'email',
          label: 'Email',
          sortable: true,
        },
        {
          key: 'phone_number',
          label: 'Numéro',
          sortable: true,
        },
        {
          key: 'role',
          label: 'Role',
          sortable: true,
        },
        {
          key: 'companyName',
          label: 'Nom de la compagny',
          sortable: true,
        },
        {
          key: 'planSize',
          label: 'Object',
          sortable: true,
        },

        {
          key: 'responses',
          label: 'Message',
        },

        'action',
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
  <div>
    <BRow>
      <BCol cols="12">
        <div
          class="ttable table-centered datatable dt-responsive nowrap table-card-list dataTable no-footer dtr-inline"
        >
          <BRow>
            <BCol sm="12" md="6">
              <div id="tickets-table_length" class="dataTables_length">
                <label class="d-inline-flex align-items-center">
                  Show
                  <BFormSelect v-model="perPage" size="sm" :options="pageOptions"></BFormSelect
                  >entries
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
                    placeholder="Search..."
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
            <p class="mt-3 text-muted">Aucune Conatct de collaboration</p>
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

            <template v-slot:cell(email)="data">
              <a href="#" class="text-body">{{ data.item.email }}</a>
            </template>
            <template v-slot:cell(phone_number)="data">
              <a href="#" class="text-body">{{ data.item.phone_number }}</a>
            </template>
            <template v-slot:cell(role)="data">
              <a href="#" class="text-body">{{ data.item.role }}</a>
            </template>
            <template v-slot:cell(companyName)="data">
              <a href="#" class="text-body">{{ data.item.companyName }}</a>
            </template>

            <template v-slot:cell(planSize)="data">
              <a href="#" class="text-body">{{ data.item.planSize }}</a>
            </template>
            <template v-slot:cell(responses)="data">
              <a href="#" class="text-body">{{ data.item.responses }}</a>
            </template>
            >

            <template v-slot:cell(action)="data">
              <ul class="list-inline mb-0">
                <li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-primary"
                    @click.prevent="openEditModal(data.item)"
                    title="détails"
                  >
                    <i class="uil uil-book font-size-18"></i>
                  </a>
                </li>

                <li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-danger"
                    @click.prevent="deleteRow(data.item.id)"
                    title="Delete"
                  >
                    <i class="uil uil-trash-alt font-size-18"></i>
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
    <q-dialog v-model="edit">
      <q-card
        style="
          width: 750px;
          max-width: 95vw;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        "
      >
        <!-- Bandeau entête -->
        <q-card-section
          class="row items-center q-pa-sm"
          style="background: linear-gradient(135deg, #2e7d32, #43a047); color: white"
        >
          <div>
            <div class="text-h6 text-bold">{{ formu.firstName }} {{ formu.lastName }}</div>
            <div class="text-caption">
              <q-icon name="work" size="16px" class="q-mr-xs" /> {{ formu.role }}
              <span class="q-mx-sm">•</span>
              <q-icon name="business" size="16px" class="q-mr-xs" /> {{ formu.companyName }}
            </div>
          </div>
        </q-card-section>

        <!-- Infos principales -->
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md text-body2">
            <div class="col-6">
              <q-icon name="email" size="18px" class="q-mr-xs text-primary" />
              <strong>Email:</strong> {{ formu.email }}
            </div>
            <div class="col-6">
              <q-icon name="phone" size="18px" class="q-mr-xs text-primary" />
              <strong>Téléphone:</strong> {{ formu.phone_number }}
            </div>
            <div class="col-6 q-mt-sm">
              <q-icon name="public" size="18px" class="q-mr-xs text-primary" />
              <strong>Pays:</strong> {{ formu.country }}
            </div>
            <div class="col-6 q-mt-sm">
              <q-icon name="event" size="18px" class="q-mr-xs text-primary" />
              <strong>Date:</strong> {{ new Date(formu.createdAt).toLocaleString() }}
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Sujet -->
        <q-card-section class="q-pa-md">
          <div class="text-subtitle1 text-bold text-green-9">
            <q-icon name="chat" size="20px" class="q-mr-sm text-grey-8" />
            {{ formu.planSize }}
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md bg-grey-1" style="min-height: 180px; border-radius: 8px">
          <span class="text-body1" style="line-height: 1.6; white-space: pre-line">
            {{ formu.responses }}
          </span>
        </q-card-section>

        <q-separator />

        <!-- Actions sur une seule ligne -->
        <q-card-actions class="bg-grey-2 row no-wrap justify-end items-center q-gutter-sm q-pa-sm">
          <BRow>
            <!--<BCol lg="4"
                          ><q-btn flat icon="reply" label="Répondre" color="primary"
                        /></BCol>-->

            <BCol lg="6" class="text-center"
              ><q-btn
                flat
                icon="delete"
                label="Supprimer"
                color="negative"
                @click="deleteRow(formu.id)" /></BCol
            ><BCol lg="6" class="text-center"
              ><q-btn flat icon="close" label="Fermer" color="grey" v-close-popup /></BCol
          ></BRow>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
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
</style>
