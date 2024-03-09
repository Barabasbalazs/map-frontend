import MapComponent from "../TrackingMapComponent.vue";
import BaseModal from "../../shared/BaseModal.vue";
import { Router, createRouter, createWebHistory } from "vue-router";
import router from "../../../routing/router";
import { mount, enableAutoUnmount, flushPromises } from "@vue/test-utils";
import { expect, test, describe, afterEach, beforeEach } from "vitest";

enableAutoUnmount(afterEach);

let localRouter: Router;
beforeEach(async () => {
  localRouter = createRouter({
    history: createWebHistory(),
    routes: router.options.routes,
  });
});

describe("MapComponent no connection tests", () => {
    
   test("When no connection is established, an Error modal is shown after 1 second", async () => {
        const wrapper = mount(MapComponent);
        await flushPromises();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(wrapper.findComponent(BaseModal).exists()).toBe(true);
        expect(wrapper.findComponent(BaseModal).props("isOpen")).toBe(true);

        const modal = wrapper.findComponent(BaseModal);

        const title = modal.find("#modal-title");

        expect(title.text()).toBe("Error");
   })
   
   test("The no connection error modal triggers a retry and on fail opens again", async () => {
        const wrapper = mount(MapComponent);
        await flushPromises();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(wrapper.findComponent(BaseModal).exists()).toBe(true);

        const modal = wrapper.findComponent(BaseModal);

        const title = modal.find("#modal-title");

        expect(title.text()).toBe("Error");

        const retryButton = modal.find("#modal-cancel-button");

        await retryButton.trigger("click");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(wrapper.findComponent(BaseModal).props("isOpen")).toBe(false);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        await flushPromises();
        expect(wrapper.findComponent(BaseModal).props("isOpen")).toBe(true);
        expect(wrapper.findComponent(BaseModal).exists()).toBe(true);
   })

   test("The no connection modal return button triggers a return to the previous page", async () => {

        localRouter.push("/");

        await localRouter.isReady();

        localRouter.push("/tracking");

        const wrapper = mount(MapComponent);
        await flushPromises();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(wrapper.findComponent(BaseModal).exists()).toBe(true);

        const modal = wrapper.findComponent(BaseModal);

        const title = modal.find("#modal-title");

        expect(title.text()).toBe("Error");

        const returnButton = modal.find("#modal-confirmation-button");

        await returnButton.trigger("click");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(router.currentRoute.value.path).toBe("/");
   })
});