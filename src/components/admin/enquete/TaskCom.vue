<script>
import Swal from 'sweetalert2'
import FullCalendar from '@fullcalendar/vue3'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import frLocale from '@fullcalendar/core/locales/fr'
import listPlugin from '@fullcalendar/list'

import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { BCard, BCardBody, BRow, BCol, BForm, BButton } from 'bootstrap-vue-next'

/**
 * Calendar component
 */
export default {
  components: {
    FullCalendar,
    BCard,
    BCardBody,
    BRow,
    BCol,
    BForm,
    BButton,
  },
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    const loading = ref(false)
    const categories = [
      { name: 'Invitation', value: 'invitation' },
      { name: 'Rappel', value: 'send_reminder' },
    ]
    const plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrapPlugin, listPlugin]
    const mapApiEvents = (apiEvents) => {
      return apiEvents.map((ev) => ({
        id: ev.id,
        title: ev.title,
        start: ev.scheduled_at,
        end: ev.dueDate, // tu peux utiliser juste start si tu n'as pas vraiment de fin
        classNames: ev.type, // ça correspond à ["send_reminder"] ou ["invitation"]
      }))
    }
    return {
      loading,
      mapApiEvents,
      calendarOptions: {
        headerToolbar: {
          left: 'customPrev,customNext today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        },
        customButtons: {
          customPrev: {
            text: '<', // on peut laisser vide pour mettre icône
            click: () => {
              this.$refs.fullCalendar.getApi().prev()
            },
            icon: 'bi bi-chevron-left',
          },
          customNext: {
            text: '>',
            click: () => {
              this.$refs.fullCalendar.getApi().next()
            },
            icon: 'bi bi-chevron-right',
          },
        },
        plugins,
        initialView: 'dayGridMonth',
        themeSystem: 'bootstrap',
        editable: true,
        droppable: true,
        eventResizableFromStart: true,
        dateClick: this.dateClicked,
        eventClick: this.editEvent,
        eventsSet: this.handleEvents,
        weekends: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,

        locale: frLocale,
      },
      currentEvents: [],
      showModal: false,
      eventModal: false,
      categories: categories,
      submitted: false,
      submit: false,
      events: [],
      newEventData: {},
      edit: {},
      deleteId: {},
      event: {
        title: '',
        start: '',
        end: '',
        category: '',
      },
      editevent: {
        editTitle: '',
        editStart: '',
        editEnd: '',
        editcategory: '',
      },
    }
  },
  validations: {
    event: {
      title: {
        required,
      },
      start: {
        required,
      },
      end: {
        required,
      },
      category: {
        required,
      },
    },
  },
  mounted() {
    this.fetchEvents()
  },
  methods: {
    async handleSubmit() {
      this.submitted = true

      // stop here if form is invalid
      this.v$.$touch()
      if (this.v$.$invalid) {
        return
      } else {
        try {
          const startDateTime = new Date(`${this.event.start}`)
          const endDateTime = new Date(`${this.event.end}`)
          const payload = {
            title: this.event.title,
            type: [this.event.category], // ton backend attend un tableau
            scheduled_at: startDateTime.toISOString(),
            dueDate: endDateTime.toISOString(),
            completed: false,
          }
          const { data: newEvent } = await api.post('/admin/tasks/execute', payload)
          let calendarApi = this.newEventData.view.calendar
          calendarApi.addEvent(this.mapApiEvents([newEvent])[0])

          this.successmsg()
          this.showModal = false
          this.newEventData = {}
        } catch (err) {
          console.error('Erreur ajout event:', err)
        }
      }
      this.submitted = false
      this.event = {}
    },
    // eslint-disable-next-line no-unused-vars
    hideModal(e) {
      this.submitted = false
      this.showModal = false
      this.event = {}
    },
    /**
     * Edit event modal submit
     */
    // eslint-disable-next-line no-unused-vars
    async editSubmit(e) {
      this.submit = true
      try {
        const payload = {
          title: this.editevent.editTitle,
          type: [this.editevent.editcategory],
          scheduled_at: this.editevent.editStart,
          dueDate: this.editevent.editEnd,
          completed: false,
        }

        const { data: updated } = await api.put(`/admin/tasks/${this.edit.id}/execute`, payload)

        this.edit.setProp('title', updated.title)
        this.edit.setProp('classNames', updated.type)

        this.successmsg()
        this.eventModal = false
      } catch (err) {
        console.error('Erreur update event:', err)
      }
    },
    async fetchEvents() {
      try {
        this.loading = true
        const data = await api.get('/admin/tasks')
        this.calendarOptions.events = this.mapApiEvents(data.data)
      } catch (err) {
        console.error('Erreur fetch events:', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * Delete event
     */
    async deleteEvent() {
      try {
        await api.delete(`/admin/tasks/${this.edit.id}`)
        this.edit.remove()
        this.eventModal = false
        Swal.fire('Deleted!', 'Event has been deleted.', 'success')
      } catch (err) {
        console.error('Erreur suppression event:', err)
      }
    },
    /**
     * Modal open for add event
     */
    dateClicked(info) {
      this.newEventData = info
      this.showModal = true
    },
    /**
     * Modal open for edit event
     */
    editEvent(info) {
      this.edit = info.event
      this.editevent.editTitle = this.edit.title
      this.editevent.editcategory = this.edit.classNames[0]
      this.editevent.editStart = this.edit.start.toISOString().slice(0, 16) // format yyyy-MM-ddTHH:mm
      this.editevent.editEnd = this.edit.end
        ? this.edit.end.toISOString().slice(0, 16)
        : this.editevent.editStart
      this.eventModal = true
    },

    closeModal() {
      this.eventModal = false
    },

    confirm() {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to delete this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.value) {
          this.deleteEvent()
          Swal.fire('Deleted!', 'Event has been deleted.', 'success')
        }
      })
    },

    /**
     * Show list of events
     */
    handleEvents(events) {
      this.currentEvents = events
    },

    /**
     * Show successfull Save Dialog
     */
    successmsg() {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Event has been saved',
        showConfirmButton: false,
        timer: 1000,
      })
    },
  },
}
</script>

<template>
  <div>
    <BRow no-body>
      <BCol cols="12">
        <BCard no-body>
          <BCardBody>
            <div class="app-calendar">
              <FullCalendar
                class="full-calender-wrapper"
                ref="fullCalendar"
                :options="calendarOptions"
              />
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
    <q-dialog v-model="showModal" persistent>
      <q-card style="min-width: 400px; max-width: 600px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Ajouter une tâche</div>
        </q-card-section>
        <q-card-section>
          <BForm @submit.prevent="handleSubmit">
            <BRow no-body>
              <!-- Nom de l’événement -->
              <BCol cols="12" class="mb-4 floating-label">
                <div class="mb-3">
                  <input
                    id="name"
                    v-model="event.title"
                    type="text"
                    class="form-control-modern"
                    placeholder=" "
                    :class="{ 'is-invalid': submitted && v$.event.title.$error }"
                  />
                  <label for="name">Titre</label>
                  <div
                    v-if="submitted && v$.event.title.required.$invalid"
                    class="invalid-feedback"
                  >
                    Ce champ est obligatoire.
                  </div>
                </div>
              </BCol>

              <!-- Type -->
              <BCol cols="12" class="mb-4 floating-label">
                <div class="mb-3">
                  <select
                    id="sel"
                    v-model="event.category"
                    class="form-control-modern"
                    placeholder=" "
                    name="category"
                    :class="{ 'is-invalid': submitted && v$.event.category.$error }"
                  >
                    <option v-for="option in categories" :key="option.value" :value="option.value">
                      {{ option.name }}
                    </option>
                  </select>
                  <label for="sel">Type</label>
                  <div v-if="submitted && v$.event.category.$invalid" class="invalid-feedback">
                    Ce champ est obligatoire.
                  </div>
                </div>
              </BCol>

              <!-- Date de début -->
              <BCol cols="12" class="mb-4 floating-label">
                <div class="mb-3">
                  <input
                    id="dees"
                    type="datetime-local"
                    v-model="event.start"
                    class="form-control-modern"
                    placeholder=" "
                  />
                  <label for="dess">Date de début</label>
                  <div v-if="submitted && v$.event.start.$invalid" class="invalid-feedback">
                    Ce champ est obligatoire.
                  </div>
                </div>
              </BCol>

              <!-- Date de fin -->
              <BCol cols="12" class="mb-4 floating-label">
                <div class="mb-3">
                  <input
                    type="datetime-local"
                    class="form-control-modern"
                    v-model="event.end"
                    placeholder=" "
                  />
                  <label class="control-label">Date de fin</label>
                  <div v-if="submitted && v$.event.end.$invalid" class="invalid-feedback">
                    Ce champ est obligatoire.
                  </div>
                </div>
              </BCol>
            </BRow>

            <div class="d-flex justify-content-end">
              <BButton variant="light" class="me-2" @click="hideModal">Fermer</BButton>
              <BButton type="submit" variant="success" class="ms-1">Enregistre</BButton>
            </div>
          </BForm>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="eventModal" persistent>
      <q-card style="min-width: 400px; max-width: 600px">
        <q-card-section class="bg-warning text-white">
          <div class="text-h6">Modification</div>
        </q-card-section>
        <q-card-section>
          <BForm @submit.prevent="editSubmit">
            <BRow no-body>
              <!-- Nom -->
              <BCol cols="12" class="mb-4 floating-label">
                <div class="mb-3">
                  <input
                    id="edit-name"
                    v-model="editevent.editTitle"
                    type="text"
                    class="form-control-modern"
                    placeholder=" "
                    :class="{ 'is-invalid': submit && !editevent.editTitle }"
                  />
                  <label for="edit-name">Nom de l'événement</label>
                  <div v-if="submit && !editevent.editTitle" class="invalid-feedback">
                    Ce champ est requis.
                  </div>
                </div>
              </BCol>

              <!-- Catégorie -->
              <BCol cols="12" class="mb-4 floating-label">
                <div class="mb-3">
                  <select
                    v-model="editevent.editcategory"
                    id="sels"
                    placeholder=" "
                    class="form-control-modern"
                    :class="{ 'is-invalid': submit && !editevent.editcategory }"
                  >
                    <option v-for="option in categories" :key="option.value" :value="option.value">
                      {{ option.name }}
                    </option>
                  </select>
                  <label for="sels">Catégorie</label>
                  <div v-if="submit && !editevent.editcategory" class="invalid-feedback">
                    Ce champ est requis.
                  </div>
                </div>
              </BCol>

              <!-- Date de début -->
              <BCol cols="12" class="mb-4 floating-label">
                <div class="mb-3">
                  <input
                    id="deb"
                    type="datetime-local"
                    v-model="editevent.editStart"
                    placeholder=" "
                    class="form-control-modern"
                    :class="{ 'is-invalid': submit && !editevent.editStart }"
                  />
                  <label for="deb">Date de début</label>
                  <div v-if="submit && !editevent.editStart" class="invalid-feedback">
                    La date de début est requise.
                  </div>
                </div>
              </BCol>

              <!-- Date de fin -->
              <BCol cols="12" class="mb-4 floating-label">
                <div class="mb-3">
                  <input
                    id="fin"
                    type="datetime-local"
                    v-model="editevent.editEnd"
                    placeholder=" "
                    class="form-control-modern"
                    :class="{ 'is-invalid': submit && !editevent.editEnd }"
                  />
                  <label for="fin">Date de fin</label>
                  <div v-if="submit && !editevent.editEnd" class="invalid-feedback">
                    La date de fin est requise.
                  </div>
                </div>
              </BCol>
            </BRow>

            <!-- Boutons -->
            <div class="d-flex justify-content-between">
              <BButton class="me-2" variant="danger" @click="confirm">Supprimer</BButton>
              <div class="d-flex">
                <BButton variant="light" class="me-2" @click="closeModal">Fermer</BButton>
                <BButton type="submit" variant="success">Enregistrer</BButton>
              </div>
            </div>
          </BForm>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss">
.full-calender-wrapper {
  .fc-header-toolbar.fc-toolbar.fc-toolbar-ltr {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
}
.fc-event.invitation {
  background-color: #0d6efd !important; /* bleu bootstrap */
  border-color: #0d6efd !important;
  color: white !important;
}

/* Rappel = warning */
.fc-event.send_reminder {
  background-color: #ffc107 !important; /* warning bootstrap */
  border-color: #ffc107 !important;
  color: black !important;
}
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
</style>
