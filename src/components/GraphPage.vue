<template>
  <div class="main_container">
    <div class="graph_container">
      <div>
        <canvas ref="chartCanvas" width="500" height="500"></canvas>
      </div>
      <div class="pie-chart-grid">
        <div v-for="(rokData, index) in pieChartData" :key="index">
          <canvas :id="'pie-chart-container-' + index" width="300" height="300"></canvas>
        </div>
      </div>
      <div>
        <canvas ref="lineChartCanvas" width="400" height="400"></canvas>
      </div>
    </div>
  </div>
</template>


<script>
import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';


export default {
  name: "GraphPage",
  data() {
    return {
      xmlData: [],
      chartCreated: false,
      chart: null,
      pieCharts: [],
    };
  },

  computed: {
    pieChartData() {
      return this.xmlData.map((record) => ({
        rok: record.rok,
        data: record.hodnotenie,
      }));
    },
  },

  methods: {
    async fetchAndParseXML() {
      try {
        const xmlFilePath = "/z03.xml";
        const response = await fetch(xmlFilePath);
        const xmlString = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");

        const zaznamElements = xmlDoc.querySelectorAll("zaznam");
        const parsedData = [];

        zaznamElements.forEach((zaznamElement) => {
          const rok = zaznamElement.querySelector("rok").textContent;
          const hodnotenieElement = zaznamElement.querySelector("hodnotenie");
          const hodnotenie = {};

          hodnotenieElement.childNodes.forEach((childNode) => {
            if (childNode.nodeType === 1) {
              const gradeType = childNode.nodeName;
              const gradeValue = childNode.textContent;
              hodnotenie[gradeType] = gradeValue;
            }
          });

          parsedData.push({
            rok: rok,
            hodnotenie: hodnotenie,
          });
        });

        this.xmlData = parsedData;
        this.drawCharts();
      } catch (error) {
        console.error("Error fetching/parsing XML:", error);
      }
    },

    drawPieChart(canvasId, data, rok) {
  const values = Object.values(data);
  const total = values.reduce((acc, value) => acc + parseFloat(value), 0); // Use parseFloat to handle string values

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: values,
        backgroundColor: Object.keys(data).map(
          () => `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}, 0.55)`
        ),
        borderColor: Object.keys(data).map(
          () => `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}, 1)`
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      enabled: true,
    },
    plugins: {
      title: {
        display: true,
        text: `${rok}`,
        font: {
          size: 16,
        },
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 12,
          font: {
            size: 12,
          },
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const ds = data.datasets[0];

              const percentageData = ds.data.map((value) => {
                const percentage = total === 0 ? 0 : (parseFloat(value) / total) * 100; // Use parseFloat to handle string values
                return `${percentage.toPrecision(3)}%`;
              });

              return data.labels.map((label, i) => ({
                text: `${label}: ${ds.data[i]} (${percentageData[i]})`,
                fillStyle: ds.backgroundColor[i],
                strokeStyle: ds.borderColor[i],
                lineWidth: ds.borderWidth,
                hidden: isNaN(ds.data[i]) || chart.getDatasetMeta(0).data[i].hidden,
                index: i,
              }));
            }
            return [];
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
  };

  const ctx = document.getElementById(canvasId).getContext("2d");

  const pieChart = new Chart(ctx, {
    type: "pie",
    data: chartData,
    options: chartOptions,
    plugins: [ChartDataLabels],
  });

  this.pieCharts.push(pieChart);
},





    async drawPieCharts() {
      this.pieCharts.forEach((pieChart) => {
        pieChart.destroy();
      });

      this.pieCharts = [];

      for (let index = 0; index < this.pieChartData.length; index++) {
        await this.$nextTick();
        const { data, rok } = this.pieChartData[index];
        this.drawPieChart(`pie-chart-container-${index}`, data, rok);
      }
    },

    plotBarChart(ctx) {
      if (!this.xmlData || this.xmlData.length === 0) {
        return;
      }

      const rokValues = [...new Set(this.xmlData.map((record) => record.rok))];
      const firstRecord = this.xmlData[0];

      if (!firstRecord || !firstRecord.hodnotenie) {
        return;
      }

      const hodnotenieKeys = Object.keys(firstRecord.hodnotenie);
      const datasets = hodnotenieKeys.map((key) => {
        const dataValues = rokValues.map((rok) => {
          const record = this.xmlData.find((record) => record.rok === rok);

          if (!record || !record.hodnotenie || record.hodnotenie[key] === undefined) {
            return null;
          }

          const value = record.hodnotenie[key];

          if (Array.isArray(value)) {
            return value[0];
          }

          return value;
        });

        return {
          label: key,
          data: dataValues,
          backgroundColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}, 0.35)`,
          borderColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}, 1)`,
          borderWidth: 1,
        };
      });

      const chartData = {
        labels: rokValues,
        datasets: datasets,
      };

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Webte1 grades through the years:',
            font: {
              size: 16,
            },
          },
        },
      };

      if (this.chartCreated && this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions,
      });

      this.chartCreated = true;
    },

    plotHorizontalBarChart(ctx) {
      if (!this.xmlData || this.xmlData.length === 0) {
        return;
      }

      const rokValues = [...new Set(this.xmlData.map((record) => record.rok))];
      const firstRecord = this.xmlData[0];

      if (!firstRecord || !firstRecord.hodnotenie) {
        return;
      }

      const hodnotenieKeys = Object.keys(firstRecord.hodnotenie);
      const datasets = hodnotenieKeys.map((key) => {
        const dataValues = rokValues.map((rok) => {
          const record = this.xmlData.find((record) => record.rok === rok);

          if (!record || !record.hodnotenie || record.hodnotenie[key] === undefined) {
            return null;
          }

          const value = record.hodnotenie[key];

          if (Array.isArray(value)) {
            return value[0];
          }

          return value;
        });

        return {
          label: key,
          data: dataValues,
          backgroundColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}, 0.35)`,
          borderColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}, 1)`,
          borderWidth: 1,
        };
      });

      const chartData = {
        labels: rokValues,
        datasets: datasets,
      };

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Webte1 grades through the years:',
            font: {
              size: 16,
            },
          },
        },
      };

      if (this.chartCreated && this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions,
      });

      this.chartCreated = true;
    },

    plotLineChart(ctx) {
  if (!this.xmlData || this.xmlData.length === 0) {
    return;
  }

  const rokValues = [...new Set(this.xmlData.map((record) => record.rok))];
  const firstRecord = this.xmlData[0];

  if (!firstRecord || !firstRecord.hodnotenie || !firstRecord.hodnotenie.A) {
    return;
  }

  const dataValues = rokValues.map((rok) => {
    const record = this.xmlData.find((record) => record.rok === rok);

    if (!record || !record.hodnotenie || record.hodnotenie.A === undefined) {
      return null;
    }

    const value = record.hodnotenie.A;

    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  });

  const chartData = {
    labels: rokValues,
    datasets: [
      {
        label: "Amount A",
        data: dataValues,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Amount of grade A through the years:',
        font: {
          size: 16,
        },
      },
    },
  };

  this.lineChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: chartOptions,
  });
},


drawCharts() {
  const screenWidth = window.innerWidth;
  if (this.$refs.chartCanvas && this.$refs.chartCanvas.getContext) {
    const ctx = this.$refs.chartCanvas.getContext("2d");

    if (this.chartCreated && this.chart) {
      this.chart.destroy();
    }

    if (screenWidth <= 800) {
      this.plotHorizontalBarChart(ctx);
    } else {
      this.plotBarChart(ctx);
    }
  }

  this.drawPieCharts();

  this.plotLineChart(this.$refs.lineChartCanvas.getContext("2d"));
},




    handleResize() {
  this.drawCharts();
},


  },

  mounted() {
    //window.addEventListener("resize", this.handleResize);
    this.fetchAndParseXML();
    this.handleResize();
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    if (this.chartCreated && this.chart) {
      this.chart.destroy();
    }

    this.pieCharts.forEach((pieChart) => {
      pieChart.destroy();
    });
  },
};
</script>

<style scoped>
.graph_container {
  margin-top: 35px;
  margin: 30px;
  max-width: 1000px;
  position: relative;
  margin: 0 auto;
}

.pie-chart-grid {
  gap: 20px;
  max-width: 1000px;
  position: relative;
  margin: 0 auto;
  padding-bottom: 75px;
  margin-top: 25px;
}

@media (max-width: 800px) {
  .pie-chart-grid {
    grid-template-columns: 1fr;
  }
}

* {
  background-color: #e9ebee;
  padding: 5px;
}
</style>
