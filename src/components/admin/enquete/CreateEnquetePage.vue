<script>
import { onMounted, ref } from 'vue'
import Step1 from './actions/Step1Ac.vue'
import Step2 from './actions/Step2Ac.vue'
import Step3 from './actions/Step3Ac.vue'
import Step4Ac from './actions/Step4Ac.vue'
import Step5Ac from './actions/Step5Ac.vue'
import { useRegisterStore } from 'src/stores/useRegisterStore.js'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth.js'

export default {
  components: {
    Step1,
    Step2,
    Step3,
    Step4Ac,
    Step5Ac,
  },
  setup() {
    const store = useRegisterStore()
    const router = useRouter()
    const authStore = useAuthStore()
    const activeTab = ref(1)
    const progressBarValue = ref(10)
    const step3Ref = ref(0)

    const refreshStep3 = async () => {
      step3Ref.value++
    }

    const toggleWizard = (tab, value) => {
      activeTab.value = tab
      progressBarValue.value = value
    }

    const goBack = () => {
      const role = authStore.roles[0]
      if (role === import.meta.env.VITE_DEFAULT_ROLEA) {
        router.push('/admin/enquetes')
      } else if (role === import.meta.env.VITE_DEFAULT_ROLEB) {
        router.push('/business/enquetes')
      }
    }

    const finishWizard = () => {
      goBack()
    }

    onMounted(() => {
      store.setIdSurvey(null)
    })

    return {
      activeTab,
      progressBarValue,
      step3Ref,
      toggleWizard,
      refreshStep3,
      goBack,
      finishWizard,
    }
  },
}
</script>

<template>
  <div class="create-enquete-page-unified">
    <!-- Navigation avec bouton retour et étapes -->
    <div class="unified-navigation">
      <button class="back-btn-unified" @click="goBack">
        <i class="bi bi-arrow-left"></i>
      </button>

      <div class="steps-navigation-unified">
        <div
          class="step-nav-item-unified"
          :class="{ active: activeTab === 1, completed: activeTab > 1 }"
          @click="activeTab > 1 && toggleWizard(1, 10)"
        >
          <div class="step-nav-number-unified">
            <span v-if="activeTab > 1"><i class="bi bi-check-circle-fill"></i></span>
            <span v-else>1</span>
          </div>
          <div class="step-nav-title-unified">Création</div>
        </div>

        <div class="step-nav-connector-unified" :class="{ active: activeTab > 1 }"></div>

        <div
          class="step-nav-item-unified"
          :class="{ active: activeTab === 2, completed: activeTab > 2 }"
          @click="activeTab > 2 && toggleWizard(2, 30)"
        >
          <div class="step-nav-number-unified">
            <span v-if="activeTab > 2"><i class="bi bi-check-circle-fill"></i></span>
            <span v-else>2</span>
          </div>
          <div class="step-nav-title-unified">Groupes de questions</div>
        </div>

        <div class="step-nav-connector-unified" :class="{ active: activeTab > 2 }"></div>

        <div
          class="step-nav-item-unified"
          :class="{ active: activeTab === 3, completed: activeTab > 3 }"
          @click="activeTab > 3 && toggleWizard(3, 50)"
        >
          <div class="step-nav-number-unified">
            <span v-if="activeTab > 3"><i class="bi bi-check-circle-fill"></i></span>
            <span v-else>3</span>
          </div>
          <div class="step-nav-title-unified">Groupes de participants</div>
        </div>

        <div class="step-nav-connector-unified" :class="{ active: activeTab > 3 }"></div>

        <div
          class="step-nav-item-unified"
          :class="{ active: activeTab === 4, completed: activeTab > 4 }"
          @click="activeTab > 4 && toggleWizard(4, 70)"
        >
          <div class="step-nav-number-unified">
            <span v-if="activeTab > 4"><i class="bi bi-check-circle-fill"></i></span>
            <span v-else>4</span>
          </div>
          <div class="step-nav-title-unified">Questions</div>
        </div>

        <div class="step-nav-connector-unified" :class="{ active: activeTab > 4 }"></div>

        <div
          class="step-nav-item-unified"
          :class="{ active: activeTab === 5, completed: activeTab > 5 }"
          @click="activeTab > 5 && toggleWizard(5, 90)"
        >
          <div class="step-nav-number-unified">
            <span v-if="activeTab > 5"><i class="bi bi-check-circle-fill"></i></span>
            <span v-else>5</span>
          </div>
          <div class="step-nav-title-unified">Finalisation</div>
        </div>
      </div>
    </div>

    <!-- Contenu unifié -->
    <div class="unified-content">
      <div v-show="activeTab === 1" class="step-content-unified">
        <Step1 @onNext="toggleWizard(2, 30)" />
      </div>
      <div v-show="activeTab === 2" class="step-content-unified">
        <Step2
          @refreshGroups="refreshStep3()"
          @onBack="toggleWizard(1, 10)"
          @onNext="toggleWizard(3, 50)"
        />
      </div>
      <div v-show="activeTab === 3" class="step-content-unified">
        <Step4Ac
          :refreshTrigger="step3Ref"
          @onBack="toggleWizard(2, 30)"
          @onNext="toggleWizard(4, 70)"
        />
      </div>
      <div v-show="activeTab === 4" class="step-content-unified">
        <Step3 @onBack="toggleWizard(3, 50)" @onNext="toggleWizard(5, 100)" />
      </div>
      <div v-show="activeTab === 5" class="step-content-unified">
        <Step5Ac @onBack="toggleWizard(4, 70)" @onNext="finishWizard()" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../css/assets/scss/app2.scss';
</style>
