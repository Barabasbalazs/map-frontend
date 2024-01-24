import SimulationInput from "../SimulationInput.vue";
import { enableAutoUnmount, shallowMount } from "@vue/test-utils";
import { describe, test, afterEach, expect } from "vitest";
import { UserWithParameters } from "../../../types/user-parameters";

enableAutoUnmount(afterEach);

const baseProps = {
  modelValue: {
    user: {
      id: 1,
      name: "test",
      coords: {
        lat: 51.507,
        lng: 0.1,
      },
    },
    parameters: {
      distance: 10,
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
