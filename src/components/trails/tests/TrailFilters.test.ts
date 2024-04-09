import TrailFilters from "../TrailFilters.vue";
import BaseInput from "../../shared/BaseInput.vue";
import SelectInput from "../../shared/SelectInput.vue";
import {  createRouter, createWebHistory } from "vue-router";
import router from "../../../routing/router";
import { describe, test, expect, afterEach, beforeEach } from "vitest";
import { mount, enableAutoUnmount } from "@vue/test-utils";

const mockedUser = {
  id: 1,
  email: "bb@mail.com",
  name: "mockedUser",
  role: "user",
};

enableAutoUnmount(afterEach);


beforeEach(async () => {
  createRouter({
    history: createWebHistory(),
    routes: router.options.routes,
  });
});

describe("TrailFilters tests", () => {
    test("TrailFilters component renders correctly", () => {
        const wrapper = mount(TrailFilters, {
            props: {
                user: mockedUser,
            },
        });
        expect(wrapper).toBeDefined();
    });
    test("TrailFilter component renders with necessary inputs", () => {
        const wrapper = mount(TrailFilters, {
            props: {
                user: mockedUser,
            },
        });

        const searchInput = wrapper.get("#search").findComponent(BaseInput);
        const sortingInput = wrapper.get("#sort").findComponent(SelectInput);
        const orderInput = wrapper.get("#order").findComponent(SelectInput);
        const myTrailsLink = wrapper.get("#my-trails-link")//.findComponent(RouterLink);
        expect(searchInput.exists()).toBe(true);
        expect(sortingInput.exists()).toBe(true);
        expect(sortingInput.props().options).toEqual(["name", "location", "creator"]);
        expect(orderInput.props().options).toEqual(["asc", "desc"]);
        expect(orderInput.exists()).toBe(true);
        expect(myTrailsLink.attributes("to")).toBe("/subscribed-trails");
    });
    test("TrailFilter emits the search options when parameters change", async () => {
        const wrapper = mount(TrailFilters, {
            props: {
                user: mockedUser,
            },
        });

        const searchInput = wrapper.get("#search").findComponent(BaseInput);
        const sortingInput = wrapper.get("#sort").findComponent(SelectInput);
        const orderInput = wrapper.get("#order").findComponent(SelectInput);

        await searchInput.setValue("test search");

        await sortingInput.find("select").setValue("name");
        await orderInput.find("select").setValue("asc");
       
        await new Promise((r) => setTimeout(r, 1000));

        expect(wrapper.emitted("search")).toBeDefined();
        expect(wrapper.emitted("search")[0]).toEqual([
            {
                search: "test search",
                sort: "name",
                order: "asc",
            },
        ]);
    });

});
