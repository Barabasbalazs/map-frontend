import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../pages/LandingPage.vue";
import TrackingPage from "../pages/TrackingPage.vue";
import SimulatorPage from "../pages/SimulatorPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";

const routes = [
  { path: "/", name: "Landing Page", component: LandingPage },
  { path: "/tracking", name: "Tracking Page", component: TrackingPage },
  { path: "/simulator", name: "Simulator Page",component: SimulatorPage },
  { path: '/:pathMatch(.*)*', name: 'NotFound Page', component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
