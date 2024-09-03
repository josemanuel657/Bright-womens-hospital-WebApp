import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
      variant={"contained"}
      sx={{
        // m: "0.5vw",
        // width: "60%",
        height: "100%",
        backgroundColor: "#012d5a",
        // color: "white",
      }}
      startIcon={<LogoutIcon />}
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;
