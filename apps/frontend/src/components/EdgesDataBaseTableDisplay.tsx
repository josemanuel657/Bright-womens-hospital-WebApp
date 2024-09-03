import React, { useState, useEffect } from "react";
import { edge } from "common/src/interfaces.ts";
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
  { field: "edgeID", headerName: "Edge ID", flex: 1 },
  { field: "startNodeID", headerName: "Start Node ID", flex: 1 },
  { field: "endNodeID", headerName: "End Node ID", flex: 1 },
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

const DataGridEdges: React.FC<{
  tableData: edge[];
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

interface GetDataEdgesProps {
  dataUpdated: boolean;
}
export const GetDataEdges: React.FC<
  GetDataEdgesProps & { onFileDrop: (file: File) => void }
> = ({ dataUpdated, onFileDrop }) => {
  const [data, setData] = useState<edge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request to the API endpoint
        const response = await fetch("/api/edge-populate");

        // Check if the request was successful (status code 2xx)
        if (!response.ok) {
          throw new Error(
            `Please load edge data and ensure that node data is already populated ${response.status}`,
          );
        }

        // Parse the JSON response
        const result = await response.json();

        const dataWithIDs = result.map((item: edge) => ({
          ...item,
          id: item.edgeID,
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
      <DataGridEdges tableData={data} onFileDrop={onFileDrop}></DataGridEdges>
    </div>
  );
};
