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
import { religiousServiceRequest } from "common/src/backend_interfaces/religiousServiceRequest.ts";
import { ServiceRequest } from "common/src/backend_interfaces/ServiceRequest.ts";

function ReligiousFields({
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

  const religionOptions: string[] = [
    "Christianity",
    "Islam",
    "Hinduism",
    "Buddhism",
    "Sikhism",
    "Judaism",
    "Taoism",
    "Confucianism",
    "Paganism",
  ];

  const objectOptions: string[] = [
    "Sacred Text",
    "Altar/Shrine",
    "Religious Symbol",
    "Ceremony/Ritual",
    "Beads",
    "Incense",
  ];

  const [formData, setFormData] = useState<religiousServiceRequest>({
    SRID: 0,
    employeeEmail: "",
    location: "",
    priority: "",
    status: "",
    religionName: "",
    objectName: "",
    description: "",
    serviceType: "Religious",
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

  const resetForm = () => {
    setFormData({
      SRID: 0,
      employeeEmail: "",
      location: "",
      priority: "",
      status: "",
      religionName: "",
      objectName: "",
      description: "",
      serviceType: "Religious",
    });
  };

  const handleEmployeeEmailAutocompleteChange = (value: string | null) => {
    if (value) {
      setFormData({
        ...formData,
        employeeEmail: value,
      });
    }
  };

  useEffect(() => {
    fetchEmployeeEmail();
    fetchLocations();
  }, []);

  async function fetchData() {
    const res = await axios.get("/api/service-request");
    console.log(res);
    setReqData(res.data);
    console.log("successfully got data from get request");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // comment out if this is a gabe issue

    formData.employeeEmail = formData.employeeEmail.split("(")[1].split(")")[0];
    formData.location = formData.location.split("(")[1].split(")")[0];

    try {
      const response = await axios.post(
        "/api/religious-service-request",
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
            id={"religionName"}
            disablePortal
            options={religionOptions}
            renderInput={(params) => (
              <TextField {...params} label="Religion" required />
            )}
            sx={{
              width: "100%",
              marginRight: "2%",
            }}
            value={formData.religionName}
            onChange={(e, value) =>
              handleAutocompleteChange("religionName", value)
            }
          />
          <Autocomplete
            id={"objectName"}
            disablePortal
            options={objectOptions}
            renderInput={(params) => (
              <TextField {...params} label="Religious Object" required />
            )}
            sx={{
              width: "100%",
              marginLeft: "2%",
            }}
            value={formData.objectName}
            onChange={(e, value) =>
              handleAutocompleteChange("objectName", value)
            }
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
        <p className={`${styles.footer}`}>Created by Peter Czepiel</p>
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

export default ReligiousFields;
