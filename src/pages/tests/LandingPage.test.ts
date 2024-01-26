import App from "../../App.vue";
import LandingPage from "../LandingPage.vue";
import SimulatorPage from "../SimulatorPage.vue";
import TrackingPage from "../TrackingPage.vue";
import { Router, createRouter, createWebHistory } from "vue-router";
import {
  mount,
  shallowMount,
  enableAutoUnmount,
  flushPromises,
} from "@vue/test-utils";
import { expect, test, describe, afterEach, beforeEach, vi } from "vitest";
import router from "../../routing/router";

enableAutoUnmount(afterEach);

let localRouter: Router;
beforeEach(async () => {
  localRouter = createRouter({
    history: createWebHistory(),
    routes: router.options.routes,
  });
});

describe("LandingPage mounting tests", () => {
    test("LandingPage mounts properly", () => {
        const wrapper = shallowMount(LandingPage);
        expect(wrapper.exists()).toBe(true);
    });
    
    test("LandingPage mounts when the App mounts on '/' path", async () => {
        localRouter.push("/");
    
        await localRouter.isReady();
        const wrapper = mount(App, {
        global: {
            plugins: [localRouter],
        },
        });
    
        expect(wrapper.findComponent(LandingPage).exists()).toBe(true);
    
        await flushPromises();
    });
});

describe("LandinPage navigation test", () => {
    test("LandingPage navigates to the TrackingPage from the respective href", async () => {
        localRouter.push("/");
    
        await localRouter.isReady();
        const wrapper = mount(App, {
        global: {
            plugins: [localRouter],
        },
        });

        const push = vi.spyOn(localRouter, 'push')
    
        const trackingLink = wrapper.find("#tracking");

        expect(trackingLink.exists()).toBe(true);
        await trackingLink.trigger("click");

        await flushPromises();

        expect(push).toHaveBeenCalledTimes(1)
        expect(push).toHaveBeenCalledWith('/tracking')

        expect(wrapper.findComponent(LandingPage).exists()).toBe(false);
        expect(wrapper.findComponent(TrackingPage).exists()).toBe(true);
        expect(localRouter.currentRoute.value.path).toBe("/tracking");
    });

    test("LandingPage navigates to the SimulatorPage from the respective href", async () => {
        localRouter.push("/");
    
        await localRouter.isReady();
        const wrapper = mount(App, {
        global: {
            plugins: [localRouter],
        },
        });

        const push = vi.spyOn(localRouter, 'push')
    
        const simulatorLink = wrapper.find("#simulator");

        expect(simulatorLink.exists()).toBe(true);
        await simulatorLink.trigger("click");

        await flushPromises();

        expect(push).toHaveBeenCalledTimes(1)
        expect(push).toHaveBeenCalledWith('/simulator')

        expect(wrapper.findComponent(LandingPage).exists()).toBe(false);
        expect(wrapper.findComponent(SimulatorPage).exists()).toBe(true);
        expect(localRouter.currentRoute.value.path).toBe("/simulator");
    });
})