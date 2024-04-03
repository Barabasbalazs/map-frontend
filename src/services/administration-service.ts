import configProvider from "../config/config-provider";
import { User } from "../models/user-model";
import { request, parseResponse } from "../utils/fetch-wrapper";

const { apiUrl } = configProvider;

const administrationUrl = `${apiUrl}/administration`;

const administrationService = {
    getUser: async(id: string, authToken: string) : Promise<Partial<User> | { message: string}> => {
        const resp = await request.get({
            url: `${administrationUrl}/users/${id}`,
            authToken: authToken,
        });
        return await parseResponse(resp);
    }
}

export default administrationService;