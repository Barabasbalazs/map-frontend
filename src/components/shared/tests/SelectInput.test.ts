import SelectInput from "../SelectInput.vue";
import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";

const baseProps = {
  label: "Test Label",
  options: ["Option 1", "Option 2", "Option 3"],
};

describe("SelectInput related tests", () => {
  test("SelectInput renders with the correct label", () => {
    const wrapper = mount(SelectInput, {
      props: baseProps,
    });
    expect(wrapper.html()).toContain("Test Label");
  });
  test("SelectInput renders with the correct options", () => {
    const wrapper = mount(SelectInput, {
      props: baseProps,
    });
    expect(wrapper.findAll("option").length).toBe(3);
  });
  test("SelectInput has the correct default value", () => {
    const wrapper = mount(SelectInput, {
      props: {
        ...baseProps,
        modelValue: "Option 1",
      },
    });
    expect(wrapper.find("select").element.value).toBe("Option 1");
  });
  test("SelectInput emits the correct value upon choosing", async () => {
    const wrapper = mount(SelectInput, {
      props: baseProps,
    });
    await wrapper.find("select").setValue("Option 2");
    expect(wrapper.emitted("update:modelValue")).toEqual([["Option 2"]]);
  });
  test("Disabled SelectInput should not emit any value", async () => {
    const wrapper = mount(SelectInput, {
      props: {
        ...baseProps,
        disabled: true,
      },
    });
    await wrapper.find("select").setValue("Option 2");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });
  test("SelectInput should render error message if prop is passed", () => {
    const wrapper = mount(SelectInput, {
      props: {
        ...baseProps,
        error: "Error message",
      },
    });
    expect(wrapper.find("#error").text()).toBe("Error message");
  })
});
