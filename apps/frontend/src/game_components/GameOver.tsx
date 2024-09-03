import React, { useCallback, useEffect, useState } from "react";
import { breakoutHighScore } from "common/src/backend_interfaces/breakoutHighScore.js";
import axios from "axios";
import { Button, Tabs, Tab, Box, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import styles from "../styles/brighamBreakout.module.css";
import { allCharacters } from "./Characters.ts";

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
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

const GameOver = () => {
  // const [hovering, setHovering] = useState(false);
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const endTime = localStorage.getItem("score");
  const characterIndexString = localStorage.getItem("characterIndex");
  const characterIndex = characterIndexString
    ? parseInt(characterIndexString)
    : 0;
  const username = params.get("username");

  const [submitted, setSubmitted] = useState(false);
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const gameOverContainer: React.CSSProperties = {
    height: "100vh",
    background:
      "linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('/backgroundCancerGame.png')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    color: "white",
  };

  const highScoreContainer: React.CSSProperties = {
    backgroundColor: "black",
    opacity: ".8",
    color: "white",
    height: "90vh",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const leaveButton = {
    fontFamily: "'Halogen by Pixel Surplus', sans-serif",
    fontSize: "3rem",
    justifyContent: "space-around",
    borderRadius: 0,
    transition: "background-color 0.3s", // Add transition for smooth effect
  };

  const [formData, setFormData] = useState<breakoutHighScore>({
    HSID: 0,
    initial: "",
    time: endTime ? endTime : "",
    character: "",
  });

  const [highScores, setHighScores] = useState<breakoutHighScore[]>([]);
  const [recentScores, setRecentScores] = useState<breakoutHighScore[]>([]);

  const [initials, setInitials] = useState("");
  const [initial, setInitial] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fetchTop = async () => {
    try {
      const response = await axios.get("/api/hs-all-time");
      const highscores = response.data;

      while (highscores.length < 20) {
        highscores.push({ HSID: -1, initial: ". . . .", time: "" });
      }

      const send = response.data;

      setHighScores(send);
    } catch (error) {
      console.log("ERROR");
    }
  };

  const fetchRecent = async () => {
    try {
      const response = await axios.get("/api/hs-today");
      const highscores = response.data;

      while (highscores.length < 20) {
        highscores.push({ HSID: -1, initial: ". . . .", time: "" });
      }

      const send = response.data;

      setRecentScores(send);
    } catch (error) {
      console.log("ERROR");
    }
  };

  useEffect(() => {
    fetchTop();
    fetchRecent();
  }, []);

  const handleSubmit = useCallback(async () => {
    const resetForm = () => {
      setFormData({
        HSID: 0,
        initial: "",
        time: endTime ? endTime : "",
        character: allCharacters[characterIndex].name,
      });
    };

    if (initials.length === 3) {
      try {
        formData.initial = initials;
        if (allCharacters[12].name === allCharacters[characterIndex].name) {
          formData.time = 0;
          const response = await axios.post("/api/brig-hs-request", formData);
          console.log(response.data);
          localStorage.setItem("characterIndex", "");
          localStorage.setItem("score", "");
        } else {
          console.log(allCharacters[characterIndex].name);
          formData.character = allCharacters[characterIndex].name.substring(
            0,
            4,
          );
          const response = await axios.post("/api/brig-hs-request", formData);
          localStorage.setItem("characterIndex", "");
          localStorage.setItem("score", "");
          console.log(response.data);
        }
      } catch (error) {
        console.error("Unable to create form");
        console.log(error);
      }
      resetForm();
      setSubmitted(true);

      fetchTop();
      fetchRecent();
    } else {
      return;
    }
  }, [characterIndex, endTime, formData, initials]);

  const keyboardRows = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "Del",
    "Go",
  ];

  useEffect(() => {
    const keyboardRows = [
      [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "Del",
        "Go",
      ],
    ];

    const handleKeyPress = async (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setSelectedIndex((prevIndex) =>
          (prevIndex + 1) % 7 ? (prevIndex + 1) % 28 : prevIndex - 6,
        );
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prevIndex) =>
          prevIndex % 7 ? (prevIndex - 1) % 28 : prevIndex + 6,
        );
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prevIndex) => (prevIndex - 7 + 28) % 28);
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prevIndex) => (prevIndex + 7) % 28);
      } else if (e.key === " " || e.key === "Enter") {
        // i literally dont understand this line. its the opposite of what i think it should be, but this is the right way, my way only allowed inputs of anything other than space and enter (and ofc arrow keys)
        console.log(selectedIndex);
        console.log("FUCK");
        if (selectedIndex === 26) {
          setInitials(initials.slice(0, -1));
        } else if (selectedIndex === 27) {
          console.log("I LOVE VITE!!!!");
          await handleSubmit();
        } else {
          if (initials.length === 3) {
            setInitials(initials.slice(0, -1) + keyboardRows[0][selectedIndex]);
          } else {
            setInitials(initials + keyboardRows[0][selectedIndex]);
          }
          console.log(initials);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [selectedIndex, initial, initials, formData, handleSubmit]);

  const handleKeyPress = (key: string, index: number) => {
    if (key === keyboardRows[keyboardRows.length - 1]) {
      handleSubmit().then();
    } else if (key === keyboardRows[keyboardRows.length - 2]) {
      setInitials((prevInitials) => prevInitials.slice(0, -1));
    } else if (initials.length < 3) {
      setInitials((prevInitials) => prevInitials + key);
      setInitial((prevInitial) => prevInitial + key);
    } else {
      setInitials((prevInitials) => prevInitials.slice(0, -1) + key);
    }
    setSelectedIndex(index);
  };

  console.log(allCharacters[characterIndex]);

  return (
    <>
      <div
        id={"gameOverContainer"}
        style={gameOverContainer}
        className={"container-fluid"}
      >
        <div
          id={"highScoreContainer"}
          className={`container px-0 ${styles.highScoreTable}`}
          style={highScoreContainer}
        >
          {!submitted ? (
            <>
              <h1
                style={{
                  justifyContent: "center",
                  display: "flex",
                  fontFamily: '"Halogen by Pixel Surplus", monospace',
                  fontSize: "5rem",
                  marginTop: "2rem",
                }}
              >
                Enter Initials
              </h1>
              <div>
                <h1
                  className={"justify-content-center d-flex display-1 pt-5"}
                  style={{
                    fontFamily: '"Halogen by Pixel Surplus", monospace',
                  }}
                >
                  {initials.length > 0 ? initials[0] : "_ "}
                  {initials.length > 1 ? initials[1] : "_ "}
                  {initials.length > 2 ? initials[2] : "_ "}
                </h1>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Grid item>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                    <Grid
                      container
                      spacing={4}
                      style={{
                        alignItems: "center",
                        justifyContent: "space-evenly",
                      }}
                    >
                      {keyboardRows.slice(0, 7).map((key, colIndex) => (
                        <Grid item key={key} style={{ flex: "1" }}>
                          <Button
                            variant="outlined"
                            onClick={() => handleKeyPress(key, colIndex)}
                            style={{
                              backgroundColor:
                                selectedIndex === colIndex
                                  ? "#39ff14"
                                  : "transparent",
                              borderColor: "#39ff14",
                              color:
                                selectedIndex === colIndex ? "black" : "white",
                              fontFamily:
                                '"Halogen by Pixel Surplus", monospace',
                              fontWeight: "700",
                              fontSize: "2rem",
                              height: "4rem",
                              width: "6rem",
                            }}
                          >
                            {key}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                    <Grid
                      container
                      spacing={4}
                      style={{ justifyContent: "space-evenly" }}
                    >
                      {keyboardRows.slice(7, 14).map((key, colIndex) => (
                        <Grid item key={key}>
                          <Button
                            variant="outlined"
                            onClick={() => handleKeyPress(key, colIndex + 7)}
                            style={{
                              backgroundColor:
                                selectedIndex === colIndex + 7
                                  ? "#39ff14"
                                  : "transparent",
                              borderColor: "#39ff14",
                              color:
                                selectedIndex === colIndex + 7
                                  ? "black"
                                  : "white",
                              fontFamily:
                                '"Halogen by Pixel Surplus", monospace',
                              fontWeight:
                                selectedIndex === colIndex + 7 ? "700" : "600",
                              fontSize: "2rem",
                              height: "4rem",
                              width: "6rem",
                            }}
                          >
                            {key}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                    <Grid
                      container
                      spacing={4}
                      style={{ justifyContent: "space-evenly" }}
                    >
                      {keyboardRows.slice(14, 21).map((key, colIndex) => (
                        <Grid item key={key}>
                          <Button
                            variant="outlined"
                            onClick={() =>
                              handleKeyPress(key, colIndex + 7 * 2)
                            }
                            style={{
                              backgroundColor:
                                selectedIndex === colIndex + 7 * 2
                                  ? "#39ff14"
                                  : "transparent",
                              borderColor: "#39ff14",
                              color:
                                selectedIndex === colIndex + 7 * 2
                                  ? "black"
                                  : "white",
                              fontFamily:
                                '"Halogen by Pixel Surplus", monospace',
                              fontWeight:
                                selectedIndex === colIndex + 7 * 2
                                  ? "700"
                                  : "600",
                              fontSize: "2rem",
                              height: "4rem",
                              width: "6rem",
                            }}
                          >
                            {key}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                    <Grid
                      container
                      spacing={4}
                      style={{ justifyContent: "space-evenly" }}
                    >
                      {keyboardRows.slice(21, 28).map((key, colIndex) => (
                        <Grid item key={key}>
                          <Button
                            variant="outlined"
                            onClick={() =>
                              handleKeyPress(key, colIndex + 7 * 3)
                            }
                            style={{
                              backgroundColor:
                                selectedIndex === colIndex + 7 * 3
                                  ? "#39ff14"
                                  : "transparent",
                              borderColor: "#39ff14",
                              color:
                                selectedIndex === colIndex + 7 * 3
                                  ? "black"
                                  : "white",
                              fontFamily:
                                '"Halogen by Pixel Surplus", monospace',
                              fontWeight:
                                selectedIndex === colIndex + 7 * 3
                                  ? "700"
                                  : "600",
                              fontSize: "2rem",
                              height: "4rem",
                              width: "6rem",
                            }}
                          >
                            {key}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                </Grid>
              </div>
              <h1
                style={{
                  justifyContent: "center",
                  display: "flex",
                  fontFamily: '"Halogen by Pixel Surplus", monospace',
                  fontSize: "5rem",
                  marginTop: "6rem",
                }}
              >
                Final Time: {endTime}
              </h1>
            </>
          ) : (
            <>
              <Tabs
                value={value}
                onChange={handleChange}
                variant={"fullWidth"}
                className={""}
                TabIndicatorProps={{ style: { display: "none" } }}
              >
                <Tab
                  label="All Time High Scores"
                  style={{
                    color: `rgba(255, 255, 255, ${value === 0 ? 1 : 0.6})`,
                    borderRight: value === 0 ? "" : "5px solid #39ff14",
                    borderBottom: value === 0 ? "" : "5px solid #39ff14",
                    borderBottomRightRadius: value === 0 ? "0px" : "10px",
                    borderTopLeftRadius: "10px",
                    fontFamily: '"Halogen by Pixel Surplus", sans-serif',
                    fontSize: "24px",
                    width: "100%",
                  }}
                />
                <Tab
                  label="Today's High Scores"
                  style={{
                    color: `rgba(255, 255, 255, ${value === 1 ? 1 : 0.6})`,
                    borderBottomColor: value === 1 ? "green" : "transparent",
                    borderBottomLeftRadius: value === 1 ? "0px" : "10px",
                    borderTopRightRadius: "10px",
                    borderLeft: value === 1 ? "" : "5px solid #39ff14",
                    borderBottom: value === 1 ? "" : "5px solid #39ff14",
                    fontFamily: '"Halogen by Pixel Surplus", sans-serif',
                    fontSize: "24px",
                  }}
                />
              </Tabs>
              <div>
                <CustomTabPanel value={value} index={0}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      paddingTop: "5rem",
                      paddingRight: "2rem",
                      paddingLeft: "2rem",
                    }}
                  >
                    <div>
                      <table>
                        <tbody>
                          {highScores.slice(0, 10).map((score, index) => (
                            <tr key={index}>
                              <td className={styles.highScoreTableInitials}>
                                {index + 1} .{" "}
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td className={styles.highScoreTableInitials}>
                                {score.initial}{" "}
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td className={styles.highScoreTableInitials}>
                                . . .
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td className={styles.highScoreTableChar}>
                                {score.character
                                  ? score.character
                                  : ". . . . ."}
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td className={styles.highScoreTableInitials}>
                                . . . .
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td className={styles.highScoreTableInitials}>
                                {score.time}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {highScores.length > 10 && (
                      <div>
                        <table>
                          <tbody>
                            {highScores.slice(10, 20).map((score, index) => (
                              <tr key={index}>
                                <td className={styles.highScoreTableInitials}>
                                  {index + 11} .{" "}
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className={styles.highScoreTableInitials}>
                                  {score.initial}{" "}
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className={styles.highScoreTableInitials}>
                                  . . .
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className={styles.highScoreTableChar}>
                                  {score.character
                                    ? score.character
                                    : ". . . . ."}
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className={styles.highScoreTableInitials}>
                                  . . . .
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className={styles.highScoreTableInitials}>
                                  {score.time}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      paddingTop: "5rem",
                      paddingRight: "2rem",
                      paddingLeft: "2rem",
                    }}
                  >
                    <div>
                      <table>
                        <tbody>
                          {recentScores.slice(0, 10).map((score, index) => (
                            <tr key={index}>
                              <td className={styles.highScoreTableInitials}>
                                {index + 1} .{" "}
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td className={styles.highScoreTableInitials}>
                                {score.initial}{" "}
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td className={styles.highScoreTableInitials}>
                                . . .
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td className={styles.highScoreTableChar}>
                                {score.character
                                  ? score.character
                                  : ". . . . ."}
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td className={styles.highScoreTableInitials}>
                                . . . .
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td className={styles.highScoreTableInitials}>
                                {score.time}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {recentScores.length > 10 && (
                      <div>
                        <table>
                          <tbody>
                            {recentScores.slice(10, 20).map((score, index) => (
                              <tr key={index}>
                                <td className={styles.highScoreTableInitials}>
                                  {index + 11} .{" "}
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className={styles.highScoreTableInitials}>
                                  {score.initial}{" "}
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className={styles.highScoreTableInitials}>
                                  . . .
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className={styles.highScoreTableChar}>
                                  {score.character
                                    ? score.character
                                    : ". . . . ."}
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className={styles.highScoreTableInitials}>
                                  . . . .
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className={styles.highScoreTableInitials}>
                                  {score.time}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </CustomTabPanel>
              </div>

              <div className={styles.buttons}>
                <a
                  id="leave"
                  style={{ ...leaveButton }} // Merge styles based on hovering state
                  className={`btn py-4 px-5 shadow-lg ${styles.backToMap}`}
                  href={"/public-map"}
                >
                  BACK TO MAP
                </a>
                <a
                  id="character"
                  style={{ ...leaveButton }} // Merge styles based on hovering state
                  className={`btn py-4 px-5 shadow-lg ${styles.backToCharacter}`}
                  onClick={() => {
                    window.location.href = `/character-select?username=${username}`;
                  }}
                >
                  CHANGE CHARACTER
                </a>
                <a
                  id="restart"
                  style={{ ...leaveButton }} // Merge styles based on hovering state
                  className={`btn py-4 px-5 shadow-lg ${styles.tryAgain}`}
                  onClick={() => {
                    window.location.href = `/brigham-breakout?characterIndex=${characterIndex}&username=${username}`;
                  }}
                >
                  TRY AGAIN
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GameOver;
