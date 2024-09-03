import React from "react";
import {
  FormControl,
  Select,
  Box,
  MenuItem,
  SvgIcon,
  InputAdornment,
} from "@mui/material";
import { SvgIconProps } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useMapContext } from "./MapContext.ts";
import {
  AccessibilityType,
  EditorMode,
} from "../../../../packages/common/src/types/map_page_types.ts";
import AccessibleIcon from "@mui/icons-material/Accessible";

function CustomArrowIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <image href="dropDownArrow.png" height="1.5rem" width="1.5rem" />
    </SvgIcon>
  );
}

function AccessibilitySelector() {
  const {
    selectedAccessibility,
    setSelectedAccessibility,
    setDirectionsCounter,
    editorMode,
  } = useMapContext();

  const handleChange = (event: SelectChangeEvent<AccessibilityType>) => {
    setSelectedAccessibility(event.target.value as AccessibilityType);
    setDirectionsCounter(0);
  };

  if (editorMode !== EditorMode.disabled) {
    return <></>;
  }

  return (
    <Box>
      <FormControl
        sx={{
          backgroundColor: "white",
          boxShadow: 7,
          borderRadius: "5px",
          // position: "absolute",
          display: "flex",
          height: "5vh",
          // marginTop: "12vh",
          // marginRight: "1vw",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
          // right: 0,
          padding: "0.5rem",
        }}
      >
        <Select
          variant="standard"
          value={selectedAccessibility}
          onChange={handleChange}
          displayEmpty
          IconComponent={CustomArrowIcon}
          sx={{
            fontWeight: "bold",
            // fontFamily: "inter",
            fontSize: "14px",
            "&:before, &:after": {
              display: "none", // Remove underline
            },
            "& .MuiSelect-select": {
              "&:focus": {
                backgroundColor: "transparent", // Remove focus background color
              },
            },
          }}
          startAdornment={
            <InputAdornment position={"start"} sx={{ color: "black" }}>
              <AccessibleIcon />
            </InputAdornment>
          }
        >
          <MenuItem value="all">All Accessible</MenuItem>
          <MenuItem value="wheelchair">Wheelchair Accessible</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default AccessibilitySelector;
