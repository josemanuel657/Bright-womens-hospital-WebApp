import React, { useEffect, useRef, useState, useMemo } from "react";

const Disease = ({
  x,
  y,
  viewBox,
  player,
  setIsAlive,
  isAlive,
  playerHP,
  setPlayerHP,
  isShielded,
  setSpeed,
  characterParam,
}) => {
  const position = useRef({ x: x, y: y });
  const playerRef = useRef(player);
  const imageRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [randDisease, setRandDisease] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showDisease, setShowDisease] = useState(true);

  const diseaseData = useMemo(
    () => [
      { width: 130, height: 130, color: "red" },
      { width: 52, height: 52, color: "blue" },
      { width: 62, height: 62, color: "pink" },
      { width: 56, height: 56, color: "green" },
    ],
    [],
  );

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * diseaseData.length);
    const randomDisease = diseaseData[randomIndex];
    setRandDisease(randomDisease);
  }, [diseaseData]);

  useEffect(() => {
    const frameTimer = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % 2); // Cycle between frames 0 and 1
    }, 200); // Switch frames every 200 milliseconds

    return () => clearInterval(frameTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showDisease && isAlive) {
      position.current = { x: x, y: y };

      const playerRect = playerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();
      playerRect.width *= 0.85;
      playerRect.height *= 0.75;
      imageRect.width *= 0.8;
      imageRect.height *= 0.8;

      if (isIntersecting(playerRect, imageRect)) {
        console.log("Collision detected!");
        if (!isShielded) {
          if (characterParam.name === "Lorenzo") {
            setSpeed((prevSpeed) => prevSpeed + 30);
          }
          setPlayerHP(playerHP - 1);
        }
        setShowDisease(false);
      }

      // Hide the disease after 15 seconds
      if (elapsedTime >= 10) {
        setShowDisease(false);
      }
    }
  }, [
    x,
    y,
    viewBox,
    player,
    setIsAlive,
    elapsedTime,
    showDisease,
    isAlive,
    playerHP,
    setPlayerHP,
    isShielded,
    characterParam.name,
    setSpeed,
  ]);

  const imageSrc = `/${randDisease?.color}Disease${currentFrame + 1}.png`;

  return (
    <>
      {showDisease && isAlive && (
        <image
          ref={imageRef}
          x={position.current.x}
          y={position.current.y}
          width={
            characterParam.name === "Gus"
              ? randDisease?.width - 10
              : randDisease?.width
          }
          height={
            characterParam.name === "Gus"
              ? randDisease?.height - 10
              : randDisease?.height
          }
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

export default Disease;
