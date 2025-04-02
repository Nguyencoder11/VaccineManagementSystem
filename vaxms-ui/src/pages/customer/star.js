import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const StarRating = ({ onRatingSelect }) => {
  const [rating, setRating] = useState(1);
  const [hover, setHover] = useState(0);

  const handleRating = (ratingValue) => {
    setRating(ratingValue);
    onRatingSelect(ratingValue);  // Gọi callback từ App
  };

  return (
    <div style={{ display: 'flex' }}>
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;

        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleRating(ratingValue)} // Gọi hàm handleRating
              style={{ display: 'none' }}
            />
            <FontAwesomeIcon
              icon={faStar}
              className="star"
              size="2x"
              color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;