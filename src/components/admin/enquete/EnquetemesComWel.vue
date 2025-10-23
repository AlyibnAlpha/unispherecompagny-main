<script>
import { chatData, chatMessagesData, groupData } from './utils3.js'
import { onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BButton,
  BFormInput,
  BPagination,
  BFormSelect,
  BTable,
  BDropdown,
  BDropdownItem,
} from 'bootstrap-vue-next'
import Step1 from './actions-welcome/Step1Ac.vue'
import Step2 from './actions-welcome/Step2Ac.vue'
import Step3 from './actions-welcome/Step3Ac.vue'
import Step4Ac from './actions-welcome/Step4Ac.vue'
import Step5Ac from './actions-welcome/Step5Ac.vue'

import simplebar from 'simplebar-vue'
import { api } from 'src/boot/axios.js'
import { useRegisterStore } from 'src/stores/useRegisterStore.js'
import Swal from 'sweetalert2'
import { useAuthStore } from 'src/stores/auth.js'
import { useRouter } from 'vue-router'
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
    Step1,
    Step2,
    Step3,
    Step4Ac,
    simplebar,
    BDropdown,
    BDropdownItem,
    Step5Ac,
  },
  data() {
    const orderData = ref([])
    const edit = ref(false)
    const editingSurvey = ref(null)
    const detail = ref(false)
    const listdetail = ref([])
    const store = useRegisterStore()
    const authStore = useAuthStore()
    const ajout = ref(false)
    const route = useRouter()
    const categories = ref([])
    const loading = ref(true)

    const getcaetory = async () => {
      const role = authStore.roles[0]
      if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
        const response = await api.get('/admin/survey-categories')
        categories.value = response.data.categories.map((cat) => ({
          label: cat.name,
          value: cat.id,
        }))
      } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
        const response = await api.get('/admin/survey-categories')
        categories.value = response.data.categories.map((cat) => ({
          label: cat.name,
          value: cat.id,
        }))
      }
    }

    const gets = async () => {
      try {
        const response = await api.get('/admin/welcome-surveys')
        orderData.value = response.data.sort((a, b) => b.id - a.id)
        console.log(orderData.value)
      } catch (error) {
        console.error('Error fetching surveys:', error)
        orderData.value = []
      } finally {
        loading.value = false
      }
    }
    const deleteSurvey = async (surveyId) => {
      Swal.fire({
        title: 'Etes vous sur?',
        text: 'Voulez-vous supprimmer le sondage',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      }).then(async (result) => {
        if (result.value) {
          try {
            await api.delete(`/admin/welcome-surveys/${surveyId}`)
            gets()
            Swal.fire('Deleted!', 'Le sondage a été supprimer avec success.', 'success')
          } catch (error) {
            console.error('Error deleting survey:', error)
            Swal.fire(
              'Error!',
              error.response.data.message ||
                "Une erreur s'est produite lors de la suppression du sondage.",
              'error',
            )
          }
        }
      })
    }
    const creaOpenModal = () => {
      store.setIdSurveyw(null)
      ajout.value = true
    }
    const openEditModal = (survey) => {
      editingSurvey.value = { ...survey }
      store.setIdSurveyw(editingSurvey.value.id)
      setTimeout(() => {
        route.push(`/admin/enquetes-welcome-modification/${editingSurvey.value.slug}`)
      }, 500)
      this.activeTab = 1
      this.progressBarValue = 15
    }

    const openDetailModal = (survey) => {
      const id = survey ? survey.id : null

      route.push(`/admin/enquetes-details-bienvenue/${id}`)
    }
    const step3Ref = ref(0)

    const refreshStep3 = async () => {
      step3Ref.value++
    }

    onMounted(() => {
      gets()
      getcaetory()
    })
    return {
      gets,
      openEditModal,
      deleteSurvey,
      openDetailModal,
      refreshStep3,
      step3Ref,
      detail,
      listdetail,
      orderData,
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
      ajout,
      chat: ref(false),
      chatData: chatData,
      groupData: groupData,
      chatMessagesData,
      loading,
      fields: [
        {
          key: 'check',
          label: '',
        },

        {
          key: 'title',
          label: 'Titre',
          sortable: true,
        },

        {
          key: 'bonusPoints',
          label: 'Points',
          sortable: true,
        },
        {
          key: 'isActive',
          label: 'Active',
          sortable: true,
        },
        {
          key: 'displayOrder',
          label: "Ordre d'affichage",
          sortable: true,
        },
        {
          key: 'status',
          label: 'Status',
          sortable: true,
        },
        'action',
      ],
      progressBarValue: 10,
      activeTab: 1,
      activeTabArrow: 2,
      creaOpenModal,
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
    toggleWizard(tab, value) {
      this.activeTab = tab
      this.progressBarValue = value
    },

    toggleTabWizard(tab) {
      this.activeTabArrow = tab
    },
    closeModal() {
      this.edit = false
      this.ajout = false
      this.gets()
    },
  },
}
</script>

<template>
  <div>
    <BRow>
      <BCol cols="12">
        <div class="d-flex justify-content-between">
          <BButton variant="success" class="waves-effect waves-light mb-3" @click="creaOpenModal"
            >Créer une enquête</BButton
          >

          <q-dialog v-model="ajout">
            <q-card
              style="
                width: 800px;
                max-width: 90vw;
                background: linear-gradient(135deg, #f0f4ff, #e0f7fa);
              "
            >
              <!-- Titre -->
              <q-card-section class="q-pa-sm bg-grey-2">
                <div class="text-h6">Créez une enquête</div>
              </q-card-section>

              <!-- Barre de progression -->
              <div class="q-pa-sm">
                <q-linear-progress
                  :value="progressBarValue / 100"
                  color="success"
                  class="progress-bar"
                />

                <ul class="nav nav-pills d-flex justify-content-around wizard-steps" role="tablist">
                  <li class="nav-item" role="presentation">
                    <q-btn
                      flat
                      round
                      icon="check_circle"
                      :color="activeTab >= 1 ? 'success' : 'grey'"
                    />
                  </li>
                  <li class="nav-item" role="presentation">
                    <q-btn
                      flat
                      round
                      icon="check_circle"
                      :color="activeTab >= 2 ? 'success' : 'grey'"
                    />
                  </li>

                  <li class="nav-item" role="presentation">
                    <q-btn
                      flat
                      round
                      icon="check_circle"
                      :color="activeTab >= 3 ? 'success' : 'grey'"
                    />
                  </li>

                  <li class="nav-item" role="presentation">
                    <q-btn
                      flat
                      round
                      icon="check_circle"
                      :color="activeTab >= 4 ? 'success' : 'grey'"
                    />
                  </li>
                  <li class="nav-item" role="presentation">
                    <q-btn
                      flat
                      round
                      icon="check_circle"
                      :color="activeTab >= 5 ? 'success' : 'grey'"
                    />
                  </li>
                </ul>
              </div>

              <!-- Contenu dynamique selon l'étape -->
              <q-card-section>
                <div v-show="activeTab === 1">
                  <Step1 @refreshTable="gets()" @onNext="toggleWizard(2, 30)" />
                </div>
                <div v-show="activeTab === 2">
                  <Step2
                    @refreshGroups="refreshStep3()"
                    @onBack="toggleWizard(1, 10)"
                    @onNext="toggleWizard(3, 50)"
                  />
                </div>
                <div v-show="activeTab === 3">
                  <Step4Ac
                    :refreshTrigger="step3Ref"
                    @onBack="toggleWizard(2, 30)"
                    @onNext="toggleWizard(4, 70)"
                  />
                </div>
                <div v-show="activeTab === 4">
                  <Step3 @onBack="toggleWizard(3, 50)" @onNext="toggleWizard(5, 100)" />
                </div>
                <div v-show="activeTab === 5">
                  <Step5Ac @onBack="toggleWizard(4, 70)" @onNext="closeModal()" />
                </div>
              </q-card-section>
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
            <p class="mt-3 text-muted">Aucune enquête trouvée</p>
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

            <template v-slot:cell(title)="data">
              <a href="#" class="text-body">{{ data.item.title }}</a>
            </template>

            <template v-slot:cell(bonusPoints)="data">
              <a href="#" class="text-success">{{ data.item.bonusPoints }} pts</a>
            </template>

            <template v-slot:cell(isActive)="data">
              <a
                href="#"
                class="badge badge-pill font-size-12"
                :class="{
                  'bg-soft-success': data.item.isActive === true,
                  'bg-soft-danger': data.item.isActive === false,
                }"
                >{{ data.item.isActive === true ? 'Activé' : 'Non Activé' }}</a
              >
            </template>

            <template v-slot:cell(displayOrder)="data">
              <a href="#" class="text-warning"
                ><strong>{{ data.item.displayOrder }} position</strong></a
              >
            </template>

            <template v-slot:cell(status)="data">
              <div
                class="badge badge-pill font-size-12"
                :class="{
                  'bg-soft-primary': data.item.status === 'draft',
                  'bg-soft-success': data.item.status === 'published',
                  'bg-soft-warning': data.item.status === 'archived',
                  'bg-soft-secondary': data.item.status === 'review',
                  'bg-soft-danger': data.item.status === 'closed',
                }"
              >
                {{ data.item.status }}
              </div>
            </template>
            <template v-slot:cell(action)="data">
              <ul class="list-inline mb-0">
                <li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-info"
                    @click.prevent="openDetailModal(data.item)"
                    title="stastique"
                  >
                    <i class="bi bi-eye" style="font-size: 18px"></i>
                  </a>
                </li>

                <li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-warning"
                    @click.prevent="openEditModal(data.item)"
                    title="Edit"
                  >
                    <i class="uil uil-pen font-size-18"></i>
                  </a>
                </li>

                <!--<li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-primary"
                    @click.prevent="chat = !chat"
                    title="chat I.A"
                  >
                    <i class="uil uil-robot font-size-18"></i>
                  </a>
                </li>-->
                <li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-danger"
                    @click.prevent="deleteSurvey(data.item.id)"
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
    <q-dialog v-model="chat" persistent>
      <q-card style="width: 700px; max-width: 80vw" class="bg-white text-black">
        <q-card-section class="q-pa-md row items-center">
          <div class="col-lg-6">
            <div class="text-h6">Chat</div>
          </div>
          <div class="col-lg-6" style="text-align: end">
            <q-btn flat round icon="close" @click="chat = false" />
          </div>
        </q-card-section>

        <q-separator />

        <div class="px-lg-2 chat-users">
          <div class="chat-conversation p-3">
            <simplebar data-simplebar style="height: 550px">
              <ul class="list-unstyled mb-0">
                <li
                  v-for="data of chatMessagesData"
                  :key="data.id"
                  :class="{ right: `${data.align}` === 'right' }"
                >
                  <div class="conversation-list">
                    <div class="ctext-wrap">
                      <div class="ctext-wrap-content">
                        <h5 class="font-size-14 conversation-name d-flex justify-content-between">
                          <a href="#" class="nav-link">{{ data.name }}</a>
                          <span class="d-inline-block font-size-12 text-muted ms-2">{{
                            data.time
                          }}</span>
                        </h5>
                        <p class="mb-0">{{ data.message }}</p>
                      </div>
                      <BDropdown class="align-self-start" variant="white">
                        <template #button-content>
                          <i class="uil uil-ellipsis-v"></i>
                        </template>
                        <BDropdownItem href="#">Copy</BDropdownItem>
                        <BDropdownItem href="#">Save</BDropdownItem>
                        <BDropdownItem href="#">Forward</BDropdownItem>
                        <BDropdownItem href="#">Delete</BDropdownItem>
                      </BDropdown>
                    </div>
                  </div>
                </li>
              </ul>
            </simplebar>
          </div>
        </div>
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

.form-control-modern {
  border-radius: 12px;
  border: 2px solid #e0e7ff;
  padding: 0.9rem 1rem;
  width: 100%;
  transition: all 0.3s ease;
  background: #fff;
}

.form-control-modern:focus {
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
