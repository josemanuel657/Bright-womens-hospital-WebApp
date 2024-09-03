import styles from "../styles/Dashboard.module.css";
import DashCurrentRequests from "../components/DashCurrentRequests.tsx";
import DashMakeARequest from "../components/DashMakeARequest.tsx";
import { useEffect, useState } from "react";
import { ServiceRequest } from "common/src/backend_interfaces/ServiceRequest.ts";
import axios from "axios";

function Dashboard() {
  const [expanded, setExpanded] = useState(false);
  const [reqData, setReqData] = useState<ServiceRequest[]>([]);

  const onExpandClick = () => {
    setExpanded(!expanded);
  };

  async function fetchData() {
    const res = await axios.get("/api/service-request");
    console.log(res);
    setReqData(res.data);
    console.log("successfully got data from get request");
  }

  useEffect(() => {
    fetchData().then();
  }, []);

  return (
    <div className={"overflow-hidden"}>
      <div className={`${styles.pageContainer}`}>
        {expanded ? (
          <>
            <DashCurrentRequests
              expanded={expanded}
              onExpandClick={onExpandClick}
              reqData={reqData}
              setReqData={setReqData}
            />
            <DashMakeARequest setReqData={setReqData} />
          </>
        ) : (
          <>
            <DashCurrentRequests
              expanded={expanded}
              onExpandClick={onExpandClick}
              reqData={reqData}
              setReqData={setReqData}
            />
            <DashMakeARequest setReqData={setReqData} />
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
