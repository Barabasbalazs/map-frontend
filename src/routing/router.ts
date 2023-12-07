import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../pages/LandingPage.vue";
import TrackingPage from "../pages/TrackingPage.vue";

const routes = [
    { path: '/', component: LandingPage },
    { path: '/tracking', component: TrackingPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;