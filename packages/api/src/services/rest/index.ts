import { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { restEndPoints } from "./endpoints";

export interface RestService {
  ping(config?: AxiosRequestConfig): Promise<{ ok: boolean }>;
}

export function createRestService(client: AxiosInstance): RestService {
  return {
    async ping(config) {
      const response = await client.get<{ ok: boolean }>(
        restEndPoints.ping,
        config,
      );
      return response.data;
    },
  };
}

export { restBasePath, restEndPoints } from "./endpoints";
export type { RestEndPoints } from "./endpoints";
