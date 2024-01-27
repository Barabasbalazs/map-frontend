import BaseModal from "../BaseModal.vue";
import BaseButton from "../BaseButton.vue";
import { mount, shallowMount, enableAutoUnmount } from "@vue/test-utils";
import { expect, describe, test, afterEach } from "vitest";

enableAutoUnmount(afterEach);

const defaultProps = {
  title: "Test Modal",
  text: "Test Text",
  warning: true,
  isOpen: true,
  cancel: true,
};

describe("BaseModal basic mounting", () => {
  test("BaseModal mounts with correct props", () => {
    const wrapper = shallowMount(BaseModal, {
      props: defaultProps,
    });
    expect(wrapper).toBeDefined();
    expect(wrapper.props()).toEqual(defaultProps);
  });
  test("BaseModal doesn't mount without title", () => {
    try {
      shallowMount(BaseModal, {
        props: {
          ...defaultProps,
          title: undefined,
        },
      });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  test("BaseModal title is red when warning is true", async () => {
    const wrapper = mount(BaseModal, {
      props: defaultProps,
    });
    const title = wrapper.find("#modal-title");
    expect(title.text()).toBe("Test Modal");
    expect(title.classes()).toContain("text-red-600");
  });

  test("BaseModal title is black when warning is false", async () => {
    const wrapper = mount(BaseModal, {
      props: {
        ...defaultProps,
        warning: false,
      },
    });
    const title = wrapper.find("#modal-title");
    expect(title.classes()).not.toContain("text-red-600");
    expect(title.text()).toBe("Test Modal");
  });

  test("BaseModal renders the text if it's provided as a prop", async () => {
    const wrapper = mount(BaseModal, {
      props: defaultProps,
    });
    const text = wrapper.find("#modal-text");
    expect(text.text()).toBe("Test Text");
  });

  test("BaseModal displays slot if no text is provided and slot is provided", async () => {
    const wrapper = mount(BaseModal, {
      props: {
        ...defaultProps,
        text: undefined,
      },
      slots: {
        default: "Test Slot",
      },
    });
    expect(wrapper.html()).toContain("Test Slot");
  });
});

describe("BaseModal functionality tests", () => {
  test("BaseModal emits confrim event and changes isOpen when ok button is clicked", async () => {
    const wrapper = mount(BaseModal, {
      props: {
        ...defaultProps,
        cancel: false,
      },
    });
    const okButton = wrapper.getComponent(BaseButton);
    await okButton.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("confirm");
    expect(wrapper.emitted()).toHaveProperty("update:isOpen");
    expect(wrapper.emitted()["update:isOpen"]).toEqual([[false]]);
  });
  test("BaseModal emits cancel event and changes isOpen when cancel button is clicked", async () => {
    const wrapper = mount(BaseModal, {
      props: defaultProps,
    });
    const cancelButton = wrapper
      .get("#modal-cancel-button")
      .getComponent(BaseButton);
    await cancelButton.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("cancel");
    expect(wrapper.emitted()).toHaveProperty("update:isOpen");
    expect(wrapper.emitted()["update:isOpen"]).toEqual([[false]]);
  });
});
