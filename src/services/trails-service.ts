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
  deleteTrail: async (
    trailId: string,
    authToken: string
  ): Promise<Trail | null> => {
    const resp = await request.delete({
      url: `${trailsUrl}/${trailId}`,
      authToken: authToken,
    });
    return await parseResponse(resp);
  },
  subscribeToTrail: async (
    trailId: string,
    authToken: string
  ): Promise<Trail | null> => {
    const resp = await request.patch({
      url: `${trailsUrl}/${trailId}/subscribe`,
      authToken: authToken,
      params: { id: trailId },
    });
    return await parseResponse(resp);
  },
  unsubscribeFromTrail: async (
    trailId: string,
    authToken: string
  ): Promise<Trail | null> => {
    const resp = await request.delete({
      url: `${trailsUrl}/${trailId}/unsubscribe`,
      authToken: authToken,
    });
    return await parseResponse(resp);
  },
};

export default trailsService;
