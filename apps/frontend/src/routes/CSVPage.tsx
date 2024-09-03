import { GetDataNodes } from "../components/NodesDataBaseTableDisplay.tsx";
import { GetDataEdges } from "../components/EdgesDataBaseTableDisplay.tsx";
import ExportAllButton from "../components/ExportAllButton.tsx";
import "../styles/csvPage.css";
import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import ClearDataButton from "../components/ClearDataButton.tsx";
import styles from "../styles/CSVPage.module.css";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export function CSVPage() {
  const [value, setValue] = useState(0);
  const [dataUpdated, setDataUpdated] = useState(false);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
          setDataUpdated(!dataUpdated); // Toggle dataUpdated state to trigger re-render
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`${styles.pageContainer}`}>
      <div className={`${styles.header}`}>
        <h1 className={`${styles.pageTitle}`}>Map Data</h1>
        <div className={`${styles.buttonCluster}`}>
          <ExportAllButton />
          <ClearDataButton onClear={() => setDataUpdated(!dataUpdated)} />
        </div>
      </div>
      <div className={`${styles.tabs}`}>
        <Box
          sx={{
            border: 1,
            borderRadius: "5px",
            borderColor: "divider",
          }}
        >
          <Tabs value={value} onChange={handleChange} variant={"fullWidth"}>
            <Tab label="Nodes" />
            <Tab label="Edges" />
          </Tabs>
        </Box>
      </div>
      <CustomTabPanel value={value} index={0}>
        <div className={`${styles.tabPanel}`}>
          <GetDataNodes
            dataUpdated={dataUpdated}
            onFileDrop={(file) => handleFileDrop(file, "/api/node-populate")}
          />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div className={`${styles.tabPanel}`}>
          <GetDataEdges
            dataUpdated={dataUpdated}
            onFileDrop={(file) => handleFileDrop(file, "api/edge-populate")}
          />
        </div>
      </CustomTabPanel>
    </div>
  );
}
