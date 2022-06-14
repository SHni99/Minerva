import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import RatingStyle from "./Rating.module.css";

const Rating = () => {
    return (
      <div className="">
        <StarRating />
      </div>
    );
  };
  
  export default Rating;

  const colors = {
    orange: "#FFBA5A",
    grey: "#a9a9a9"
    
};

const StarRating = () => {
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);
  const stars = Array(5).fill(0)

  const handleClick = value => {
    setCurrentValue(value)
  }

  const handleMouseOver = newHoverValue => {
    setHoverValue(newHoverValue)
  };

  const handleMouseLeave = () => {
    setHoverValue(0)
  }
  return (
    <div className={RatingStyle["star"]}>
        {stars.map((_, index) => {
          return (
            <FaStar
              key={index}
              size={24}
              onClick={() => handleClick(index + 1)}
              onMouseOver={() => handleMouseOver(index + 1)}
              onMouseLeave={handleMouseLeave}
              color={(hoverValue || currentValue) > index ? colors.orange : colors.grey}
              style={{
                marginRight: 10,
                cursor: "pointer",
                transform: "rotate(180deg)"
              }}
            />
          )
        })}
      </div>
  );
};