import styles from "../styles/EmployeePage.module.css";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Snackbar,
  IconButton,
  Tooltip,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { EmployeeType } from "common/src/backend_interfaces/Employee.ts";
import FileUpload from "../components/FileUpload.tsx";
import { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
import BuildIcon from "@mui/icons-material/Build";
import DeleteIcon from "@mui/icons-material/Delete";

function CustomToolbar() {
  const handleFileDrop = async (file: File, apiEndpoint: string) => {
    // Create a FileReader
    const reader = new FileReader();

    // Set up a callback for when the file is loaded
    reader.onload = async (event) => {
      if (event.target) {
        // Extract the CSV content as a string
        const csvString = event.target.result as string;

        console.log(csvString);

        try {
          const res = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Set the appropriate content type
            },
            body: JSON.stringify({ csvString }), // Send the CSV string as JSON
          });

          console.log(res);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarExport />
      <FileUpload
        onFileDrop={(file) => handleFileDrop(file, "/api/employee-populate")}
      />
    </GridToolbarContainer>
  );
}

function EmployeePage() {
  const [open, setOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeType[]>([]);
  const [formData, setFormData] = useState({
    employeeEmail: "",
    employeeFirstName: "",
    employeeLastName: "",
    employeePosition: "",
    employeePermission: "",
    numberOfServiceRequests: 0,
    employeeID: 0,
  });
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [areYouSureOpen, setAreYouSureOpen] = useState(false);

  const handlePermissionChange = (event: SelectChangeEvent) => {
    setFormData({
      ...formData,
      employeePermission: event.target.value as string,
    });
  };

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/employee-populate");
      if (!response.ok) {
        throw new Error(`Please load node data ${response.status}`);
      }
      const result = await response.json();
      setEmployeeData(result);
    } catch (err) {
      console.error("Error fetching employee data");
    }
  };

  useEffect(() => {
    fetchData().then();
  }, []);

  console.log(employeeData);

  const handleEmployeeButtonClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/add-employee", formData);
      console.log(response.data);
    } catch (error) {
      console.error("Unable to create form");
      console.log(error);
    }
    handleClose();
    fetchData().then();
    setSnackbarIsOpen(true);
  };

  const handleEditClick = (rowData: EmployeeType) => {
    setFormData(rowData);
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.post("/api/add-employee/update", formData);
      console.log(response.data);
    } catch (error) {
      console.error("Unable to update employee");
      console.log(error);
    }
    setEditOpen(false);
    fetchData().then();
  };

  const handleEditDelete = async () => {
    try {
      const response = await axios.delete("/api/add-employee", {
        data: {
          employeeEmail: formData.employeeEmail,
        },
      });
      console.log("Employee deleted", response.data);
    } catch (error) {
      console.error("Unable to delete employee");
    }
    setEditOpen(false);
    fetchData().then();
  };

  const columns = [
    {
      field: "employeeID",
      headerName: "Employee ID",
      width: 130,
    },
    {
      field: "employeeLastName",
      headerName: "Last Name",
      flex: 1,
    },
    {
      field: "employeeFirstName",
      headerName: "First Name",
      flex: 1,
    },
    {
      field: "employeePosition",
      headerName: "Position",
      flex: 1,
    },
    {
      field: "employeeEmail",
      headerName: "Email Address",
      flex: 1,
    },
    {
      field: "employeePermission",
      headerName: "Permission Level",
      flex: 1,
    },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      width: 100,
      renderCell: (params: { row: EmployeeType }) => (
        <IconButton
          size={"small"}
          onClick={() => {
            handleEditClick(params.row as EmployeeType);
          }}
        >
          <BuildIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Dialog
        open={areYouSureOpen}
        onClose={() => {
          setAreYouSureOpen(false);
        }}
      >
        <DialogContent>
          Are you sure you want to delete this employee?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAreYouSureOpen(false);
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              setAreYouSureOpen(false);
              handleEditDelete();
            }}
            color={"error"}
            variant={"contained"}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
        }}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              borderRadius: 2,
              borderColor: "#012D5A",
              minWidth: "600px",
              maxWidth: "600px",
              boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
              padding: "3px",
            },
          },
        }}
      >
        <DialogTitle sx={{ color: "#012d5a" }}>Edit Employee</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              autoFocus
              margin={"dense"}
              id={"employeeFirstName"}
              label={"First Name"}
              fullWidth
              value={formData.employeeFirstName}
              required
              variant={"outlined"}
              sx={{ marginRight: "1%" }}
              onChange={handleTextFieldChange}
            />
            <TextField
              autoFocus
              margin={"dense"}
              id={"employeeLastName"}
              label={"Last Name"}
              fullWidth
              value={formData.employeeLastName}
              required
              variant={"outlined"}
              sx={{ marginLeft: "1%" }}
              onChange={handleTextFieldChange}
            />
          </div>
          <TextField
            autoFocus
            margin={"dense"}
            id={"employeeEmail"}
            label={"Email Address"}
            fullWidth
            value={formData.employeeEmail}
            required
            variant={"outlined"}
            onChange={handleTextFieldChange}
          />
          <TextField
            autoFocus
            margin={"dense"}
            id={"employeePosition"}
            label={"Position"}
            fullWidth
            value={formData.employeePosition}
            required
            variant={"outlined"}
            onChange={handleTextFieldChange}
          />
          <FormControl fullWidth margin={"dense"} required>
            <InputLabel id={"permission-label"}>Permission Level</InputLabel>
            <Select
              labelId="permission-label"
              id={"employeePermission"}
              value={formData.employeePermission}
              label={"Permission"}
              onChange={handlePermissionChange}
              variant={"outlined"}
            >
              <MenuItem value={""}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={"Staff"}>Staff</MenuItem>
              <MenuItem value={"Admin"}>Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Tooltip title={"Delete"} placement={"bottom"}>
            <IconButton
              color={"error"}
              onClick={() => {
                setAreYouSureOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={() => setEditOpen(false)} color={"error"}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant={"contained"}
            sx={{ backgroundColor: "#012d5a" }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarIsOpen}
        autoHideDuration={5000}
        onClose={() => {
          setSnackbarIsOpen(false);
        }}
        message={"Request was submitted successfully!"}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
      <div className={`${styles.pageContainer}`}>
        <div className={`${styles.employeeDashboardBox}`}>
          <div className={`${styles.employeePageHeader}`}>
            <div className={`${styles.employeePageTitle}`}>
              <h1>Manage Employees</h1>
            </div>
            <div className={`${styles.employeePageButtonsBox}`}>
              <Button
                variant="contained"
                onClick={handleEmployeeButtonClick}
                sx={{
                  backgroundColor: "#012D5A",
                }}
                startIcon={<PersonAddIcon />}
              >
                Add Employee
              </Button>
            </div>
            <Dialog
              open={open}
              onClose={handleClose}
              sx={{
                "& .MuiDialog-container": {
                  "& .MuiPaper-root": {
                    borderRadius: 2,
                    borderColor: "#012D5A",
                    minWidth: "600px",
                    maxWidth: "600px",
                    boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
                    padding: "3px",
                  },
                },
              }}
            >
              <DialogTitle sx={{ color: "#012d5a" }}>
                Add a New Employee
              </DialogTitle>
              <DialogContent>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <TextField
                    autoFocus
                    margin={"dense"}
                    id={"employeeFirstName"}
                    label={"First Name"}
                    fullWidth
                    required
                    variant={"outlined"}
                    sx={{ marginRight: "1%" }}
                    onChange={handleTextFieldChange}
                  />
                  <TextField
                    autoFocus
                    margin={"dense"}
                    id={"employeeLastName"}
                    label={"Last Name"}
                    fullWidth
                    required
                    variant={"outlined"}
                    sx={{ marginLeft: "1%" }}
                    onChange={handleTextFieldChange}
                  />
                </div>
                <TextField
                  autoFocus
                  margin={"dense"}
                  id={"employeeEmail"}
                  label={"Email Address"}
                  fullWidth
                  required
                  variant={"outlined"}
                  onChange={handleTextFieldChange}
                />
                <TextField
                  autoFocus
                  margin={"dense"}
                  id={"employeePosition"}
                  label={"Position"}
                  fullWidth
                  required
                  variant={"outlined"}
                  onChange={handleTextFieldChange}
                />
                <FormControl fullWidth margin={"dense"} required>
                  <InputLabel id={"permission-label"}>
                    Permission Level
                  </InputLabel>
                  <Select
                    labelId="permission-label"
                    id={"employeePermission"}
                    label={"Permission"}
                    onChange={handlePermissionChange}
                    variant={"outlined"}
                  >
                    <MenuItem value={""}>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"Staff"}>Staff</MenuItem>
                    <MenuItem value={"Admin"}>Admin</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color={"error"}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant={"contained"}
                  sx={{ backgroundColor: "#012d5a" }}
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </div>

          <div className={`${styles.tableSection}`}>
            <DataGrid
              columns={columns}
              rows={employeeData}
              getRowId={(row) => row.employeeID}
              slots={{
                toolbar: CustomToolbar,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeePage;
