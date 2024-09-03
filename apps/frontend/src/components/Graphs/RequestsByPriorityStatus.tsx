import styles from "../../styles/Statistics.module.css";
import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

type GraphData = {
  label: string;
  data: number[];
};

type DataItem = {
  status: string;
  priority: string;
  serviceType: string;
  _count: {
    SRID: number;
  };
};

function RequestsByPriority() {
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);

  const priorityColors: { [key: string]: string } = {
    Low: "#00b300",
    Medium: "#ffcc00",
    High: "#ff6600",
    Emergency: "#ff0000",
  };

  useEffect(() => {
    fetch("/api/request-by-priority")
      .then((response) => response.json())
      .then((data: DataItem[]) => {
        const serviceTypes = [...new Set(data.map((item) => item.serviceType))];

        const formattedData = data.reduce(
          (acc: GraphData[], item: DataItem) => {
            const existingItem = acc.find((i) => i.label === item.priority);
            if (existingItem) {
              const index = serviceTypes.indexOf(item.serviceType);
              existingItem.data[index] = item._count.SRID;
            } else {
              const counts = new Array(serviceTypes.length).fill(0);
              counts[serviceTypes.indexOf(item.serviceType)] = item._count.SRID;
              acc.push({
                label: item.priority,
                data: counts,
              });
            }
            return acc;
          },
          [],
        );
        setGraphData(formattedData);
        setServiceTypes(serviceTypes);
      });
  }, []);

  return (
    <>
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: serviceTypes,
          },
        ]}
        series={graphData.map((item) => ({
          ...item,
          stack: "total",
          color: priorityColors[item.label],
          highlightScope: {
            highlighted: "series",
            faded: "global",
          },
        }))}
        height={250}
        slotProps={{
          legend: {
            labelStyle: { fontSize: 12 },
          },
        }}
        tooltip={{ trigger: "item" }}
      />
    </>
  );
}

function RequestsByStatus() {
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);

  const statusColors: { [key: string]: string } = {
    Unassigned: "#ef6a6a",
    Assigned: "#ffdf22",
    "In Progress": "#56ff2a",
    Closed: "#464646",
  };

  useEffect(() => {
    fetch("/api/request-by-status")
      .then((response) => response.json())
      .then((data: DataItem[]) => {
        const serviceTypes = [...new Set(data.map((item) => item.serviceType))];

        const formattedData = data.reduce(
          (acc: GraphData[], item: DataItem) => {
            const existingItem = acc.find((i) => i.label === item.status);
            if (existingItem) {
              const index = serviceTypes.indexOf(item.serviceType);
              existingItem.data[index] = item._count.SRID;
            } else {
              const counts = new Array(serviceTypes.length).fill(0);
              counts[serviceTypes.indexOf(item.serviceType)] = item._count.SRID;
              acc.push({
                label: item.status,
                data: counts,
              });
            }
            return acc;
          },
          [],
        );
        setGraphData(formattedData);
        setServiceTypes(serviceTypes);
      });
  }, []);

  return (
    <>
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: serviceTypes,
          },
        ]}
        series={graphData.map((item) => ({
          ...item,
          stack: "total",
          color: statusColors[item.label],
          highlightScope: {
            highlighted: "series",
            faded: "global",
          },
        }))}
        height={250}
        slotProps={{
          legend: {
            labelStyle: { fontSize: 12 },
          },
        }}
        tooltip={{ trigger: "item" }}
      />
    </>
  );
}
export default function RequestsByPriorityStatus() {
  const [selection, setSelection] = useState("Priority");
  return (
    <>
      <div className={`${styles.chartHeader}`}>
        <h1 className={`${styles.graphTitle}`}>
          Number of Requests by Type by {selection}
        </h1>
        <ToggleButtonGroup
          value={selection}
          exclusive
          onChange={(event, newSelection) => {
            if (newSelection) {
              setSelection(newSelection);
            }
          }}
          size={"small"}
        >
          <ToggleButton value={"Priority"}>Priority</ToggleButton>
          <ToggleButton value={"Status"}>Status</ToggleButton>
        </ToggleButtonGroup>
      </div>
      {selection === "Priority" ? <RequestsByPriority /> : <RequestsByStatus />}
    </>
  );
}
