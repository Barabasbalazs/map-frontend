import App from "./App.vue";
import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";

describe("App not breaking", () => {
  test("App should render", () => {
    const wrapper = mount(App);
    expect(wrapper.getCurrentComponent()).toBeDefined();
  });
});