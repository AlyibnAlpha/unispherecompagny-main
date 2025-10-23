<template>
  <div>
    <h5>Réponses par genre</h5>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  props: {
    dataGender: {
      type: Object,
      default: () => ({ male: 0, female: 0, other: 0 }),
    },
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chartInstance = null

    const renderChart = () => {
      if (chartInstance) chartInstance.destroy()

      const labels = ['Homme', 'Femme', 'Autre']
      const data = [props.dataGender.male, props.dataGender.female, props.dataGender.other]

      chartInstance = new Chart(chartCanvas.value, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              label: 'Nombre de réponses',
              data,
              backgroundColor: ['#42A5F5', '#FF6384', '#FFA726'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Réponses par genre' },
          },
        },
      })
    }

    onMounted(() => renderChart())
    watch(
      () => props.dataGender,
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
