<template>
  <div>
    <BRow class="d-flexjustify-content-center g-3">
      <BCol md="6" cols="12">
        <BCard no-body class="shadow-sm rounded-4 p-2 stat-card shadow-warning h-100">
          <BCardHeader class="text-warning fw-bold rounded-4"> Transactions </BCardHeader>
          <BCardBody class="pb-0" style="margin-bottom: -4px">
            <BRow class="g-3">
              <BCol cols="6" md="6" xl="3">
                <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                  <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                    <div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-coin text-warning fs-3 me-2"></i>
                        <h4 class="fw-bold mb-0 fs-2">
                          <CountToComponent
                            :startVal="0"
                            :endVal="totaltransaction"
                            :duration="2000"
                          />
                        </h4>
                      </div>

                      <span
                        class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                        >Transactions</span
                      >
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>
              <BCol cols="6" md="6" xl="3">
                <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                  <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                    <div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-coin text-warning fs-3 me-2"></i>
                        <h4 class="fw-bold mb-0 fs-2">
                          <CountToComponent
                            :startVal="0"
                            :endVal="totalPointsAwarded"
                            :duration="2000"
                          />
                        </h4>
                      </div>

                      <span
                        class="badge bg-warning-subtle text-warning fw-semibold px-0 py-1 rounded-pill"
                        >Points crédités</span
                      >
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>
              <BCol cols="6" md="6" xl="3">
                <BCard no-body class="shadow-sm rounded-4 stat-card shadow-danger">
                  <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                    <div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-coin text-danger fs-3 me-2"></i>
                        <h4 class="fw-bold mb-0 fs-2">
                          <CountToComponent
                            :startVal="0"
                            :endVal="totalPointsSpent"
                            :duration="2000"
                          />
                        </h4>
                      </div>
                      <span
                        class="badge bg-danger-subtle text-danger fw-semibold px-0 py-1 rounded-pill"
                        >Points débités</span
                      >
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>
              <BCol cols="6" md="6" xl="3">
                <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
                  <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                    <div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-coin text-success fs-3 me-2"></i>
                        <h4 class="fw-bold mb-0 fs-2">
                          <CountToComponent :startVal="0" :endVal="netPoints" :duration="2000" />
                        </h4>
                      </div>

                      <span
                        class="badge bg-success-subtle text-success fw-semibold px-1 py-1 rounded-pill"
                        >Solde net</span
                      >
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>
            </BRow>
          </BCardBody>
        </BCard>
      </BCol>

      <BCol md="6" cols="xl-6">
        <BRow>
          <BCol cols="12" md="12" xl="12">
            <BCard no-body class="shadow-sm rounded-4 p-1 stat-card shadow-warning h-100">
              <BCardHeader class="text-warning fw-bold rounded-4"> sondages </BCardHeader>
              <BCardBody class="pb-0" style="margin-bottom: -4px">
                <BRow class="g-3">
                  <BCol cols="6" md="6" xl="3">
                    <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                      <BCardBody
                        class="d-flex justify-content-between align-items-center p-3 bg-light"
                      >
                        <div>
                          <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-bookmark-check text-warning fs-3 me-2"></i>
                            <h4 class="fw-bold mb-0 fs-2">
                              <CountToComponent
                                :startVal="0"
                                :endVal="surveyCounst"
                                :duration="2000"
                              />
                            </h4>
                          </div>
                          <span
                            class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
                          >
                            Transaction</span
                          >
                        </div>
                      </BCardBody>
                    </BCard>
                  </BCol>
                  <BCol cols="6" md="6" xl="3">
                    <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
                      <BCardBody
                        class="d-flex justify-content-between align-items-center p-3 bg-light"
                      >
                        <div>
                          <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-bookmark-check text-success fs-3 me-2"></i>
                            <h4 class="fw-bold mb-0 fs-2">
                              <CountToComponent
                                :startVal="0"
                                :endVal="surveytotalPoints"
                                :duration="2000"
                              />
                            </h4>
                          </div>

                          <span
                            class="badge bg-success-subtle text-success fw-semibold px-1 py-1 rounded-pill"
                            >Points attribuée</span
                          >
                        </div>
                      </BCardBody>
                    </BCard>
                  </BCol>
                </BRow>
              </BCardBody>
            </BCard>
          </BCol>
          <BCol md="12" cols="xl-12" class="mt-2">
            <BCard no-body class="shadow-sm rounded-4 p-1 stat-card shadow-warning h-100">
              <BCardHeader class="text-warning fw-bold rounded-4"> Parrainage </BCardHeader>
              <BCardBody class="pb-0" style="margin-bottom: -4px">
                <BRow class="g-3">
                  <BCol cols="6" md="6" xl="3">
                    <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                      <BCardBody
                        class="d-flex justify-content-between align-items-center p-3 bg-light"
                      >
                        <div>
                          <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-people text-warning fs-3 me-2"></i>
                            <h4 class="fw-bold mb-0 fs-2">
                              <CountToComponent
                                :startVal="0"
                                :endVal="invitationcount"
                                :duration="2000"
                              />
                            </h4>
                          </div>

                          <span
                            class="badge bg-warning-subtle text-warning fw-semibold px-1 py-1 rounded-pill"
                            >parrainage</span
                          >
                        </div>
                      </BCardBody>
                    </BCard>
                  </BCol>
                  <BCol cols="6" md="6" xl="3">
                    <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
                      <BCardBody
                        class="d-flex justify-content-between align-items-center p-3 bg-light"
                      >
                        <div>
                          <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-people text-success fs-3 me-2"></i>
                            <h4 class="fw-bold mb-0 fs-2">
                              <CountToComponent
                                :startVal="0"
                                :endVal="invitationtotalPoints"
                                :duration="2000"
                              />
                            </h4>
                          </div>

                          <span
                            class="badge bg-success-subtle text-success fw-semibold px-1 py-1 rounded-pill"
                            >points crédités via invitations</span
                          >
                        </div>
                      </BCardBody>
                    </BCard>
                  </BCol>
                </BRow>
              </BCardBody>
            </BCard>
          </BCol>
        </BRow>
      </BCol>

      <BCol md="4" cols="xl-2"
        ><BCard no-body class="shadow-sm rounded-4 p-1 stat-card shadow-warning h-100">
          <BCardHeader class="text-warning fw-bold rounded-4"> Bonus </BCardHeader>
          <BCardBody class="pb-0" style="margin-bottom: -4px">
            <BRow class="g-3">
              <BCol cols="6" md="6" xl="3">
                <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                  <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                    <div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-cash-coin text-warning fs-3 me-2"></i>
                        <h4 class="fw-bold mb-0 fs-2">
                          <CountToComponent
                            :startVal="0"
                            :endVal="leaderboard_bonuscount"
                            :duration="2000"
                          />
                        </h4>
                      </div>

                      <span
                        class="badge bg-warning-subtle text-warning fw-semibold px-1 py-1 rounded-pill"
                        >Transaction Bonus</span
                      >
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>
              <BCol cols="6" md="6" xl="3">
                <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
                  <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                    <div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-cash-coin text-success fs-3 me-2"></i>
                        <h4 class="fw-bold mb-0 fs-2">
                          <CountToComponent
                            :startVal="0"
                            :endVal="leaderboard_bonustotalPoints"
                            :duration="2000"
                          />
                        </h4>
                      </div>

                      <span
                        class="badge bg-success-subtle text-success fw-semibold px-1 py-1 rounded-pill"
                        >Point attribué
                      </span>
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>
            </BRow>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol md="4" cols="xl-2"
        ><BCard no-body class="shadow-sm rounded-4 p-1 stat-card shadow-warning h-100">
          <BCardHeader class="text-warning fw-bold rounded-4"> Récompenses </BCardHeader>
          <BCardBody class="pb-0" style="margin-bottom: -4px">
            <BRow class="g-3">
              <BCol cols="6" md="6" xl="3">
                <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                  <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                    <div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-trophy text-warning fs-3 me-2"></i>
                        <h4 class="fw-bold mb-0 fs-2">
                          <CountToComponent
                            :startVal="0"
                            :endVal="redemptioncount"
                            :duration="2000"
                          />
                        </h4>
                      </div>

                      <span
                        class="badge bg-warning-subtle text-warning fw-semibold px-1 py-1 rounded-pill"
                        >échange de points</span
                      >
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>
              <BCol cols="6" md="6" xl="3">
                <BCard no-body class="shadow-sm rounded-4 stat-card shadow-danger">
                  <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                    <div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-trophy text-danger fs-3 me-2"></i>
                        <h4 class="fw-bold mb-0 fs-2">
                          <CountToComponent
                            :startVal="0"
                            :endVal="redemptiontotalPoints"
                            :duration="2000"
                          />
                        </h4>
                      </div>

                      <span
                        class="badge bg-danger-subtle text-danger fw-semibold px-1 py-1 rounded-pill"
                        >Point dépensé</span
                      >
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>
            </BRow>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol md="4" cols="xl-2"
        ><BCard no-body class="shadow-sm rounded-4 p-1 stat-card shadow-warning h-100">
          <BCardHeader class="text-warning fw-bold rounded-4">
            Ajustements Administrateur
          </BCardHeader>
          <BCardBody class="pb-0" style="margin-bottom: -4px">
            <BRow class="g-3">
              <BCol cols="6" md="6" xl="3">
                <BCard no-body class="shadow-sm rounded-4 stat-card shadow-warning">
                  <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                    <div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-pie-chart text-warning fs-3 me-2"></i>
                        <h4 class="fw-bold mb-0 fs-2">
                          <CountToComponent
                            :startVal="0"
                            :endVal="admin_adjustmentcount"
                            :duration="2000"
                          />
                        </h4>
                      </div>

                      <span
                        class="badge bg-warning-subtle text-warning fw-semibold px-1 py-1 rounded-pill"
                        >Ajustements manuels</span
                      >
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>
              <BCol cols="6" md="6" xl="3">
                <BCard no-body class="shadow-sm rounded-4 stat-card shadow-success">
                  <BCardBody class="d-flex justify-content-between align-items-center p-3 bg-light">
                    <div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-pie-chart text-success fs-3 me-2"></i>
                        <h4 class="fw-bold mb-0 fs-2">
                          <CountToComponent
                            :startVal="0"
                            :endVal="admin_adjustmenttotalPoints"
                            :duration="2000"
                          />
                        </h4>
                      </div>

                      <span
                        class="badge bg-success-subtle text-success fw-semibold px-1 py-1 rounded-pill"
                        >Points attribué</span
                      >
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>
            </BRow>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
    <BRow class="mt-3">
      <BCol cols="12">
        <div class="d-flex justify-content-between">
          <BButton
            variant="success"
            class="waves-effect waves-light mb-3 btn-success"
            @click="ajout = true"
            >Créer une Transactions</BButton
          >

          <q-dialog v-model="ajout" transition-show="scale" transition-hide="fade">
            <q-card
              style="width: 800px; max-width: 90vw; border-radius: 20px; overflow: hidden"
              class="shadow-lg"
            >
              <!-- Titre -->
              <q-card-section
                class="q-pa-md text-white flex items-center justify-center"
                style="background: linear-gradient(135deg, #0d6efd, #6610f2)"
              >
                <q-icon name="group_add" size="28px" class="q-mr-sm" />
                <div class="text-h6 text-center">Transactions</div>
              </q-card-section>

              <!-- Formulaire -->
              <div class="q-pa-lg">
                <BForm>
                  <BRow>
                    <!-- Nom -->
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

                    <!-- Ville -->
                    <BCol cols="12" class="mb-4 floating-label">
                      <input
                        class="form-control form-control-modern"
                        type="number"
                        id="publishCheck"
                        v-model="form.points"
                        placeholder=" "
                      />
                      <label for="publishCheck"> Points requits </label>
                    </BCol>
                  </BRow>

                  <!-- Bouton -->
                  <div v-if="loadings" class="d-flex justify-content-end mt-4">
                    <q-spinner-dots color="green" size="20px" class="q-mr-sm" />
                  </div>
                  <div v-else class="d-flex justify-content-end mt-4">
                    <BButton variant="success" class="px-5" @click="Add"> Enregistrer </BButton>
                  </div>
                </BForm>
              </div>
            </q-card>
          </q-dialog>
        </div>
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
          <q-card
            style="width: 800px; max-width: 90vw; border-radius: 20px; overflow: hidden"
            class="shadow-lg"
          >
            <!-- Titre -->
            <q-card-section
              class="q-pa-md text-white flex items-center justify-center"
              style="background: linear-gradient(135deg, #0d6efd, #6610f2)"
            >
              <q-icon name="group_add" size="28px" class="q-mr-sm" />
              <div class="text-h6 text-center">Transactions</div>
            </q-card-section>

            <!-- Formulaire -->
            <div class="q-pa-lg">
              <BForm>
                <BRow>
                  <!-- Nom -->

                  <!-- Description -->
                  <BCol cols="12" class="mb-4 floating-label">
                    <textarea
                      id="desc"
                      v-model="formu.description"
                      class="form-control form-control-modern"
                      rows="3"
                      placeholder=" "
                    ></textarea>
                    <label for="desc">Description</label>
                  </BCol>

                  <!-- Ville -->
                  <BCol cols="12" class="mb-4 floating-label" style="margin-top: 5px">
                    <input
                      class="form-control form-control-modern"
                      type="number"
                      id="publishCheck"
                      v-model="formu.points"
                    />
                    <label class="form-check-label fw-semibold" for="publishCheck">
                      Points requits
                    </label>
                  </BCol>
                </BRow>

                <!-- Bouton -->
                <div v-if="loadings" class="d-flex justify-content-end mt-4">
                  <q-spinner-dots color="green" size="20px" class="q-mr-sm" />
                </div>
                <div v-else class="d-flex justify-content-end mt-4">
                  <BButton variant="success" class="px-5" @click="Edit"> Enregistrer </BButton>
                </div>
              </BForm>
            </div>
          </q-card>
        </q-dialog>
        <q-dialog v-model="opendMdet">
          <q-card class="detail-dialog" style="width: 800px; max-width: 90vw">
            <!-- Header -->
            <q-card-section class="dialog-header row items-center q-pa-sm">
              <div class="q-ml-sm">
                <div class="text-h6 text-warning">Ajustements</div>
                <div class="text-caption text-warning">📋 Détails</div>
              </div>
              <q-space />
            </q-card-section>

            <!-- Contenu -->
            <q-card-section class="dialog-content">
              <div class="info-grid">
                <div class="info-box">
                  <q-icon name="category" class="text-primary q-mr-sm" />
                  <div>
                    <div class="label">Source</div>
                    <q-badge color="orange" class="chip">
                      {{ selectedTask?.source }}
                    </q-badge>
                  </div>
                </div>

                <div class="info-box">
                  <q-icon name="paid" class="text-indigo q-mr-sm" />
                  <div>
                    <div class="label">Points</div>
                    <div class="value">{{ selectedTask?.points }} Pts</div>
                  </div>
                </div>

                <div class="info-box">
                  <q-icon name="event" class="text-indigo q-mr-sm" />
                  <div>
                    <div class="label">Date de creation</div>
                    <div class="value">
                      {{ new Date(selectedTask?.createdAt).toLocaleDateString('fr-FR') }}
                    </div>
                  </div>
                </div>

                <div class="info-box col-span-2">
                  <q-icon name="assignment_turned_in" class="text-blue q-mr-sm" />
                  <div>
                    <div class="label">Participant info</div>
                    <div class="value">
                      {{
                        selectedTask?.participant.lastName +
                        ' ' +
                        selectedTask?.participant.firstName +
                        ' - ' +
                        getAge(selectedTask?.participant.birthDate)
                      }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="description-box">
                <q-icon name="description" class="text-teal q-mr-sm" />
                <div>
                  <div class="label">Description</div>
                  <p class="description-text">
                    {{ selectedTask?.description || 'Pas de description' }}
                  </p>
                </div>
              </div>
            </q-card-section>
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
  BCardBody,
  BCard,
  BCardHeader,
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
    BCardBody,
    BCard,
    CountToComponent,
    BCardHeader,
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
.detail-dialog {
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(50, 50, 93, 0.25);
  background: #fff;
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
