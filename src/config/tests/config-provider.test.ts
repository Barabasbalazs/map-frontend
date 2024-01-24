import configProvider from "../config-provider";
import { test, describe, expect } from "vitest";

const env = import.meta.env;

describe("Config Provider Test for values", () => {
    test("Config Provider should return default values", () => {
        const { wsServerUrl } = configProvider;
        expect(wsServerUrl).toBe(env.VITE_WS_SERVER_URL || 'http://localhost:3000');
    })
})