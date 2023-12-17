import { Coordinates } from "../types/coordinates";

export interface User {
    id: number;
    name: string;
    coords?: Coordinates;
}