import { useState, useCallback, useEffect } from "react";
import { allCharacters } from "../Characters";

const SelectionStatus = {
  unselected: 0,
  selected: 1,
};

export function useCharacterSelector(
  initialIndex,
  username,
  joeUnlocked,
  wongUnlocked,
) {
  const [index, setIndex] = useState(initialIndex);
  const [activeArrowKey, setActiveArrowKey] = useState(null);
  const itemCount = allCharacters.length;
  const [selectedStatus, setSelectedStatus] = useState(
    SelectionStatus.unselected,
  );

  const firstRowSize = 7;
  const secondRowSize = 6;

  const setIndexSafely = useCallback(
    (newIndex) => {
      setIndex((newIndex + itemCount) % itemCount);
    },
    [itemCount],
  );

  const movePrev = useCallback(() => {
    if (!activeArrowKey || activeArrowKey === "ArrowLeft") {
      setActiveArrowKey("ArrowLeft");
      setIndexSafely(index - 1);
    }
  }, [index, activeArrowKey, setIndexSafely]);

  const moveNext = useCallback(() => {
    if (!activeArrowKey || activeArrowKey === "ArrowRight") {
      setActiveArrowKey("ArrowRight");
      setIndexSafely(index + 1);
    }
  }, [index, activeArrowKey, setIndexSafely]);

  const moveUp = useCallback(() => {
    if (!activeArrowKey || activeArrowKey === "ArrowUp") {
      setActiveArrowKey("ArrowUp");
      if (index >= firstRowSize) {
        const newIndex = index - secondRowSize;
        setIndexSafely(newIndex);
      }
    }
  }, [index, activeArrowKey, firstRowSize, secondRowSize, setIndexSafely]);

  const moveDown = useCallback(() => {
    if (!activeArrowKey || activeArrowKey === "ArrowDown") {
      setActiveArrowKey("ArrowDown");
      if (index === 0) {
        setIndexSafely(7);
      } else if (index < firstRowSize) {
        const newIndex = index + secondRowSize;
        setIndexSafely(newIndex);
      }
    }
  }, [index, activeArrowKey, firstRowSize, secondRowSize, setIndexSafely]);

  const moveRandom = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * 13); // Random index between 0 and 12
    const step = () => {
      setIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % itemCount;
        if (nextIndex === randomIndex) {
          clearInterval(timer);
        } else {
          setIndexSafely(nextIndex);
        }
        return nextIndex;
      });
    };
    const timer = setInterval(step, 100); // Adjust the time interval as needed
  }, [setIndexSafely, itemCount]);




  const keyboardEnter = useCallback(() => {
    if (index === 7 && !joeUnlocked) {
      return;
    }
    if (index === 12 && !wongUnlocked) {
      return;
    }
    if (selectedStatus === SelectionStatus.unselected) {
      setSelectedStatus(SelectionStatus.selected);
    } else {
      localStorage.setItem("characterIndex", index);
      window.location.href = `/brigham-breakout`;
    }
  }, [wongUnlocked, joeUnlocked, selectedStatus, index]);

  const keyboardEscape = useCallback(() => {
    setSelectedStatus(SelectionStatus.unselected);
  }, []);

  const setCurrentIndex = useCallback(
    (newIndex) => {
      setIndexSafely(newIndex);
    },
    [setIndexSafely],
  );

  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case "ArrowLeft":
          movePrev();
          break;
        case "ArrowRight":
          moveNext();
          break;
        case "ArrowUp":
          moveUp();
          break;
        case "ArrowDown":
          moveDown();
          break;
        case "Enter":
          keyboardEnter();
          break;
        case "Escape":
          keyboardEscape();
          break;
        default:
          break;
        case "r":
          moveRandom();
          break;
      }
    },
    [moveRandom, movePrev, moveNext, moveUp, moveDown, keyboardEnter, keyboardEscape],
  );

  const handleKeyUp = useCallback(
    (event) => {
      if (event.key === activeArrowKey) {
        setActiveArrowKey(null);
      }
    },
    [activeArrowKey],
  );

  useEffect(() => {
    // Add event listeners for key down and key up events
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const getCharacter = useCallback(() => {
    return allCharacters[index];
  }, [index]);

  return {
    currentIndex: index,
    setCurrentIndex,
    movePrev,
    moveNext,
    moveUp,
    moveDown,
    getCharacter,
    selectedStatus,
  };
}

