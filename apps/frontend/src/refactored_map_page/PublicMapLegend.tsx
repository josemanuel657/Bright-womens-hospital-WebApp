import React from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  SvgIcon,
  SvgIconProps,
} from "@mui/material";

import ATMICon from "../../public/iconsSized/atmIcon-removebg-preview.png";
import bikeIcon from "../../public/iconsSized/bikeIcon-removebg-preview.png";
import busIcon from "../../public/iconsSized/busIcon-removebg-preview.png";
import cafeIcon from "../../public/iconsSized/cafeIcon-removebg-preview.png";
import elevatorIcon from "../../public/iconsSized/elevatorIcon-removebg-preview.png";
import escalatorIcon from "../../public/iconsSized/escalatorIcon-removebg-preview.png";
import foodIcon from "../../public/iconsSized/foodIcon-removebg-preview.png";
import giftIcon from "../../public/iconsSized/giftIcon-removebg-preview.png";
import handicapIcon from "../../public/iconsSized/wheelchairIcon.png";
import infoIcon from "../../public/iconsSized/infoIcon-removebg-preview.png";
import restroomIcon from "../../public/iconsSized/restroomIcon-removebg-preview.png";
import valetIcon from "../../public/iconsSized/valetIcon-removebg-preview.png";
import vendingIcon from "../../public/iconsSized/vendingIcon-removebg-preview.png";
import waitingIcon from "../../public/iconsSized/waitingIcon-removebg-preview.png";

function MapLegend() {
  function CustomArrowIcon(props: SvgIconProps) {
    return (
      <SvgIcon {...props}>
        <svg width="24" height="24" viewBox="0 0 24 24">
          <image
            xlinkHref="dropDownArrow.png"
            x="0"
            y="0"
            height="24px"
            width="24px"
            preserveAspectRatio="xMidYMid meet"
            transform="rotate(180 12 12)"
          />
        </svg>
      </SvgIcon>
    );
  }

  const icons = [
    { src: ATMICon, alt: "ATMIcon", title: "ATM" },
    { src: bikeIcon, alt: "bikeIcon", title: "Bike Parking" },
    { src: busIcon, alt: "busIcon", title: "Bus Stop" },
    { src: cafeIcon, alt: "cafeIcon", title: "Cafe" },
    { src: elevatorIcon, alt: "elevatorIcon", title: "Elevator" },
    { src: escalatorIcon, alt: "escalatorIcon", title: "Escalator" },
    { src: foodIcon, alt: "foodIcon", title: "Food Option" },
    { src: giftIcon, alt: "giftIcon", title: "Gift Shop" },
    { src: handicapIcon, alt: "handicapIcon", title: "Handicap Entrance" },
    { src: infoIcon, alt: "infoIcon", title: "Info Desk" },
    { src: restroomIcon, alt: "restroomIcon", title: "Restrooms" },
    { src: valetIcon, alt: "valetIcon", title: "Valet Service" },
    { src: vendingIcon, alt: "vendingIcon", title: "Vending Machine" },
    { src: waitingIcon, alt: "waitingIcon", title: "Waiting Room" },
  ];

  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: 5,
        backgroundColor: "white",
        color: "black",
        bottom: 0,
        left: 0,
        marginLeft: "1vw",
        marginBottom: "2vh",
        borderRadius: "10px",
        boxShadow: "0px 0px 1px",
      }}
    >
      <Accordion TransitionProps={{ timeout: 650 }}>
        <AccordionSummary
          expandIcon={<CustomArrowIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "14px",
              fontFamily: "Inter",
            }}
          >
            Map Legend
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ padding: "1px" }}>
            {icons.map((icon, index) => (
              <p key={index}>
                <img
                  src={icon.src}
                  alt={icon.alt}
                  style={{ height: "20px", width: "25px" }}
                />
                {icon.title}
              </p>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default MapLegend;
