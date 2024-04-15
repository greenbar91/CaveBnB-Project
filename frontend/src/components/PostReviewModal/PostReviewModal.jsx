import { useState } from "react";
import "./PostReviewModal.css";

export default function PostReviewModal() {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="modal-container">
      <div className="post-review-container">
        <form className="post-review-form">
          <h2 className="post-review-header">How was your stay?</h2>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="review-textarea"
            placeholder="Leave your review here..."
          />
          <div className="star-rating-container">
            <div className="star-rating">
              {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                  <button
                    type="button"
                    key={index}
                    className={index <= (rating || hover) ? "on" : "off"}
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <span className="star">&#9733;</span>
                  </button>
                );
              })}
            </div>
          </div>
          <button
            className="submit-review"
            type=""
            disabled={!(rating > 0) || !(reviewText.length > 10)}
          >
            Submit Your Review
          </button>
        </form>
      </div>
    </div>
  );
}
