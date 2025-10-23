<template>
  <q-card class="q-pa-md">
    <canvas ref="chartRef" style="max-width: 100%"></canvas>
  </q-card>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { Chart, registerables } from 'chart.js'

// Enregistrement des composants nécessaires
Chart.register(...registerables)

const chartRef = ref(null)
let chartInstance = null

onMounted(() => {
  if (chartRef.value) {
    chartInstance = new Chart(chartRef.value, {
      type: 'radar',
      data: {
        labels: ['Janvier', 'Février', 'Mars', 'Avril'],
        datasets: [
          {
            label: 'Ventes',
            data: [100, 200, 150, 300],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Statistiques des Ventes',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>
