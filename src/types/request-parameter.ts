import { Trail } from "../models/trail-model";

export type OrderType = "asc" | "desc";

export type RequestParameters = {
  id?: string;
  sort?: keyof Trail;
  order?: OrderType;
  search?: string;
  creator?: number;
};
