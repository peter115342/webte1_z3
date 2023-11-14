<template>
    <div>
      <div class="graph_container">
        <div>
          <canvas id="chart-container" width="400" height="400"></canvas> 
         </div>
         <div>
          <canvas id="pie-chart-container-1" width="200" height="200"></canvas> 
         </div>
         <div>
          <canvas id="pie-chart-container-2" width="200" height="200"></canvas> 
         </div>
         <div>
          <canvas id="pie-chart-container-3" width="200" height="200"></canvas> 
         </div>
    </div>
  </div>

    </template>

    <script>

    export default {
  name: 'LiveGraph',
  data() {
    return {
      greeting: 'Hello, Vue!'
    };
  }
};
    </script>
