import { ServiceRequest } from "./ServiceRequest.ts";

export interface religiousServiceRequest extends ServiceRequest {
  religionName: string;
  objectName: string;
}
