import { describe, test, expect, vi } from "vitest";
import { authService } from "../auth-service";
import { createFetchResponse } from "../../utils/testing-utilites";

const userCredentials = { email: "test@mail.com", password: "123456789" };

describe("auth-service tests", () => {
  test("Login calls the correct endpoint", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        userCredentials,
      })
    );

    await authService.login(userCredentials.email, userCredentials.password);

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/v1/auth/login", {
      body: JSON.stringify(userCredentials),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      mode: "cors",
    });
  });

  test("Register calls the correct endpoint", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        userCredentials,
      })
    );

    await authService.register(userCredentials);

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/v1/auth/signup", {
      body: JSON.stringify(userCredentials),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      mode: "cors",
    });
  });
});
