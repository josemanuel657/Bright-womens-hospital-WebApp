import { ServiceRequest } from "./ServiceRequest.ts";

export interface foodDeliveryServiceRequest extends ServiceRequest {
  foodItem: string;
  foodQuantity: string;
  utensilItem: string;
  deliveryTime: string;
}
