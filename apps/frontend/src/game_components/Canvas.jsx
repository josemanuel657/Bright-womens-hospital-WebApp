import React, { useEffect, useMemo, useRef, useState } from "react";
import PlatformerBG from "./PlatformerBG.jsx";
import Disease from "./Disease.jsx";
import JoseSprite from "./JoseSprite.jsx";
import HealthPickup from "./HealthPickup.jsx";
import Shield from "./Shield.jsx";
import { allCharacters } from "./Characters";
import axios from "axios";

const Canvas = () => {
  const characterIndex = localStorage.getItem("characterIndex");
  const username = localStorage.getItem("username");

  const characterParam =
    characterIndex !== null ? allCharacters[characterIndex] : null;

  let characterWidth;
  let characterHeight;

  if (characterParam.size === 1) {
    characterWidth = 120;
    characterHeight = 240;
  } else if (characterParam.size === 2) {
    characterWidth = 110;
    characterHeight = 220;
  } else if (characterParam.size === 3) {
    characterWidth = 100;
    characterHeight = 200;
  } else if (characterParam.size === 4) {
    characterWidth = 90;
    characterHeight = 180;
  } else if (characterParam.size === 5) {
    characterWidth = 85;
    characterHeight = 170;
  }

  // Define fixed width and height for the canvas
  const canvasWidth = 1500; // Example width
  const canvasHeight = 800; // Example height

  // Calculate viewBox based on fixed width and height
  const viewBox = useMemo(
    () => [-canvasWidth / 2, -canvasHeight / 2, canvasWidth, canvasHeight],
    [canvasWidth, canvasHeight],
  );

  const containerStyle = {
    minWidth: `${canvasWidth}px`,
    minHeight: `${canvasHeight}px`,
    maxWidth: `${canvasWidth}px`,
    maxHeight: `${canvasHeight}px`,
    overflow: "hidden", // Hide any overflow content
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "absolute", // Ensure position context for absolute-positioned elements
    border: "10px solid",
    borderColor: "black",
  };

  const [position, setPosition] = useState({
    x: -75 / 2, // Centering horizontally
    y: -100 / 2, // Centering vertically
  });

  const [isAlive, setIsAlive] = useState(true);

  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(150 + 30 * characterParam.speed);

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (isAlive) {
      const timer = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isAlive, elapsedTime]);

  const [playerHP, setPlayerHP] = useState(characterParam.health + 1);
  const [playerMaxHP] = useState(characterParam.health + 1);
  const [playerShields, setPlayerShields] = useState(0);

  useEffect(() => {
    if (characterParam.name === "Sofia") {
      const timer = setInterval(() => {
        if (elapsedTime % 12 === 0) {
          if (playerHP < playerMaxHP) {
            setPlayerHP((prevHP) => prevHP + 1);
          }
        }
      }, 1000); // Check every second

      return () => clearInterval(timer);
    }
  }, [characterParam.name, elapsedTime, setPlayerHP, playerHP, playerMaxHP]);

  const [gameOverDisplayed, setGameOverDisplayed] = useState(false);
  useEffect(() => {
    let gameOverTimer;

    if (!isAlive && !gameOverDisplayed) {
      gameOverTimer = setTimeout(() => {
        setGameOverDisplayed(true);
      }, 3000);
    }

    if (!isAlive && gameOverDisplayed) {
      console.log("elapsed time:", elapsedTime);
      if (elapsedTime >= 160) {
        axios
          .post("/api/unlock-character/wong", { username })
          .then((response) => {
            // handle response here
            console.log(response.data);
          })
          .catch((error) => {
            // handle error here
            console.error(error);
          });
      }
      if (elapsedTime >= 100) {
        console.log("sending data");
        console.log("username", username);
        axios
          .post("/api/unlock-character/joe", { username })
          .then((response) => {
            // handle response here
            console.log(response.data);
          })
          .catch((error) => {
            // handle error here
            console.error(error);
          });
      }
      localStorage.setItem("score", elapsedTime);
      window.location.href = `/game-over`;
    }
    return () => clearTimeout(gameOverTimer);
  }, [characterIndex, username, isAlive, gameOverDisplayed, elapsedTime]);

  const [isShielded, setIsShielded] = useState(false);

  const [invertedControls, setInvertedControls] = useState(false); // State to toggle inverted controls

  useEffect(() => {
    if (characterParam.name === "Timothy") {
      setInvertedControls(true);
    } else {
      setInvertedControls(false);
    }
  }, [characterParam.name]);

  const [timeSinceLastMovement, setTimeSinceLastMovement] = useState(0);

  // Function to reset the time since last movement
  const resetTimeSinceLastMovement = () => {
    setTimeSinceLastMovement(0);
  };

  useEffect(() => {
    // Reset the time since last movement whenever the player moves
    const timer = setTimeout(resetTimeSinceLastMovement, 4000);

    return () => clearTimeout(timer);
  }, [velocity]);

  // Increment the time since last movement when the player is alive
  useEffect(() => {
    if (isAlive) {
      const timer = setInterval(() => {
        setTimeSinceLastMovement((prevTime) => prevTime + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isAlive]);

  useEffect(() => {
    const adjustVelocity = (newVelocity, key, speed) => {
      if (!invertedControls) {
        switch (key) {
          case "ArrowUp":
          case "w":
          case "W":
            if (newVelocity.y > -speed) {
              newVelocity.y -= speed;
            }
            break;
          case "ArrowDown":
          case "s":
          case "S":
            if (newVelocity.y < speed) {
              newVelocity.y += speed;
            }
            break;
          case "ArrowLeft":
          case "a":
          case "A":
            if (newVelocity.x > -speed) {
              newVelocity.x -= speed;
            }
            break;
          case "ArrowRight":
          case "d":
          case "D":
            if (newVelocity.x < speed) {
              newVelocity.x += speed;
            }
            break;
          case " ": // Spacebar key
            if (playerShields >= 1 && !isShielded) {
              setIsShielded(true); // Set isShielded to true when spacebar is pressed
              setPlayerShields(playerShields - 1);
              let shieldedTimer = 1000;
              if (characterParam.name === "Maddux") {
                shieldedTimer = 3000;
              }
              setTimeout(() => setIsShielded(false), shieldedTimer); // Set isShielded back to false after 1 second
            }
            break;
          default:
            break;
        }
      } else {
        switch (key) {
          case "ArrowUp":
          case "w":
          case "W":
            if (newVelocity.y < speed) {
              newVelocity.y += speed;
            }
            break;
          case "ArrowDown":
          case "s":
          case "S":
            if (newVelocity.y > -speed) {
              newVelocity.y -= speed;
            }
            break;
          case "ArrowLeft":
          case "a":
          case "A":
            if (newVelocity.x < speed) {
              newVelocity.x += speed;
            }
            break;
          case "ArrowRight":
          case "d":
          case "D":
            if (newVelocity.x > -speed) {
              newVelocity.x -= speed;
            }
            break;
          case " ": // Spacebar key
            if (playerShields >= 1 && !isShielded) {
              setIsShielded(true); // Set isShielded to true when spacebar is pressed
              setPlayerShields(playerShields - 1);
              setTimeout(() => setIsShielded(false), 1000); // Set isShielded back to false after 1 second
            }
            break;
          default:
            break;
        }
      }
    };

    // Handle key down events
    const handleKeyDown = (event) => {
      if (!event.repeat) {
        resetTimeSinceLastMovement();
        const newVelocity = { ...velocity };
        if (event.key) {
          adjustVelocity(newVelocity, event.key, speed);
        } else {
          newVelocity.y = 0;
          newVelocity.x = 0;
        }
        setVelocity(newVelocity);
      }
    };

    // Handle key up events
    const handleKeyUp = (event) => {
      const newVelocity = { ...velocity };
      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
          newVelocity.y = 0;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          newVelocity.y = 0;
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          newVelocity.x = 0;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          newVelocity.x = 0;
          break;
        default:
          break;
      }
      setVelocity(newVelocity);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    velocity,
    viewBox,
    isShielded,
    setPlayerShields,
    playerShields,
    playerHP,
    setPlayerHP,
    speed,
    characterWidth,
    characterHeight,
    invertedControls,
    characterParam.name,
  ]);

  const [healthSpawnPoints, setHealthSpawnPoints] = useState([]);
  const [heartSpawning, setHeartSpawning] = useState(false);
  const [spawnIntervalHeart, setSpawnIntervalHeart] = useState(null);

  useEffect(() => {
    let nextSpawnInterval = 0;
    if (characterParam.name === "Gabe") {
      nextSpawnInterval = 5000;
    } else {
      const heartSpawnRateUpper = 15000;
      const heartSpawnRateLower = 10000;
      nextSpawnInterval =
        Math.random() * (heartSpawnRateUpper - heartSpawnRateLower) +
        heartSpawnRateLower;
    }

    const spawnHeart = () => {
      setHeartSpawning(true);

      const heartWidth = 75;
      const heartHeight = 40;

      const spawnX = Math.random() * (viewBox[2] - heartWidth) + viewBox[0];
      const spawnY = Math.random() * (viewBox[3] - heartHeight) + viewBox[1];

      setHealthSpawnPoints((prevPoints) => [
        ...prevPoints,
        { x: spawnX, y: spawnY },
      ]);

      setSpawnIntervalHeart(
        setTimeout(() => {
          setHeartSpawning(false);
        }, nextSpawnInterval),
      );
    };

    let spawnInterval;

    if (!heartSpawning) {
      spawnInterval = setTimeout(spawnHeart, nextSpawnInterval);
    }

    return () => {
      clearTimeout(spawnInterval); // Clear the heart spawn interval
    };
  }, [viewBox, heartSpawning, spawnIntervalHeart, characterParam.name]);

  const [shieldSpawnPoints, setShieldSpawnPoints] = useState([]);
  const [shieldSpawning, setShieldSpawning] = useState(false);
  const [spawnIntervalShield, setSpawnIntervalShield] = useState(null);

  useEffect(() => {
    let nextSpawnInterval = 0;
    if (characterParam.name === "Gabe") {
      nextSpawnInterval = 5000;
    } else {
      const shieldSpawnRateUpper = 15000;
      const shieldSpawnRateLower = 10000;
      nextSpawnInterval =
        Math.random() * (shieldSpawnRateUpper - shieldSpawnRateLower) +
        shieldSpawnRateLower;
    }

    const spawnShield = () => {
      setShieldSpawning(true);

      const shieldWidth = 75;
      const shieldHeight = 40;

      const spawnX = Math.random() * (viewBox[2] - shieldWidth) + viewBox[0];
      const spawnY = Math.random() * (viewBox[3] - shieldHeight) + viewBox[1];

      setShieldSpawnPoints((prevPoints) => [
        ...prevPoints,
        { x: spawnX, y: spawnY },
      ]);

      setSpawnIntervalShield(
        setTimeout(() => {
          setShieldSpawning(false);
        }, nextSpawnInterval),
      );
    };

    let spawnInterval;

    if (!shieldSpawning) {
      spawnInterval = setTimeout(spawnShield, nextSpawnInterval);
    }

    return () => {
      clearTimeout(spawnInterval); // Clear the shield spawn interval
    };
  }, [viewBox, shieldSpawning, spawnIntervalShield, characterParam.name]);

  const [diseases, setDiseases] = useState([]);
  const spawnIntervalRef = useRef(null);
  const baseSpeed = useRef(5);

  useEffect(() => {
    const spawnDisease = () => {
      const maybeJose = Math.random();
      const DiseaseComponent = maybeJose <= 0.2 ? JoseSprite : Disease;

      // Adjust speed every ten seconds
      const adjustedSpeed =
        baseSpeed.current + Math.floor(elapsedTime / 10) * 0.5;

      const margin = 50;

      const spawnX =
        Math.random() > 0.5
          ? viewBox[0] - margin
          : viewBox[0] + viewBox[2] + margin;
      const spawnY = Math.random() * viewBox[3] + viewBox[1];

      const dx = viewBox[0] + viewBox[2] / 2 - spawnX;
      const dy = viewBox[1] + viewBox[3] / 2 - spawnY;
      const angleTowardsViewBox = Math.atan2(dy, dx);

      const finalAngle =
        angleTowardsViewBox + (Math.random() - 0.5) * (Math.PI / 4);

      const newDisease = {
        x: spawnX,
        y: spawnY,
        velocityX: Math.cos(finalAngle) * adjustedSpeed,
        velocityY: Math.sin(finalAngle) * adjustedSpeed,
        Component: DiseaseComponent,
      };

      setDiseases((prevDiseases) => [...prevDiseases, newDisease]);

      // Set next spawn interval with adjusted speed
      let spawnRateModifier = 0;

      if (elapsedTime < 150) {
        spawnRateModifier = (elapsedTime / 10) * 100;
      } else {
        spawnRateModifier = 1500;
      }

      const nextSpawnInterval =
        Math.random() * (3000 - spawnRateModifier) + (1000 - spawnRateModifier);
      spawnIntervalRef.current = setTimeout(spawnDisease, nextSpawnInterval);
    };

    spawnDisease();

    return () => clearTimeout(spawnIntervalRef.current);
  }, [elapsedTime, viewBox]);

  useEffect(() => {
    const moveDiseases = () => {
      setDiseases((prevDiseases) =>
        prevDiseases.map((disease) => ({
          ...disease,
          x: disease.x + disease.velocityX,
          y: disease.y + disease.velocityY,
        })),
      );

      // Update player's position
      setPosition((prevPosition) => {
        const nextX = prevPosition.x + velocity.x / (60 / 2);
        const nextY = prevPosition.y + velocity.y / (60 / 2);

        const playerWidth = characterWidth;
        const playerHeight = characterHeight;

        const minX = viewBox[0];
        const minY = viewBox[1];
        const maxX = viewBox[0] + viewBox[2] - playerWidth;
        const maxY = viewBox[1] + viewBox[3] - playerHeight;

        const adjustedX = Math.min(Math.max(nextX, minX), maxX);
        const adjustedY = Math.min(Math.max(nextY, minY), maxY);

        return { x: adjustedX, y: adjustedY };
      });
    };

    const interval = setInterval(moveDiseases, 1000 / 60);
    if (playerHP <= 0) {
      setPlayerHP(0);
      setIsAlive(false); // Call the setIsAlive function to set isAlive to false
    }

    return () => clearInterval(interval);
  }, [velocity, viewBox, characterWidth, characterHeight, playerHP]);

  const prevHPRef = useRef(playerHP);
  useEffect(() => {
    // Track the previous HP value using a ref
    const prevHP = prevHPRef.current;

    // Logic to remove diseases upon damage if the character is "Peter"
    if (characterParam.name === "Peter" && playerHP < prevHP) {
      setDiseases([]); // Clear all currently spawned diseases
    }

    // Update the previous HP value after each render
    prevHPRef.current = playerHP;
  }, [characterParam.name, playerHP, playerMaxHP]);

  useEffect(() => {
    // Function to handle teleportation for Ethan
    const teleportEthan = () => {
      // Calculate random coordinates within the canvas bounds
      const randomX = Math.random() * viewBox[2] + viewBox[0];
      const randomY = Math.random() * viewBox[3] + viewBox[1];

      // Update Ethan's position
      setPosition({ x: randomX, y: randomY });

      // Set Ethan as shielded for 500ms
      setIsShielded(true);
      setTimeout(() => setIsShielded(false), 500 + baseSpeed.current * 50);

      // Schedule the next teleportation
      const nextTeleportTime = Math.random() * 10000 + 5000; // Random interval between 5 and 15 seconds
      setTimeout(teleportEthan, nextTeleportTime);
    };

    // Check if the character is Ethan and start teleportation
    if (characterParam.name === "Ethan") {
      teleportEthan();
    }

    // Cleanup function to clear any pending teleportation
    return () => clearTimeout(spawnIntervalRef.current);
  }, [baseSpeed, characterParam.name, viewBox]);

  const imageRef = useRef(null);

  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrame(
        (prevFrame) => (prevFrame + 1) % characterParam.frames.length,
      );
    }, 200); // Change the interval time as needed

    return () => clearInterval(frameInterval);
  }, [characterParam.frames.length]);

  useEffect(() => {
    if (characterParam.name === "Sean") {
      if (timeSinceLastMovement >= 2) {
        if (playerHP < playerMaxHP) {
          setPlayerHP((prevPlayerHP) => prevPlayerHP + 1);
          resetTimeSinceLastMovement();
        }
      }
    }
  }, [
    characterParam.name,
    timeSinceLastMovement,
    playerHP,
    setPlayerHP,
    playerMaxHP,
  ]);

  const GameOverText = {
    fontFamily: "'Halogen by Pixel Surplus', sans-serif",
    fontSize: "5rem",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "red",
  };

  const TimerContainer = {
    position: "absolute",
    top: "10px",
    left: "50%",
    zIndex: "999",
  };

  const TimerText = {
    fontFamily: "'Halogen Rough by Pixel Surplus', sans-serif",
    fontSize: "1.5rem",
    color: "black",
    padding: "0.5rem",
    display: "inline-block",
    position: "absolute",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    whiteSpace: "nowrap", // Ensure text stays on a single line
  };

  const HPContainer = {
    position: "absolute",
    top: "10px",
    left: "10px",
    zIndex: "999",
  };

  const HPText = {
    fontFamily: "'Halogen Rough by Pixel Surplus', sans-serif",
    fontSize: "1.5rem",
    color: "white",
    background: "rgba(0, 0, 0, 0.5)",
    padding: "0.5rem",
  };

  const ShieldContainer = {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: "999",
  };

  const ShieldText = {
    fontFamily: "'Halogen Rough by Pixel Surplus', sans-serif",
    fontSize: "1.5rem",
    color: "white",
    background: "rgba(0, 0, 0, 0.5)",
    padding: "0.5rem",
  };

  return (
    <div style={containerStyle}>
      <PlatformerBG canvasWidth={canvasWidth} canvasHeight={canvasHeight} />
      <div>
        {!isAlive && (
          <div className="game-over text-center" style={GameOverText}>
            <p>Game Over</p>
          </div>
        )}
        <div style={HPContainer}>
          <div className={"px-3"} style={HPText}>
            <img
              width={40}
              height={40}
              alt="Heart"
              src={"/heart1.png"}
              style={{ marginRight: "25px" }}
            />
            {playerHP}/{playerMaxHP}
          </div>
        </div>
        <div style={ShieldContainer}>
          <div className={"px-3"} style={ShieldText}>
            <img
              width={65}
              height={35}
              alt="Mask"
              src={"/maskSpriteF1.png"}
              style={{ marginRight: "25px" }}
            />{" "}
            {playerShields}
          </div>
        </div>
        <div style={TimerContainer}>
          <div style={TimerText}>Time: {elapsedTime}</div>
        </div>
        <svg
          id="platformer-canvas"
          preserveAspectRatio="xMaxYMax none"
          viewBox={viewBox}
        >
          {isAlive && (
            <g
              ref={imageRef}
              width={50}
              height={100}
              id={"Player"}
              transform={`translate(${position.x}, ${position.y})`}
            >
              <image
                width={characterWidth}
                height={characterHeight}
                href={characterParam.frames[currentFrame]}
                style={{ filter: isShielded ? "brightness(300%)" : "none" }}
              />
            </g>
          )}
          {/* Loop through an array of spawn points to create multiple hearts */}
          {healthSpawnPoints.map((spawnPoint, index) => (
            <HealthPickup
              key={index}
              x={spawnPoint.x}
              y={spawnPoint.y}
              viewBox={viewBox}
              setPlayerHP={setPlayerHP}
              playerHP={playerHP}
              playerMaxHP={playerMaxHP}
              player={document.getElementById("Player")}
              isAlive={isAlive}
              characterParam={characterParam}
              setSpeed={setSpeed}
            />
          ))}
          {shieldSpawnPoints.map((spawnPoint, index) => (
            <Shield
              key={index}
              x={spawnPoint.x}
              y={spawnPoint.y}
              viewBox={viewBox}
              setPlayerShields={setPlayerShields}
              playerShields={playerShields}
              player={document.getElementById("Player")}
              isAlive={isAlive}
              characterParam={characterParam}
              setSpeed={setSpeed}
            />
          ))}
          {diseases.map((disease, index) => {
            const DiseaseComponent = disease.Component;
            return (
              <DiseaseComponent
                key={index}
                x={disease.x}
                y={disease.y}
                viewBox={viewBox}
                setPlayerHP={setPlayerHP}
                playerHP={playerHP}
                player={document.getElementById("Player")}
                setIsAlive={setIsAlive}
                isAlive={isAlive}
                isShielded={isShielded}
                characterParam={characterParam}
                setSpeed={setSpeed}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Canvas;
