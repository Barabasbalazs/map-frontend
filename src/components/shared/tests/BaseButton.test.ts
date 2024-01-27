import BaseButtonVue from "../BaseButton.vue";
import { shallowMount, mount, enableAutoUnmount } from "@vue/test-utils";
import { test, expect, describe, afterEach } from "vitest";

enableAutoUnmount(afterEach);

describe("BaseButton functionality tests", () => {
  test("BaseButton slot renders correctly", () => {
    const wrapper = mount(BaseButtonVue, {
      slots: {
        default: "Test Text",
      },
    });

    expect(wrapper.html()).toContain("Test Text");
  });

  test("BaseButton emits click event", () => {
    const wrapper = shallowMount(BaseButtonVue);

    wrapper.trigger("click");

    expect(wrapper.emitted("click")).toHaveLength(1);
  });

  test("BaseButton is disabled when disabled prop is true", () => {
    const wrapper = shallowMount(BaseButtonVue, {
      props: {
        disabled: true,
      },
    });

    expect(wrapper.getComponent({ name: "BaseButton" }).props("disabled")).toBe(
      true
    );
  });

  test("BaseButton doesn't emit click event when disabled prop is true", () => {
    const wrapper = shallowMount(BaseButtonVue, {
      props: {
        disabled: true,
      },
    });

    wrapper.trigger("click");

    expect(wrapper.emitted("click")).toBeUndefined();
  });

  test("BaseButton click only works when not disabled", async () => {
    const wrapper = shallowMount(BaseButtonVue, {
      slots: {
        default: "<p>Click me</p>",
      },
    });

    wrapper.trigger("click");

    await wrapper.setProps({ disabled: true });

    wrapper.trigger("click");

    const increment = wrapper.emitted("click");

    expect(increment).toHaveLength(1);
  });

  test("BaseButton when enableing it should trigger click event", async () => {
    const wrapper = shallowMount(BaseButtonVue, {
      slots: {
        default: "<p>Click me</p>",
      },
      props: {
        disabled: true,
      },
    });

    wrapper.trigger("click");
    wrapper.trigger("click");

    await wrapper.setProps({ disabled: false });

    wrapper.trigger("click");

    const increment = wrapper.emitted("click");

    expect(increment).toHaveLength(1);
  });

  test("BaseButton class is disabled when disabled prop is true", () => {
    const wrapper = shallowMount(BaseButtonVue, {
      props: {
        disabled: true,
      },
    });

    expect(wrapper.classes()).toContain("cursor-not-allowed");
  });

  test("BaseButton class should be disabled when changing props", async () => {
    const wrapper = shallowMount(BaseButtonVue);

    await wrapper.setProps({ disabled: true });

    expect(wrapper.classes()).toContain("cursor-not-allowed");
  });
});
