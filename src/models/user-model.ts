import { Coordinates } from "../types/coordinates";

export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    coords?: Coordinates;
}