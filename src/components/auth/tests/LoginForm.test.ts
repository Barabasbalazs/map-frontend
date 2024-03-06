import LoginForm from "../LoginForm.vue";
import BaseInput from "../../shared/BaseInput.vue";
import BaseButton from "../../shared/BaseButton.vue";
import { mount } from "@vue/test-utils";
import { describe, test, expect } from "vitest";

describe("LoginForm related tests", () => {
    test("LoginForm should mount when provided with modelValue", () => {
        const wrapper = mount(LoginForm);
        expect(wrapper.exists()).toBe(true);
    });
    test("LoginForm should mount with the necessary input fields", () => {
        const wrapper = mount(LoginForm);
        const emailInput = wrapper.get("#email").findComponent(BaseInput);
        const passwordInput = wrapper.get("#password").findComponent(BaseInput);

        expect(emailInput.exists()).toBe(true);
        expect(passwordInput.exists()).toBe(true);

        expect(wrapper.exists()).toBe(true);

        const loginButton = wrapper.get("#loginButton").findComponent(BaseButton);
        const registerButton = wrapper.get("#registerButton");

        expect(loginButton.exists()).toBe(true);
        expect(registerButton).toBeDefined();
    });
    test("LoginForm should emit register event when register button is clicked", async () => {
        const wrapper = mount(LoginForm);
        const registerButton = wrapper.get("#registerButton");
        await registerButton.trigger("click");
        expect(wrapper.emitted()).toHaveProperty("register");
    });
    test("LoginForm should emit submit event when login button is clicked with proper object", async () => {
        const wrapper = mount(LoginForm);
        const emailInput = wrapper.get("#email").findComponent(BaseInput);
        const passwordInput = wrapper.get("#password").findComponent(BaseInput);
        const loginButton = wrapper.get("#loginButton").findComponent(BaseButton);

        await emailInput.setValue("test@mail.com");
        await passwordInput.setValue("password");
        await loginButton.trigger("click");

        expect(wrapper.emitted()).toHaveProperty("submit");

        const emittedObject = wrapper.emitted("submit")[0][0] as { email: string, password: string };

        expect(emittedObject).toHaveProperty("email");
        expect(emittedObject).toHaveProperty("password");

        expect(emittedObject.email as string).toBe("test@mail.com");
        expect(emittedObject.password as string).toBe("password");
    });
});    
