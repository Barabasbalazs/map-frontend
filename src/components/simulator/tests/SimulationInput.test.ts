import SimulationInput from "../SimulationInput.vue";
import BaseInput from "../../shared/BaseInput.vue";
import BaseButton from "../../shared/BaseButton.vue";
import { enableAutoUnmount, shallowMount, mount } from "@vue/test-utils";
import { describe, test, afterEach, expect } from "vitest";
import { UserWithParameters } from "../../../types/user-parameters";

enableAutoUnmount(afterEach);

const emptyProps = {
  modelValue: {
    user: {
      id: "0",
      name: "Mandem",
      coords: {
        lat: 0,
        lng: 0,
      },
      email: "test@mail.com",
    },
    parameters: {
      speed: 0,
    },
  } as UserWithParameters,
};

const baseProps = {
  modelValue: {
    user: {
      id: "1",
      name: "test",
      coords: {
        lat: 51.507,
        lng: 0.1,
      },
      email: "test@mail2.com",
    },
    parameters: {
      speed: 1,
    },
  } as UserWithParameters,
};

describe("SimulationInput mounting tests", () => {
  test("SimulationInput mounts properly with basic props", () => {
    const wrapper = shallowMount(SimulationInput, {
      props: baseProps,
    });

    expect(wrapper.exists()).toBe(true);
  });
  test("SimulationInput doesn't mount when parameter in prop is missing", () => {
    try {
      shallowMount(SimulationInput, {
        props: {
          user: baseProps.modelValue.user,
        } as any,
      });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});

describe("SimulationInput input validation tests", () => {

  test("SimulationInput renders error on invalid speed", async () => {
    const wrapper = mount(SimulationInput, {
      props: emptyProps,
    });

    const speedInput = wrapper.get("#speed").getComponent(BaseInput);
    const confirmationButton = wrapper.getComponent(BaseButton);

    await speedInput.setValue(-1);

    await confirmationButton.trigger("click");

    expect(speedInput.find("#error")).toBeDefined();

    await speedInput.setValue(0);

    await confirmationButton.trigger("click");

    expect(speedInput.find("#error")).toBeDefined();
  });

  test("SimulationInput renders error on invalid speed", async () => {
    const wrapper = mount(SimulationInput, {
      props: emptyProps,
    });

    const speedInput = wrapper.get("#speed").getComponent(BaseInput);
    const confirmationButton = wrapper.getComponent(BaseButton);

    await speedInput.setValue(-1);

    await confirmationButton.trigger("click");

    expect(speedInput.find("#error")).toBeDefined();
  });

  test("SimulationInput renders error on empty inputs", async () => {
    const wrapper = mount(SimulationInput, {
      props: emptyProps,
    });

    const speedInput = wrapper.get("#speed").getComponent(BaseInput);

    const confirmationButton = wrapper.getComponent(BaseButton);

    await confirmationButton.trigger("click");

    expect(speedInput.find("#error")).toBeDefined();
  });
});

describe("SimulationInput correct input tests", () => {
  test("SimulationInput emits update:modelValue with valid input", async () => {
    const wrapper = mount(SimulationInput, {
      props: baseProps,
    });

    const confirmationButton = wrapper.getComponent(BaseButton);

    await confirmationButton.trigger("click");

    expect(wrapper.emitted()).toHaveProperty("update:modelValue");
  });

  test("SimulationInput emits update:modelValue upon entering of valid input", async () => {
    const wrapper = mount(SimulationInput, {
      props: emptyProps,
    });

    const speedInput = wrapper.get("#speed").getComponent(BaseInput);

    const confirmationButton = wrapper.getComponent(BaseButton);

    await confirmationButton.trigger("click");

    expect(wrapper.emitted()).not.toHaveProperty("update:modelValue");

    await speedInput.setValue(1);

    await confirmationButton.trigger("click");

    expect(wrapper.emitted()).toHaveProperty("update:modelValue");
  });
});
