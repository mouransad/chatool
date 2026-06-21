// HTTP client
export { createHttpClient, type CreateHttpClientOptions } from "./client";

// Service factory
export {
  createServices,
  type CreateServicesOptions,
  type Services,
} from "./services";

// Clutch service: factory, endpoints + types (formerly ambient globals)
export {
  createClutchService,
  type ClutchService,
  clutchBasePath,
  clutchEndPoints,
  type ClutchEndPoints,
  type GetBannersParams,
  type GetBannersItem,
  type GetBannersResponse,
} from "./services/clutch";

// Dealers service scaffold
export {
  createDealersService,
  type DealersService,
  type DealerItem,
  type ListDealersParams,
  dealersBasePath,
  dealersEndPoints,
  type DealersEndPoints,
} from "./services/dealers";

// Rest service scaffold
export {
  createRestService,
  type RestService,
  restBasePath,
  restEndPoints,
  type RestEndPoints,
} from "./services/rest";

// Re-export commonly needed axios types for consumers
export type { AxiosInstance, AxiosRequestConfig } from "axios";
