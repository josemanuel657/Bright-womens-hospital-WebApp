import { ServiceRequest } from "./ServiceRequest.ts";

export interface roomSchedulingRequest extends ServiceRequest {
  startTime: string;
  endTime: string;
}
