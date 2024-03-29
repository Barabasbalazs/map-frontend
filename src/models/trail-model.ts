import { Coordinates } from "../types/coordinates";
import { User } from "./user-model";

export interface PathPoint {
  name: string;
  coordinates: Coordinates;
}

export interface Trail {
  _id?: string;
  id?: string;
  name?: string;
  location?: string;
  creator?: User;
  createdAt?: Date;
  updatedAt?: Date;
  path?: PathPoint[];
}
