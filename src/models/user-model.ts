import { Coordinates } from "../types/coordinates";

export interface User {
    id: string;
    name: string;
    coords?: Coordinates;
}