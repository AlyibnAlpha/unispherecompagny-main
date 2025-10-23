<script>
import { ref } from 'vue'
import Step1u from './actions-modif/Step1Ac.vue'
import Step2u from './actions-modif/Step2Ac.vue'
import Step3u from './actions-modif/Step3Ac.vue'
import Step4Acu from './actions-modif/Step4Ac.vue'
import Step5Acu from './actions-modif/Step5Ac.vue'

/**
 * Orders component
 */
export default {
  components: {
    Step1u,
    Step2u,
    Step3u,
    Step4Acu,
    Step5Acu,
  },
  data() {
    const step3Ref = ref(null)

    const refreshStep3 = () => {
      step3Ref.value++
    }
    //  @click="toggleWizard(1, 10)" @click="toggleWizard(2, 30)"  @click="toggleWizard(3, 50)"  @click="toggleWizard(4, 70)"  @click="toggleWizard(5, 100)"

    return {
      refreshStep3,
      step3Ref,
      // Active tab
      activeTab: 1,
      activeTabArrow: 1,

      // Progress bar value
      progressBarValue: 10,
    }
  },

  methods: {
    /**
     * Search the table data with search input
     */

    toggleWizard(tab, value) {
      this.activeTab = tab
      this.progressBarValue = value
    },

    toggleTabWizard(tab) {
      this.activeTabArrow = tab
    },
  },
}
</script>

<template>
  <div>
    <BRow>
      <BCol cols="12">
        <div class="d-flex justify-content-between" style="margin: 20px">
          <q-card
            style="
              background: linear-gradient(135deg, #f0f4ff, #e0f7fa);
              max-width: 920px;
              width: 100%;
            "
          >
            <!-- Titre -->

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
                <Step1u @onNext="toggleWizard(2, 30)" />
              </div>
              <div v-show="activeTab === 2">
                <Step2u
                  @refreshGroups="refreshStep3()"
                  @onBack="toggleWizard(1, 10)"
                  @onNext="toggleWizard(3, 50)"
                />
              </div>
              <div v-show="activeTab === 3">
                <Step4Acu
                  :refreshTrigger="step3Ref"
                  @onBack="toggleWizard(2, 30)"
                  @onNext="toggleWizard(4, 70)"
                />
              </div>
              <div v-show="activeTab === 4">
                <Step3u @onBack="toggleWizard(3, 50)" @onNext="toggleWizard(5, 100)" />
              </div>
              <div v-show="activeTab === 5">
                <Step5Acu @onBack="toggleWizard(4, 70)" />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </BCol>
    </BRow>
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
