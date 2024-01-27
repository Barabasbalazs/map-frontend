import BaseInput from "../BaseInput.vue";
import ToolTip from "../ToolTip.vue";
import { shallowMount, mount, enableAutoUnmount } from "@vue/test-utils";
import { test, expect, describe, afterEach } from "vitest";

enableAutoUnmount(afterEach);

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
  test("BaseInput with different type and modelValue should not mount", () => {
    try {
      const wrapper = mount(BaseInput, {
        props: {
          label: "DDD",
          type: "number",
          modelValue: "initialText",
          "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
        },
      });
    } catch (e) {
      expect(e).toBeDefined();
    }
  })
});

describe("BaseInput behaviour tests", () => {
  test("BaseButton emits the entered string value", async () => {
    //this will not run with shallowMount
    const wrapper = mount(BaseInput, {
      props: {
        label: "Enter something",
        modelValue: "initialText",
        "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
      },
    });

    await wrapper.find("input").setValue("test");
    expect(wrapper.props("modelValue")).toBe("test");
  });
  test("BaseInput emits the entered number value", async () => {
    const wrapper = mount(BaseInput, {
      props: {
        label: "Enter something",
        modelValue: 0,
        "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
        type: "number",
      },
    });

    await wrapper.find("input").setValue(2);
    expect(wrapper.props("modelValue")).toBe(2);
  });
  test("ModelValue of not corresponding type should not work", async () => {
    const wrapper = mount(BaseInput, {
      props: {
        label: "Enter something",
        modelValue: 4,
        "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
        type: "number",
      },
    });

    await wrapper.find("input").setValue("test");
    expect(wrapper.props("modelValue")).toBeFalsy();
  });
  test("BaseInput renders error prop changes", async () => {
    const wrapper = shallowMount(BaseInput, {
      props: {
        label: "Dummy text",
      },
    });

    expect(wrapper.html()).not.toContain("Error text");

    await wrapper.setProps({ error: "Error text" });

    expect(wrapper.html()).toContain("Error text");
  });
});
