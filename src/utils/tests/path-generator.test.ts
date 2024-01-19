import { expect, test } from "vitest";
import { generateRandomizedPath } from "../path-generator";
import { Coordinates } from "../../types/coordinates";

test("No distance input tests", () => {
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

test("Negative distance input tests", () => {
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

test("Negative speed input tests", () => {
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

test("Out of bounds coordinates test", () => {
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

function invalidCoords(path: Coordinates[]) {
  return path.filter((coord) => coord.lat < -90 || coord.lat > 90 || coord.lng < -180 || coord.lng > 180);
}

test("Out of bounds result test", () => {

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

  edgeCases.forEach((edgeCase) => expect(invalidCoords(generateRandomizedPath(edgeCase, 100, 1)).length).toEqual(0));
})