import { ServiceRequest } from "./ServiceRequest.ts";

export interface medicineDeliveryRequest extends ServiceRequest {
  medicineType: string;
  dosageType: string;
  dosageAmount: string;
}
