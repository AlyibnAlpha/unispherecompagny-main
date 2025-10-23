<template>
  <q-card class="q-pa-md">
    <canvas ref="chartCanvas"></canvas>
  </q-card>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  props: {
    dataMonths: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chartInstance = null

    const renderChart = () => {
      if (chartInstance) chartInstance.destroy()

      const labels = props.dataMonths.map((d) => d.month)
      const data = props.dataMonths.map((d) => d.count)

      chartInstance = new Chart(chartCanvas.value, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Nombre de réponses',
              data,
              backgroundColor: '#42A5F5',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Réponses par mois' },
          },
        },
      })
    }

    onMounted(() => renderChart())

    watch(
      () => props.dataMonths,
      () => renderChart(),
      { deep: true },
    )

    return { chartCanvas }
  },
}
</script>

<style scoped>
canvas {
  width: 100% !important;
  max-height: 300px;
}
</style>
