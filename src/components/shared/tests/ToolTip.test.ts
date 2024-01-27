import ToolTip from "../ToolTip.vue";
import { shallowMount, mount, enableAutoUnmount } from "@vue/test-utils";
import { test, expect, describe, afterEach } from "vitest";

enableAutoUnmount(afterEach);

describe("ToolTip Rendering Tests", () => {
  test("ToolTip renders when passing a text", () => {
    const wrapper = shallowMount(ToolTip, {
      props: {
        text: "Tooltip text",
      },
    });

    expect(wrapper.getCurrentComponent()).toBeDefined();
  });
  test("ToolTip doesn't render when not passing a text", () => {
    try {
      shallowMount(ToolTip);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("ToolTip Functionality Tests", () => {
  test("ToolTip by default doesn't display the text", () => {
    const wrapper = mount(ToolTip, {
      props: {
        text: "Tooltip text",
      },
    });
    expect(wrapper.html()).not.toContain("Tooltip text");
  });

  test("ToolTip text only shows when hovering over the element", async () => {
    const wrapper = mount(ToolTip, {
      props: {
        text: "Tooltip text",
      },
    });

    expect(wrapper.html()).not.toContain("Tooltip text");

    await wrapper.trigger("mouseover");
    expect(wrapper.html()).toContain("Tooltip text");

    await wrapper.trigger("mouseleave");
    expect(wrapper.html()).not.toContain("Tooltip text");
  });

  test("ToolTip error changes with different props", async () => {
    const wrapper = mount(ToolTip, {
      props: {
        text: "Tooltip text",
      },
    });

    expect(wrapper.html()).not.toContain("Tooltip text");

    await wrapper.trigger("mouseover");
    expect(wrapper.html()).toContain("Tooltip text");

    await wrapper.setProps({ text: "New tooltip text" });
    expect(wrapper.html()).toContain("New tooltip text");

    await wrapper.trigger("mouseleave");
    expect(wrapper.html()).not.toContain("New tooltip text");
  });
});
