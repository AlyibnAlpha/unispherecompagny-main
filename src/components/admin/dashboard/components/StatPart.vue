<template>
  <BRow class="stats-row-modern">
    <BCol md="6" lg="3" v-for="stat in stats" :key="stat.id" class="mb-4">
      <div class="stat-card-modern" :class="`stat-${stat.color}`">
        <div class="stat-icon-wrapper">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">
            <CountToComponent :startVal="0" :endVal="stat.value" :duration="2000" />
          </div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
        <div class="stat-decoration"></div>
      </div>
    </BCol>
  </BRow>
</template>

<script>
import CountToComponent from '../../../../components/common/CountToComponent.vue'
import { BRow, BCol } from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
import { onMounted, ref, computed } from 'vue'

export default {
  components: {
    CountToComponent,
    BRow,
    BCol,
  },
  setup() {
    const Tq = ref(0)
    const Tr = ref(0)
    const Tav = ref(0)
    const Tpoint = ref(0)

    const stats = computed(() => [
      {
        id: 1,
        label: 'Sondages disponibles',
        value: Tav.value,
        icon: 'bi bi-clipboard-data-fill',
        color: 'orange',
      },
      {
        id: 2,
        label: 'Enquêtes en cours',
        value: Tq.value,
        icon: 'bi bi-hourglass-split',
        color: 'blue',
      },
      {
        id: 3,
        label: 'Enquêtes complétées',
        value: Tr.value,
        icon: 'bi bi-check-circle-fill',
        color: 'green',
      },
      {
        id: 4,
        label: 'Points gagnés',
        value: Tpoint.value,
        icon: 'bi bi-trophy-fill',
        color: 'purple',
      },
    ])

    const gets = async () => {
      const response = await api.get('/participants/dashboard/overview')
      const resp = await api.get('/participants/points/balance')

      Tpoint.value = resp.data.totalPoints
      Tav.value = response.data.surveys_available?.length || 0
      Tq.value = response.data.stats.total_surveys_in_progress
      Tr.value = response.data.stats.total_surveys_completed
    }

    onMounted(() => {
      gets()
    })

    return {
      stats,
    }
  },
}
</script>

<style lang="scss">
@import '../../../../css/assets/scss/app2.scss';
@import '../../../../css/admin/dashboard.scss';
@import 'src/css/participant/surveys.scss';
</style>
