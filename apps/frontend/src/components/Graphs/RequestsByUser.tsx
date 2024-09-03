import styles from "../../styles/Statistics.module.css";
import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";

type GraphData = {
  label: string;
  data: number[];
};

export default function RequestsByUser() {
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/request-by-user")
      .then((response) => response.json())
      .then((data: Record<string, number>) => {
        const serviceTypes = [
          ...new Set(Object.keys(data).map((key) => key.split("-")[1])),
        ];

        const formattedData = Object.entries(data).reduce(
          (acc: GraphData[], [key, count]) => {
            const [fullName, serviceType] = key.split("-");
            const existingItem = acc.find(
              (i: GraphData) => i.label === fullName,
            );
            if (existingItem) {
              const index = serviceTypes.indexOf(serviceType);
              existingItem.data[index] = count;
            } else {
              const counts = new Array(serviceTypes.length).fill(0);
              counts[serviceTypes.indexOf(serviceType)] = count;
              acc.push({
                label: fullName,
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
  }, []); // Empty array added here

  return (
    <>
      <h1 className={`${styles.graphTitle}`}>
        Number of Requests by Type by User
      </h1>
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: serviceTypes,
          },
        ]}
        series={graphData.map((item: GraphData) => ({
          ...item,
          stack: "total",
          highlightScope: {
            highlighted: "series",
            faded: "global",
          },
        }))}
        height={250}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
        tooltip={{ trigger: "item" }}
      />
    </>
  );
}
