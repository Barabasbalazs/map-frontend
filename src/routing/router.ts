import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../pages/LandingPage.vue";
import TrackingPage from "../pages/TrackingPage.vue";
import SimulatorPage from "../pages/SimulatorPage.vue";

const routes = [
  { path: "/", component: LandingPage },
  { path: "/tracking", component: TrackingPage },
  { path: "/simulator", component: SimulatorPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
