import {
  // TableCell,
  styled,
  tableCellClasses,
  TableRow,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Collapse,
  Box,
  TextField,
  InputAdornment,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TablePagination,
  SelectChangeEvent,
  Popover,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TableCell,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import styles from "../styles/Dashboard.module.css";
import SearchIcon from "@mui/icons-material/Search";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import axios from "axios";
import { ServiceRequest } from "common/src/backend_interfaces/ServiceRequest.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

function createData(
  SRID: number,
  serviceType: string,
  employeeEmail: string,
  location: string,
  priority: string,
  status: string,
  description: string,
) {
  return {
    SRID,
    serviceType,
    employeeEmail,
    location,
    priority,
    status,
    description,
  };
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#012D5A",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(4n), &:nth-of-type(4n-1)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function Row(props: {
  row: ReturnType<typeof createData>;
  setReqData: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
}) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);

  const [requestData, setRequestData] = useState({
    SRID: 0,
    serviceType: "",
    employeeEmail: "",
    location: "",
    priority: "",
    status: "",
    description: "",
    religionName: "",
    objectName: "",
    foodItem: "",
    foodQuantity: "",
    utensilItem: "",
    deliveryTime: "",
    senderName: "",
    receiverName: "",
    flowerType: "",
    deliveryDate: "",
    giftType: "",
    medicineType: "",
    dosageAmount: "",
    dosageType: "",
    deviceName: "",
    deviceQuantity: "",
    startTime: "",
    endTime: "",
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low":
        return "#00b300";
      case "Medium":
        return "#ffcc00";
      case "High":
        return "#ff6600";
      case "Emergency":
        return "#ff0000";
      default:
        return "#FFFFFF";
    }
  };

  const handleStatusChange = async (
    row: ServiceRequest,
    event: SelectChangeEvent<unknown>,
  ) => {
    // Update the priority of the ServiceRequest object
    row.status = event.target.value as string;

    try {
      // Send a POST request to the server with the updated ServiceRequest object
      const response = await axios.post("/api/service-request", row);
      console.log("Form data sent successfully:", response.data);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  const getFlowerDeliveryData = async (SRID: number) => {
    try {
      const res = await axios.get(`/api/flower-service-request`, {
        params: {
          SRID: SRID,
        },
      });
      console.log(res.data);
      setRequestData(res.data);
    } catch {
      console.error("Error getting flower delivery data");
    }
  };

  const getGiftDeliveryData = async (SRID: number) => {
    try {
      const res = await axios.get(`/api/gift-service-request`, {
        params: {
          SRID: SRID,
        },
      });
      console.log(res.data);
      setRequestData(res.data);
    } catch {
      console.error("Error getting gift delivery data");
    }
  };

  const getMedicineData = async (SRID: number) => {
    try {
      const res = await axios.get(`/api/medicine-delivery-service-request`, {
        params: {
          SRID: SRID,
        },
      });
      console.log(res.data);
      setRequestData(res.data);
    } catch {
      console.error("Error getting medicine data");
    }
  };

  const getMedicalDeviceData = async (SRID: number) => {
    try {
      const res = await axios.get(`/api/medical-device-service-request`, {
        params: {
          SRID: SRID,
        },
      });
      console.log(res.data);
      setRequestData(res.data);
    } catch {
      console.error("Error getting medical device data");
    }
  };

  const getRoomSchedulingData = async (SRID: number) => {
    try {
      const res = await axios.get(`/api/room-scheduling-request`, {
        params: {
          SRID: SRID,
        },
      });
      console.log(res.data);
      setRequestData(res.data);
    } catch {
      console.error("Error getting room scheduling data");
    }
  };

  const getReligiousData = async (SRID: number) => {
    try {
      const res = await axios.get(`/api/religious-service-request`, {
        params: {
          SRID: SRID,
        },
      });
      console.log(res.data);
      setRequestData(res.data);
    } catch {
      console.error("Error getting religious data");
    }
  };

  const getFoodData = async (SRID: number) => {
    try {
      const res = await axios.get(`/api/food-delivery-service-request`, {
        params: {
          SRID: SRID,
        },
      });
      console.log(res.data);
      setRequestData(res.data);
    } catch {
      console.error("Error getting food data");
    }
  };

  const handleDelete = async (SRID: number) => {
    setDialogueOpen(false);
    try {
      const response = await axios.delete("/api/service-request", {
        data: {
          SRID: SRID,
        },
      });
      console.log("Service Request Deleted", response.data);
    } catch (error) {
      console.error("Error Deleting Service Request", error);
    }
    props.setReqData((prevData) => prevData.filter((req) => req.SRID !== SRID));
  };

  return (
    <React.Fragment>
      <Dialog open={dialogueOpen} onClose={() => setDialogueOpen(false)}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete this service request? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogueOpen(false)}
            sx={{
              color: "black",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(row.SRID)}
            color="error"
            variant={"contained"}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <StyledTableCell>
          <IconButton
            size="small"
            onClick={() => {
              setOpen(!open);
              if (!open) {
                if (row.serviceType === "Flower Delivery") {
                  getFlowerDeliveryData(row.SRID).then();
                } else if (row.serviceType === "Gift Delivery") {
                  getGiftDeliveryData(row.SRID).then();
                } else if (row.serviceType === "Medical Device") {
                  getMedicalDeviceData(row.SRID).then();
                } else if (row.serviceType === "Medicine") {
                  getMedicineData(row.SRID).then();
                } else if (row.serviceType === "Room Scheduling") {
                  getRoomSchedulingData(row.SRID).then();
                } else if (row.serviceType === "Religious") {
                  getReligiousData(row.SRID).then();
                } else if (row.serviceType === "Food Delivery") {
                  getFoodData(row.SRID).then();
                }
              }
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {row.SRID}
        </StyledTableCell>
        <StyledTableCell align="right">{row.serviceType}</StyledTableCell>
        <StyledTableCell align="right">{row.employeeEmail}</StyledTableCell>
        <StyledTableCell align="right">{row.location}</StyledTableCell>
        <StyledTableCell align="right" sx={{ textWrap: "nowrap" }}>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: getPriorityColor(row.priority),
              marginRight: "8px",
            }}
          />
          {row.priority}
        </StyledTableCell>
        <StyledTableCell align="right">
          <FormControl fullWidth size={"small"}>
            <Select
              id="filterStatus"
              defaultValue={row.status}
              onChange={(event) => handleStatusChange(row, event)}
              sx={{
                fontSize: "14px",
              }}
            >
              <MenuItem value={"Unassigned"} sx={{ fontSize: "14px" }}>
                Unassigned
              </MenuItem>
              <MenuItem value={"Assigned"} sx={{ fontSize: "14px" }}>
                Assigned
              </MenuItem>
              <MenuItem value={"In Progress"} sx={{ fontSize: "14px" }}>
                In Progress
              </MenuItem>
              <MenuItem value={"Closed"} sx={{ fontSize: "14px" }}>
                Closed
              </MenuItem>
            </Select>
          </FormControl>
        </StyledTableCell>
        <StyledTableCell align={"center"}>
          <IconButton
            sx={{
              color: "#484848",
              transition: "color 0.15s ease-in-out",
              "&:hover": {
                color: "red",
              },
              padding: 0,
            }}
            onClick={() => setDialogueOpen(true)}
          >
            <DeleteIcon />
          </IconButton>
        </StyledTableCell>
      </TableRow>
      <TableRow>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={8}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {row.serviceType === "Flower Delivery" ? (
                <>
                  <Table size={"small"}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Sender Name</b>
                        </TableCell>
                        <TableCell>
                          <b>Receiver Name</b>
                        </TableCell>
                        <TableCell>
                          <b>Flower Type</b>
                        </TableCell>
                        <TableCell>
                          <b>Delivery Date</b>
                        </TableCell>
                        <TableCell>
                          <b>Description</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <StyledTableCell>
                          {requestData.senderName}
                        </StyledTableCell>
                        <StyledTableCell>
                          {requestData.receiverName}
                        </StyledTableCell>
                        <StyledTableCell>
                          {requestData.flowerType}
                        </StyledTableCell>
                        <StyledTableCell>
                          {requestData.deliveryDate}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.description ? (
                            row.description
                          ) : (
                            <p>
                              <em>None</em>
                            </p>
                          )}
                        </StyledTableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </>
              ) : row.serviceType === "Gift Delivery" ? (
                <>
                  <Table size={"small"}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Sender Name</b>
                        </TableCell>
                        <TableCell>
                          <b>Receiver Name</b>
                        </TableCell>
                        <TableCell>
                          <b>Gift Type</b>
                        </TableCell>
                        <TableCell>
                          <b>Delivery Date</b>
                        </TableCell>
                        <TableCell>
                          <b>Description</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <StyledTableCell>
                          {requestData.senderName}
                        </StyledTableCell>
                        <StyledTableCell>
                          {requestData.receiverName}
                        </StyledTableCell>
                        <StyledTableCell>
                          {requestData.giftType}
                        </StyledTableCell>
                        <StyledTableCell>
                          {requestData.deliveryDate}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.description ? (
                            row.description
                          ) : (
                            <p>
                              <em>None</em>
                            </p>
                          )}
                        </StyledTableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </>
              ) : row.serviceType === "Medicine" ? (
                <>
                  <Table size={"small"}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Medicine Type</b>
                        </TableCell>
                        <TableCell>
                          <b>Dosage Amount</b>
                        </TableCell>
                        <TableCell>
                          <b>Dosage Form</b>
                        </TableCell>
                        <TableCell>
                          <b>Description</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <StyledTableCell>
                          {requestData.medicineType}
                        </StyledTableCell>
                        <StyledTableCell>
                          {requestData.dosageAmount} mg
                        </StyledTableCell>
                        <StyledTableCell>
                          {requestData.dosageType}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.description ? (
                            row.description
                          ) : (
                            <p>
                              <em>None</em>
                            </p>
                          )}
                        </StyledTableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </>
              ) : row.serviceType === "Medical Device" ? (
                <>
                  <Table size={"small"}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Device Type</b>
                        </TableCell>
                        <TableCell>
                          <b>Quantity</b>
                        </TableCell>
                        <TableCell>
                          <b>Description</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <StyledTableCell>
                          {requestData.deviceName}
                        </StyledTableCell>
                        <StyledTableCell>
                          {requestData.deviceQuantity}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.description ? (
                            row.description
                          ) : (
                            <p>
                              <em>None</em>
                            </p>
                          )}
                        </StyledTableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </>
              ) : row.serviceType === "Room Scheduling" ? (
                <>
                  <Table size={"small"}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Start Time</b>
                        </TableCell>
                        <TableCell>
                          <b>End Time</b>
                        </TableCell>
                        <TableCell>
                          <b>Description</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <StyledTableCell>
                          {requestData.startTime}
                        </StyledTableCell>
                        <StyledTableCell>{requestData.endTime}</StyledTableCell>
                        <StyledTableCell>
                          {row.description ? (
                            row.description
                          ) : (
                            <p>
                              <em>None</em>
                            </p>
                          )}
                        </StyledTableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </>
              ) : row.serviceType === "Religious" ? (
                <>
                  <Table size={"small"}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Religion</b>
                        </TableCell>
                        <TableCell>
                          <b>Object</b>
                        </TableCell>
                        <TableCell>
                          <b>Description</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <StyledTableCell>
                          {requestData.religionName}
                        </StyledTableCell>
                        <StyledTableCell>
                          {requestData.objectName}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.description ? (
                            row.description
                          ) : (
                            <p>
                              <em>None</em>
                            </p>
                          )}
                        </StyledTableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </>
              ) : row.serviceType === "Food Delivery" ? (
                <>
                  <Table size={"small"}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Food Item</b>
                        </TableCell>
                        <TableCell>
                          <b>Food Quantity</b>
                        </TableCell>
                        <TableCell>
                          <b>Utensil Item</b>
                        </TableCell>
                        <TableCell>
                          <b>Delivery Time</b>
                        </TableCell>
                        <TableCell>
                          <b>Description</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <StyledTableCell>
                          {requestData.foodItem}
                        </StyledTableCell>
                        <StyledTableCell>
                          {requestData.foodQuantity}
                        </StyledTableCell>
                        <StyledTableCell>
                          {requestData.utensilItem}
                        </StyledTableCell>
                        <StyledTableCell>
                          {requestData.deliveryTime}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.description ? (
                            row.description
                          ) : (
                            <p>
                              <em>None</em>
                            </p>
                          )}
                        </StyledTableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </>
              ) : (
                <></>
              )}
            </Box>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function DashCurrentRequests({
  expanded,
  onExpandClick,
  reqData,
  setReqData,
}: {
  expanded: boolean;
  onExpandClick: () => void;
  reqData: ServiceRequest[];
  setReqData: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // const [requestData, setRequestData] = useState<ServiceRequest[]>();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Any");
  const [filterPriority, setFilterPriority] = useState("Any");
  const [filterStatus, setFilterStatus] = useState("Any");
  const [filterEmployee, setFilterEmployee] = useState("Any");

  const filterRows = (rows: ServiceRequest[]) => {
    return rows.filter((row) => {
      const matchesSearchTerm =
        searchTerm === "" ||
        Object.values(row).some((val) =>
          val.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesFilterType =
        filterType === "Any" || row.serviceType === filterType;
      const matchesFilterPriority =
        filterPriority === "Any" || row.priority === filterPriority;
      const matchesFilterStatus =
        filterStatus === "Any" || row.status === filterStatus;
      const matchesFilterEmployee =
        filterEmployee === "Any" || row.employeeEmail === filterEmployee;
      return (
        matchesSearchTerm &&
        matchesFilterType &&
        matchesFilterPriority &&
        matchesFilterStatus &&
        matchesFilterEmployee
      );
    });
  };
  const [employeeEmailOptions, setemployeeEmailOptions] = useState<string[]>(
    [],
  );
  useEffect(() => {
    // async function fetchData() {
    //   const res = await axios.get("/api/service-request");
    //   console.log(res);
    //   setRequestData(res.data);
    //   console.log("successfully got data from get request");
    // }
    // fetchData().then();

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
    fetchEmployeeEmail();
  }, []);

  let rows: ServiceRequest[] = [];
  if (reqData) {
    rows = reqData;
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <div
        className={`${styles.currentRequestsContainer} ${
          expanded ? styles.expanded : styles.collapsed
        }`}
      >
        <div className={`${styles.currentRequestsHeader}`}>
          <h1 className={`${styles.sectionHeader}`}>Current Requests</h1>
          {expanded ? (
            <IconButton onClick={onExpandClick}>
              <ChevronLeftIcon />
            </IconButton>
          ) : (
            <IconButton onClick={onExpandClick}>
              <ChevronRightIcon />
            </IconButton>
          )}
        </div>
        {/*<hr className={`${styles.divider}`} />*/}
        <div className={`${styles.tableMutators}`}>
          <div className={`${styles.searchMenu}`}>
            <label htmlFor="searchBar" className={`${styles.filterMenuText}`}>
              Search
            </label>
            <TextField
              id={"searchBar"}
              variant={"outlined"}
              size={"small"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className={`${styles.filterMenu}`}>
            <Button
              variant={"outlined"}
              color={"error"}
              onClick={() => {
                setFilterEmployee("Any");
                setFilterType("Any");
                setFilterPriority("Any");
                setFilterStatus("Any");
              }}
              sx={{
                mr: "8px",
              }}
            >
              <FilterAltOffIcon />
            </Button>
            <Button
              variant={"contained"}
              // startIcon={<FilterAltIcon />}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                setPopoverOpen(true);
                setAnchorEl(event.currentTarget);
              }}
              sx={{
                ml: "8px",
                backgroundColor: "#012d5a",
                color: "white",
              }}
            >
              {/*Filter*/}
              <FilterAltIcon />
            </Button>
            <div>
              <Popover
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={() => {
                  setPopoverOpen(false);
                  setAnchorEl(null);
                }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <div className={`${styles.filterSelectors}`}>
                  <FormControl fullWidth size={"small"} sx={{ mx: "4px" }}>
                    <InputLabel id="filterEmployeeLabel">Employee</InputLabel>
                    <Select
                      labelId="filterEmployeeLabel"
                      id="filterEmployee"
                      label="Employee"
                      value={filterEmployee} // Add this line
                      onChange={(event) =>
                        setFilterEmployee(event.target.value as string)
                      }
                    >
                      <MenuItem value={"Any"}>
                        <em>Any</em>
                      </MenuItem>
                      {employeeEmailOptions.map((email) => (
                        <MenuItem key={email} value={email}>
                          {email}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size={"small"} sx={{ mx: "4px" }}>
                    <InputLabel id="filterTypeLabel">Type</InputLabel>
                    <Select
                      labelId="filterTypeLabel"
                      id="filterType"
                      label="Type"
                      value={filterType}
                      onChange={(event) =>
                        setFilterType(event.target.value as string)
                      }
                    >
                      <MenuItem value={"Any"}>
                        <em>Any</em>
                      </MenuItem>
                      <MenuItem value={"Flower Delivery"}>
                        Flower Delivery
                      </MenuItem>
                      <MenuItem value={"Gift Delivery"}>Gift Delivery</MenuItem>
                      <MenuItem value={"Medicine"}>Medicine</MenuItem>
                      <MenuItem value={"Medical Device"}>
                        Medical Device
                      </MenuItem>
                      <MenuItem value={"Room Scheduling"}>
                        Room Scheduling
                      </MenuItem>
                      <MenuItem value={"Religious"}>Religious</MenuItem>
                      <MenuItem value={"Food Delivery"}>Food Delivery</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size={"small"} sx={{ mx: "4px" }}>
                    <InputLabel id="filterPriorityLabel">Priority</InputLabel>
                    <Select
                      labelId="filterPriorityLabel"
                      id="filterPriority"
                      label="Priority"
                      value={filterPriority} // Add this line
                      onChange={(event) =>
                        setFilterPriority(event.target.value as string)
                      }
                    >
                      <MenuItem value={"Any"}>
                        <em>Any</em>
                      </MenuItem>
                      <MenuItem value={"Low"}>Low</MenuItem>
                      <MenuItem value={"Medium"}>Medium</MenuItem>
                      <MenuItem value={"High"}>High</MenuItem>
                      <MenuItem value={"Emergency"}>Emergency</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size={"small"} sx={{ mx: "4px" }}>
                    <InputLabel id="filterStatusLabel">Status</InputLabel>
                    <Select
                      labelId="filterStatusLabel"
                      id="filterStatus"
                      label="Status"
                      value={filterStatus} // Add this line
                      onChange={(event) =>
                        setFilterStatus(event.target.value as string)
                      }
                    >
                      <MenuItem value={"Any"}>
                        <em>Any</em>
                      </MenuItem>
                      <MenuItem value={"Unassigned"}>Unassigned</MenuItem>
                      <MenuItem value={"Assigned"}>Assigned</MenuItem>
                      <MenuItem value={"In Progress"}>In Progress</MenuItem>
                      <MenuItem value={"Closed"}>Closed</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Popover>
            </div>
          </div>
        </div>
        <TableContainer
          style={{
            overflow: "auto",
            padding: "0 4% 0 4%",
          }}
        >
          <Table size={"small"} stickyHeader>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell style={{ borderTopLeftRadius: "5px" }} />
                <StyledTableCell>
                  <b>ID</b>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <b>Type</b>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <b>Employee</b>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <b>Location</b>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <b>Priority</b>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <b>Status</b>
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  style={{ borderTopRightRadius: "5px" }}
                >
                  <b>Delete</b>
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {filterRows(rows)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <Row key={row.SRID} row={row} setReqData={setReqData} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{
            margin: "0 4% 2% 4%",
            border: "1px solid lightgray",
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            height: "64px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        />
      </div>
    </>
  );
}
