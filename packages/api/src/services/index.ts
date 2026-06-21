import { type AxiosInstance } from "axios";
import { createHttpClient } from "../client";
import { createClutchService, type ClutchService } from "./clutch";
import { createDealersService, type DealersService } from "./dealers";
import { createRestService, type RestService } from "./rest";

export interface CreateServicesOptions {
  /** Injected base URL — e.g. from process.env (Next) or import.meta.env (Vite). */
  baseURL: string;
  /** Optional pre-configured client. When omitted, one is created from `baseURL`. */
  client?: AxiosInstance;
}

export interface Services {
  client: AxiosInstance;
  clutch: ClutchService;
  dealers: DealersService;
  rest: RestService;
}

/**
 * Build the grouped, typed service object on top of a single axios client.
 * Framework-agnostic — works in RSC, getServerSideProps, an API route, or the
 * browser, as long as the caller injects `baseURL`.
 */
export function createServices({
  baseURL,
  client,
}: CreateServicesOptions): Services {
  const httpClient = client ?? createHttpClient({ baseURL });

  return {
    client: httpClient,
    clutch: createClutchService(httpClient),
    dealers: createDealersService(httpClient),
    rest: createRestService(httpClient),
  };
}
