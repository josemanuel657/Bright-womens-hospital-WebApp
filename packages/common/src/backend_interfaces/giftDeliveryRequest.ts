import { ServiceRequest } from "./ServiceRequest.ts";

export interface giftDeliveryRequest extends ServiceRequest {
  senderName: string;
  receiverName: string;
  giftType: string;
  deliveryDate: string;
}
