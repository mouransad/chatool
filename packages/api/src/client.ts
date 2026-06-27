import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";

export interface CreateHttpClientOptions extends CreateAxiosDefaults {
  /** Required absolute base URL. The consumer injects this (no process.env here). */
  baseURL: string;
}

/**
 * Create a configured axios instance. Fully injectable: the caller supplies the
 * `baseURL` (and any other axios config). This package never reads environment
 * variables — each framework injects its own baseURL.
 */
export function createHttpClient({
  baseURL,
  ...axiosConfig
}: CreateHttpClientOptions): AxiosInstance {
  return axios.create({ baseURL, ...axiosConfig });
}
