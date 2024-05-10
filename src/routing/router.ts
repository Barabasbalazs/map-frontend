import TrackingPage from "../pages/TrackingPage.vue";
import SimulatorPage from "../pages/SimulatorPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import GeneralTrailsPage from "../pages/GeneralTrailsPage.vue";
import AdministrationPage from "../pages/AdministrationPage.vue";
import redirectService from "../services/router-service";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", name: "Trails Page", component: GeneralTrailsPage },
  { path: "/tracking/:id", name: "Tracking Page", component: TrackingPage },
  { path: "/simulator/:id", name: "Simulator Page", component: SimulatorPage },
  { path: "/login", name: "Login Page", component: LoginPage },
  { path: "/my-trails", name: "My Trails Page", component: GeneralTrailsPage },
  {
    path: "/subscribed-trails",
    name: "Subscribed Trails Page",
    component: GeneralTrailsPage,
  },
  {
    path: "/administration",
    name: "Administration Page",
    component: AdministrationPage,
  },
  { path: "/:pathMatch(.*)*", name: "NotFound Page", component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  return redirectService.beforeEach(to, _from, next);
});

export default router;
