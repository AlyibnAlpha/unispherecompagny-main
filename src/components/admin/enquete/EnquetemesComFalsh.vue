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
  BForm,
} from 'bootstrap-vue-next'
import Multiselect from '@vueform/multiselect'
import { api } from 'src/boot/axios'
import Swal from 'sweetalert2'
import { useAuthStore } from 'src/stores/auth'
import { Notify } from 'quasar'
import CountToComponent from 'src/components/common/CountToComponent.vue'
import ApexCharts from 'vue3-apexcharts'
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
    CountToComponent,
    apexchart: ApexCharts,
  },
  data() {
    const orderData = ref([])
    const ajout = ref(false)
    const apep = ref(false)
    const part = ref([])
    const optionss = ref([])
    const auth = useAuthStore()
    const loading = ref(false)
    const loadings = ref(false)
    const expired = ref(false)
    let idCounter = 1
    let idCounterch = 1
    const authStore = useAuthStore()
    const form = ref({
      id: idCounter,
      question: '',
      type: '',
      targetGroupId: '',
      expiresAt: '',
      choices: [{ id: 1, label: '', value: '' }],
      isNew: true,
    })
    const options = [
      {
        label: 'Par Oui ou Non',
        value: 'OUI_NON',
      },

      {
        label: 'Par Choix Multiple',
        value: 'CHOIX_MULTIPLE',
      },
    ]

    const gets = async () => {
      try {
        loading.value = true
        const role = authStore.roles[0]
        if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          const responses = await api.get('/business/flash-surveys')
          const response = await api.get('/business/dashboard/overview')
          orderData.value = responses.data.sort((a, b) => b.id - a.id)

          optionss.value = response.data.participants_groups.map((item) => ({
            label: item.name,
            value: item.id,
          }))
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          const responses = await api.get('/admin/flash-surveys')
          const response = await api.get('/admin/dashboard/overview')
          orderData.value = responses.data.sort((a, b) => b.id - a.id)
          optionss.value = response.data.participants_groups.map((item) => ({
            label: item.name,
            value: item.id,
          }))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        loading.value = false
      }
    }
    const formu = ref({
      id: idCounterch,
      question: '',
      type: '',
      targetGroupId: '',
      expiresAt: '',

      choices: [{ id: 1, label: '', value: '' }],
      isNew: true,
    })
    const AddFormDataM = () => {
      form.value.choices.push({
        id: idCounterch++,
        label: '',
        value: '',
        isNew: true,
      })
    }
    const AddFormDataMU = () => {
      formu.value.choices.push({
        id: idCounterch++,
        label: '',
        value: '',
        isNew: true,
      })
    }
    const edit = ref(false)
    const editingSurvey = ref(null)
    const onpenCreate = async () => {
      const role = authStore.roles[0]
      if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
        const response = await api.get('/business/subscription/status')
        if (response.data.status === 'expired') {
          expired.value = true
          Notify.create({
            type: 'warning',
            message: 'Votre compte est expiré.Veillez vous souscrire',
            timeout: 5000,
          })
        } else {
          ajout.value = true
        }
      } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
        ajout.value = true
      }
    }

    const Add = async () => {
      const role = auth.roles[0]
      const newItems = {
        question: form.value.question,
        type: form.value.type,
        targetGroupId: form.value.targetGroupId,
        expiresAt: form.value.expiresAt,
        choices: form.value.choices.map((choice) => choice.value),
      }
      if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
        try {
          if (
            !newItems.question ||
            !newItems.type ||
            !newItems.targetGroupId ||
            !newItems.expiresAt ||
            !newItems.choices
          ) {
            Notify.create({
              type: 'warning',
              message: 'Veuillez remplir tous les champs obligatoires.',
              timeout: 3000,
            })

            return
          }
          loadings.value = false
          const response = await api.post('/admin/flash-surveys', newItems)
          const surveyId = response.data.id
          await api.post(`/business/flash-surveys/${surveyId}/publish`, {
            survey_id: surveyId,
            participantGroups: part.value,
          })
        } catch (error) {
          console.error(error)
        } finally {
          loadings.value = false
          gets()
          Swal.fire({
            icon: 'success',
            title: 'Enregistre avec success',
            showConfirmButton: true,
            timer: 2000,
          })
          ajout.value = false
        }
      } else if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
        try {
          if (
            !newItems.question ||
            !newItems.type ||
            !newItems.targetGroupId ||
            !newItems.expiresAt ||
            !newItems.choices
          ) {
            Notify.create({
              type: 'warning',
              message: 'Veuillez remplir tous les champs obligatoires.',
              timeout: 3000,
            })

            return
          }
          loadings.value = true
          const response = await api.post('/business/flash-surveys', newItems)
          const surveyId = response.data.id
          await api.post(`/business/flash-surveys/${surveyId}/publish`, {
            survey_id: surveyId,
            participantGroups: part.value,
          })
        } catch (error) {
          Notify.create({
            type: 'negative',
            message: error.response.data.message,
            timeout: 5000,
          })
        } finally {
          loadings.value = false
          gets()
          Swal.fire({
            icon: 'success',
            title: 'Enregistre avec success',
            showConfirmButton: true,
            timer: 2000,
          })
          ajout.value = false
        }
      }
    }

    const Edit = async () => {
      try {
        const role = auth.roles[0]
        if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          loadings.value = true
          await api.put(`/participants-groups/${formu.value.id}`, formu.value)
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          loadings.value = true
          await api.put(`/participants-groups/${formu.value.id}`, formu.value)
        }
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.response.data.message,
          timeout: 5000,
        })
      } finally {
        gets()
        Swal.fire({
          icon: 'success',
          title: 'Enregistre avec success',
          showConfirmButton: true,
          timer: 2000,
        })
        edit.value = false
      }
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

    const deleteRow = (index) => {
      form.value.choices.splice(index, 1)
    }

    const deleteRowU = (index) => {
      formu.value.choices.splice(index, 1)
    }
    const deleteRows = (index) => {
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
        deleteRows
        if (result.value) {
          try {
            const role = auth.roles[0]
            if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
              await api.delete(`/business/flash-surveys/${index}`)
              gets()
              Swal.fire('Deleted!', 'Le participants a été supprimer avec success.', 'success')
            } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
              await api.delete(`/admin/flash-surveys/${index}`)
              gets()
              Swal.fire('Deleted!', 'Le participants a été supprimer avec success.', 'success')
            }
          } catch (error) {
            Notify.create({
              type: 'negative',
              message: error.response.data.message,
              timeout: 5000,
            })
          }
        }
      })
    }
    const selectedTask = ref(null)
    const opendMdet = ref(false)
    const loadingx = ref(false)
    const openDetailModal = async (index) => {
      try {
        const role = auth.roles[0]
        let response
        if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          loadingx.value = true
          opendMdet.value = true
          response = await api.get(`/business/flash-surveys/${index}`)
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          loadingx.value = true
          opendMdet.value = true
          response = await api.get(`/admin/flash-surveys/${index}`)
        }
        selectedTask.value = response.data
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.response.data.message,
          timeout: 5000,
        })
        Notify
      } finally {
        loadingx.value = false
      }
    }
    const stats = computed(() => {
      const oui = selectedTask.value?.flashSurveyResponses.filter((r) => r.reponse === 'oui').length
      const non = selectedTask.value?.flashSurveyResponses.filter((r) => r.reponse === 'non').length
      return { oui, non }
    })
    const statsMultiple = computed(() => {
      const counts = {}
      selectedTask.value?.choices.forEach((choice) => {
        counts[choice.label] = 0
      })

      selectedTask.value?.flashSurveyResponses.forEach((resp) => {
        resp.selected.forEach((idChoix) => {
          const choix = selectedTask.value?.choices.find((c) => c.id === idChoix)
          if (choix) counts[choix.label]++
        })
      })

      return counts
    })

    const pieOptions = ref({
      labels: Object.keys(statsMultiple.value),
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    })

    const barOptions = ref({
      chart: { type: 'bar', toolbar: { show: false } },

      xaxis: { categories: Object.keys(statsMultiple.value) },
      dataLabels: {
        enabled: true,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
        },
      },
    })

    const chartOptions = ref({
      chart: {
        type: 'pie',
      },
      labels: ['Oui', 'Non'],
      colors: ['#28a745', '#dc3545'], // vert = oui, rouge = non
    })

    const Active = async (id) => {
      try {
        const role = auth.roles[0]
        if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
          loading.value = true
          await api.post(`/business/flash-surveys/${id}/publish`)
          gets()
          Swal.fire({
            icon: 'success',
            title: 'Enregistre avec success',
            showConfirmButton: true,
            timer: 2000,
          })
        } else if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
          loading.value = true
          await api.post(`/admin/flash-surveys/${id}/publish`)
          gets()
          Swal.fire({
            icon: 'success',
            title: 'Enregistre avec success',
            showConfirmButton: true,
            timer: 2000,
          })
        }
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.response.data.message,
          timeout: 5000,
        })
      } finally {
        loading.value = false
      }
    }
    onMounted(() => {
      gets()
    })
    return {
      Active,
      pieOptions,
      barOptions,
      statsMultiple,
      stats,
      chartOptions,
      loadingx,
      selectedTask,
      opendMdet,
      options,
      optionss,
      orderData,
      part,
      ajout,
      apep,
      openEditModal,
      canEditSurvey,
      Add,
      Edit,
      deleteRowU,
      deleteRow,
      onpenCreate,
      form,
      openDetailModal,
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
      AddFormDataM,
      AddFormDataMU,
      deleteRows,
      chat: ref(false),
      fields: [
        {
          key: 'check',
          label: '',
        },

        {
          key: 'question',
          label: 'Titre de la question',
          sortable: true,
        },
        {
          key: 'type',
          label: 'Type de question',
          sortable: true,
        },

        {
          key: 'expiresAt',
          label: "Date d'expiration",
          sortable: true,
        },
        {
          key: 'status',
          label: 'Status',
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
    totalReponse() {
      return this.selectedTask?.flashSurveyResponses.length
    },
    totaloui() {
      return this.selectedTask?.flashSurveyResponses.filter((r) => r.reponse === 'oui').length
    },
    totalNon() {
      return this.selectedTask?.flashSurveyResponses.filter((r) => r.reponse === 'non').length
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
        <div class="page-header">
          <div class="header-content">
            <h2 class="page-title">Sondages Flash</h2>
            <p class="page-subtitle">Créez et gérez vos sondages rapides</p>
          </div>
          <BButton class="modern-create-btn" @click="onpenCreate">
            <i class="bi bi-plus-circle me-2"></i>
            Créer un sondage rapide
          </BButton>

          <q-dialog v-model="ajout" transition-show="scale" transition-hide="fade">
            <q-card class="modern-modal-card">
              <!-- Header -->
              <q-card-section class="dialog-header row items-center">
                <div class="header-text q-ml-md">
                  <div class="name">Nouveau Sondage Flash</div>
                  <div class="subtitle">Créez un sondage rapide pour vos participants</div>
                </div>
                <q-space />
              </q-card-section>

              <!-- Formulaire -->
              <q-card-section class="modal-form-section">
                <BForm>
                  <BRow>
                    <BCol cols="12">
                      <!-- Question -->
                      <BCol cols="12" class="mb-4 floating-label">
                        <input
                          id="title"
                          v-model="form.question"
                          type="text"
                          class="w-100 form-control-modern"
                          placeholder=" "
                        />
                        <label for="title">Titre de la question</label>
                      </BCol>

                      <!-- Date -->
                      <BCol cols="12" class="mb-4 floating-label">
                        <input
                          id="dateexp"
                          type="date"
                          v-model="form.expiresAt"
                          class="w-100 form-control-modern"
                          placeholder=" "
                        />
                        <label for="dateexp">Date d'expiration</label>
                      </BCol>

                      <!-- Type de réponse -->
                      <BCol class="mb-4 floating-label mt-3">
                        <Multiselect
                          id="st"
                          v-model="form.type"
                          :options="options"
                          placeholder="Choisir un type"
                          class="form-control-modern"
                        />
                        <label for="st">Type de réponses</label>
                      </BCol>

                      <!-- Choix multiples -->
                      <BCol v-if="form.type === 'CHOIX_MULTIPLE'" lg="12" class="mb-3">
                        <label class="form-label fw-semibold mb-3">
                          <i class="bi bi-list-ul me-2"></i>
                          Options de réponses
                        </label>
                        <div class="options-list">
                          <div v-for="(option, indexs) in form.choices" :key="indexs" class="option-item mb-3">
                            <div class="option-input-wrapper">
                              <span class="option-number">{{ indexs + 1 }}</span>
                              <input
                                type="text"
                                v-model="option.value"
                                placeholder="Entrez une option de réponse"
                                class="form-control-modern"
                              />
                            </div>
                            <div class="option-actions">
                              <button class="btn-add-option" @click="AddFormDataM(indexs)" title="Ajouter une option">
                                <i class="bi bi-plus-circle"></i>
                              </button>
                              <button class="btn-delete-option" @click="deleteRow(indexs)" title="Supprimer cette option">
                                <i class="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </BCol>

                      <!-- Groupe cible -->
                      <BCol cols="12" class="mb-4 floating-label">
                        <Multiselect
                          id="sel"
                          v-model="form.targetGroupId"
                          :options="optionss"
                          :searchable="true"
                          :close-on-select="true"
                          :clear-on-select="false"
                          placeholder="Choisissez les participants"
                          class="form-control-modern"
                        />
                        <label for="sel">Participants à cibler</label>
                      </BCol>
                    </BCol>
                  </BRow>

                  <!-- Bouton -->
                  <div class="d-flex justify-content-end mt-5 gap-2">
                    <BButton class="btn-modern btn-secondary-modern" @click="ajout = false">
                      <i class="bi bi-x-circle me-2"></i>
                      Annuler
                    </BButton>
                    <BButton v-if="loadings" class="btn-modern btn-success-modern" disabled>
                      <q-spinner-dots color="white" size="20px" class="me-2" />
                      Enregistrement...
                    </BButton>
                    <BButton v-else class="btn-modern btn-success-modern" @click="Add">
                      <i class="bi bi-check-circle me-2"></i>
                      Enregistrer
                    </BButton>
                  </div>
                </BForm>
              </q-card-section>
            </q-card>
          </q-dialog>
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

            <template v-slot:cell(question)="data">
              <a href="#" class="text-body">{{ data.item.question }}</a>
            </template>

            <template v-slot:cell(type)="data">
              <a href="#" class="text-body">{{ data.item.type }}</a>
            </template>
            <template v-slot:cell(expiresAt)="data">
              <a href="#" class="text-body">{{
                new Date(data.item.expiresAt).toLocaleDateString('fr-FR', {
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
                <li class="list-inline-item" v-if="data.item.status !== 'published'">
                  <a
                    href="#"
                    class="px-2 text-success"
                    @click.prevent="Active(data.item.id)"
                    title="Publiée"
                  >
                    <i class="uil uil-check font-size-18"></i>
                  </a>
                </li>
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
                    class="px-2 text-danger"
                    @click.prevent="deleteRows(data.item.id)"
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
    <q-dialog v-model="edit" transition-show="scale" transition-hide="fade">
      <q-card class="modern-modal-card">
        <!-- Header -->
        <q-card-section class="dialog-header row items-center">
          <div class="header-text q-ml-md">
            <div class="name">Modifier le Sondage</div>
            <div class="subtitle">Mettez à jour les informations du sondage</div>
          </div>
          <q-space />
        </q-card-section>

        <!-- Formulaire -->
        <q-card-section class="modal-form-section">
          <BForm>
            <BRow>
              <BCol cols="12">
                <!-- Question -->
                <BCol cols="12" class="mb-4 floating-label">
                  <input
                    id="title"
                    v-model="formu.question"
                    type="text"
                    class="w-100 form-control-modern"
                    placeholder=" "
                  />
                  <label for="title">Titre de la question</label>
                </BCol>

                <!-- Date -->
                <BCol cols="12" class="mb-4 floating-label">
                  <input
                    id="dateexp"
                    type="date"
                    v-model="formu.expiresAt"
                    class="w-100 form-control-modern"
                    placeholder=" "
                  />
                  <label for="dateexp">Date d'expiration</label>
                </BCol>

                <!-- Type de réponse -->
                <BCol class="mb-4 floating-label mt-3">
                  <Multiselect
                    id="st"
                    v-model="formu.type"
                    :options="options"
                    placeholder="Choisir un type"
                    class="form-control-modern"
                  />
                  <label for="st">Type de réponses</label>
                </BCol>

                <!-- Choix multiples -->
                <BCol v-if="formu.type === 'CHOIX_MULTIPLE'" lg="12" class="mb-3">
                  <label class="form-label fw-semibold mb-3">
                    <i class="bi bi-list-ul me-2"></i>
                    Options de réponses
                  </label>
                  <div class="options-list">
                    <div v-for="(option, indexs) in formu.choices" :key="indexs" class="option-item mb-3">
                      <div class="option-input-wrapper">
                        <span class="option-number">{{ indexs + 1 }}</span>
                        <input
                          type="text"
                          v-model="option.value"
                          placeholder="Entrez une option de réponse"
                          class="form-control-modern"
                        />
                      </div>
                      <div class="option-actions">
                        <button class="btn-add-option" @click="AddFormDataMU(indexs)" title="Ajouter une option">
                          <i class="bi bi-plus-circle"></i>
                        </button>
                        <button class="btn-delete-option" @click="deleteRowU(indexs)" title="Supprimer cette option">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </BCol>

                <!-- Groupe cible -->
                <BCol cols="12" class="mb-4 floating-label">
                  <Multiselect
                    id="sel"
                    v-model="formu.targetGroupId"
                    :options="optionss"
                    placeholder="Choisissez les participants"
                    class="form-control-modern"
                  />
                  <label for="sel">Participants à cibler</label>
                </BCol>
              </BCol>
            </BRow>

            <!-- Bouton -->
            <div class="d-flex justify-content-end mt-5 gap-2">
              <BButton class="btn-modern btn-secondary-modern" @click="edit = false">
                <i class="bi bi-x-circle me-2"></i>
                Annuler
              </BButton>
              <BButton v-if="loadings" class="btn-modern btn-success-modern" disabled>
                <q-spinner-dots color="white" size="20px" class="me-2" />
                Enregistrement...
              </BButton>
              <BButton v-else class="btn-modern btn-success-modern" @click="Edit">
                <i class="bi bi-check-circle me-2"></i>
                Enregistrer
              </BButton>
            </div>
          </BForm>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="opendMdet">
      <q-card class="modern-modal-card">
        <!-- Header -->
        <q-card-section class="dialog-header row items-center">
          <div class="header-text q-ml-md">
            <div v-if="loadingx" class="skeleton skeleton-title"></div>
            <div v-else class="name">{{ selectedTask?.question }}</div>
            <div class="subtitle">Détails du sondage flash</div>
          </div>
          <q-space />
        </q-card-section>

        <q-separator />
        
        <!-- Stats Section -->
        <q-card-section class="modal-stats-section">
          <div class="modal-stats-grid">
            <div class="modal-stat-card modal-stat-success">
              <div class="modal-stat-icon">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              <div class="modal-stat-content">
                <div v-if="loadingx" class="skeleton skeleton-title"></div>
                <div v-else class="modal-stat-value">
                  <CountToComponent :startVal="0" :endVal="totalReponse" :duration="2000" />
                </div>
                <div class="modal-stat-label">Réponses</div>
              </div>
            </div>

            <div class="modal-stat-card modal-stat-info">
              <div class="modal-stat-icon">
                <i class="bi bi-calendar-event"></i>
              </div>
              <div class="modal-stat-content">
                <div v-if="loadingx" class="skeleton skeleton-title"></div>
                <div v-else class="modal-stat-value" style="font-size: 1.2rem;">
                  {{ selectedTask?.type }}
                </div>
                <div class="modal-stat-label">Type</div>
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- Content Section -->
        <q-card-section class="dialog-content">
          <!-- Créateur -->
          <div v-if="selectedTask?.createdByBusiness" class="info-card">
            <img
              :src="`https://ui-avatars.com/api/?name=${selectedTask?.createdByBusiness?.firstName}+${selectedTask?.createdByBusiness?.lastName}&background=667eea`"
              alt="Avatar"
              class="rounded-circle"
              style="width: 40px; height: 40px; margin-right: 15px;"
            />
            <div class="info-text">
              <div class="label">Créé par (Business)</div>
              <div class="value">
                {{ selectedTask?.createdByBusiness?.firstName }}
                {{ selectedTask?.createdByBusiness?.lastName }}
              </div>
              <div style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">
                <i class="bi bi-building me-1"></i>
                {{ selectedTask?.createdByBusiness?.companyName }}
              </div>
            </div>
          </div>

          <div v-if="selectedTask?.createdByAdmin" class="info-card">
            <img
              :src="`https://ui-avatars.com/api/?name=${selectedTask?.createdByAdmin?.firstName}+${selectedTask?.createdByAdmin?.lastName}&background=667eea`"
              alt="Avatar"
              class="rounded-circle"
              style="width: 40px; height: 40px; margin-right: 15px;"
            />
            <div class="info-text">
              <div class="label">Créé par (Admin)</div>
              <div class="value">
                {{ selectedTask?.createdByAdmin?.firstName }}
                {{ selectedTask?.createdByAdmin?.lastName }}
              </div>
              <div style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">
                <i class="bi bi-people me-1"></i>
                Groupe: {{ selectedTask?.targetGroup?.name }}
              </div>
            </div>
          </div>

          <div class="info-card">
            <q-icon name="calendar_today" size="20px" class="icon" />
            <div class="info-text">
              <div class="label">Date d'expiration</div>
              <div v-if="loadingx" class="skeleton skeleton-text"></div>
              <div v-else class="value">
                {{ new Date(selectedTask?.expiresAt).toLocaleDateString('fr-FR') }}
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- Graphiques Section Moderne -->
        <q-card-section v-if="selectedTask?.type === 'OUI_NON'" style="padding: 30px 40px; background: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px 20px; border-radius: 12px 12px 0 0; margin-bottom: 0;">
            <div style="display: flex; align-items: center; color: white;">
              <i class="bi bi-pie-chart-fill" style="font-size: 1.5rem; margin-right: 12px;"></i>
              <div>
                <div style="font-weight: 700; font-size: 1.1rem;">Statistiques des réponses</div>
                <div style="font-size: 0.85rem; opacity: 0.9;">Répartition OUI / NON</div>
              </div>
            </div>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            <apexchart
              type="pie"
              :options="chartOptions"
              :series="series"
              height="320"
            />
          </div>
        </q-card-section>

        <q-card-section v-if="selectedTask?.type === 'CHOIX_MULTIPLE'" style="padding: 30px 40px; background: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px 20px; border-radius: 12px 12px 0 0; margin-bottom: 0;">
            <div style="display: flex; align-items: center; color: white;">
              <i class="bi bi-bar-chart-fill" style="font-size: 1.5rem; margin-right: 12px;"></i>
              <div>
                <div style="font-weight: 700; font-size: 1.1rem;">Statistiques des réponses</div>
                <div style="font-size: 0.85rem; opacity: 0.9;">Répartition par choix</div>
              </div>
            </div>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            <apexchart
              type="bar"
              :options="chartOptionsBar"
              :series="seriesBar"
              height="350"
            />
          </div>
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            label="Fermer"
            color="primary"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss">
@import '../../../css/admin/tables-shared.scss';
@import '../../../css/admin/surveys.scss';
@import '../../../css/admin/badges.scss';
@import '../../../css/admin/users-management.scss';

// ✅ Tous les styles sont maintenant dans les fichiers SCSS partagés
</style>
