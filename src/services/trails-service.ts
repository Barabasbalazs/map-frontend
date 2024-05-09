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
  getTrail: async (trailId: string, authToken: string) => {
    const resp = await request.get({
      url: `${trailsUrl}/${trailId}`,
      authToken,
    });
    return await parseResponse(resp);
  },
  updateTrail: async (
    trail: Trail,
    authToken: string
  ): Promise<Trail | null> => {
    delete trail.creator;
    const resp = await request.patch<Partial<Trail>>({
      url: `${trailsUrl}/${trail.id || trail._id}`,
      authToken: authToken,
      params: trail,
    });
    return await parseResponse(resp);
  },
  createTrail: async (
    trail: Trail,
    authToken: string
  ): Promise<Trail | null> => {
    const resp = await request.post<Partial<Trail>>({
      url: trailsUrl,
      authToken: authToken,
      params: trail,
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
  getSubscribedTrails: async (authToken: string): Promise<Trail[] | []> => {
    const resp = await request.get({
      url: `${trailsUrl}/subscribed`,
      authToken: authToken,
    });
    return await parseResponse(resp);
  },
  getCreatedTrails: async (authToken: string): Promise<Trail[] | []> => {
    const resp = await request.get({
      url: `${trailsUrl}/my-trails`,
      authToken: authToken,
    });
    return await parseResponse(resp);
  },
};

export default trailsService;
