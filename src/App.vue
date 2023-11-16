<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary bg-primary bg-gradient mt-0 navbar-fixed-top">
      <div class="container-fluid">
        <router-link to="/results" class="navbar-brand">Graphs</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/results" class="nav-link" aria-current="page">Grades</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/live-graph" class="nav-link">Live Graph</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <router-view class="main_viewport"></router-view>
  </div>
</template>

<script>


export default {
  name: 'App',
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
  color: #1f2933;
  background-color: #e9ebee;
}
.main_viewport{
  max-width: 1200px;
  position: relative;
  margin: 0 auto;
}
.router-link {
  cursor: pointer;
}
.main_container{
  position: relative;
  margin: 0 auto;
  max-width: 1200px;
}
body {
  background-color: #e9ebee;
  padding: 5px;
}
</style>
