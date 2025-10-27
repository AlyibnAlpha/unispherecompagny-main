<template>
  <div class="modern-admin-page">
    <!-- En-tête moderne -->
    <div class="section-header-modern mb-4">
      <div class="section-title-wrapper">
        <div class="section-icon-modern">
          <i class="bi bi-currency-exchange"></i>
        </div>
        <div class="section-title-content">
          <h3 class="section-title-modern">Transactions de Points</h3>
          <p class="section-subtitle-modern">Gérez et suivez toutes les transactions de points</p>
        </div>
      </div>
    </div>

    <!-- Section Transactions -->
    <div class="stats-group-card mb-4">
      <div class="stats-section-title mb-3">
        <i class="bi bi-currency-exchange me-2"></i>
        Transactions
      </div>
      <BRow class="g-3">
      <BCol cols="6" md="3">
        <div class="modern-stat-card stat-warning">
          <div class="stat-icon">
            <i class="bi bi-coin"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">
              <CountToComponent :startVal="0" :endVal="totaltransaction" :duration="2000" />
            </h3>
            <p class="stat-label">Transactions</p>
          </div>
        </div>
      </BCol>
      <BCol cols="6" md="3">
        <div class="modern-stat-card stat-success">
          <div class="stat-icon">
            <i class="bi bi-arrow-up-circle"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">
              <CountToComponent :startVal="0" :endVal="totalPointsAwarded" :duration="2000" />
            </h3>
            <p class="stat-label">Points crédités</p>
          </div>
        </div>
      </BCol>
      <BCol cols="6" md="3">
        <div class="modern-stat-card stat-danger">
          <div class="stat-icon">
            <i class="bi bi-arrow-down-circle"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">
              <CountToComponent :startVal="0" :endVal="totalPointsSpent" :duration="2000" />
            </h3>
            <p class="stat-label">Points débités</p>
          </div>
        </div>
      </BCol>
      <BCol cols="6" md="3">
        <div class="modern-stat-card stat-info">
          <div class="stat-icon">
            <i class="bi bi-wallet2"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">
              <CountToComponent :startVal="0" :endVal="netPoints" :duration="2000" />
            </h3>
            <p class="stat-label">Solde net</p>
          </div>
        </div>
      </BCol>
      </BRow>
    </div>

    <!-- Grille 2 colonnes pour les autres sections -->
    <BRow class="g-4">
      <!-- Colonne gauche -->
      <BCol md="6">
        <!-- Section Sondages -->
        <div class="stats-group-card mb-4">
          <div class="stats-section-title mb-3">
            <i class="bi bi-clipboard-check me-2"></i>
            Sondages
          </div>
          <BRow class="g-3">
            <BCol cols="6">
              <div class="modern-stat-card stat-warning">
                <div class="stat-icon">
                  <i class="bi bi-bookmark-check"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">
                    <CountToComponent :startVal="0" :endVal="surveyCounst" :duration="2000" />
                  </h3>
                  <p class="stat-label">Transactions</p>
                </div>
              </div>
            </BCol>
            <BCol cols="6">
              <div class="modern-stat-card stat-success">
                <div class="stat-icon">
                  <i class="bi bi-star-fill"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">
                    <CountToComponent :startVal="0" :endVal="surveytotalPoints" :duration="2000" />
                  </h3>
                  <p class="stat-label">Points attribués</p>
                </div>
              </div>
            </BCol>
          </BRow>
        </div>

        <!-- Section Bonus -->
        <div class="stats-group-card mb-4">
          <div class="stats-section-title mb-3">
            <i class="bi bi-star-fill me-2"></i>
            Bonus
          </div>
          <BRow class="g-3">
            <BCol cols="6">
              <div class="modern-stat-card stat-warning">
                <div class="stat-icon">
                  <i class="bi bi-cash-coin"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">
                    <CountToComponent :startVal="0" :endVal="leaderboard_bonuscount" :duration="2000" />
                  </h3>
                  <p class="stat-label">Transactions Bonus</p>
                </div>
              </div>
            </BCol>
            <BCol cols="6">
              <div class="modern-stat-card stat-success">
                <div class="stat-icon">
                  <i class="bi bi-trophy-fill"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">
                    <CountToComponent :startVal="0" :endVal="leaderboard_bonustotalPoints" :duration="2000" />
                  </h3>
                  <p class="stat-label">Points attribués</p>
                </div>
              </div>
            </BCol>
          </BRow>
        </div>

        <!-- Section Ajustements -->
        <div class="stats-group-card">
          <div class="stats-section-title mb-3">
            <i class="bi bi-sliders me-2"></i>
            Ajustements Admin
          </div>
          <BRow class="g-3">
            <BCol cols="6">
              <div class="modern-stat-card stat-warning">
                <div class="stat-icon">
                  <i class="bi bi-pie-chart"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">
                    <CountToComponent :startVal="0" :endVal="admin_adjustmentcount" :duration="2000" />
                  </h3>
                  <p class="stat-label">Ajustements manuels</p>
                </div>
              </div>
            </BCol>
            <BCol cols="6">
              <div class="modern-stat-card stat-success">
                <div class="stat-icon">
                  <i class="bi bi-check-circle-fill"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">
                    <CountToComponent :startVal="0" :endVal="admin_adjustmenttotalPoints" :duration="2000" />
                  </h3>
                  <p class="stat-label">Points attribués</p>
                </div>
              </div>
            </BCol>
          </BRow>
        </div>
      </BCol>

      <!-- Colonne droite -->
      <BCol md="6">
        <!-- Section Parrainage -->
        <div class="stats-group-card mb-4">
          <div class="stats-section-title mb-3">
            <i class="bi bi-people-fill me-2"></i>
            Parrainage
          </div>
          <BRow class="g-3">
            <BCol cols="6">
              <div class="modern-stat-card stat-warning">
                <div class="stat-icon">
                  <i class="bi bi-people"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">
                    <CountToComponent :startVal="0" :endVal="invitationcount" :duration="2000" />
                  </h3>
                  <p class="stat-label">Parrainages</p>
                </div>
              </div>
            </BCol>
            <BCol cols="6">
              <div class="modern-stat-card stat-success">
                <div class="stat-icon">
                  <i class="bi bi-gift-fill"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">
                    <CountToComponent :startVal="0" :endVal="invitationtotalPoints" :duration="2000" />
                  </h3>
                  <p class="stat-label">Points via invitations</p>
                </div>
              </div>
            </BCol>
          </BRow>
        </div>

        <!-- Section Récompenses -->
        <div class="stats-group-card">
          <div class="stats-section-title mb-3">
            <i class="bi bi-gift me-2"></i>
            Récompenses
          </div>
          <BRow class="g-3">
            <BCol cols="6">
              <div class="modern-stat-card stat-warning">
                <div class="stat-icon">
                  <i class="bi bi-trophy"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">
                    <CountToComponent :startVal="0" :endVal="redemptioncount" :duration="2000" />
                  </h3>
                  <p class="stat-label">Échanges de points</p>
                </div>
              </div>
            </BCol>
            <BCol cols="6">
              <div class="modern-stat-card stat-danger">
                <div class="stat-icon">
                  <i class="bi bi-bag-x-fill"></i>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">
                    <CountToComponent :startVal="0" :endVal="redemptiontotalPoints" :duration="2000" />
                  </h3>
                  <p class="stat-label">Points dépensés</p>
                </div>
              </div>
            </BCol>
          </BRow>
        </div>
      </BCol>
    </BRow>
    <BRow class="mt-4">
      <BCol cols="12">
        <div class="table-section-card">
          <!-- En-tête avec bouton -->
          <div class="table-header-section">
            <div class="table-title-group">
              <div class="table-icon-wrapper">
                <i class="bi bi-table"></i>
              </div>
              <div>
                <h4 class="table-main-title">Liste des Transactions</h4>
                <p class="table-subtitle">Gérez toutes les transactions de points</p>
              </div>
            </div>
            <BButton class="btn-create-modern" @click="ajout = true">
              <i class="bi bi-plus-circle me-2"></i>
              Créer une Transaction
            </BButton>
          </div>

          <!-- Contenu du tableau -->
          <div class="table-content-section">
        
        <q-dialog v-model="ajout" transition-show="scale" transition-hide="fade">
            <q-card class="modern-form-modal">
              <!-- Header moderne -->
              <div class="form-modal-header">
                <div class="form-modal-header-content">
                  <div class="form-modal-icon">
                    <i class="bi bi-plus-circle-fill"></i>
                  </div>
                  <div>
                    <h4 class="form-modal-title">Créer une Transaction</h4>
                    <p class="form-modal-subtitle">Ajouter une nouvelle transaction de points</p>
                  </div>
                </div>
                <button class="form-modal-close-btn" @click="ajout = false">
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>

              <!-- Formulaire -->
              <div class="form-modal-content">
                <BForm>
                  <BRow>
                    <!-- Participant -->
                    <BCol cols="12" class="mb-4 floating-label">
                      <Multiselect
                        id="st"
                        v-model="form.participant_id"
                        :options="optionl2"
                        :searchable="true"
                        :close-on-select="true"
                        :clear-on-select="false"
                        placeholder=" "
                        class="form-control-modern"
                      />
                      <label for="st">Participant</label>
                    </BCol>

                    <!-- Description -->
                    <BCol cols="12" class="mb-4 floating-label">
                      <textarea
                        id="desc"
                        v-model="form.description"
                        class="form-control form-control-modern"
                        rows="3"
                        placeholder=" "
                      ></textarea>
                      <label for="desc">Description</label>
                    </BCol>

                    <!-- Points -->
                    <BCol cols="12" class="mb-4 floating-label">
                      <input
                        class="form-control form-control-modern"
                        type="number"
                        id="publishCheck"
                        v-model="form.points"
                        placeholder=" "
                      />
                      <label for="publishCheck">Points requis</label>
                    </BCol>
                  </BRow>

                  <!-- Boutons -->
                  <div class="form-modal-actions">
                    <button type="button" class="btn-cancel-form" @click="ajout = false">
                      <i class="bi bi-x-circle me-2"></i>
                      Annuler
                    </button>
                    <button v-if="loadings" type="button" class="btn-submit-form" disabled>
                      <q-spinner-dots color="white" size="20px" />
                    </button>
                    <button v-else type="button" class="btn-submit-form" @click="Add">
                      <i class="bi bi-check-circle me-2"></i>
                      Enregistrer
                    </button>
                  </div>
                </BForm>
              </div>
            </q-card>
        </q-dialog>
        
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
          hover
          small
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
          <template v-slot:cell(source)="data">
            <a href="#" class="text-body">{{ data.item.source }}</a>
          </template>

          <template v-slot:cell(description)="data">
            <a href="#" class="text-warning">{{ truncate(data.item.description, 70) }}</a>
          </template>

          <template v-slot:cell(points)="data">
            <a href="#" class="text-body">{{ data.item.points }} Pts</a>
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
                  href="#"
                  class="px-2 text-warning"
                  @click.prevent="openEditModal(data.item)"
                  title="Modifier"
                >
                  <i class="uil uil-pen font-size-18"></i>
                </a>
              </li>
            </ul>
          </template>
        </BTable>
        <q-dialog v-model="edit" transition-show="scale" transition-hide="fade">
          <q-card class="modern-form-modal">
            <!-- Header moderne -->
            <div class="form-modal-header">
              <div class="form-modal-header-content">
                <div class="form-modal-icon form-modal-icon-edit">
                  <i class="bi bi-pencil-square"></i>
                </div>
                <div>
                  <h4 class="form-modal-title">Modifier la Transaction</h4>
                  <p class="form-modal-subtitle">Mettre à jour les informations</p>
                </div>
              </div>
              <button class="form-modal-close-btn" @click="edit = false">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <!-- Formulaire -->
            <div class="form-modal-content">
              <BForm>
                <BRow>
                  <!-- Description -->
                  <BCol cols="12" class="mb-4 floating-label">
                    <textarea
                      id="desc-edit"
                      v-model="formu.description"
                      class="form-control form-control-modern"
                      rows="3"
                      placeholder=" "
                    ></textarea>
                    <label for="desc-edit">Description</label>
                  </BCol>

                  <!-- Points -->
                  <BCol cols="12" class="mb-4 floating-label">
                    <input
                      class="form-control form-control-modern"
                      type="number"
                      id="points-edit"
                      v-model="formu.points"
                      placeholder=" "
                    />
                    <label for="points-edit">Points requis</label>
                  </BCol>
                </BRow>

                <!-- Boutons -->
                <div class="form-modal-actions">
                  <button type="button" class="btn-cancel-form" @click="edit = false">
                    <i class="bi bi-x-circle me-2"></i>
                    Annuler
                  </button>
                  <button v-if="loadings" type="button" class="btn-submit-form" disabled>
                    <q-spinner-dots color="white" size="20px" />
                  </button>
                  <button v-else type="button" class="btn-submit-form" @click="Edit">
                    <i class="bi bi-check-circle me-2"></i>
                    Enregistrer
                  </button>
                </div>
              </BForm>
            </div>
          </q-card>
        </q-dialog>
        <q-dialog v-model="opendMdet">
          <q-card class="modern-detail-modal">
            <!-- Header moderne -->
            <div class="modal-header-modern">
              <div class="modal-header-content">
                <div class="modal-icon-wrapper">
                  <i class="bi bi-info-circle"></i>
                </div>
                <div>
                  <h4 class="modal-title">Détails de la Transaction</h4>
                  <p class="modal-subtitle">Informations complètes</p>
                </div>
              </div>
              <button class="modal-close-btn" @click="opendMdet = false">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <!-- Contenu moderne -->
            <div class="modal-content-modern">
              <div class="info-cards-grid">
                <!-- Source -->
                <div class="info-card">
                  <div class="info-card-icon info-icon-orange">
                    <i class="bi bi-tag-fill"></i>
                  </div>
                  <div class="info-card-content">
                    <div class="info-card-label">Source</div>
                    <div class="info-card-badge badge-orange">
                      {{ selectedTask?.source }}
                    </div>
                  </div>
                </div>

                <!-- Points -->
                <div class="info-card">
                  <div class="info-card-icon info-icon-purple">
                    <i class="bi bi-coin"></i>
                  </div>
                  <div class="info-card-content">
                    <div class="info-card-label">Points</div>
                    <div class="info-card-value">{{ selectedTask?.points }} Pts</div>
                  </div>
                </div>

                <!-- Date -->
                <div class="info-card">
                  <div class="info-card-icon info-icon-blue">
                    <i class="bi bi-calendar-event"></i>
                  </div>
                  <div class="info-card-content">
                    <div class="info-card-label">Date de création</div>
                    <div class="info-card-value">
                      {{ new Date(selectedTask?.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) }}
                    </div>
                  </div>
                </div>

                <!-- Participant -->
                <div class="info-card info-card-full">
                  <div class="info-card-icon info-icon-green">
                    <i class="bi bi-person-fill"></i>
                  </div>
                  <div class="info-card-content">
                    <div class="info-card-label">Participant</div>
                    <div class="info-card-value">
                      {{ selectedTask?.participant.lastName }}
                      {{ selectedTask?.participant.firstName }}
                      <span class="age-badge">{{ getAge(selectedTask?.participant.birthDate) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="description-card">
                <div class="description-header">
                  <div class="description-icon">
                    <i class="bi bi-file-text"></i>
                  </div>
                  <div class="description-label">Description</div>
                </div>
                <p class="description-content">
                  {{ selectedTask?.description || 'Aucune description disponible' }}
                </p>
              </div>
            </div>
          </q-card>
        </q-dialog>
          </div>
          
          <!-- Pagination -->
          <div class="table-footer-section">
            <BPagination 
              v-model="currentPage" 
              :total-rows="rows" 
              :per-page="perPage"
              class="modern-pagination"
            />
          </div>
        </div>
      </BCol>
    </BRow>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue'
import {
  BRow,
  BCol,
  BFormInput,
  BPagination,
  BFormSelect,
  BTable,
  BButton,
} from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
import Multiselect from '@vueform/multiselect'
import { Notify } from 'quasar'
import Swal from 'sweetalert2'
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
    Multiselect,
    BButton,
    CountToComponent,
  },
  data() {
    const orderData = ref([])
    const orderDatas = ref([])
    const detailData = ref([])
    const ajout = ref(false)
    const edit = ref(false)
    const optionl = ref([])
    const loading = ref(false)
    const loadings = ref(false)
    const loadingx = ref(false)
    const optionl2 = ref([])
    const form = ref({
      participant_id: 0,
      description: '',
      points: 0,
    })
    const formu = ref({
      description: '',
      points: 0,
    })

    function truncate(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    }
    const getAge = (birthDateString) => {
      const birthDate = new Date(birthDateString)
      const today = new Date()

      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      // Vérifie si l'anniversaire n'est pas encore passé cette année
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      return `${age} ans`
    }

    const categories = async () => {
      try {
        loading.value = true
        const response = await api.get('/admin/dashboard/overview')

        optionl2.value = response.data.participant_profiles.map((item) => ({
          label: item.lastName + ',' + item.firstName,
          value: item.id,
        }))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        loading.value = false
      }
    }

    const gets = async () => {
      try {
        loading.value = true
        const response = await api.get('/admin/points-transactions')
        orderData.value = response.data.transactions
        const responses = await api.get('/admin/points-transactions/stats')
        orderDatas.value = responses.data
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }

    const Add = async () => {
      try {
        loadings.value = true
        if (!form.value.participant_id || !form.value.points) {
          Notify.create({
            type: 'warning',
            message: 'Veuillez remplir tous les champs obligatoires.',
            timeout: 3000,
          })

          return
        }
        await api.post('/admin/points-transactions/create', form.value)

        Swal.fire({
          icon: 'success',
          title: 'Enregistre avec success',
          showConfirmButton: true,
          timer: 2000,
        })
        form.value = {
          name: '',
          description: '',
          pointsRequired: 0,
        }
        gets()
      } catch (error) {
        console.error(error)
      } finally {
        loadings.value = false
        ajout.value = false
      }
    }

    const Edit = async () => {
      try {
        loadings.value = true
        await api.put(`/admin/points-transaction/${formu.value.id}/edit`, formu.value)
        Swal.fire({
          icon: 'success',
          title: 'Enregistre avec success',
          showConfirmButton: true,
          timer: 2000,
        })
        edit.value = false
        gets()
      } catch (error) {
        console.error(error)
      } finally {
        loadings.value = false
      }
    }
    const openEditModal = (survey) => {
      formu.value = { ...survey }
      setTimeout(() => {
        edit.value = true
      }, 500)
      this.activeTab = 1
      this.progressBarValue = 15
    }

    const selectedTask = ref(null)
    const opendMdet = ref(false)

    const openDetailModal = async (index) => {
      const response = await api.get(`/admin/points-transactions/${index}`)
      selectedTask.value = response.data
      opendMdet.value = true
    }

    onMounted(() => {
      categories()
      gets()
    })
    return {
      getAge,
      openDetailModal,
      selectedTask,
      opendMdet,
      truncate,
      Add,
      Edit,
      openEditModal,
      orderDatas,
      form,
      formu,
      optionl2,
      activeTabss: 0,
      ajout,
      edit,
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
          key: 'source',
          label: 'Source',
          sortable: true,
        },

        {
          key: 'description',
          label: 'Description',
        },
        {
          key: 'points',
          label: 'Points',
          sortable: true,
        },
        {
          key: 'createdAt',
          label: 'Date de création',
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
    totaltransaction() {
      return this.orderDatas.totalTransactions
    },
    totalPointsAwarded() {
      return this.orderDatas.totalPointsAwarded
    },
    totalPointsSpent() {
      return this.orderDatas.totalPointsSpent
    },
    netPoints() {
      return this.orderDatas.netPoints
    },
    surveyCounst() {
      return this.orderDatas.statsBySource?.survey?.count
    },
    surveytotalPoints() {
      return this.orderDatas.statsBySource?.survey?.totalPoints
    },
    invitationcount() {
      return this.orderDatas.statsBySource?.invitation?.count
    },
    invitationtotalPoints() {
      return this.orderDatas.statsBySource?.invitation?.totalPoints
    },
    leaderboard_bonuscount() {
      return this.orderDatas.statsBySource?.leaderboard_bonus?.count
    },
    leaderboard_bonustotalPoints() {
      return this.orderDatas.statsBySource?.leaderboard_bonus?.totalPoints
    },
    redemptioncount() {
      return this.orderDatas.statsBySource?.redemption?.count
    },
    redemptiontotalPoints() {
      return this.orderDatas.statsBySource?.redemption?.totalPoints
    },
    admin_adjustmentcount() {
      return this.orderDatas.statsBySource?.admin_adjustment?.count
    },
    admin_adjustmenttotalPoints() {
      return this.orderDatas.statsBySource?.admin_adjustment?.totalPoints
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
<style lang="scss">
@import '../../../css/assets/scss/app2.scss';

/* === Page moderne === */
.modern-admin-page {
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* === En-tête de section moderne === */
.section-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  .section-title-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;

    .section-icon-modern {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.8rem;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .section-title-content {
      .section-title-modern {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .section-subtitle-modern {
        font-size: 0.95rem;
        color: #64748b;
        margin: 0;
        font-weight: 500;
      }
    }
  }

  .btn-add-gradient {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-weight: 700;
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
      background: linear-gradient(135deg, #764ba2, #667eea);
    }

    &:active {
      transform: translateY(0);
    }

    i {
      font-size: 1.1rem;
    }
  }
}

/* === Section tableau moderne === */
.table-section-card {
  background: white;
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 2px solid #f1f5f9;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
}

.table-header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  border-bottom: 2px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 1rem;

  .table-title-group {
    display: flex;
    align-items: center;
    gap: 1rem;

    .table-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .table-main-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
      line-height: 1.2;
    }

    .table-subtitle {
      font-size: 0.85rem;
      color: #64748b;
      margin: 0.25rem 0 0 0;
    }
  }
}

.btn-create-modern {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  border: none !important;
  color: white !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
  transition: all 0.3s ease !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
  }

  &:active {
    transform: translateY(0) !important;
  }

  i {
    font-size: 1.1rem;
  }
}

.table-content-section {
  padding: 1.5rem;
}

.table-footer-section {
  padding: 1.25rem 1.5rem;
  background: #fafbfc;
  border-top: 2px solid #f1f5f9;
  display: flex;
  justify-content: center;

  .modern-pagination {
    margin: 0;
    
    .page-item {
      margin: 0 0.25rem;

      .page-link {
        border-radius: 8px;
        border: 2px solid #e2e8f0;
        color: #64748b;
        font-weight: 600;
        padding: 0.5rem 0.75rem;
        transition: all 0.2s ease;

        &:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #475569;
        }
      }

      &.active .page-link {
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-color: #667eea;
        color: white;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      }
    }
  }
}

/* === Cartes de groupe === */
.stats-group-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 2px solid #f1f5f9;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
}

/* === Titres de sections === */
.stats-section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  padding-left: 0.75rem;
  border-left: 4px solid #667eea;
  
  i {
    color: #667eea;
  }
}

/* === Cartes de statistiques modernes === */
.modern-stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #667eea, #764ba2);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

    &::before {
      opacity: 1;
    }

    .stat-icon {
      transform: scale(1.1) rotate(5deg);
    }
  }

  .stat-icon {
    width: 64px;
    height: 64px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    color: white;
    flex-shrink: 0;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .stat-content {
    flex: 1;

    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      line-height: 1;
      margin: 0 0 0.5rem 0;
      color: #1e293b;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 600;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  &.stat-warning {
    .stat-icon {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
    }

    &:hover {
      border-color: #fef3c7;
      background: linear-gradient(135deg, #ffffff, #fffbeb);
    }
  }

  &.stat-success {
    .stat-icon {
      background: linear-gradient(135deg, #34d399, #10b981);
    }

    &:hover {
      border-color: #d1fae5;
      background: linear-gradient(135deg, #ffffff, #f0fdf4);
    }
  }

  &.stat-danger {
    .stat-icon {
      background: linear-gradient(135deg, #f87171, #ef4444);
    }

    &:hover {
      border-color: #fecaca;
      background: linear-gradient(135deg, #ffffff, #fef2f2);
    }
  }

  &.stat-info {
    .stat-icon {
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
    }

    &:hover {
      border-color: #dbeafe;
      background: linear-gradient(135deg, #ffffff, #eff6ff);
    }
  }
}

/* === Modaux modernes (pour SubscriptionCom) === */
.modern-dialog-card {
  width: 70vw !important;
  max-width: 1300px !important;
  margin: 20px auto;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modern-dialog-details {
  max-height: 90vh;
  overflow-y: auto;
}

.modern-dialog-details-small {
  width: 55vw !important;
  max-width: 900px !important;
}

.modern-dialog-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: none;

  .dialog-header-content {
    display: flex;
    align-items: center;
    gap: 1rem;

    .dialog-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      backdrop-filter: blur(10px);
    }

    .dialog-title-wrapper {
      .dialog-title {
        font-size: 1.3rem;
        font-weight: 700;
        color: white;
        margin: 0;
        line-height: 1.2;
      }

      .dialog-subtitle {
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.8);
        margin: 0.25rem 0 0 0;
      }
    }
  }

  .dialog-close-btn {
    background: rgba(255, 255, 255, 0.2) !important;
    color: white !important;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.3) !important;
    }
  }
}

.detail-stats-grid-modal {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.detail-stat-card {
  background: white;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .stat-card-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  &.stat-card-warning .stat-card-icon {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
  }

  &.stat-card-success .stat-card-icon {
    background: linear-gradient(135deg, #34d399, #10b981);
  }

  &.stat-card-info .stat-card-icon {
    background: linear-gradient(135deg, #60a5fa, #3b82f6);
  }

  .stat-card-content {
    flex: 1;

    .stat-card-value {
      font-size: 1.3rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.25rem 0;
      line-height: 1.2;
    }

    .stat-card-label {
      font-size: 0.7rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }
  }
}

.section-subtitle-info {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  i {
    color: #667eea;
  }
}

.info-grid-modern {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.info-card-modern {
  background: white;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e2e8f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .info-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .info-content {
    flex: 1;

    .info-label {
      font-size: 0.7rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.5rem;
    }

    .info-value {
      font-size: 0.85rem;
      font-weight: 600;
      color: #1e293b;
      line-height: 1.4;
    }
  }
}

/* === Modals de formulaire === */
.modern-form-modal {
  width: 700px;
  max-width: 90vw;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  background: white;
}

.form-modal-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .form-modal-header-content {
    display: flex;
    align-items: center;
    gap: 1rem;

    .form-modal-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      backdrop-filter: blur(10px);

      &.form-modal-icon-edit {
        background: rgba(255, 193, 7, 0.3);
      }
    }

    .form-modal-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: white;
      margin: 0;
      line-height: 1.2;
    }

    .form-modal-subtitle {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0.25rem 0 0 0;
    }
  }

  .form-modal-close-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    i {
      font-size: 1rem;
    }
  }
}

.form-modal-content {
  padding: 2rem;
  background: #f8fafc;
}

.form-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
}

.btn-cancel-form {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #475569;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  i {
    font-size: 1.1rem;
  }
}

.btn-submit-form {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  i {
    font-size: 1.1rem;
  }
}

/* === Modal de détail moderne (AdTranscCom) === */
.modern-detail-modal {
  width: 60vw !important;
  max-width: 950px !important;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  background: white;

  @media (max-width: 768px) {
    width: 90vw !important;
  }
}

.modal-header-modern {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .modal-header-content {
    display: flex;
    align-items: center;
    gap: 1rem;

    .modal-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      backdrop-filter: blur(10px);
    }

    .modal-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: white;
      margin: 0;
      line-height: 1.2;
    }

    .modal-subtitle {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0.25rem 0 0 0;
    }
  }

  .modal-close-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    i {
      font-size: 1rem;
    }
  }
}

.modal-content-modern {
  padding: 1.5rem;
}

.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-card {
  background: white;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  &.info-card-full {
    grid-column: 1 / -1;
  }

  .info-card-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
    flex-shrink: 0;

    &.info-icon-orange {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
    }

    &.info-icon-purple {
      background: linear-gradient(135deg, #a78bfa, #8b5cf6);
    }

    &.info-icon-blue {
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
    }

    &.info-icon-green {
      background: linear-gradient(135deg, #34d399, #10b981);
    }
  }

  .info-card-content {
    flex: 1;

    .info-card-label {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.5rem;
    }

    .info-card-value {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.3;

      .age-badge {
        display: inline-block;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-left: 0.5rem;
      }
    }

    .info-card-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;

      &.badge-orange {
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        color: #92400e;
        border: 2px solid #fbbf24;
      }
    }
  }
}

.description-card {
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  padding: 1.25rem;

  .description-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;

    .description-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.1rem;
    }

    .description-label {
      font-size: 0.9rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  .description-content {
    font-size: 1rem;
    color: #475569;
    line-height: 1.6;
    margin: 0;
    padding-left: 3rem;
  }
}

/* Header */
.dialog-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
}

/* Grid d'infos */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 20px;
}

.info-box {
  display: flex;
  align-items: flex-start;
  padding: 14px;
  border-radius: 12px;
  background: #f9fafc;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.08);
  transition: all 0.2s ease;
}

.info-box:hover {
  background: #eef2ff;
  transform: translateY(-2px);
}

.label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4b5563;
}
.value {
  font-size: 0.95rem;
  color: #111827;
}

/* Description */
.description-box {
  margin-top: 16px;
  padding: 16px;
  border-radius: 12px;
  background: #f0f9ff;
  display: flex;
  align-items: flex-start;
}

.description-text {
  margin: 4px 0 0;
  color: #374151;
  font-size: 0.95rem;
  line-height: 1.4;
}
.stat-card {
  transition: all 0.4s ease-in-out;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #fdfdfd, #f5f5f5);
  position: relative;
  overflow: hidden;
}
.stat-card:hover {
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
