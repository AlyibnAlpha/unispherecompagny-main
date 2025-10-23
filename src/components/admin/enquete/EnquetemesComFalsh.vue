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
  BCardBody,
  BCard,
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
    BCardBody,
    BCard,
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
        label: 'par oui ou non',
        value: 'OUI_NON',
      },

      {
        label: 'par choix multiple',
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
        <div class="d-flex justify-content-between">
          <BButton variant="success" class="waves-effect waves-light mb-3" @click="onpenCreate"
            >Créer un sondage rapide</BButton
          >

          <q-dialog v-model="ajout" transition-show="scale" transition-hide="fade">
            <q-card class="shadow-lg" style="width: 800px; max-width: 90vw">
              <!-- En-tête -->
              <q-card-section
                class="q-pa-md text-white flex items-center justify-center"
                style="background: linear-gradient(135deg, #0d6efd, #6610f2)"
              >
                <div class="text-h6">Sondage</div>
              </q-card-section>

              <!-- Contenu -->
              <div class="q-pa-lg" style="max-height: 70vh; overflow-y: auto">
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
                        <BRow v-for="(option, indexs) in form.choices" :key="indexs">
                          <BCol lg="10" class="mb-3 floating-label">
                            <input
                              type="text"
                              v-model="option.value"
                              class="w-100 form-control-modern"
                              placeholder=" "
                            />
                            <label>Option de réponse</label>
                          </BCol>
                          <BCol lg="2" class="d-flex align-items-center">
                            <BButton
                              size="sm"
                              class="btn-success me-1"
                              @click="AddFormDataM(indexs)"
                            >
                              <i class="bx bx-add-to-queue"></i>
                            </BButton>
                            <BButton size="sm" class="btn-danger" @click="deleteRow(indexs)">
                              <i class="dripicons-document-delete"></i>
                            </BButton>
                          </BCol>
                        </BRow>
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
                  <div v-if="loadings" class="d-flex justify-content-end mt-4">
                    <q-spinner-dots color="green" size="20px" class="q-mr-sm" />
                  </div>

                  <div v-else class="d-flex justify-content-end mt-5">
                    <BButton variant="success" class="px-5" @click="Add">Enregistrer</BButton>
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
                  Trier
                  <BFormSelect v-model="perPage" size="sm" :options="pageOptions"></BFormSelect>
                </label>
              </div>
            </BCol>
            <BCol sm="12" md="6">
              <div id="tickets-table_filter" class="dataTables_filter text-md-end">
                <label class="d-inline-flex align-items-center">
                  Recheche:
                  <BFormInput
                    v-model="filter"
                    type="search"
                    placeholder="Recheche..."
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
                    class="px-2 text-warning"
                    @click.prevent="openEditModal(data.item)"
                    title="Edit"
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
      <q-card class="shadow-lg" style="width: 800px; max-width: 90vw">
        <!-- En-tête -->
        <q-card-section
          class="q-pa-md text-white flex items-center justify-center"
          style="background: linear-gradient(135deg, #0d6efd, #6610f2)"
        >
          <div class="text-h6">Modification</div>
        </q-card-section>

        <!-- Contenu -->
        <div class="q-pa-lg" style="max-height: 70vh; overflow-y: auto">
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
                  <BRow v-for="(option, indexs) in formu.choices" :key="indexs">
                    <BCol lg="10" class="mb-3 floating-label">
                      <input
                        type="text"
                        v-model="option.value"
                        class="w-100 form-control-modern"
                        placeholder=" "
                      />
                      <label>Option de réponse</label>
                    </BCol>
                    <BCol lg="2" class="d-flex align-items-center">
                      <BButton size="sm" class="btn-success me-1" @click="AddFormDataM(indexs)">
                        <i class="bx bx-add-to-queue"></i>
                      </BButton>
                      <BButton size="sm" class="btn-danger" @click="deleteRow(indexs)">
                        <i class="dripicons-document-delete"></i>
                      </BButton>
                    </BCol>
                  </BRow>
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
            <div v-if="loadings" class="d-flex justify-content-end mt-4">
              <q-spinner-dots color="green" size="20px" class="q-mr-sm" />
            </div>

            <div v-else class="d-flex justify-content-end mt-5">
              <BButton variant="success" class="px-5" @click="Edit">Enregistrer</BButton>
            </div>
          </BForm>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="opendMdet">
      <q-card
        class="modern-dialog"
        style="width: 800px; max-width: 90vw; height: 600px; max-height: 80vw"
      >
        <!-- Header -->
        <q-card-section class="dialog-header row items-center q-pa-sm">
          <div class="q-ml-sm">
            <span v-if="loadingx" class="skeleton skeleton-title"></span>
            <div v-else class="text-h6 text-warning">{{ selectedTask?.question }}</div>
            <span v-if="loadingx" class="skeleton skeleton-title"></span>
            <div v-else class="text-caption text-warning-8">
              Type:<span
                class="badge bg-warning-subtle text-warning me-2 fw-semibold px-3 py-1 rounded-pill"
                >{{ selectedTask?.type }}</span
              >
            </div>
          </div>
          <q-space />
        </q-card-section>

        <div class="q-pa-lg" style="background-color: #f9faff; overflow-y: auto">
          <q-separator color="grey-3" />
          <q-card-section>
            <BCard v-if="selectedTask?.createdByBusiness" class="shadow-sm border-0 mt-3 rounded-4">
              <div class="p-3 d-flex align-items-center gap-3">
                <!-- Avatar généré automatiquement -->
                <img
                  :src="`https://ui-avatars.com/api/?name=${selectedTask?.createdByBusiness?.firstName}+${selectedTask?.createdByBusiness?.lastName}&background=random`"
                  alt="Avatar créateur"
                  class="rounded-circle shadow-sm"
                  style="width: 60px; height: 60px; object-fit: cover"
                />
                <div>
                  <!-- Nom et prénom -->
                  <h5 class="mb-1 fw-bold text-primary">
                    {{ selectedTask?.createdByBusiness?.firstName }}
                    {{ selectedTask?.createdByBusiness?.lastName }}
                  </h5>

                  <!-- Entreprise -->
                  <p class="mb-1 text-muted small">
                    <i class="bi bi-building me-2"></i>
                    {{ selectedTask?.createdByBusiness?.companyName }}
                  </p>
                </div>
              </div>
            </BCard>
            <BCard v-if="selectedTask?.createdByAdmin" class="shadow-sm border-0 mt-3 rounded-4">
              <div class="p-3 d-flex align-items-center gap-3">
                <!-- Avatar généré automatiquement -->
                <img
                  :src="`https://ui-avatars.com/api/?name=${selectedTask?.createdByAdmin?.firstName}+${selectedTask?.createdByAdmin?.lastName}&background=random`"
                  alt="Avatar créateur"
                  class="rounded-circle shadow-sm"
                  style="width: 60px; height: 60px; object-fit: cover"
                />

                <div>
                  <!-- Nom et prénom -->
                  <h5 class="mb-1 fw-bold text-primary">
                    {{ selectedTask?.createdByAdmin?.firstName }}
                    {{ selectedTask?.createdByAdmin?.lastName }}
                  </h5>

                  <!-- Poste -->
                  <p class="mb-1 text-muted small">
                    <i class="bi bi-person-badge me-2"></i>
                    Groupe des participants: {{ selectedTask?.targetGroup?.name }}
                  </p>
                </div>
              </div>
            </BCard>
          </q-card-section>
          <q-card-section v-if="selectedTask?.type === 'OUI_NON'">
            <BRow class="d-flex justify-content-center">
              <BCol md="6" cols="xl-6"
                ><BRow class="d-flexjustify-content-center">
                  <BCol md="12" cols="xl-12">
                    <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
                      <BCardBody
                        class="d-flex justify-content-between align-items-center p-3 bg-light"
                      >
                        <div>
                          <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-check-square text-success fs-3 me-2"></i>
                            <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                            <h4 v-else class="fw-bold mb-0 fs-2">
                              <CountToComponent
                                :startVal="0"
                                :endVal="totalReponse"
                                :duration="2000"
                              />
                            </h4>
                          </div>
                          <span
                            class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                            >Réponses</span
                          >
                        </div>
                      </BCardBody>
                    </BCard>
                  </BCol>
                  <BCol md="6" cols="xl-6">
                    <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
                      <BCardBody
                        class="d-flex justify-content-between align-items-center p-3 bg-light"
                      >
                        <div>
                          <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-check-square text-success fs-3 me-2"></i>
                            <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                            <h4 v-else class="fw-bold mb-0 fs-2">
                              <CountToComponent :startVal="0" :endVal="totaloui" :duration="2000" />
                            </h4>
                          </div>
                          <span
                            class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                            >Nombre de OUI</span
                          >
                        </div>
                      </BCardBody>
                    </BCard>
                  </BCol>
                  <BCol md="6" cols="xl-6">
                    <BCard no-body class="shadow-sm rounded-4 stat-card shadow-danger">
                      <BCardBody
                        class="d-flex justify-content-between align-items-center p-3 bg-light"
                      >
                        <div>
                          <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-check-square text-danger fs-3 me-2"></i>
                            <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                            <h4 v-else class="fw-bold mb-0 fs-2">
                              <CountToComponent :startVal="0" :endVal="totalNon" :duration="2000" />
                            </h4>
                          </div>
                          <span
                            class="badge bg-danger-subtle text-danger fw-semibold px-3 py-1 rounded-pill"
                            >Nombre de NON</span
                          >
                        </div>
                      </BCardBody>
                    </BCard>
                  </BCol>
                </BRow></BCol
              >
              <BCol md="6" cols="xl-6">
                <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                  <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                    <apexchart
                      type="pie"
                      height="290"
                      :options="chartOptions"
                      :series="[stats.oui, stats.non]"
                    />
                  </BCardBody>
                </BCard>
              </BCol>
            </BRow>
          </q-card-section>
          <q-card-section v-if="selectedTask?.type === 'CHOIX_MULTIPLE'">
            <BRow class="d-flex justify-content-center">
              <BCol md="6" cols="xl-6"
                ><BRow class="d-flex justify-content-center">
                  <BCol md="12" cols="xl-12">
                    <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
                      <BCardBody
                        class="d-flex justify-content-between align-items-center p-3 bg-light"
                      >
                        <div>
                          <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-check-square text-success fs-3 me-2"></i>
                            <h4 v-if="loadingx" class="skeleton skeleton-title"></h4>
                            <h4 v-else class="fw-bold mb-0 fs-2">
                              <CountToComponent
                                :startVal="0"
                                :endVal="totalReponse"
                                :duration="2000"
                              />
                            </h4>
                          </div>
                          <span
                            class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
                            >Réponses</span
                          >
                        </div>
                      </BCardBody>
                    </BCard>
                  </BCol>
                  <BCol md="12" cols="xl-12">
                    <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                      <BCardBody
                        class="d-flex justify-content-between align-items-center p-3 bg-light"
                      >
                        <apexchart
                          type="pie"
                          height="300"
                          :options="pieOptions"
                          :series="Object.values(statsMultiple)"
                        />
                      </BCardBody>
                    </BCard>
                  </BCol> </BRow
              ></BCol>
              <BCol md="6" cols="xl-6">
                <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                  <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                    <apexchart
                      type="bar"
                      height="300"
                      :options="barOptions"
                      :series="[{ name: 'Réponses', data: Object.values(statsMultiple) }]"
                    />
                  </BCardBody>
                </BCard>
              </BCol>
            </BRow>
          </q-card-section>

          <!-- Content -->
          <q-card-section class="dialog-content">
            <div class="info-row mb-2">
              <span class="label">Date d'expiration:</span>
              <span v-if="loadingx" class="skeleton skeleton-title"></span>
              <span v-else class="value"
                >{{
                  new Date(selectedTask?.expiresAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                }}
              </span>
            </div>
            <div class="info-row mb-2">
              <span class="label">Status :</span>
              <span v-if="loadingx" class="skeleton skeleton-title"></span>
              <span v-else class="value">{{ selectedTask?.status }} </span>
            </div>

            <div class="info-row mb-2">
              <span class="label">Publier :</span>
              <span v-if="loadingx" class="skeleton skeleton-title"></span>
              <span
                v-else
                class="value badge badge-pill bg-soft-success font-size-12"
                :class="{
                  'bg-soft-success': selectedTask?.publishedAt !== null,

                  'bg-soft-danger': selectedTask?.publishedAt === null,
                }"
                >{{ selectedTask?.publishedAt === null ? 'Non publier' : 'Publier' }}</span
              >
            </div>
          </q-card-section>
        </div>

        <q-separator color="grey-3" />

        <!-- Actions -->
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

.table tbody tr {
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #f9fcff;
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
/* === Gradient header === */

/* === Floating inputs === */
.floating-label {
  position: relative;

  label {
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
}

.form-control-modern {
  border-radius: 12px;
  border: 2px solid #e0e7ff;
  padding: 0.9rem 1rem;
  transition: all 0.3s ease;
  background: #fff;

  &:focus {
    border-color: #2ea3f2;
    box-shadow: 0 0 8px rgba(46, 163, 242, 0.4);
    transform: scale(1.01);
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

.btn-danger {
  background: #ff6b6b;
  border: none;
  border-radius: 50px;
  transition: all 0.3s ease;

  &:hover {
    background: #ff4c4c;
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.96);
  }
}

/* === Animation ouverture dialog === */
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
</style>
