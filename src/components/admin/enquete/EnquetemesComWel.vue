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
    simplebar,
    BDropdown,
    BDropdownItem,
  },
  data() {
    const orderData = ref([])
    const edit = ref(false)
    const editingSurvey = ref(null)
    const detail = ref(false)
    const listdetail = ref([])
    const store = useRegisterStore()
    const authStore = useAuthStore()
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
      route.push('/admin/enquetes-welcome/create')
    }
    const openEditModal = (survey) => {
      editingSurvey.value = { ...survey }
      store.setIdSurveyw(editingSurvey.value.id)
      route.push(`/admin/enquetes-welcome-modification/${editingSurvey.value.slug}`)
    }

    const openDetailModal = (survey) => {
      const id = survey ? survey.id : null

      route.push(`/admin/enquetes-details-bienvenue/${id}`)
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
  },
}
</script>

<template>
  <div class="modern-enquete-container">
    <BRow>
      <BCol cols="12">
        <div class="page-header">
          <div class="header-content">
            <h2 class="page-title">Enquêtes de Bienvenue</h2>
            <p class="page-subtitle">Créez et gérez vos enquêtes de bienvenue pour accueillir vos nouveaux utilisateurs</p>
          </div>
          <BButton variant="success" class="modern-create-btn" @click="creaOpenModal">
            <i class="bi bi-plus-circle me-2"></i>
            Créer une enquête
          </BButton>
        </div>

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

          <div v-if="loading" class="loading-state">
            <q-spinner-ball color="green" size="50px" />
            <p class="loading-text">Chargement des enquêtes...</p>
          </div>
          <div
            v-else-if="Array.isArray(orderData) && orderData.length === 0"
            class="empty-state"
          >
            <i class="bi bi-clipboard-data empty-icon"></i>
            <h4 class="empty-title">Aucune enquête trouvée</h4>
            <p class="empty-description">Commencez par créer votre première enquête de bienvenue</p>
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

            <template v-slot:cell(title)="data">
              <a href="#" class="text-body">{{ data.item.title }}</a>
            </template>

            <template v-slot:cell(bonusPoints)="data">
              <a href="#" class="text-success">{{ data.item.bonusPoints }} pts</a>
            </template>

            <template v-slot:cell(isActive)="data">
              <div
                class="badge badge-pill font-size-12"
                :class="{
                  'bg-soft-success': data.item.isActive === true,
                  'bg-soft-danger': data.item.isActive === false,
                }"
              >
                {{ data.item.isActive === true ? 'Activé' : 'Non Activé' }}
              </div>
            </template>

            <template v-slot:cell(displayOrder)="data">
              <span class="text-warning">
                <strong>{{ data.item.displayOrder }} position</strong>
              </span>
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
                    title="Voir les statistiques"
                  >
                    <i class="bi bi-eye" style="font-size: 18px"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-warning"
                    @click.prevent="openEditModal(data.item)"
                    title="Modifier"
                  >
                    <i class="uil uil-pen font-size-18"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-danger"
                    @click.prevent="deleteSurvey(data.item.id)"
                    title="Supprimer"
                  >
                    <i class="uil uil-trash-alt font-size-18"></i>
                  </a>
                </li>
              </ul>
            </template>
            </BTable>
          </div>

          <div class="pagination-container">
            <BPagination v-model="currentPage" :total-rows="rows" :per-page="perPage" class="modern-pagination" />
          </div>
        </div>
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
// Import des styles globaux qui incluent maintenant les styles modernes réutilisables
@import '../../../css/assets/scss/app2.scss';
@import '../../../css/admin/tables-shared.scss';
@import '../../../css/admin/surveys.scss';
@import '../../../css/admin/badges.scss';

// ✅ Tous les styles sont maintenant dans les fichiers SCSS partagés
</style>
