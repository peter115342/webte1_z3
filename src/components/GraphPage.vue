<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary bg-primary  bg-gradient mt-0 navbar-fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Graphs</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Results</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Active Graph</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
 
  <div>
    <div>
      <div>
        <canvas id="chart-container" width="400" height="400"></canvas>  </div>
  </div>
</div>
  
  </template>
  
  <script> 
  import Chart from "chart.js/auto";

  export default { name: "GraphPage", data() { return { xmlData: [], chart: null, }; },

   methods: { fetchAndParseXML() { 
    const xmlFilePath = "/z03.xml";
  
    fetch(xmlFilePath)
      .then((response) => response.text())
      .then((xmlString) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  
        const zaznamElements = xmlDoc.querySelectorAll('zaznam');
        const parsedData = [];
  
        zaznamElements.forEach((zaznamElement) => {
          const rok = zaznamElement.querySelector('rok').textContent;
          const hodnotenieElement = zaznamElement.querySelector('hodnotenie');
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
        this.plotBarChart();
      })
      .catch((error) => console.error('Error fetching XML:', error));
  },
  
  plotBarChart() {
    const rokValues = [...new Set(this.xmlData.map((record) => record.rok))];
    const hodnotenieKeys = Object.keys(this.xmlData[0].hodnotenie);
    const datasets = hodnotenieKeys.map((key) => {
      const dataValues = rokValues.map((rok) => {
        const record = this.xmlData.find((record) => record.rok === rok);
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
    };
  
    const ctx = document.getElementById('chart-container').getContext('2d');
  
    if (this.chart) {
      this.chart.destroy();
    }
  
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    });
  },
  
  }, mounted() { this.fetchAndParseXML(); },
   beforeUnmount() { if (this.chart) { this.chart.destroy(); } }, }; 
  </script>
