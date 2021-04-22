import Vue from 'vue'
import VueRouter from 'vue-router'
import Render from '../views/3D_Modeling.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '3D_Modeling',
    component: Render
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
