import styles from "../styles/Dashboard.module.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import MedicineFields from "./RequestFields/MedicineFields.tsx";
import MedicalDeviceFields from "./RequestFields/MedicalDeviceFields.tsx";
import RoomSchedulingFields from "./RequestFields/RoomSchedulingFields.tsx";
import GiftFields from "./RequestFields/GiftFields.tsx";
import FlowerDeliveryFields from "./RequestFields/FlowerDeliveryFields.tsx";
import ReligiousFields from "./RequestFields/ReligiousFields.tsx";
import FoodDeliveryFields from "./RequestFields/FoodDeliveryFields.tsx";
import React, { useState } from "react";
import { ServiceRequest } from "common/src/backend_interfaces/ServiceRequest.ts";

export default function DashMakeARequest({
  setReqData,
}: {
  setReqData: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
}) {
  const [currentReqType, setCurrentReqType] = useState(
    <FlowerDeliveryFields setReqData={setReqData} />,
  );

  const handleRequestTypeChange = (e: SelectChangeEvent<unknown>) => {
    switch (e.target.value) {
      case "Medicine":
        setCurrentReqType(<MedicineFields setReqData={setReqData} />);
        break;
      case "Med. Device":
        setCurrentReqType(<MedicalDeviceFields setReqData={setReqData} />);
        break;
      case "Room":
        setCurrentReqType(<RoomSchedulingFields setReqData={setReqData} />);
        break;
      case "Gift":
        setCurrentReqType(<GiftFields setReqData={setReqData} />);
        break;
      case "Religious":
        setCurrentReqType(<ReligiousFields setReqData={setReqData} />);
        break;
      case "Food":
        setCurrentReqType(<FoodDeliveryFields setReqData={setReqData} />);
        break;
      case "Flower":
        setCurrentReqType(<FlowerDeliveryFields setReqData={setReqData} />);
        break;
      default:
        setCurrentReqType(<div></div>);
        break;
    }
  };

  return (
    <>
      <div className={`${styles.requestFormContainer}`}>
        <div className={`${styles.requestFormHeader}`}>
          <h1 className={`${styles.sectionHeader}`}>Make a Request</h1>
          <FormControl fullWidth sx={{ maxWidth: "48%" }} required>
            <InputLabel id="requestTypeLabel">Request Type</InputLabel>
            <Select
              labelId="requestTypeLabel"
              id="requestType"
              label="Request Type"
              onChange={(e) => {
                handleRequestTypeChange(e);
              }}
              defaultValue={"Flower"}
            >
              <MenuItem value={"Flower"}>Flower Delivery</MenuItem>
              <MenuItem value={"Gift"}>Gift</MenuItem>
              <MenuItem value={"Medicine"}>Medicine</MenuItem>
              <MenuItem value={"Med. Device"}>Medical Device</MenuItem>
              <MenuItem value={"Room"}>Room Scheduling</MenuItem>
              <MenuItem value={"Religious"}>Religious</MenuItem>
              <MenuItem value={"Food"}>Food Delivery</MenuItem>
            </Select>
          </FormControl>
        </div>
        <hr className={`${styles.divider}`} />
        <div className={`${styles.formContent}`}>{currentReqType}</div>
      </div>
    </>
  );
}
