import configProvider from "../config/config-provider";
import { request, parseResponse } from "../utils/fetch-wrapper";

const { apiUrl } = configProvider;

const adminRequestUrl = `${apiUrl}/admin-requests`;

const adminRequestService = {
  respondToAdminRequest: async (
    requestId: string,
    accepted: boolean,
    authToken: string
  ) => {
    const resp = await request.patch({
      url: `${adminRequestUrl}/${requestId}`,
      params: { accepted },
      authToken: authToken,
    });
    return await parseResponse(resp);
  },
  getAdminRequests: async (authToken: string) => {
    const resp = await request.get({
      url: adminRequestUrl,
      authToken: authToken,
    });
    return await parseResponse(resp);
  },
};

export default adminRequestService;
