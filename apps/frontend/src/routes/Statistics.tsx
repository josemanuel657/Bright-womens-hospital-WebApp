import styles from "../styles/Statistics.module.css";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import RequestsByUser from "../components/Graphs/RequestsByUser.tsx";
import RequestByPriorityStatus from "../components/Graphs/RequestsByPriorityStatus.tsx";
import PieCharts from "../components/Graphs/PieCharts.tsx";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

export default function Statistics() {
  const exportCharts = async () => {
    const charts = document.querySelectorAll(".chart-container");
    for (let i = 0; i < charts.length; i++) {
      const canvas = await html2canvas(charts[i] as HTMLElement);
      canvas.toBlob(function (blob) {
        if (blob) {
          saveAs(blob, `chart${i + 1}.png`);
        }
      });
    }
  };

  return (
    <>
      <div className={`${styles.pageContainer}`}>
        <div className={`${styles.statisticsBox}`}>
          <div className={`${styles.header}`}>
            <h1 className={`${styles.pageTitle}`}>Statistics</h1>
            <Button
              variant={"contained"}
              sx={{
                backgroundColor: "#012d5a",
                color: "white",
              }}
              startIcon={<DownloadIcon />}
              onClick={exportCharts}
            >
              Export
            </Button>
          </div>
          <div className={`${styles.graphsContainer}`}>
            <div className={`${styles.barCharts}`}>
              <RequestByPriorityStatus />
              <RequestsByUser />
            </div>
            <div className={`${styles.pieCharts}`}>
              <PieCharts />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
