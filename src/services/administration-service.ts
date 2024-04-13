import configProvider from "../config/config-provider";
import { User } from "../models/user-model";
import { request, parseResponse } from "../utils/fetch-wrapper";

const { apiUrl } = configProvider;

const administrationUrl = `${apiUrl}/administration`;

const administrationService = {
  getUser: async (
    id: string,
    authToken: string
  ): Promise<Partial<User> | { message: string }> => {
    const resp = await request.get({
      url: `${administrationUrl}/users/${id}`,
      authToken: authToken,
    });
    return await parseResponse(resp);
  },
  getAllUsers: async (
    authToken: string
  ): Promise<User[] | { message: string }> => {
    const resp = await request.get({
      url: `${administrationUrl}/users`,
      authToken: authToken,
    });
    return await parseResponse(resp);
  },
  updateUser: async (
    user: Partial<User>,
    authToken: string
  ): Promise<User | null> => {
    const resp = await request.patch({
      url: `${administrationUrl}/users/${user.id}`,
      authToken: authToken,
      params: user,
    });
    return await parseResponse(resp);
  },
  deleteUser: async (id: string, authToken: string) => {
    const resp = await request.delete({
      url: `${administrationUrl}/users/${id}`,
      authToken: authToken,
    });
    return await parseResponse(resp);
  },
};

export default administrationService;
