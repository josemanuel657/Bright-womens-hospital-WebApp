import React, { useState, useEffect } from "react";
import { node } from "common/src/interfaces.ts";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import FileUpload from "./FileUpload.tsx";
import { Box } from "@mui/material";

const columns = [
  { field: "nodeID", headerName: "Node ID", width: 130 },
  { field: "xcoord", headerName: "X-Coordinate", width: 130 },
  { field: "ycoord", headerName: "Y-Coordinate", width: 130 },
  { field: "floor", headerName: "Floor", width: 130 },
  { field: "building", headerName: "Building", width: 130 },
  { field: "nodeType", headerName: "Node Type", width: 130 },
  { field: "longName", headerName: "Long Name", flex: 1 },
  { field: "shortName", headerName: "Short Name", flex: 1 },
];
function CustomToolbar({ onFileDrop }: { onFileDrop: (file: File) => void }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarExport />
      <FileUpload onFileDrop={onFileDrop} />
    </GridToolbarContainer>
  );
}

const DataGridNodes: React.FC<{
  tableData: node[];
  onFileDrop: (file: File) => void;
}> = ({ tableData, onFileDrop }) => {
  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={tableData}
        columns={columns}
        slots={{
          toolbar: () => <CustomToolbar onFileDrop={onFileDrop} />,
        }}
      />
    </div>
  );
};

interface GetDataNodesProps {
  dataUpdated: boolean;
}

export const GetDataNodes: React.FC<
  GetDataNodesProps & { onFileDrop: (file: File) => void }
> = ({ dataUpdated, onFileDrop }) => {
  const [data, setData] = useState<node[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request to the API endpoint
        const response = await fetch("/api/node-populate");

        // Check if the request was successful (status code 2xx)
        if (!response.ok) {
          throw new Error(`Please load node data ${response.status}`);
        }

        // Parse the JSON response
        const result = await response.json();

        const dataWithIDs = result.map((item: node) => ({
          ...item,
          id: item.nodeID,
        }));

        // Set the data in the state
        setData(dataWithIDs);
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
      <DataGridNodes tableData={data} onFileDrop={onFileDrop}></DataGridNodes>
    </div>
  );
};
