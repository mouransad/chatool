/**
 * Clutch service types — these were previously ambient globals; they are now
 * real, importable exports.
 */

export interface GetBannersParams {
  placement?: string;
  limit?: number;
  /** ISO locale, e.g. "fa-IR". */
  locale?: string;
}

export interface GetBannersItem {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  order?: number;
}

export interface GetBannersResponse {
  items: GetBannersItem[];
}
