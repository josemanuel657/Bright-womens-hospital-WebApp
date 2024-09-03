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
import { flowerDeliveryRequest } from "common/src/backend_interfaces/flowerServiceRequest.ts";
import axios from "axios";
import { ServiceRequest } from "common/src/backend_interfaces/ServiceRequest.ts";

function FlowerDeliveryFields({
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
    fetchLocations();
    fetchEmployeeEmail();
  }, []);

  const [formData, setFormData] = useState<flowerDeliveryRequest>({
    SRID: 0,
    employeeEmail: "",
    location: "",
    priority: "",
    status: "",
    senderName: "",
    receiverName: "",
    flowerType: "",
    deliveryDate: "",
    description: "",
    serviceType: "Flower Delivery",
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

  //this one handles the location
  const handleAutocompleteChange = (value: string | null) => {
    if (value) {
      setFormData({
        ...formData,
        location: value,
      });
    }
  };
  //this one does email
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
      senderName: "",
      receiverName: "",
      flowerType: "",
      deliveryDate: "",
      description: "",
      serviceType: "Flower Delivery",
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
        "/api/flower-service-request",
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
              renderInput={(params) => (
                <TextField {...params} label="Employee" required />
              )}
              sx={{
                marginRight: "2%",
                width: "100%",
              }}
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
              onChange={(e, value) => handleAutocompleteChange(value)}
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
          <TextField
            id={"senderName"}
            fullWidth
            variant={"outlined"}
            label={"Sender Name"}
            sx={{
              marginRight: "2%",
            }}
            required
            value={formData.senderName}
            onChange={handleTextFieldChange}
          />
          <TextField
            id={"receiverName"}
            fullWidth
            variant={"outlined"}
            label={"Recipient Name"}
            sx={{
              marginLeft: "2%",
            }}
            required
            value={formData.receiverName}
            onChange={handleTextFieldChange}
          />
        </div>
        <div className={`${styles.doubleInputRow} ${styles.spaceAbove}`}>
          <FormControl
            fullWidth
            required
            sx={{
              maxWidth: "100%",
              marginRight: "2%",
            }}
          >
            <InputLabel id="flowerTypeLabel">Flower Type</InputLabel>
            <Select
              labelId="flowerTypeLabel"
              id="flowerType"
              label="Flower Type"
              value={formData.flowerType}
              onChange={(e) => handleSelectChange(e, "flowerType")}
            >
              <MenuItem value={"Rose"}>Rose</MenuItem>
              <MenuItem value={"Tulip"}>Tulip</MenuItem>
              <MenuItem value={"Lily"}>Lily</MenuItem>
              <MenuItem value={"Orchid"}>Orchid</MenuItem>
              <MenuItem value={"Sunflower"}>Sunflower</MenuItem>
              <MenuItem value={"Daisy"}>Daisy</MenuItem>
              <MenuItem value={"Carnation"}>Carnation</MenuItem>
              <MenuItem value={"Hydrangea"}>Hydrangea</MenuItem>
              <MenuItem value={"Peony"}>Peony</MenuItem>
              <MenuItem value={"Chrysanthemum"}>Chrysanthemum</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id={"deliveryDate"}
            type={"date"}
            fullWidth
            variant={"outlined"}
            label={"Delivery Date"}
            InputLabelProps={{ shrink: true }}
            sx={{ marginLeft: "2%" }}
            required
            value={formData.deliveryDate}
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

export default FlowerDeliveryFields;
