import PathDisplayVue from "../PathDisplay.vue";
import BaseButton from "../../inputs/BaseButton.vue";
import BaseInputVue from "../../inputs/BaseInput.vue";
import { mount, shallowMount, enableAutoUnmount } from "@vue/test-utils";
import { expect, test, describe, afterEach } from "vitest";
import { User } from "../../../models/user-model";
import { Coordinates } from "../../../types/coordinates";

enableAutoUnmount(afterEach);

const baseProps = {
  user: {
    id: 1,
    name: "John Doe",
  } as User,
  path: [
    {
      lat: 1,
      lng: 1,
    },
    {
      lat: 2,
      lng: 2,
    },
    {
      lat: 3,
      lng: 3,
    },
  ] as Coordinates[],
};

describe("PathDisplay mounting tests", () => {
  test("PathDisplay mounts properly with basic props", () => {
    const wrapper = shallowMount(PathDisplayVue, {
      props: baseProps,
    });
    expect(wrapper.exists()).toBe(true);
  });
  test("PathDisplay doesn't mount when user prop is missing", () => {
    try {
      shallowMount(PathDisplayVue, {
        props: {
          path: baseProps.path,
        } as any,
      });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
  test("PathDisplay doesn't mount when path prop is missing", () => {
    try {
      shallowMount(PathDisplayVue, {
        props: {
          user: baseProps.user,
        } as any,
      });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  test("PathDisplay sets the interval to 1 by default", () => {
    const wrapper = mount(PathDisplayVue, {
      props: baseProps,
    });
    expect(wrapper.getComponent(BaseInputVue).props("modelValue")).toBe(1);
  });

  test("PathDisplay displays the coordinates of every element in the path", () => {
    const wrapper = mount(PathDisplayVue, {
      props: baseProps,
    });
    baseProps.path.forEach((element) =>
      expect(wrapper.html()).toContain(`Latitude: ${ element.lat }, Longitude: ${ element.lng }`)
    );
  });
});

describe("PathDisplay behaviour tests", () => {
  test("PathDisplay doesn't let the interval to be 0 or less", async () => {
    const wrapper = mount(PathDisplayVue, {
      props: baseProps,
    });
    await wrapper.find("input").setValue(0);

    const button = wrapper.getComponent(BaseButton);
    const input = wrapper.getComponent(BaseInputVue);

    await button.trigger("click");

    expect(input.find("#error").exists()).toBe(true);

    await wrapper.find("input").setValue(-1);

    await button.trigger("click");

    expect(input.find("#error").exists()).toBe(true);
  });

  test("PathDisplay after entering valid interval doesn't display errors anymore", async () => {
    const wrapper = mount(PathDisplayVue, {
      props: baseProps,
    });
    await wrapper.find("input").setValue(0);

    const button = wrapper.getComponent(BaseButton);
    const input = wrapper.getComponent(BaseInputVue);

    await button.trigger("click");

    expect(input.find("#error").exists()).toBe(true);

    await wrapper.find("input").setValue(2);

    await button.trigger("click");

    expect(input.find("#error").exists()).toBe(false);
  });

  test("PathDisplay sends the data in the correct interval", async () => {
    const wrapper = mount(PathDisplayVue, {
      props: baseProps,
    });
    await wrapper.find("input").setValue(1);

    const button = wrapper.getComponent(BaseButton);
    const input = wrapper.getComponent(BaseInputVue);

    await button.trigger("click");

    expect(input.find("#error").exists()).toBe(false);

    expect(wrapper.html()).toContain("Number of points: 3");

    await new Promise((r) => setTimeout(r, 1000));

    expect(wrapper.html()).toContain("Number of points: 2");
  });

  test("PathDisplay emits finishedBroadcast after the path is finished", async () => {
    const wrapper = mount(PathDisplayVue, {
      props: { ...baseProps, path: baseProps.path.slice(0, 2) },
    });
    await wrapper.find("input").setValue(1);

    const button = wrapper.getComponent(BaseButton);
    const input = wrapper.getComponent(BaseInputVue);

    await button.trigger("click");

    expect(input.find("#error").exists()).toBe(false);

    expect(wrapper.html()).toContain("Number of points: 2");

    await new Promise((r) => setTimeout(r, 1000));

    expect(wrapper.html()).toContain("Number of points: 1");

    await new Promise((r) => setTimeout(r, 1000));

    expect(wrapper.html()).toContain("Number of points: 0");

    await new Promise((r) => setTimeout(r, 1000));

    expect(wrapper.emitted("finishedBroadcast")).toBeDefined();
  });

  test("PathDisplay once broadcasting doesn't let the user click the send button again", async () => {
    const wrapper = mount(PathDisplayVue, {
      props: baseProps,
    });
    await wrapper.find("input").setValue(1);

    const button = wrapper.getComponent(BaseButton);
    await button.trigger("click");

    await new Promise((r) => setTimeout(r, 1000));

    button.trigger("click");
    button.trigger("click");
    button.trigger("click");

    expect(button.emitted("click")).toHaveLength(1);

  });
});
