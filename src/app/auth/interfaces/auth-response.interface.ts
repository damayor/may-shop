import { User } from "@products/interfaces/user.interface";

export interface AuthResponse {
  user:  User;
  token: string;
}

