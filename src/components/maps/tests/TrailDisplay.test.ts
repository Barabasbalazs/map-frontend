import TrailDisplay from "../TrailDisplay.vue";
import BaseInput from "../../shared/BaseInput.vue";
import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";

const mockTrail = {
  id: "1",
  name: "Test trail",
  location: "Test location",
  path: [
    {
      name: "Test path",
      coordinates: [
        { lat: 1, lng: 1 },
        { lat: 2, lng: 2 },
      ],
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
  test("TrailDisplay inputs should be disabled if user is not guide", () => {
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
});
