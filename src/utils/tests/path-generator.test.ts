import { expect, test } from "vitest";
import { generateRandomizedPath } from "../path-generator";

test("no distance input tests", () => {
  expect(
    generateRandomizedPath(
      {
        lat: 10,
        lng: 10,
      },
      0,
      0
    )
  ).toEqual([]);
});

test("negative distance input tests", () => {
  expect(
    generateRandomizedPath(
      {
        lat: 10,
        lng: 10,
      },
      -1,
      0
    )
  ).toEqual([]);
});

test("negative speed input tests", () => {
  expect(
    generateRandomizedPath(
      {
        lat: 10,
        lng: 10,
      },
      1,
      -1
    )
  ).toEqual([]);
});

test("out of bounds coordinates test", () => {
  expect(
    generateRandomizedPath(
      {
        lat: -91,
        lng: 181,
      },
      1,
      1
    )
  ).toEqual([]);
})