import React, { useEffect, useRef, useState } from "react";

const HealthPickup = ({
  x,
  y,
  viewBox,
  player,
  isAlive,
  playerHP,
  setPlayerHP,
  playerMaxHP,
  setSpeed,
  characterParam,
}) => {
  const position = useRef({ x: x, y: y });
  const playerRef = useRef(player);
  const imageRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [updateTime, setUpdateTime] = useState(0);
  const [showPickup, setShowPickup] = useState(true);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    const frameTimer = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % 9); // Cycle between frames 0 to 4
    }, 100); // Switch frames every 200 milliseconds

    return () => clearInterval(frameTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showPickup && isAlive && playerRef.current) {
      const timer = setInterval(() => {
        setUpdateTime((prevUpdateTime) => prevUpdateTime + 1);
      }, 1);

      const playerRect = playerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();
      playerRect.width *= 0.9;
      playerRect.height *= 0.9;
      imageRect.width *= 0.8;
      imageRect.height *= 0.8;

      if (isIntersecting(playerRect, imageRect)) {
        console.log("Collision detected!");
        if (characterParam.name === "Jose") {
          setPlayerHP(playerHP + 1);
        } else if (playerHP < playerMaxHP) {
          setPlayerHP(playerHP + 1);
          if (characterParam.name === "Lorenzo") {
            setSpeed((prevSpeed) => prevSpeed - 30);
          }
        }
        setShowPickup(false);
      }

      if (elapsedTime >= 5) {
        setShowPickup(false);
      }
      // console.log(updateTime);
      return () => clearInterval(timer);
    }
  }, [
    viewBox,
    player,
    elapsedTime,
    showPickup,
    isAlive,
    playerHP,
    setPlayerHP,
    updateTime,
    playerMaxHP,
    characterParam,
    setSpeed,
  ]);

  const imageSrc = `/heart${currentFrame + 1}.png`;

  return (
    <>
      {showPickup && isAlive && (
        <image
          ref={imageRef}
          x={position.current.x}
          y={position.current.y}
          width={50}
          height={50}
          href={imageSrc}
        />
      )}
    </>
  );
};

function isIntersecting(a, b) {
  return (
    a.x <= b.x + b.width &&
    a.x + a.width >= b.x &&
    a.y <= b.y + b.height &&
    a.y + a.height >= b.y
  );
}

export default HealthPickup;
