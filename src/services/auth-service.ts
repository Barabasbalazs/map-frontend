import configProvider from "../config/config-provider";
import { User } from "../models/user-model";
import { request, parseResponse } from "../utils/fetch-wrapper";

const { apiUrl } = configProvider;

const authUrl = `${apiUrl}/auth`;

export const authService = {
  login: async (email: string, password: string) => {
    const user = {
      email,
      password,
    };
    const resp = await request.post<Partial<User>>({
      url: `${authUrl}/login`,
      params: user,
    });
    return await parseResponse(resp);
  },
  register: async (user: Partial<User>) => {
    const resp = await request.post<Partial<User>>({
      url: `${authUrl}/register`,
      params: user,
    });
    return await parseResponse(resp);
  },
};
