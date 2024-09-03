import React, { useState, useEffect } from "react";
import { EmployeeType } from "common/src/backend_interfaces/Employee.ts";
import {
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

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
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableContainer = styled(TableContainer)(() => ({
  borderRadius: 10, // Adjust the value as per your preference
}));

function GenerateTableRowsEdges(tableData: EmployeeType[]): JSX.Element[] {
  return tableData.map((item, index) => (
    <StyledTableRow key={index}>
      <StyledTableCell>{tableData[index].employeeEmail}</StyledTableCell>
      <StyledTableCell>{tableData[index].employeeFullName}</StyledTableCell>
      <StyledTableCell>{tableData[index].employeePosition}</StyledTableCell>
      <StyledTableCell>
        {tableData[index].numberOfServiceRequests}
      </StyledTableCell>
    </StyledTableRow>
  ));
}

const TableEdges: React.FC<{ tableData: EmployeeType[] }> = ({ tableData }) => {
  return (
    <StyledTableContainer>
      <Table size={"small"}>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Position</StyledTableCell>
            <StyledTableCell>Number of Requests</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>{GenerateTableRowsEdges(tableData)}</TableBody>
      </Table>
    </StyledTableContainer>
  );
};
interface GetDataEmployeeProps {
  dataUpdated: boolean;
}
export const GetDataEmployee: React.FC<GetDataEmployeeProps> = ({
  dataUpdated,
}) => {
  const [data, setData] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request to the API endpoint
        const response = await fetch("/api/employee-populate");

        // Check if the request was successful (status code 2xx)
        if (!response.ok) {
          throw new Error(
            `Please load edge data and ensure that node data is already populated ${response.status}`,
          );
        }

        // Parse the JSON response
        const result = await response.json();

        // Set the data in the state
        setData(result);
      } catch (err) {
        // Handle errors
        console.log(err);
      } finally {
        // Set loading to false, indicating that the request has completed
        setLoading(false);
      }
    };

    fetchData().then();
  }, [dataUpdated]); //

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <TableEdges tableData={data}></TableEdges>
    </div>
  );
};
