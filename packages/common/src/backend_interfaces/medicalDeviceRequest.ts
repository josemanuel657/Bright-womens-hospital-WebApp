import { ServiceRequest } from "./ServiceRequest.ts";
export interface MedicalDevice extends ServiceRequest {
  deviceName: string;
  deviceQuantity: string;
}
