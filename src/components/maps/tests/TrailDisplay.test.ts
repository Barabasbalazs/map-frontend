import TrailDisplay from "../TrailDisplay.vue";
import BaseInput from "../../shared/BaseInput.vue";
import BaseButton from "../../shared/BaseButton.vue";
import { describe, test, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";

beforeEach(async () => {
  setActivePinia(createPinia());
});

const mockTrail = {
  id: "1",
  _id: "1",
  name: "Test trail",
  location: "Test location",
  path: [
    {
      name: "Test path",
      coordinates: { lat: 1, lng: 1 },
    },
    {
      name: "Test path 2",
      coordinates: { lat: 2, lng: 2 },
    },
  ],
  creator: {
    id: "1",
    email: "creator@mail.com",
    role: "guide",
  },
};

describe("TrailDisplay tests", () => {
  test("TrailDisplay renders correctly", () => {
    const wrapper = mount(TrailDisplay, {
      props: {
        trail: mockTrail,
        user: mockTrail.creator,
      },
    });
    expect(wrapper).toBeDefined();
  });
  test("TrailDisplay renders with inputs for trail name and location", () => {
    const wrapper = mount(TrailDisplay, {
      props: {
        trail: mockTrail,
        user: mockTrail.creator,
      },
    });
    const nameInput = wrapper.get("#name").findComponent(BaseInput);
    const locationInput = wrapper.get("#location").findComponent(BaseInput);
    expect(nameInput.exists()).toBe(true);
    expect(locationInput.exists()).toBe(true);
  });
  test("TrailDisplay inputs should be disabled if editable prop is not passed", () => {
    const wrapper = mount(TrailDisplay, {
      props: {
        trail: mockTrail,
        user: {
          ...mockTrail.creator,
          role: "user",
        },
      },
    });
    const nameInput = wrapper.get("#name").findComponent(BaseInput);
    const locationInput = wrapper.get("#location").findComponent(BaseInput);
    expect(nameInput.props().disabled).toBe(true);
    expect(locationInput.props().disabled).toBe(true);
  });
  test("TrailDisplay inputs should be enabled if editable prop is passed", () => {
    const wrapper = mount(TrailDisplay, {
      props: {
        trail: mockTrail,
        user: mockTrail.creator,
        editable: true,
      },
    });
    const nameInput = wrapper.get("#name").findComponent(BaseInput);
    const locationInput = wrapper.get("#location").findComponent(BaseInput);
    expect(nameInput.props().disabled).toBe(false);
    expect(locationInput.props().disabled).toBe(false);
  });
  test("TrailDisplay should render with a save and cancel button if editable prop is passed", () => {
    const wrapper = mount(TrailDisplay, {
      props: {
        trail: mockTrail,
        user: mockTrail.creator,
        editable: true,
      },
    });
    const saveButton = wrapper.get("#save").findComponent(BaseButton);
    const cancelButton = wrapper.get("#cancel").findComponent(BaseButton);
    expect(saveButton.exists()).toBe(true);
    expect(cancelButton.exists()).toBe(true);
  });
  test("TrailDisplay should not render with a save and cancel button if editable prop is not passed", () => {
    const wrapper = mount(TrailDisplay, {
      props: {
        trail: mockTrail,
        user: mockTrail.creator,
      },
    });
    const saveButton = wrapper.find("#save");
    const cancelButton = wrapper.find("#cancel");
    expect(saveButton.exists()).toBe(false);
    expect(cancelButton.exists()).toBe(false);
  });
  test("TrailDisplay should render subscribe button if is user role is not guide", () => {
    const wrapper = mount(TrailDisplay, {
      props: {
        trail: mockTrail,
        user: {
          ...mockTrail.creator,
          role: "user",
        },
      },
    });
    const subscribeButton = wrapper.get("#subscribe").findComponent(BaseButton);
    expect(subscribeButton.exists()).toBe(true);
  });
  test("TrailDisplay should not render subscribe button if user role is guide", () => {
    const wrapper = mount(TrailDisplay, {
      props: {
        trail: mockTrail,
        user: mockTrail.creator,
      },
    });
    const subscribeButton = wrapper.find("#subscribe");
    expect(subscribeButton.exists()).toBe(false);
  });
  test("TrailDisplay should render unsubscribe button if user is subscribed", () => {
    const wrapper = mount(TrailDisplay, {
      props: {
        trail: {
          ...mockTrail,
        },
        user: { ...mockTrail.creator, role: "user", trails: [mockTrail.id] },
      },
    });
    const unsubscribeButton = wrapper
      .get("#subscribe")
      .findComponent(BaseButton);
    expect(unsubscribeButton.html().includes("Unsubscribe"));
    expect(unsubscribeButton.exists()).toBe(true);
  });
});
