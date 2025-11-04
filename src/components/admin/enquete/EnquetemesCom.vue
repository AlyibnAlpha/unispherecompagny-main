<script>
import { chatData, chatMessagesData, groupData } from '../enquete/utils3.js'
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
        const role = authStore.roles[0]
        let response
        if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          response = await api.get('/surveys')
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          response = await api.get('/admin/surveys')
        }
        orderData.value = response.data.sort((a, b) => b.id - a.id)
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
            await api.delete(`/surveys/${surveyId}`)
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
      store.setIdSurvey(null)
      const role = authStore.roles[0]
      if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
        route.push('/admin/enquetes/create')
      } else if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
        route.push('/business/enquetes/create')
      }
    }
    const openEditModal = (survey) => {
      editingSurvey.value = { ...survey }
      store.setIdSurvey(editingSurvey.value.id.toString())
      setTimeout(() => {
        const role = authStore.roles[0]
        if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          route.push(`/admin/enquetes-modification/${editingSurvey.value.slug}`)
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          route.push(`/business/enquetes-modification/${editingSurvey.value.slug}`)
        }
      }, 500)
      this.activeTab = 1
      this.progressBarValue = 15
    }

    const openDetailModal = (survey) => {
      const id = survey ? survey.slug : null
      const role = authStore.roles[0]
      if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
        route.push(`/admin/enquetes-details/${id}`)
      } else if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
        route.push(`/business/enquetes-details/${id}`)
      }
    }

    // Vérifier si le sondage peut être modifié
    const canEditSurvey = (survey) => {
      // Ne peut pas modifier si le statut est 'closed'
      if (survey.status === 'closed') {
        return false
      }
      
      // Ne peut pas modifier si le sondage est publié et en cours
      if (survey.status === 'published' && survey.endDate) {
        const now = new Date()
        const endDate = new Date(survey.endDate)
        // Si la date de fin n'est pas encore passée, le sondage est en cours
        if (now <= endDate) {
          return false
        }
      }
      
      return true
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
      canEditSurvey,
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
          key: 'startDate',
          label: 'date de création',
          sortable: true,
        },
        {
          key: 'endDate',
          label: 'date de fin',
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
            <h2 class="page-title">Gestion des Enquêtes</h2>
            <p class="page-subtitle">Créez et gérez vos enquêtes en toute simplicité</p>
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
            <p class="empty-description">Commencez par créer votre première enquête</p>
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

            <template v-slot:cell(startDate)="data">
              <a href="#" class="text-body">{{
                new Date(data.item.startDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              }}</a>
            </template>
            <template v-slot:cell(endDate)="data">
              <a href="#" class="text-body">{{
                new Date(data.item.endDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              }}</a>
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
                    class="px-2"
                    :class="canEditSurvey(data.item) ? 'text-warning' : 'text-muted disabled-link'"
                    @click.prevent="canEditSurvey(data.item) && openEditModal(data.item)"
                    :title="canEditSurvey(data.item) ? 'Modifier' : 'Modification non autorisée (sondage en cours ou clos)'"
                    :style="{ cursor: canEditSurvey(data.item) ? 'pointer' : 'not-allowed', opacity: canEditSurvey(data.item) ? 1 : 0.5 }"
                  >
                    <i class="uil uil-pen font-size-18"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a
                    href="#"
                    class="px-2 text-primary"
                    @click.prevent="chat = !chat"
                    title="Chat IA"
                  >
                    <i class="bi bi-robot" style="font-size: 18px"></i>
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
// Import des styles globaux
@import '../../../css/assets/scss/app2.scss';
@import '../../../css/admin/tables-shared.scss';
@import '../../../css/admin/surveys.scss';
@import '../../../css/admin/badges.scss';

// ✅ Tous les styles sont maintenant dans les fichiers SCSS partagés
</style>
