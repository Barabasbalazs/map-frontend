import { capitalizeFirstLetter } from "../string-manipulation";
import { test, expect, describe } from "vitest";

describe("Capitalize util function tests", () => {
  test("Capitalize a normal string", () =>
    expect(capitalizeFirstLetter("hello")).toEqual("Hello"));

  test("Capitalize an empty string", () =>
    expect(capitalizeFirstLetter("")).toEqual(""));

  test("Capitalize a string with a single character", () =>
    expect(capitalizeFirstLetter("a")).toEqual("A"));
});
