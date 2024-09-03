import React, { useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CharCarruselChunk from "./CharCarruselChunk.jsx";
import { allCharacters } from "./Characters";

const CharCarrusel = ({
  currentIndex,
  getCharacter,
  selectedStatus,
  joeUnlocked,
  wongUnlocked,
}) => {
  const sliderRef = useRef(null);
  const character = getCharacter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.slickGoTo(currentIndex);
      }
    }, 0);

    return () => clearInterval(intervalId);
  }, [currentIndex, sliderRef, character]);

  const settings = {
    className: "slider variable-width",
    dots: false,
    infinite: true,
    centerMode: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    draggable: false,
    speed: 400,
    onSwipeEnd: sliderRef,
  };

  return (
    <div>
      <Slider {...settings} ref={sliderRef}>
        {allCharacters.map((character, index) => (
          <CharCarruselChunk
            joeUnlocked={joeUnlocked}
            wongUnlocked={wongUnlocked}
            character={character}
            key={index}
            selectedStatus={selectedStatus}
          />
        ))}
      </Slider>
    </div>
  );
};

export default CharCarrusel;
