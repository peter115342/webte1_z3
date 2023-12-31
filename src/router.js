import Vue from 'vue';
import Router from 'vue-router';
import GraphPage from './components/GraphPage.vue';
import LiveGraph from './components/LiveGraph.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/graph-page'
    },
    {
      path: '/graph-page',
      name: 'GraphPage',
      component: GraphPage
    },
    {
      path: '/live-graph',
      name: 'LiveGraph',
      component: LiveGraph
    }
  ]
});
