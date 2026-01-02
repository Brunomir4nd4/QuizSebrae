import { ApiResponse } from "./IApiResponse";

export interface Slot {
  id: string;
  date: string;
  time: string;
}

export interface SlotResponse extends ApiResponse {
  data: Slot[];
}
