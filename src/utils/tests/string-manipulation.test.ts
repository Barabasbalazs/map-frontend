import { test, expect } from "vitest";
import { capitalizeFirstLetter } from "../string-manipulation";

test("Capitalize a normal string", () =>
  expect(capitalizeFirstLetter("hello")).toEqual("Hello"));

test("Capitalize an empty string", () =>
  expect(capitalizeFirstLetter("")).toEqual(""));

test("Capitalize a string with a single character", () =>
    expect(capitalizeFirstLetter("a")).toEqual("A"));