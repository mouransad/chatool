import { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { dealersEndPoints } from "./endpoints";

// Scaffold types — replace with the real dealers contract.
export interface DealerItem {
  id: string;
  name: string;
}

export interface ListDealersParams {
  city?: string;
  limit?: number;
}

export interface DealersService {
  list(
    params?: ListDealersParams,
    config?: AxiosRequestConfig,
  ): Promise<DealerItem[]>;
  detail(id: string, config?: AxiosRequestConfig): Promise<DealerItem>;
}

export function createDealersService(client: AxiosInstance): DealersService {
  return {
    async list(params, config) {
      const response = await client.get<DealerItem[]>(dealersEndPoints.list, {
        params,
        ...config,
      });
      return response.data;
    },
    async detail(id, config) {
      const response = await client.get<DealerItem>(
        dealersEndPoints.detail(id),
        config,
      );
      return response.data;
    },
  };
}

export { dealersBasePath, dealersEndPoints } from "./endpoints";
export type { DealersEndPoints } from "./endpoints";
