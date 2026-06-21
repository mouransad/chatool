export const restBasePath = "/rest" as const;

export const restEndPoints = {
  ping: `${restBasePath}/ping`,
} as const;

export type RestEndPoints = typeof restEndPoints;
