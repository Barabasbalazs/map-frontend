import EditablePathPoint from "../EditablePathPoint.vue";
import BaseInput from "../../shared/BaseInput.vue";
import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";

const mockPathPoint = {
  name: "mockName",
  coordinates: {
    lat: 0,
    lng: 0,
  },
};

const emptyPathPoint = {
  name: "",
  coordinates: {
    lat: null,
    lng: null,
  },
};

describe("EditablePathPoint tests", () => {
  test("EditablePathPoint renders with props", () => {
    const wrapper = mount(EditablePathPoint, {
      props: {
        modelValue: mockPathPoint,
      },
    });

    expect(wrapper.html()).toBeDefined();
  });
  test("EditablePathPoint emits deletePoint event upon clicking delete point button", async () => {
    const wrapper = mount(EditablePathPoint, {
      props: {
        modelValue: mockPathPoint,
      },
    });

    const deleteButton = wrapper.get("#deletePointButton");

    expect(deleteButton).toBeDefined();

    await deleteButton.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("deletePoint");
  });
  test("EditablePahPoint only emits update:modelValue event when input is valid", async () => {
    const wrapper = mount(EditablePathPoint, {
      props: {
        modelValue: emptyPathPoint,
      },
    });

    const nameInput = wrapper.get("#nameInput").findComponent(BaseInput);
    const latInput = wrapper.get("#latInput").findComponent(BaseInput);
    const lngInput = wrapper.get("#lngInput").findComponent(BaseInput);

    expect(nameInput).toBeDefined();
    expect(latInput).toBeDefined();
    expect(lngInput).toBeDefined();

    await nameInput.setValue("");

    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(wrapper.emitted()).not.toHaveProperty("update:modelValue");

    await nameInput.setValue("newName");
    await latInput.setValue(191);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(wrapper.emitted()).not.toHaveProperty("update:modelValue");

    await latInput.setValue(10);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(wrapper.emitted()).not.toHaveProperty("update:modelValue");
    await lngInput.setValue(-181);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(wrapper.emitted()).not.toHaveProperty("update:modelValue");

    await lngInput.setValue(10);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(wrapper.emitted()).toHaveProperty("update:modelValue");
  }, 6000);
});
