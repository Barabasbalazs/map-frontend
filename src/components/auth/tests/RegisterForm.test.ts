import RegisterForm from "../RegisterForm.vue";
import BaseInput from "../../shared/BaseInput.vue";
import BaseButton from "../../shared/BaseButton.vue";
import SelectInput from "../../shared/SelectInput.vue";
import { mount } from "@vue/test-utils";
import { describe, test, expect } from "vitest";

describe("RegisterForm related tests", () => {
  test("RegisterForm should mount with necessary inputs", () => {
    const wrapper = mount(RegisterForm);
    const emailInput = wrapper.get("#email").findComponent(BaseInput);
    const passwordInput = wrapper.get("#password").findComponent(BaseInput);
    const confirmPasswordInput = wrapper
      .get("#confirmPassword")
      .findComponent(BaseInput);
    const registerButton = wrapper
      .get("#registerButton")
      .findComponent(BaseButton);
    const returnButton = wrapper.get("#returnButton");
    const nameInput = wrapper.get("#name").findComponent(BaseInput);
    const roleInput = wrapper.get("#role").findComponent(SelectInput);

    expect(returnButton).toBeDefined();
    expect(nameInput.exists()).toBe(true);
    expect(roleInput.exists()).toBe(true);
    expect(emailInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);
    expect(confirmPasswordInput.exists()).toBe(true);
    expect(registerButton.exists()).toBe(true);
  });
  test("RegisterForm should emit return event when return button is clicked", async () => {
    const wrapper = mount(RegisterForm);
    const returnButton = wrapper.get("#returnButton");
    await returnButton.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("return");
  });

  test("RegisterForm should emit submit event when register button is clicked with proper object", async () => {
    const wrapper = mount(RegisterForm);
    const emailInput = wrapper.get("#email").findComponent(BaseInput);
    const passwordInput = wrapper.get("#password").findComponent(BaseInput);
    const confirmPasswordInput = wrapper
      .get("#confirmPassword")
      .findComponent(BaseInput);
    const registerButton = wrapper
      .get("#registerButton")
      .findComponent(BaseButton);
    const nameInput = wrapper.get("#name").findComponent(BaseInput);
    const roleInput = wrapper.get("#role").findComponent(SelectInput);

    await emailInput.setValue("test@mail.com");
    await passwordInput.setValue("password");
    await confirmPasswordInput.setValue("password");
    await nameInput.setValue("test");
    await roleInput.setValue("admin");

    await registerButton.trigger("click");

    const emitEvent = wrapper.emitted("register");

    expect(emitEvent).toBeDefined();
    expect(emitEvent?.[0][0]).toEqual({
      email: "test@mail.com",
      password: "password",
      name: "test",
      role: "admin",
    });
  });
});
