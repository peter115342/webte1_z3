<template>
  <div class="main_container">
    <h1>Live Sine and Cosine Chart</h1>
    <canvas class="live_chart" ref="chartCanvas" width="750" height="400"></canvas>
    <div class="controls-container">
      <div class="checkbox-container">
        <label>
          <input type="checkbox" v-model="checkboxSine"> Hide Sine
        </label>
      </div>
      <div class="checkbox-container">
        <label>
          <input type="checkbox" v-model="checkboxCosine"> Hide Cosine
        </label>
      </div>
      <RangeSlider :min="1" :max="10"  @amplitudeChange="updateAmplitude" :amplitude="amplitudeSize"></RangeSlider>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import ChartZoom from 'chartjs-plugin-zoom';
import RangeSlider from './RangeSlider';

Chart.register(ChartZoom);
export default {
  components: {
    RangeSlider,
  },
  data() {
    return {
      chart: null,
      data: [],
      eventSource: null,
      checkboxSine: false,
      checkboxCosine: false,
      amplitudeSize: 1,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeEmptyChart();
      this.fetchData();
      setInterval(this.fetchData, 1000);
    });
  },
  methods: {
    initializeEmptyChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d');

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Sine',
              data: [],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Cosine',
              data: [],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            zoom: {
              pan: {
                enabled: true,
                mode: 'xy',
              },
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: 'xy',
              },
            },
          },
        },
      });
    },
    fetchData() {
      const apiUrl = 'https://old.iolab.sk/evaluation/sse/sse.php';

      const parseResponse = (text) => {
        if (!text) {
          console.error('Received undefined data from SSE');
          return null;
        }

        try {
          const jsonData = JSON.parse(text.replace(/data:/g, '"data":'));
          return jsonData;
        } catch (error) {
          console.error('Error parsing JSON:', error);
          return null;
        }
      };

      const updateChart = (data) => {
        this.chart.data.labels.push(data.x);
        if (!this.checkboxSine) {
          this.chart.data.datasets[0].data.push(parseFloat(data.y1) * this.amplitudeSize);
        }

        if (!this.checkboxCosine) {
          this.chart.data.datasets[1].data.push(parseFloat(data.y2) * this.amplitudeSize);
        }
      };

      const eventListener = (event) => {
        const data = parseResponse(event.data);
        if (data) {
          this.data = data;
          updateChart(this.data);

        }
      };

      this.eventSource = new EventSource(apiUrl);
      this.eventSource.addEventListener('message', eventListener);
    },
    beforeUnmount() {
      if (this.eventSource) {
        this.eventSource.close();
      }
    },
    updateAmplitude(value) {
      this.amplitudeSize = value;
    },
  },
};

</script>

<style scoped>
* {
  background-color: #e9ebee;
  padding: 5px;
}
.live_chart {
  margin: 15px;
}
.controls-container {
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  position: relative;
  width: 500px;
}
.slider_container {
  display: flex;
  flex-direction: column;
}
</style>
