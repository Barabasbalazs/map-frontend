import UserCard from "../UserCard.vue";
import BaseInput from "../../shared/BaseInput.vue";
import SelectInput from "../../shared/SelectInput.vue";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "../../../stores/auth-store";
import { useAdministrationStore } from "../../../stores/administration-store";
import { createFetchResponse } from "../../../utils/testing-utilites";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { expect, test, describe, beforeEach, afterEach, vi } from "vitest";

const mockedUser = {
  id: "2",
  email: "bb@mail.com",
  name: "mockedUser",
  role: "user",
};

enableAutoUnmount(afterEach);

beforeEach(() => {
  setActivePinia(createPinia());
  useAuthStore().authToken = "token";
});

describe("UserCard component", () => {
  test("It should render in disabled mode by default", () => {
    const wrapper = mount(UserCard, {
      props: {
        user: mockedUser,
      },
    });

    const nameInput = wrapper.find("#name").getComponent(BaseInput);
    const emailInput = wrapper.find("#email").getComponent(BaseInput);

    expect(nameInput).toBeDefined();
    expect(emailInput).toBeDefined();

    const nameInputField = nameInput.find("input");
    const emailInputField = emailInput.find("input");

    expect(Object.keys(nameInputField.attributes()).includes("disabled")).toBe(
      true
    );
    expect(Object.keys(emailInputField.attributes()).includes("disabled")).toBe(
      true
    );
  });
  test("Clicking on edit button should enable the inputs", async () => {
    const wrapper = mount(UserCard, {
      props: {
        user: mockedUser,
      },
    });

    const editButton = wrapper.find("#modifyUser");

    await editButton.trigger("click");

    const nameInput = wrapper.find("#name").getComponent(BaseInput);
    const emailInput = wrapper.find("#email").getComponent(BaseInput);

    const nameInputField = nameInput.find("input");
    const emailInputField = emailInput.find("input");

    expect(Object.keys(nameInputField.attributes()).includes("disabled")).toBe(
      false
    );
    expect(Object.keys(emailInputField.attributes()).includes("disabled")).toBe(
      false
    );
    expect(wrapper.html()).toContain("Save");
    expect(wrapper.html()).toContain("Cancel");
  });
  test("Non Admin user doesn't see cancel button until in edit mode", async () => {
    useAuthStore().user = mockedUser;
    const wrapper = mount(UserCard, {
      props: {
        user: mockedUser,
      },
    });

    const editButton = wrapper.find("#modifyUser");

    expect(wrapper.html()).not.toContain("Cancel");
    expect(wrapper.html()).not.toContain("Delete");

    await editButton.trigger("click");

    expect(wrapper.html()).toContain("Cancel");
  });
  test("If user is Admin user sees delete button when not in edit mode for other users", async () => {
    useAuthStore().user = { ...mockedUser, id: "different", role: "admin" };
    const wrapper = mount(UserCard, {
      props: {
        user: { ...mockedUser },
      },
    });

    expect(wrapper.html()).toContain("Delete");

    const editButton = wrapper.find("#modifyUser");

    await editButton.trigger("click");

    expect(wrapper.html()).toContain("Cancel");
  });
  test("If user is Admin and card displays his information he should not see delete button", async () => {
    useAuthStore().user = { ...mockedUser, role: "admin" };
    const wrapper = mount(UserCard, {
      props: {
        user: { ...mockedUser },
      },
    });

    expect(wrapper.html()).not.toContain("Delete");

    const editButton = wrapper.find("#modifyUser");

    await editButton.trigger("click");

    expect(wrapper.html()).toContain("Cancel");
  });
  test("If user is not admin, upon save the request should be sent, and the auth user should be set", async () => {
    useAuthStore().user = mockedUser;
    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        user: { ...mockedUser, name: "newName", email: "newEmail" },
      })
    );

    const wrapper = mount(UserCard, {
      props: {
        user: mockedUser,
      },
    });

    const editButton = wrapper.find("#modifyUser");

    await editButton.trigger("click");

    const nameInput = wrapper.find("#name").getComponent(BaseInput);
    const emailInput = wrapper.find("#email").getComponent(BaseInput);

    const nameInputField = nameInput.find("input");
    const emailInputField = emailInput.find("input");

    await nameInputField.setValue("newName");
    await emailInputField.setValue("newEmail");

    const saveButton = wrapper.find("#modifyUser");

    await saveButton.trigger("click");

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:8080/v1/administration/users/${mockedUser.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify({
          ...mockedUser,
          name: "newName",
          email: "newEmail",
        }),
      }
    );

    expect(useAuthStore().user).toEqual({
      ...mockedUser,
      name: "newName",
      email: "newEmail",
    });
  });
  test("If user is admin, upon save the request should be sent, and the user should be set in the administration store", async () => {
    useAuthStore().user = { ...mockedUser, role: "admin" };
    useAdministrationStore().users = [mockedUser];
    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        user: { ...mockedUser, name: "newName", email: "newEmail" },
      })
    );

    const wrapper = mount(UserCard, {
      props: {
        user: mockedUser,
      },
    });

    const editButton = wrapper.find("#modifyUser");

    await editButton.trigger("click");

    const nameInput = wrapper.find("#name").getComponent(BaseInput);
    const emailInput = wrapper.find("#email").getComponent(BaseInput);

    const nameInputField = nameInput.find("input");
    const emailInputField = emailInput.find("input");

    await nameInputField.setValue("newName");
    await emailInputField.setValue("newEmail");

    const saveButton = wrapper.find("#modifyUser");

    await saveButton.trigger("click");

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:8080/v1/administration/users/${mockedUser.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify({
          ...mockedUser,
          name: "newName",
          email: "newEmail",
        }),
      }
    );

    expect(useAdministrationStore().users).toEqual([
      { ...mockedUser, name: "newName", email: "newEmail" },
    ]);
  });
  test("After changing user data, if cancel is clicked, the inputs should be disabled and the user data should be reset", async () => {
    const wrapper = mount(UserCard, {
      props: {
        user: mockedUser,
      },
    });

    const editButton = wrapper.find("#modifyUser");

    await editButton.trigger("click");

    const nameInput = wrapper.find("#name").getComponent(BaseInput);
    const emailInput = wrapper.find("#email").getComponent(BaseInput);

    const nameInputField = nameInput.find("input");
    const emailInputField = emailInput.find("input");

    await nameInputField.setValue("newName");
    await emailInputField.setValue("newEmail");

    const cancelButton = wrapper.find("#cancelDeleteButton");

    await cancelButton.trigger("click");

    expect(Object.keys(nameInputField.attributes()).includes("disabled")).toBe(
      true
    );
    expect(Object.keys(emailInputField.attributes()).includes("disabled")).toBe(
      true
    );

    expect(nameInputField.element.value).toBe(mockedUser.name);
    expect(emailInputField.element.value).toBe(mockedUser.email);
  });
  test("If user is admin, clicking on delete should make the component emit delete-user", async () => {
    useAuthStore().user = { ...mockedUser, id: "different", role: "admin" };
    useAdministrationStore().users = [mockedUser];
    /*
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(createFetchResponse({ message: "User deleted" }));
    */
    const wrapper = mount(UserCard, {
      props: {
        user: mockedUser,
      },
    });

    const deleteButton = wrapper.find("#cancelDeleteButton");

    await deleteButton.trigger("click");

    expect(wrapper.emitted()).toHaveProperty("delete-user");
    /*
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:8080/v1/administration/users/${mockedUser.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
        method: "DELETE",
        mode: "cors",
      }
    );

    await new Promise((r) => setTimeout(r, 100));

    expect(useAdministrationStore().users).toEqual([]);
    */
  });
  test("Only admin users should see the option to change roles, if the user in the card is not the admin", async () => {
    useAuthStore().user = { ...mockedUser, role: "admin" };
    const wrapper = mount(UserCard, {
      props: {
        user: {
          ...mockedUser,
          id: "notAdmin",
        },
      },
    });

    const selectInput = wrapper.find("#role").getComponent(SelectInput);
    expect(selectInput).toBeDefined();

    const selectInputField = selectInput.find("select");
    expect(selectInputField).toBeDefined();

    useAuthStore().user = { ...mockedUser, role: "user" };

    await wrapper.vm.$nextTick();

    const selectInput2 = wrapper.find("#role");
    expect(selectInput2.exists()).toBe(false);

    useAuthStore().user = { ...mockedUser, role: "admin" };

    wrapper.unmount();

    const wrapper2 = mount(UserCard, {
      props: {
        user: {
          ...mockedUser,
          role: "admin",
        },
      },
    });

    await wrapper2.vm.$nextTick();

    const selectInput3 = wrapper2.find("#role");
    expect(selectInput3.exists()).toBe(false);
  });
  test("If the user is an admin, the role can be changed", async () => {
    useAuthStore().user = { ...mockedUser, role: "admin" };
    useAdministrationStore().users = [mockedUser];

    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        user: { ...mockedUser, role: "admin" },
      })
    );

    const wrapper = mount(UserCard, {
      props: {
        user: {
          ...mockedUser,
          id: "notAdmin",
          role: "user",
        },
      },
    });

    const selectInput = wrapper.find("#role").getComponent(SelectInput);
    const selectInputField = selectInput.find("select");

    await selectInputField.setValue("admin");

    expect(selectInputField.element.value).toBe("admin");
  });
});
