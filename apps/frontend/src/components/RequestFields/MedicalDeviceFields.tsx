import styles from "../../styles/RequestFields.module.css";
import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MedicalDevice } from "common/src/backend_interfaces/medicalDeviceRequest.ts";
import { ServiceRequest } from "common/src/backend_interfaces/ServiceRequest.ts";

function MedicalDeviceFields({
  setReqData,
}: {
  setReqData: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
}) {
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [employeeEmailOptions, setemployeeEmailOptions] = useState<string[]>(
    [],
  );

  const fetchEmployeeEmail = async () => {
    try {
      const response = await axios.get("/api/employee-email-fetch");
      const employeeData = response.data.map(
        (employee: { employeeFullName: string; employeeEmail: string }) => ({
          name: employee.employeeFullName,
          employeeEmail: employee.employeeEmail,
        }),
      );

      const formattedEmails = employeeData.map(
        ({ name, employeeEmail }: { name: string; employeeEmail: string }) =>
          `${name} (${employeeEmail})`,
      );

      setemployeeEmailOptions(formattedEmails);
    } catch (error) {
      console.error("Failed to fetch employee emails", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get("/api/room-name-fetch");

      const nodeIDNames = response.data.map(
        (node: { shortName: string; nodeID: string }) => ({
          shortName: node.shortName,
          nodeID: node.nodeID,
        }),
      );

      const formattedNodes = nodeIDNames.map(
        ({ shortName, nodeID }: { shortName: string; nodeID: string }) =>
          `${shortName} (${nodeID})`,
      );

      setLocationOptions(formattedNodes);
    } catch (error) {
      console.error("Failed to fetch employee emails", error);
    }
  };

  useEffect(() => {
    fetchEmployeeEmail();
    fetchLocations();
  }, []);

  const deviceOptions = [
    "Stethoscope",
    "Blood Pressure Monitor",
    "Thermometer",
    "MRI Machine",
    "X-ray Machine",
    "Ultrasound Machine",
    "Defibrillator",
    "Electrocardiogram (ECG) Machine",
    "Pulse Oximeter",
    "Sphygmomanometer",
    "Glucose Meter",
    "Infusion Pump",
    "Ventilator",
    "Nebulizer",
    "Ophthalmoscope",
    "Otoscope",
    "Doppler",
    "Endoscope",
    "Laryngoscope",
    "Colonoscope",
    "Bronchoscope",
    "Anesthesia Machine",
    "Blood Gas Analyzer",
    "Fetal Monitor",
    "Spirometer",
    "Catheter",
    "Pacemaker",
    "Implantable Cardioverter Defibrillator (ICD)",
    "Cardiac Catheterization Lab Equipment",
    "Hemodialysis Machine",
    "Surgical Laser",
    "Surgical Robot",
    "CT Scanner",
    "PET Scanner",
    "EEG Machine",
    "EMG Machine",
    "EKG Machine",
    "Holter Monitor",
    "Oxygen Concentrator",
    "Apnea Monitor",
    "Continuous Glucose Monitor (CGM)",
    "Insulin Pump",
    "Wheelchair",
    "Crutches",
    "Walker",
    "Hospital Bed",
    "Suction Machine",
    "Feeding Pump",
    "Orthopedic Implants",
    "Orthosis",
    "Prosthesis",
  ];

  const [formData, setFormData] = useState<MedicalDevice>({
    SRID: 0,
    employeeEmail: "",
    location: "",
    priority: "",
    status: "",
    deviceName: "",
    deviceQuantity: "",
    description: "",
    serviceType: "Medical Device",
  });

  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<unknown>, field: string) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleAutocompleteChange = (field: string, value: string | null) => {
    if (value) {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleEmployeeEmailAutocompleteChange = (value: string | null) => {
    if (value) {
      setFormData({
        ...formData,
        employeeEmail: value,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      SRID: 0,
      employeeEmail: "",
      location: "",
      priority: "",
      status: "",
      deviceName: "",
      deviceQuantity: "",
      description: "",
      serviceType: "Medical Device",
    });
  };

  async function fetchData() {
    const res = await axios.get("/api/service-request");
    console.log(res);
    setReqData(res.data);
    console.log("successfully got data from get request");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // comment back out if it is only a gabe issue

    formData.employeeEmail = formData.employeeEmail.split("(")[1].split(")")[0];
    formData.location = formData.location.split("(")[1].split(")")[0];

    try {
      const response = await axios.post(
        "/api/medical-device-service-request",
        formData,
      );
      console.log(response.data);
    } catch (error) {
      console.error("Unable to create form");
      console.log(error);
    }
    fetchData().then();
    setSnackbarIsOpen(true);
    resetForm();
  };

  return (
    <>
      <Snackbar
        open={snackbarIsOpen}
        autoHideDuration={5000}
        onClose={() => {
          setSnackbarIsOpen(false);
        }}
        message={"Request was submitted successfully!"}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
      <form onSubmit={handleSubmit}>
        <div className={`${styles.commonInputsContainer}`}>
          <div className={`${styles.doubleInputRow}`}>
            <Autocomplete
              id="employeeEmail"
              options={employeeEmailOptions}
              fullWidth
              sx={{
                marginRight: "2%",
                width: "100%",
              }}
              renderInput={(params) => (
                <TextField {...params} label="Employee" required />
              )}
              value={formData.employeeEmail}
              onChange={(e, value) =>
                handleEmployeeEmailAutocompleteChange(value)
              }
            />
            <Autocomplete
              disablePortal
              id="location"
              options={locationOptions}
              sx={{
                marginLeft: "2%",
                width: "100%",
              }}
              renderInput={(params) => (
                <TextField {...params} label="Location" required />
              )}
              value={formData.location}
              onChange={(e, value) =>
                handleAutocompleteChange("location", value)
              }
            />
          </div>
          <div className={`${styles.doubleInputRow} ${styles.priorityStatus}`}>
            <FormControl
              fullWidth
              required
              sx={{
                maxWidth: "100%",
                marginRight: "2%",
              }}
            >
              <InputLabel id="priorityLabel">Priority</InputLabel>
              <Select
                labelId="priorityLabel"
                id="priority"
                label="Priority"
                value={formData.priority}
                onChange={(e) => handleSelectChange(e, "priority")}
              >
                <MenuItem value={"Low"}>Low</MenuItem>
                <MenuItem value={"Medium"}>Medium</MenuItem>
                <MenuItem value={"High"}>High</MenuItem>
                <MenuItem value={"Emergency"}>Emergency</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              required
              sx={{
                maxWidth: "100%",
                marginLeft: "2%",
              }}
            >
              <InputLabel id="statusLabel">Status</InputLabel>
              <Select
                labelId="statusLabel"
                id="status"
                label="Status"
                value={formData.status}
                onChange={(e) => handleSelectChange(e, "status")}
              >
                <MenuItem value={"Unassigned"}>Unassigned</MenuItem>
                <MenuItem value={"Assigned"}>Assigned</MenuItem>
                <MenuItem value={"In Progress"}>In Progress</MenuItem>
                <MenuItem value={"Closed"}>Closed</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <hr className={`${styles.divider}`} />
        <div className={`${styles.doubleInputRow}`}>
          <Autocomplete
            id={"deviceName"}
            disablePortal
            options={deviceOptions}
            renderInput={(params) => (
              <TextField {...params} label="Device" required />
            )}
            sx={{
              width: "225%",
              marginRight: "2%",
            }}
            value={formData.deviceName}
            onChange={(e, value) =>
              handleAutocompleteChange("deviceName", value)
            }
          />
          <TextField
            id={"deviceQuantity"}
            type={"number"}
            fullWidth
            variant={"outlined"}
            label={"Quantity"}
            InputProps={{
              endAdornment: <div>units</div>,
            }}
            sx={{
              marginLeft: "2%",
            }}
            required
            value={formData.deviceQuantity}
            onChange={handleTextFieldChange}
          />
        </div>
        <div className={`${styles.descriptionField}`}>
          <TextField
            id={"description"}
            fullWidth
            variant={"outlined"}
            label={"Description (optional)"}
            multiline
            rows={5}
            value={formData.description}
            onChange={handleTextFieldChange}
          />
        </div>
        <p className={`${styles.footer}`}>Created by Peter & Sofia</p>
        <div className={`${styles.formButtons}`}>
          <Button
            id={"clearButton"}
            variant={"outlined"}
            color={"error"}
            sx={{
              width: "30%",
            }}
            onClick={resetForm}
          >
            Clear
          </Button>
          <Button
            id={"submitButton"}
            variant={"contained"}
            sx={{
              backgroundColor: "#012d5a",
              color: "white",
              width: "30%",
            }}
            type={"submit"}
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}

export default MedicalDeviceFields;
