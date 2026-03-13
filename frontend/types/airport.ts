export type Airport = {
  id?: string | number;
  iata: string;
  name: string;
  city: string;
  country: string;
  terminals: number;
  smoking_area: boolean;
  lounge: boolean;
  subway: boolean;
  taxi: boolean;
  bus: boolean;
  lat?: number;
  lng?: number;
};
