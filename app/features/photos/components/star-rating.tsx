import { Star } from "lucide-react";
import { useState } from "react";

export default function StarRating({
  value = 0,
  onChange,
}: {
  value?: number;
  onChange: (index: number) => void;
}) {
  const [rating, setRating] = useState(value);
  const [hover, setHover] = useState(0);

  const handleClick = (index: number) => {
    if (index === rating) {
      setRating(0);
      onChange(0);
    } else {
      setRating(index);
      onChange(index);
    }
  };

  return (
    <div className="mx-auto flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`cursor-pointer transition-colors duration-200 ${
            star <= (hover || rating)
              ? "fill-yellow-500 text-yellow-500"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
