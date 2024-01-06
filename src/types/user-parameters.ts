import { User } from "../models/user-model";

export type PathParameters = {
    distance: number;
    time: number;
};

export type UserWithParameters = {
    user: User;
    parameters: PathParameters;
}