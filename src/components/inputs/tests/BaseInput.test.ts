import BaseInput from "../BaseInput.vue";
import ToolTip from "../ToolTip.vue";
import { shallowMount, mount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";

describe("BaseInput Rendering Tests", () => {
  test("BaseInput displays label", () => {
    const wrapper = shallowMount(BaseInput, {
      props: {
        label: "Test Label",
      },
    });

    expect(wrapper.html()).toContain("Test Label");
  });
  test("BaseInput renders the input with proper type by default", () => {
    const wrapper = shallowMount(BaseInput, {
      props: {
        label: "Dummy text",
      },
    });

    expect(wrapper.find("input").attributes("type")).toBe("text");
  });
  test("BaseInput by default doesn't render error", () => {
    const wrapper = shallowMount(BaseInput, {
      props: {
        label: "Dummy text",
      },
    });

    const errorMessage = wrapper.find("#error");

    expect(errorMessage.exists()).toBe(false);
  });
  test("BaseInput renders error when error prop is passed", () => {
    const wrapper = shallowMount(BaseInput, {
      props: {
        label: "Dummy text",
        error: "Error text",
      },
    });

    expect(wrapper.html()).toContain("Error text");
  });
  test("BaseInput doesn't render tooltip by default", () => {
    const wrapper = mount(BaseInput, {
      props: {
        label: "Dummy text",
      },
    });

    const tooltipComponent = wrapper.findComponent(ToolTip);

    expect(tooltipComponent.exists()).toBe(false);
  });
  test("BaseInput renders tooltip when tooltip prop is passed", () => {
    //check this
    const wrapper = shallowMount(BaseInput, {
      props: {
        label: "Dummy text",
        tooltip: "Tooltip text",
      },
    });

    const tooltipComponent = wrapper.findComponent(ToolTip);

    expect(tooltipComponent.getCurrentComponent().props.text).toEqual(
      "Tooltip text"
    );
  });
  test("BaseInput number type test", () => {
    const wrapper = shallowMount(BaseInput, {
      props: {
        label: "Dummy test",
        type: "number",
      },
    });

    expect(wrapper.find("input").attributes("type")).toBe("number");
  });
  test("BaseInput should not render when nothing is passed", () => {
    try {
      shallowMount(BaseInput);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
  test("BaseInput should mount with the correct base settings", () => {
    const wrapper = shallowMount(BaseInput, {
      props: {
        label: "DDD",
      },
    });

    expect(wrapper.html()).toContain("DDD");
    expect(wrapper.find("input").attributes("type")).toBe("text");
    expect(wrapper.find("#error").exists()).toBe(false);
  });
});

describe("BaseInput behaviour tests", () => {
  test("BaseButton emits the entered value", async () => {
    const wrapper = shallowMount(BaseInput, {
      props: {
        label: "Enter something",
        modelValue: "initialText",
        "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
      },
    });

    await wrapper.find("input").setValue("test");
    expect(wrapper.props("modelValue")).toBe("test");
  });
});
