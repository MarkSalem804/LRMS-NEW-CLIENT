import { FaStar } from "react-icons/fa";
import { useState } from "react";

const StarRating = ({
  rating = 0,
  onRatingChange,
  readOnly = false,
  size = 20,
  showLabel = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readOnly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
            className={`${
              readOnly ? "cursor-default" : "cursor-pointer"
            } transition-colors ${
              star <= displayRating ? "text-yellow-400" : "text-gray-300"
            } hover:scale-110 transition-transform`}
            style={{ fontSize: `${size}px` }}
          >
            <FaStar />
          </button>
        ))}
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 ml-2">
          {rating > 0 ? `${rating.toFixed(1)}` : "Not rated"}
        </span>
      )}
    </div>
  );
};

export default StarRating;
