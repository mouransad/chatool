import { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { clutchEndPoints } from "./endpoints";
import {
  type GetBannersParams,
  type GetBannersResponse,
} from "./types";

export interface ClutchService {
  getBanners(
    params?: GetBannersParams,
    config?: AxiosRequestConfig,
  ): Promise<GetBannersResponse>;
}

export function createClutchService(client: AxiosInstance): ClutchService {
  return {
    async getBanners(params, config) {
      const response = await client.get<GetBannersResponse>(
        clutchEndPoints.banners,
        { params, ...config },
      );
      return response.data;
    },
  };
}

export { clutchBasePath, clutchEndPoints } from "./endpoints";
export type { ClutchEndPoints } from "./endpoints";
export type {
  GetBannersParams,
  GetBannersItem,
  GetBannersResponse,
} from "./types";
