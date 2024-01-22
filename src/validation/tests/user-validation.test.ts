import { userParametersSchema } from "../user-validation";
import { test, expect, describe } from "vitest";

describe("User and parameters validator tests", () => {
  test("No distance validation test", async () => {
    try {
      await userParametersSchema.validateAsync({
        user: {
          id: 1,
          name: "test",
          coords: {
            lat: 10,
            lng: 10,
          },
        },
        parameters: {
          distance: 0,
          speed: 10,
        },
      });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  test("Negative distance validation test", async () => {
    try {
      await userParametersSchema.validateAsync({
        user: {
          id: 1,
          name: "test",
          coords: {
            lat: 10,
            lng: 10,
          },
        },
        parameters: {
          distance: -1,
          speed: 10,
        },
      });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  test("Negative speed validation test", async () => {
    try {
      await userParametersSchema.validateAsync({
        user: {
          id: 1,
          name: "test",
          coords: {
            lat: 10,
            lng: 10,
          },
        },
        parameters: {
          distance: 1,
          speed: -1,
        },
      });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  test("Zero Speed validation test", async () => {
    try {
      await userParametersSchema.validateAsync({
        user: {
          id: 1,
          name: "test",
          coords: {
            lat: 10,
            lng: 10,
          },
        },
        parameters: {
          distance: 1,
          speed: 0,
        },
      });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  test("Out of bounds validation test", async () => {
    try {
      await userParametersSchema.validateAsync({
        user: {
          id: 1,
          name: "test",
          coords: {
            lat: -91,
            lng: 181,
          },
        },
        parameters: {
          distance: 1,
          speed: 1,
        },
      });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  test("Valid input test", async () => {
    try {
      await userParametersSchema.validateAsync({
        user: {
          id: 1,
          name: "test",
          coords: {
            lat: 10,
            lng: 10,
          },
        },
        parameters: {
          distance: 1,
          speed: 1,
        },
      });
    } catch (e) {
      expect(e).toBeUndefined();
    }
  });

  test("Edge case coordinates validation test", async () => {
    const edgeCases = [
      {
        lat: -90,
        lng: -180,
      },
      {
        lat: -90,
        lng: 180,
      },
      {
        lat: 90,
        lng: -180,
      },
      {
        lat: 90,
        lng: 180,
      },
    ];

    edgeCases.forEach(async (coord) => {
      try {
        await userParametersSchema.validateAsync({
          user: {
            id: 1,
            name: "test",
            coords: coord,
          },
          parameters: {
            distance: 1,
            speed: 1,
          },
        });
      } catch (e) {
        expect(e).toBeUndefined();
      }
    });
  });
});
