import { Coordinates } from "../types/coordinates";

//this will return a function that will generate a path between two points
function pathFunctionGenerator(start: Coordinates, stop: Coordinates) {
  const slope = (stop.lng - start.lng) / (stop.lat - start.lat);
  const intercept = start.lng - slope * start.lat;
  return (x: number) => slope * x + intercept;
}

function pathBetweenPoints(
  start: Coordinates,
  stop: Coordinates,
  speed: number
) {
  const path: Coordinates[] = [];
  const pathFunction = pathFunctionGenerator(start, stop);
  const isIncreasing = start.lat < stop.lat;
  const stepSize = speed / 111.32; // 1 degree of latitude is approximately 111 km
  for (
    let i = start.lat;
    isIncreasing ? i < stop.lat : i > stop.lat;
    isIncreasing ? (i += stepSize) : (i -= stepSize)
  ) {
    path.push({ lat: i, lng: pathFunction(i) });
  }
  return path;
}

export function generatePath(coordinate: Coordinates[], speed: number) {
  if (coordinate.length < 2 || speed <= 0) return [];
  const path: Coordinates[] = [];
  for (let i = 0; i < coordinate.length - 1; i++) {
    const start = coordinate[i];
    const stop = coordinate[i + 1];
    path.push(...pathBetweenPoints(start, stop, speed));
  }
  return path;
}
