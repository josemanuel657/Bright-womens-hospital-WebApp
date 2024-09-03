import { ServiceRequest } from "./ServiceRequest.ts";

export interface flowerDeliveryRequest extends ServiceRequest {
  flowerType: string;
  senderName: string;
  receiverName: string;
  deliveryDate: string;
}
