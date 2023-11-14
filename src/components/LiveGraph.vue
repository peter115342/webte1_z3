<template>
  <div>
    <h1>Live Chart with Sine and Cosine</h1>
    <canvas ref="chartCanvas" width="800" height="400"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      chart: null,
      data: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      const labels = Array.from({ length: 360 }, (_, i) => i);
      const sineData = labels.map(angle => ({ label: angle, value: Math.sin((angle * Math.PI) / 180) }));
      const cosineData = labels.map(angle => ({ label: angle, value: Math.cos((angle * Math.PI) / 180) }));

      this.data = [
        { label: 'Sine', values: sineData },
        { label: 'Cosine', values: cosineData },
      ];

      this.drawChart();
    },
    drawChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.chartCanvas.getContext('2d');

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.data[0].values.map(item => item.label),
          datasets: [
            {
              label: this.data[0].label,
              data: this.data[0].values.map(item => item.value),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: this.data[1].label,
              data: this.data[1].values.map(item => item.value),
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
  },
};
</script>

<style>
</style>
