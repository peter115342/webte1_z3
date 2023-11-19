<template>
  <div class="main_container">
    <h3>Live Sine and Cosine Chart</h3>
    <canvas class="live_chart" ref="chartCanvas" width="750" height="450"></canvas>
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
      <div class="slider_container">
      <RangeSlider class="slider_range" :min="1" :max="10" @amplitudeChange="updateAmplitude" :amplitude="amplitudeSize"></RangeSlider>
    </div>
      <button class="end_button" @click="endGraph">Pause/Resume Graph</button>
    </div>
    <p>(Please refresh the page if the graph is not plotting correctly)</p>
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
      checkboxSine: false,
      checkboxCosine: false,
      amplitudeSize: 1,
      graphRefresh: true,
      isGraphEnded: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeEmptyChart();
      this.fetchData();
      window.dispatchEvent(new Event('resize'));
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
              borderWidth: 2,
              hidden: false,
              tension : 0.2,
            },
            {
              label: 'Cosine',
              data: [],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              hidden: false,
              tension : 0.2,
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
        if (!this.isGraphEnded) {
          this.chart.data.labels.push(data.x);

          this.chart.data.datasets[0].data.push(parseFloat(data.y1) * this.amplitudeSize);
          this.chart.data.datasets[1].data.push(parseFloat(data.y2) * this.amplitudeSize);

          this.chart.data.datasets[0].hidden = this.checkboxSine;
          this.chart.data.datasets[1].hidden = this.checkboxCosine;

          this.chart.update();
        } else {
          this.unzoomGraph();
          this.chart.update();

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
    endGraph() {
      if(this.isGraphEnded){
      this.isGraphEnded = false;
      }
      else{
        this.isGraphEnded = true;
      }
      this.chart.update();

    },
    unzoomGraph() {
  this.chart.resetZoom();


  this.chart.options.scales.x.min = null;
  this.chart.options.scales.x.max = null;
  this.chart.options.scales.y.min = null;
  this.chart.options.scales.y.max = null;
  this.chart.update();


},
  },
};
</script>

<style scoped>
.slider_container{
  border: 2px solid #b2b3b4;
  border-radius: 5px;
  width: 160px;
  position: relative;
  margin: 0  auto;
}
* {
  background-color: #e9ebee;
  padding: 5px;
}


.live_chart {
  margin: 7px;
}
.controls-container {
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  position: relative;
  width: 100%;
  max-width: 600px;
}



@media (max-width: 800px) {
  .controls-container {
    flex-direction: column;
  }
}


.slider_range{
  display: flex;
  flex-direction: column;
  width: 150px;
  position: relative;
  margin: 0 auto;
}

.end_button {
  height: 25%;
  width: 150px;
  position: relative;
  margin: 0 auto;
  margin-top: 15px;
  border: 2px solid #b2b3b4;
  border-radius: 5px;
  background: #e6e6e6;
}


</style>
