import PathDisplayVue from "../PathDisplay.vue";
import BaseButton from "../../shared/BaseButton.vue";
import BaseInputVue from "../../shared/BaseInput.vue";
import BaseModal from "../../shared/BaseModal.vue";
import { User } from "../../../models/user-model";
import { Coordinates } from "../../../types/coordinates";
import { useTransferSimulatedPath } from "../../../composables/transfer-simulated-path";
import { mount, shallowMount, enableAutoUnmount } from "@vue/test-utils";
import { expect, test, describe, afterEach } from "vitest";
import { ref } from "vue";

enableAutoUnmount(afterEach);

const baseProps = {
  user: {
    id: "1",
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
  trailId: "1",
};

function parameteresForComposable() {
  const props = baseProps;

  const emit = (_e: "finishedBroadcast") => {};

  const isNoConnection = ref(true);

  const pathOfUser = ref<Coordinates[]>(props.path);

  const interval = ref<number>(1);

  return {
    props,
    emit,
    isNoConnection,
    pathOfUser,
    interval,
  };
}

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
      expect(wrapper.html()).toContain(
        `Latitude: ${element.lat}, Longitude: ${element.lng}`
      )
    );
  });
});

describe("PathDisplay behaviour tests", () => {
  test("PathDisplay renders an error modal when there is no connection", async () => {
    const wrapper = mount(PathDisplayVue, {
      props: baseProps,
      attachTo: document.body
    });
    await wrapper.find("input").setValue(0);

    const button = wrapper.getComponent(BaseButton);
    const input = wrapper.getComponent(BaseInputVue);

    expect(wrapper.findComponent(BaseModal).isVisible()).toBe(false);

    await input.setValue(1);

    await button.trigger("click");

    expect(wrapper.findComponent(BaseModal).exists()).toBe(true);
  });

  test("PathDisplay doesn't let the interval to be 0 or less", async () => {
    const { props, emit, isNoConnection, pathOfUser, interval } =
      parameteresForComposable();

    const { startSendingProcess, inputError } = useTransferSimulatedPath(
      props,
      emit,
      pathOfUser,
      interval,
      isNoConnection
    );

    interval.value = 0;

    startSendingProcess();

    expect(inputError.value).toBe("Interval must be greater than 0");

    interval.value = -1;

    startSendingProcess();

    expect(inputError.value).toBe("Interval must be greater than 0");

    interval.value = 1;

    startSendingProcess();

    expect(inputError.value).toBe("");
  });

  test("PathDisplay sends the data in the correct interval", async () => {
    const { props, emit, isNoConnection, pathOfUser, interval } =
      parameteresForComposable();

    const { startSendingProcess, inputError } = useTransferSimulatedPath(
      props,
      emit,
      pathOfUser,
      interval,
      isNoConnection
    );

    interval.value = 1;

    isNoConnection.value = false;

    const originalLength = pathOfUser.value.length;

    startSendingProcess();

    expect(inputError.value).toBe("");

    await new Promise((r) =>
      setTimeout(r, interval.value * (originalLength + 1) * 1000)
    );

    expect(pathOfUser.value.length).toBe(0);
  });
});
