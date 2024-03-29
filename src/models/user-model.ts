import { Coordinates } from "../types/coordinates";

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role?: string;
    coords?: Coordinates;
    trails?: string[];
}