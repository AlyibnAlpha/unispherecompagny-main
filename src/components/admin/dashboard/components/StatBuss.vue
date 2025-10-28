<template>
  <BRow>
    <BCol md="6" cols="xl-6">
      <BCard no-body class="business-card stat-card shadow-warning">
        <BCardBody class="business-card-body d-flex justify-content-between align-items-center">
          <div>
            <h4 class="fw-bold mb-1 fs-5">
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-file-text text-warning fs-3 me-2"></i>
                <h4 class="fw-bold mb-0 fs-2">
                  <CountToComponent :startVal="0" :endVal="Tq" :duration="2000" />
                </h4>
              </div>
            </h4>
            <span class="badge bg-warning-subtle text-warning fw-semibold px-3 py-1 rounded-pill"
              >Sondanges</span
            >
          </div>
          <div class="float-end mt-2">
            <apexchart
              class="apex-charts"
              dir="ltr"
              width="55"
              height="45"
              :options="chartOptions"
              :series="series"
            ></apexchart>
          </div>
        </BCardBody>
      </BCard>
    </BCol>

    <BCol md="6" cols="xl-6">
      <BCard no-body class="business-card stat-card shadow-success">
        <BCardBody class="business-card-body d-flex justify-content-between align-items-center">
          <div>
            <div class="d-flex align-items-center mb-2">
              <i class="bi bi-check2-square text-success fs-3 me-2"></i>
              <h4 class="fw-bold mb-0 fs-2">
                <CountToComponent :startVal="0" :endVal="Tr" :duration="2000" />
              </h4>
            </div>

            <span class="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill"
              >Réponses</span
            >
          </div>
          <div class="float-end mt-2">
            <apexchart
              class="apex-charts"
              type="radialBar"
              dir="ltr"
              width="45"
              height="45"
              :options="orderRadial"
              :series="orderseries"
            ></apexchart>
          </div>
        </BCardBody>
      </BCard>
    </BCol>
  </BRow>
</template>

<script>
import CountToComponent from '../../../../components/common/CountToComponent.vue'
import { BRow, BCol, BCard, BCardBody } from 'bootstrap-vue-next'
import { api } from 'src/boot/axios'
import { onMounted, ref } from 'vue'
import ApexCharts from 'vue3-apexcharts'
export default {
  components: {
    CountToComponent,
    BRow,
    BCol,
    BCard,
    BCardBody,
    apexchart: ApexCharts,
  },
  data() {
    const Tq = ref(0)
    const Tr = ref(0)
    const gets = async () => {
      const response = await api.get('/business/dashboard/overview')
      console.log(response.data)

      Tq.value = response.data.survey_stats.total_surveys
      Tr.value = response.data.survey_stats.total_responses
    }
    onMounted(() => {
      gets()
    })
    return {
      series: [
        {
          data: [25, 66, 41, 89, 63, 25, 44, 20, 36, 40, 54],
        },
      ],
      chartOptions: {
        fill: {
          colors: ['#f1c40f'],
        },
        chart: {
          type: 'bar',
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: '50%',
          },
        },
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        xaxis: {
          crosshairs: {
            width: 1,
          },
        },
        tooltip: {
          fixed: {
            enabled: false,
          },
          x: {
            show: false,
          },
          y: {
            title: {
              formatter: function () {
                return ''
              },
            },
          },
          marker: {
            show: false,
          },
        },
      },

      orderseries: [70],
      orderRadial: {
        fill: {
          colors: ['#34c38f'],
        },
        chart: {
          sparkline: {
            enabled: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 0,
              size: '60%',
            },
            track: {
              margin: 0,
            },
            dataLabels: {
              show: false,
            },
          },
        },
      },
      customerseries: [55],
      Tq,
      Tr,
    }
  },
}
</script>
