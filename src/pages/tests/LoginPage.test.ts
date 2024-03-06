import LoginPage from "../LoginPage.vue";
import LoginForm from "../../components/auth/LoginForm.vue";
import RegisterForm from "../../components/auth/RegisterForm.vue";
import { createFetchResponse } from "../../utils/testing-utilites";
import router from "../../routing/router";
import redirectService from "../../services/router-service";
import { setActivePinia, createPinia } from "pinia";
import { Router, createRouter, createWebHistory } from "vue-router";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { expect, test, describe, beforeEach, vi, afterEach } from "vitest";

const userCredentials = { email: "test@mail.com", password: "123456789" };

enableAutoUnmount(afterEach);

let localRouter: Router;

beforeEach(() => {
  localRouter = createRouter({
    history: createWebHistory(),
    routes: router.options.routes,
  });
  localRouter.beforeEach((to, _from, next) =>
    redirectService.beforeEach(to, _from, next)
  );
  setActivePinia(createPinia());
});

describe("LoginPage related tests", () => {
  test("LoginPage mounts with loginform as default", () => {
    const wrapper = mount(LoginPage);
    expect(wrapper.exists()).toBe(true);

    const loginForm = wrapper.findComponent(LoginForm);
    expect(loginForm.exists()).toBe(true);
  });
  test("On submit event from loginform, loginpage should send the data to API", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        userCredentials,
      })
    );

    const wrapper = mount(LoginPage);
    const loginForm = wrapper.findComponent(LoginForm);

    loginForm.vm.$emit("submit", userCredentials);

    await wrapper.vm.$nextTick();

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/v1/auth/login", {
      body: JSON.stringify(userCredentials),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      mode: "cors",
    });
  });

  test("If login is succesfull, then app redirects to landing page", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        userCredentials,
      })
    );

    localRouter.push("/login");
    await localRouter.isReady();

    const loginForm = mount(LoginForm);

    expect(loginForm.exists()).toBe(true);

    loginForm.vm.$emit("submit", userCredentials);

    await loginForm.vm.$nextTick();

    expect(router.currentRoute.value.path).toBe("/");
  });

  test("If register event is fired, loginpage should switch to register form", async () => {
    const wrapper = mount(LoginPage);
    const loginForm = wrapper.findComponent(LoginForm);

    loginForm.vm.$emit("register");

    await wrapper.vm.$nextTick();

    const registerForm = wrapper.findComponent(RegisterForm);
    expect(registerForm.exists()).toBe(true);
    expect(loginForm.exists()).toBe(false);
  });
});
