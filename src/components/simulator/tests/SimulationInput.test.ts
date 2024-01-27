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
      id: 0,
      name: "",
      coords: {
        lat: 0,
        lng: 0,
      },
    },
    parameters: {
      distance: 0,
      speed: 0,
    },
  } as UserWithParameters,
};

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

describe("SimulationInput input validation tests", () => {
  test("SimulationInput renders error on invalid id", async () => {
    const wrapper = mount(SimulationInput, {
      props: emptyProps,
    });

    const idInput = wrapper.get("#id").getComponent(BaseInput);
    const confirmationButton = wrapper.getComponent(BaseButton);

    await idInput.setValue(-1);

    await confirmationButton.trigger("click");

    expect(idInput.find("#error")).toBeDefined();

    await idInput.setValue(0);

    await confirmationButton.trigger("click");

    expect(idInput.find("#error")).toBeDefined();
  });

  test("SimulationInput renders error on invalid name", async () => {
    const wrapper = mount(SimulationInput, {
      props: emptyProps,
    });

    const nameInput = wrapper.get("#name").getComponent(BaseInput);
    const confirmationButton = wrapper.getComponent(BaseButton);

    await nameInput.setValue("");

    await confirmationButton.trigger("click");

    expect(nameInput.find("#error")).toBeDefined();
  });

  test("SimulationInput renders error on invalid coordinates", async () => {
    const invalidCoordinates = [
      { lat: 91, lng: 0 },
      { lat: -91, lng: 0 },
      { lat: 0, lng: 181 },
      { lat: 0, lng: -181 },
    ];

    const wrapper = mount(SimulationInput, {
      props: emptyProps,
    });

    const latInput = wrapper.get("#lat").getComponent(BaseInput);
    const lngInput = wrapper.get("#lng").getComponent(BaseInput);

    const confirmationButton = wrapper.getComponent(BaseButton);

    for (const coords of invalidCoordinates) {
      await latInput.setValue(coords.lat);
      await lngInput.setValue(coords.lng);

      await confirmationButton.trigger("click");

      expect(latInput.find("#error")).toBeDefined();
      expect(lngInput.find("#error")).toBeDefined();
    }
  });

  test("SimulationInput renders error on invalid distance", async () => {
    const wrapper = mount(SimulationInput, {
      props: emptyProps,
    });

    const distanceInput = wrapper.get("#distance").getComponent(BaseInput);
    const confirmationButton = wrapper.getComponent(BaseButton);

    await distanceInput.setValue(-1);

    await confirmationButton.trigger("click");

    expect(distanceInput.find("#error")).toBeDefined();
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

    const idInput = wrapper.get("#id").getComponent(BaseInput);
    const nameInput = wrapper.get("#name").getComponent(BaseInput);
    const latInput = wrapper.get("#lat").getComponent(BaseInput);
    const lngInput = wrapper.get("#lng").getComponent(BaseInput);
    const distanceInput = wrapper.get("#distance").getComponent(BaseInput);
    const speedInput = wrapper.get("#speed").getComponent(BaseInput);

    const confirmationButton = wrapper.getComponent(BaseButton);

    await confirmationButton.trigger("click");

    expect(idInput.find("#error")).toBeDefined();

    idInput.setValue(1);

    await confirmationButton.trigger("click");

    expect(nameInput.find("#error")).toBeDefined();

    nameInput.setValue("test");

    await confirmationButton.trigger("click");

    expect(latInput.find("#error")).toBeDefined();

    latInput.setValue(51.507);

    await confirmationButton.trigger("click");

    expect(lngInput.find("#error")).toBeDefined();

    lngInput.setValue(0.1);

    await confirmationButton.trigger("click");

    expect(distanceInput.find("#error")).toBeDefined();

    distanceInput.setValue(10);

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

    const idInput = wrapper.get("#id").getComponent(BaseInput);
    const nameInput = wrapper.get("#name").getComponent(BaseInput);
    const latInput = wrapper.get("#lat").getComponent(BaseInput);
    const lngInput = wrapper.get("#lng").getComponent(BaseInput);
    const distanceInput = wrapper.get("#distance").getComponent(BaseInput);
    const speedInput = wrapper.get("#speed").getComponent(BaseInput);

    const confirmationButton = wrapper.getComponent(BaseButton);

    confirmationButton.trigger("click");

    expect(idInput.find("#error")).toBeDefined();

    expect(wrapper.emitted()).not.toHaveProperty("update:modelValue");

    await idInput.setValue(1);
    await nameInput.setValue("test");
    await latInput.setValue(51.507);
    await lngInput.setValue(0.1);
    await distanceInput.setValue(10);
    await speedInput.setValue(1);

    await confirmationButton.trigger("click");

    expect(wrapper.emitted()).toHaveProperty("update:modelValue");
  })
});