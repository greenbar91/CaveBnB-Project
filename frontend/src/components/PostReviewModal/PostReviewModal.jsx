import { useState } from "react";
import "./PostReviewModal.css";
import { postReviewThunk } from "../../store/reviews";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import * as reviewActions from "../../store/reviews";
import * as spotsActions from "../../store/spots";

export default function PostReviewModal({ spotId }) {
  const currentUser = useSelector((state) => state.session.user.id);
  const dispatch = useDispatch();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newReview = {
      userId: Number(currentUser),
      spotId: Number(spotId),
      review: reviewText,
      stars: rating,
    };

    const data = await dispatch(postReviewThunk(newReview));
    if(!data?.message){
      dispatch(spotsActions.getSpotDetailsThunk(Number(spotId)));
      dispatch(reviewActions.getReviewsBySpotIdThunk(Number(spotId)));
      closeModal();
    }

    if (data?.message) {
      setErrors(data);
    }
    
  };

  return (
    <div className="modal-container">
      <div className="post-review-container">
        <form className="post-review-form" onSubmit={handleSubmit}>
          <h2 className="post-review-header">How was your stay?</h2>
          {errors && <p>{errors.message}</p>}
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
                    value={rating}
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
            type="submit"
            disabled={!(rating > 0) || !(reviewText.length > 10)}
          >
            Submit Your Review
          </button>
        </form>
      </div>
    </div>
  );
}
