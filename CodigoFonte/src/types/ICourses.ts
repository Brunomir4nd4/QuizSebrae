import { ApiResponse } from "./IApiResponse";
import { Facilitator } from "./IFacilitador";

export interface GroupType {
  is_group_meetings_enabled: boolean;
  facilitator: Facilitator;
}

export interface GroupTypeResponse extends ApiResponse {
  data: GroupType
}