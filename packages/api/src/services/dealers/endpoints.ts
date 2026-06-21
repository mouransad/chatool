export const dealersBasePath = "/dealers" as const;

export const dealersEndPoints = {
  list: `${dealersBasePath}`,
  detail: (id: string) => `${dealersBasePath}/${id}`,
} as const;

export type DealersEndPoints = typeof dealersEndPoints;
