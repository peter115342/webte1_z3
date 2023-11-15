<template>
  <div class="main_container">
    <h1>Live Sine and Cosine Chart</h1>
    <canvas class="live_chart" ref="chartCanvas" width="750" height="400"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      chart: null,
      data: [],
      eventSource: null,
      animationTimeoutId: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeEmptyChart();
      this.fetchData();
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
        // Update chart data
        this.chart.data.labels.push(data.x);
        this.chart.data.datasets[0].data.push(parseFloat(data.y1));
        this.chart.data.datasets[1].data.push(parseFloat(data.y2));

        const maxDataPoints = 50;
        if (this.chart.data.labels.length > maxDataPoints) {
          this.chart.data.labels.shift();
          this.chart.data.datasets[0].data.shift();
          this.chart.data.datasets[1].data.shift();
        }

        // Update the chart without recursion
        this.chart.update();
      };

      const animateChartUpdate = async () => {
        // Update the chart and wait for a short delay before the next iteration
        if (this.data) {
          updateChart(this.data);
        }
        this.animationTimeoutId = setTimeout(() => {
          animateChartUpdate();
        }, 16); // Adjust the delay as needed
      };

      const eventListener = (event) => {
        console.log('Raw data:', event.data);
        const data = parseResponse(event.data);
        console.log('Parsed data:', data);
        if (data) {
          this.data = data;
        }
      };

      this.eventSource = new EventSource(apiUrl);
      this.eventSource.addEventListener('message', eventListener);

      // Start the animation loop
      animateChartUpdate();
    },
    beforeUnmount() {
      if (this.eventSource) {
        this.eventSource.close();
        
      }
      // Clear the timeout when the component is unmounted
      clearTimeout(this.animationTimeoutId);
      cancelAnimationFrame(this.animationFrameId);
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
</style>
