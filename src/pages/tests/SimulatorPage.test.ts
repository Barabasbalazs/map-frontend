import SimulatorPage from "../SimulatorPage.vue";
//import SimulationInput from "../../components/simulator/SimulationInput.vue";
//import PathDisplay from "../../components/simulator/PathDisplay.vue";
import { Router, createRouter, createWebHistory } from "vue-router";
import {
  // mount,
  shallowMount,
  enableAutoUnmount,
  // flushPromises,
} from "@vue/test-utils";
import { expect, test, describe, afterEach, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "../../stores/auth-store";
import { useTrailsStore } from "../../stores/trails-store";
import router from "../../routing/router";
import redirectService from "../../services/router-service";
//import BaseInputVue from "../../components/shared/BaseInput.vue";

enableAutoUnmount(afterEach);

let localRouter: Router;
beforeEach(async () => {
  localRouter = createRouter({
    history: createWebHistory(),
    routes: router.options.routes,
  });
  localRouter.beforeEach((to, _from, next) => {
    return redirectService.beforeEach(to, _from, next);
  });
  setActivePinia(createPinia());
  useAuthStore().user = {
    id: "1",
    name: "test",
    email: "mm",
  };
  useTrailsStore().trail = {
    id: "1",
    name: "Test trail",
    location: "Test location",
    path: [
      {
        name: "Test path",
        coordinates: { lat: 1, lng: 1 },
      },
    ],
    creator: {
      id: "1",
      email: "creator@mail.com",
      role: "guide",
      name: "Creator",
    },
  };
});

describe("SimulatorPage mounting tests", () => {
  test("SimulatorPage mounts properly", () => {
    const wrapper = shallowMount(SimulatorPage);
    expect(wrapper.exists()).toBe(true);
  });
});
/*
describe("SimulatorPage child component rendering tests", () => {
  test("SimulatorPage renders SimulationInput component", () => {
    const wrapper = mount(SimulatorPage);

    expect(wrapper.findComponent(SimulationInput).exists()).toBe(true);
  });

  test("SimulatorPage renders PathDisplay component after giving correct input", async () => {
    const wrapper = mount(SimulatorPage);
    const input = wrapper.getComponent(SimulationInput);

    expect(input).toBeDefined();

    await input.get("#lat").getComponent(BaseInputVue).setValue("1");
    await input.get("#lng").getComponent(BaseInputVue).setValue("1");
    await input.get("#speed").getComponent(BaseInputVue).setValue("1");
    await input.get("#distance").getComponent(BaseInputVue).setValue("1");

    const button = input.find("button");

    await button.trigger("click");

    await flushPromises();

    console.log('ww',wrapper.html());

    expect(wrapper.findComponent(PathDisplay).exists()).toBe(true);
    expect(wrapper.findComponent(SimulationInput).exists()).toBe(false);
  });

  test("SimulatorPage doesn't render PathDisplay component after giving incorrect input", async () => {
    const wrapper = mount(SimulatorPage);
    const input = wrapper.getComponent(SimulationInput);

    expect(input).toBeDefined();

    await input.get("#lat").getComponent(BaseInputVue).setValue("1");
    await input.get("#lng").getComponent(BaseInputVue).setValue("1");
    await input.get("#speed").getComponent(BaseInputVue).setValue("1");
    await input.get("#distance").getComponent(BaseInputVue).setValue("1");

    const button = input.find("button");

    await button.trigger("click");

    await flushPromises();

    expect(wrapper.findComponent(PathDisplay).exists()).toBe(false);
    expect(wrapper.findComponent(SimulationInput).exists()).toBe(true);
  });

  test("SimulatorPage rerenders SimulationInput component if PathDisplay emits finishedBroadcast", async () => {
    const wrapper = mount(SimulatorPage);

    const input = wrapper.getComponent(SimulationInput);

    expect(input).toBeDefined();

    await input.get("#lat").getComponent(BaseInputVue).setValue("1");
    await input.get("#lng").getComponent(BaseInputVue).setValue("1");
    await input.get("#speed").getComponent(BaseInputVue).setValue("1");
    await input.get("#distance").getComponent(BaseInputVue).setValue("1");

    const generatorButton = input.find("button");

    await generatorButton.trigger("click");

    await flushPromises();

    expect(wrapper.findComponent(PathDisplay).exists()).toBe(true);
    expect(wrapper.findComponent(SimulationInput).exists()).toBe(false);

    const pathDisplay = wrapper.getComponent(PathDisplay);

    pathDisplay.vm.$emit("finishedBroadcast");

    await flushPromises();

    expect(wrapper.findComponent(SimulationInput).exists()).toBe(true);
    expect(wrapper.findComponent(PathDisplay).exists()).toBe(false);
  });
});
*/
