import { User } from "./user-model";

export interface AdminRequest {
  id: string;
  user: User;
}
