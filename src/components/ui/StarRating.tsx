import '../../styles/star-rating.css';
import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  maxRating?: number;
  color?: string;
  size?: number;
  defaultRating?: number;
  onSetRating?: (rating: number) => void;
}

export function StarRating({
  maxRating = 10,
  color = '#fcc419',
  size = 24,
  defaultRating = 0,
  onSetRating,
}: StarRatingProps) {
  const [rating, setRating] = useState(defaultRating);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setRating(defaultRating);
  }, [defaultRating]);

  function handleRating(index: number) {
    setRating(index);
    if (onSetRating) {
      onSetRating(index);
    }
  }

  return (
    <div className='star-rating'>
      {[...Array(maxRating)].map((_, index) => {
        index += 1;

        return (
          <FaStar
            key={index}
            className={index <= (hover || rating) ? 'on' : 'off'}
            onClick={() => handleRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(0)}
            size={size}
            color={index <= (hover || rating) ? color : '#e4e5e9'}
            style={{ cursor: 'pointer' }}
          />
        );
      })}
    </div>
  );
}
