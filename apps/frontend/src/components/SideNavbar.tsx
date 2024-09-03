import React, { useState } from "react";
import "../styles/sidenavbar.css";
import { Nav } from "react-bootstrap";

const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed] = useState(false);

  return (
    <Nav
      id={"navbar"}
      className={`justify-content-center ${
        isCollapsed ? "collapsed" : "expanded col-2"
      }`}
    >
      <div id={"inner-navbar-wrapper"}>
        <div id={"navbar-header"} className={"row"}>
          <div className={"col-8"} id={"nav-title"}>
            Brigham & Women’s Hospital
          </div>
          <div className={"col-4"}>
            <img id={"nav-img"} src="/logo.png" alt="Brigham's Logo" />
          </div>
        </div>
        <div className={"rectangle my-3"}></div>
        <div id={"nav-body"} className={"mt-4"}>
          <Nav.Link className={"nav-links border-bottom"} href="/">
            Home
          </Nav.Link>
          <Nav.Link
            className={"nav-links border-bottom"}
            onClick={() => setIsOpen(!isOpen)}
          >
            Service Requests
            <span
              className={`mx-3 caret ${isOpen ? "caret-up" : "caret-down"}`}
            ></span>
          </Nav.Link>
          <div className={`dropdown ${isOpen ? "open" : ""}`}>
            <Nav.Link
              className={"nav-links-inner border-bottom"}
              href="/flower-delivery"
            >
              Flower Delivery
            </Nav.Link>
            <Nav.Link
              className={"nav-links-inner border-bottom"}
              href="/gift-request"
            >
              Gift Request
            </Nav.Link>
            <Nav.Link
              className={"nav-links-inner border-bottom"}
              href="/medicine-request"
            >
              Medicine
            </Nav.Link>
            <Nav.Link
              className={"nav-links-inner border-bottom"}
              href="/medical-device-request"
            >
              Medical Device
            </Nav.Link>
            <Nav.Link
              className={"nav-links-inner border-bottom"}
              href="/room-scheduling"
            >
              Room Scheduling
            </Nav.Link>
            <Nav.Link
              className={"nav-links-inner border-bottom"}
              href="/requests"
            >
              Active Requests
            </Nav.Link>
          </div>
          <Nav.Link className={"nav-links border-bottom"} href="/csv-page">
            CSV Page
          </Nav.Link>
          <Nav.Link className={"nav-links border-bottom"} href="/login">
            Login
          </Nav.Link>
        </div>
      </div>
      {/*<button*/}
      {/*  className={isCollapsed ? "collapsedButton" : "expandedButton"}*/}
      {/*  onClick={() => setIsCollapsed(!isCollapsed)}*/}
      {/*>*/}
      {/*  <p>{isCollapsed ? ">" : "<"}</p>*/}
      {/*</button>*/}
    </Nav>
  );
};

export default SideNavbar;
