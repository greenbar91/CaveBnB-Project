import * as reviewActions from "../../store/reviews";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import "./SpotReviews.css";
import DeleteReviewModal from "../DeleteReviewModal";

export default function SpotReviews() {
  const { spotId } = useParams();
  //   const spot = useSelector((state) => state.spots[Number(spotId)]);
  const reviews = useSelector((state) => state.reviews.Reviews);
  const currentUser = useSelector((state) => state.session.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reviewActions.getReviewsBySpotIdThunk(Number(spotId)));
  }, [dispatch, spotId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const sortedReviews = reviews
    ? [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  return (
    <>
      <header className="review-container">
        {sortedReviews ? (
          sortedReviews.map((review) => (
            <div className="review-info" key={review.id}>
              <div className="review-firstName">{review.User.firstName}</div>
              <div className="review-date">{formatDate(review.createdAt)}</div>
              <div className="review-description">{review.review}</div>
              <div className="delete-review-button">
                {review.userId === currentUser?.id && (
                  <OpenModalButton
                    buttonText={"Delete"}
                    modalComponent={
                      <DeleteReviewModal reviewId={review.id} spotId={spotId} />
                    }
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <div>Loading reviews...</div>
        )}
      </header>
    </>
  );
}
