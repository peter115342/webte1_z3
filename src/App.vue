<template>
  <GraphPage msg="Welcome to Your Vue.js App"/>

</template>

<script>
import GraphPage from './components/GraphPage.vue'

export default {
  name: 'App',
  components: {
    GraphPage
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Muli&display=swap');
@import url('https://fonts.googleapis.com/css?family=Quicksand&display=swap');
* {
  font-family: 'Muli', sans-serif;
}
.navbar.bg-primary{
  background-color: rgb(122, 65, 162) !important;
}

.navbar{
  border-bottom: 3px solid black;
}
.loading{
  margin-top: 25px;

}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
