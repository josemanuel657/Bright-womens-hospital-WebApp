import React, { useState } from "react";
import { Box } from "@mui/material";
import styles from "../styles/Credits.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function Credits() {
  interface CategoryItem {
    description: string;
    image: string;
  }

  const tools: CategoryItem[] = [
    {
      description:
        "GitHub: A web-based respository platform that provides hosting for software development and version control. Link: https://github.com/",
      image: "/gitHubLogo.png",
    },
    {
      description:
        "Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript/Typescript code outside of a web browser." +
        " Link: https://nodejs.org/en",
      image: "/NodeJSLogo.png",
    },
    {
      description:
        "Yarn: is one of the main JavaScript package managers, developed in 2016 by Sebastian McKenzie of Meta" +
        "for the Node.js JavaScript runtime environment. Link: https://yarnpkg.com/",
      image: "/YarnLogo.png",
    },
    {
      description:
        "Prettier: is a tool to format files in various languages, like TypeScript, JavaScript, CSS, HTML, JSON, and others. Link: https://prettier.io/",
      image: "/PrettierLogo.png",
    },
    {
      description:
        "Vitest: A testing tool for TypeScript/JavaScript applications. Link: https://vitest.dev/",
      image: "/VitestLogo.png",
    },
    {
      description:
        "Auth0: provides authentication and authorization as a service for applications. Link: https://auth0.com/",
      image: "/Auth0Logo.png",
    },
    {
      description:
        "Prisma: A database tool used to simplify the database development process by providing automated mitigations " +
        "and mapping layers, as well as a visual data management interface. Link: https://www.prisma.io/",
      image: "/PrismaLogo.png",
    },
    {
      description:
        "Discord: An online instant messaging social platform where users can create social servers for groups. Link: https://discord.com/",
      image: "/discordLogo.png",
    },
  ];

  const libraries: CategoryItem[] = [
    {
      description:
        "React is a free and open-source front-end JavaScript library " +
        "for building user interfaces based on UI components. It is maintained by Meta and a " +
        "community of individual developers and companies. Link: https://react.dev/",
      image: "/ReactLogo.png",
    },
    {
      description:
        "Material UI is an open-source React component library that implements Google's " +
        "Material Design. It's comprehensive and can be used in production out of the box. Link: https://mui.com/material-ui/",
      image: "/MaterialUILogo.png",
    },
    {
      description:
        "Axios is a promise-based HTTP Client for node.js and the browser. It " +
        "is isomorphic, using the native node.js http module on the server-side, and " +
        "XMLHttpRequests on the client. Link: https://axios-http.com/",
      image: "/axiosLogo.png",
    },
  ];
  const frameworks: CategoryItem[] = [
    {
      description:
        "React, a JavaScript library for building user interfaces. Link: https://react.dev/",
      image: "/reactLogo.png",
    },
    {
      description:
        "Express, a back end web application framework for Node.js. Link: https://expressjs.com/",
      image: "/expressLogo.png",
    },
  ];
  const [currentIndexTool, setCurrentIndexTool] = useState(0);
  const [currentIndexLib, setCurrentIndexLib] = useState(0);
  const [currentIndexFrame, setCurrentIndexFrame] = useState(0);

  const nextTool = () => {
    setCurrentIndexTool(
      (prevIndexTools) => (prevIndexTools + 1) % tools.length,
    );
  };

  const previousTool = () => {
    setCurrentIndexTool(
      (prevIndexTools) => (prevIndexTools - 1 + tools.length) % tools.length,
    );
  };

  const nextLibrary = () => {
    setCurrentIndexLib(
      (prevIndexLibs) => (prevIndexLibs + 1) % libraries.length,
    );
  };

  const previousLibrary = () => {
    setCurrentIndexLib(
      (prevIndexLibs) =>
        (prevIndexLibs - 1 + libraries.length) % libraries.length,
    );
  };

  const nextFramework = () => {
    setCurrentIndexFrame(
      (prevIndexFrame) => (prevIndexFrame + 1) % frameworks.length,
    );
  };

  const previousFramework = () => {
    setCurrentIndexFrame(
      (prevIndexFrame) =>
        (prevIndexFrame - 1 + frameworks.length) % frameworks.length,
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.overlay}></div>
      <div>
        <h1 className={styles.pageTitle}>Credits</h1>
      </div>
      <div className={styles.content}>
        <Box className={styles.card}>
          <div className={styles.cardHeader}>
            <img src={tools[currentIndexTool].image} alt="Tool" />
          </div>
          <h2 className={styles.cardTitle}>Tools</h2>
          <p>{tools[currentIndexTool].description}</p>
          <div className={styles.divBetweenArrowsAndText}></div>
          <div className={`${styles.arrow}`}>
            <ArrowBackIcon onClick={previousTool} />
            <ArrowForwardIcon onClick={nextTool} />
          </div>
        </Box>
        <Box className={styles.card}>
          <div className={styles.cardHeader}>
            <img src={libraries[currentIndexLib].image} alt="Library" />
          </div>
          <h2 className={styles.cardTitle}>Libraries</h2>
          <p>{libraries[currentIndexLib].description}</p>
          <div className={styles.divBetweenArrowsAndText}></div>
          <div className={`${styles.arrow}`}>
            <ArrowBackIcon onClick={previousLibrary} />
            <ArrowForwardIcon onClick={nextLibrary} />
          </div>
        </Box>
        <Box className={styles.card}>
          <div className={styles.cardHeader}>
            <img src={frameworks[currentIndexFrame].image} alt="Framework" />
          </div>
          <h2 className={styles.cardTitle}>Frameworks</h2>
          <p>{frameworks[currentIndexFrame].description}</p>
          <div className={styles.divBetweenArrowsAndText}></div>
          <div className={`${styles.arrow}`}>
            <ArrowBackIcon onClick={previousFramework} />
            <ArrowForwardIcon onClick={nextFramework} />
          </div>
        </Box>
      </div>
    </div>
  );
}

export default Credits;
