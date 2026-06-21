export const clutchBasePath = "/clutch" as const;

export const clutchEndPoints = {
  banners: `${clutchBasePath}/banners`,
} as const;

export type ClutchEndPoints = typeof clutchEndPoints;
