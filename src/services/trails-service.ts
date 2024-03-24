import configProvider from "../config/config-provider";
import { Trail } from "../models/trail-model";
import { RequestParameters } from "../types/request-parameter";
import { request, parseResponse } from "../utils/fetch-wrapper";

const { apiUrl } = configProvider;

const trailsUrl = `${apiUrl}/trails`;

const trailsService = {
  getTrails: async (
    params: RequestParameters,
    authToken: string
  ): Promise<Trail[] | []> => {
    const resp = await request.get({
      url: trailsUrl,
      params,
      authToken: authToken,
    });
    return await parseResponse(resp);
  },
};

export default trailsService;
