import { RequestParameters } from "../types/request-parameter";
import { useNotificationStore } from "../stores/notification-store";

interface RequestSettings<T> {
  url: string;
  authToken?: string;
  params?: RequestParameters | T;
}

function headers(authToken: string) {
  return authToken
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      }
    : { "Content-Type": "application/json" };
}

export const request = {
  get: (options: RequestSettings<RequestParameters>) => {
    let url = options.url;
    if (options.params) {
      let queryString = "?";
      Object.keys(options.params).forEach((key) => {
        if (options.params[key as keyof Object]) {
          queryString = `${queryString}${key}=${
            options.params[key as keyof Object]
          }&`;
        }
      });
      url = `${options.url}${queryString.length > 1 ? queryString : ""}`;
    }
    return fetch(url, {
      method: "GET",
      headers: headers(options.authToken),
      mode: "cors",
    });
  },
  post: <T>(options: RequestSettings<T>) => {
    return fetch(options.url, {
      method: "POST",
      headers: headers(options.authToken),
      body: options.params ? JSON.stringify(options.params) : "{}",
      mode: "cors",
    });
  },
  delete: (options: RequestSettings<RequestParameters>) => {
    return fetch(options.url, {
      method: "DELETE",
      headers: headers(options.authToken),
      mode: "cors",
    });
  },
  patch: <T>(options: RequestSettings<T>) => {
    return fetch(options.url, {
      method: "PATCH",
      headers: headers(options.authToken),
      mode: "cors",
      body: options.params ? JSON.stringify(options.params) : "{}",
    });
  },
};

export const parseResponse = async (resp: Response) => {
  if (resp.status < 200 || resp.status >= 300) {
    const message = (await resp.json()).message || "An error occurred";
    useNotificationStore().displayNotification("Error", message, true);
    return null;
  }
  const response = await resp.json();
  return response;
};
