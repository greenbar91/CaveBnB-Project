import * as spotsActions from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import "./SpotDetails.css";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function SpotDetails() {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots[Number(spotId)]);
  const currentUser = useSelector((state) => state.session.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (spotId) {
      dispatch(spotsActions.getSpotDetailsThunk(Number(spotId)));
    }
  }, [dispatch, spotId]);

  if (!spot) {
    return <div>Loading...</div>;
  }

  const handleClickReserve = () => {
    return window.alert("Feature coming soon");
  };

  const previewImage = spot.SpotImages.find((image) => image.preview);

  const handleReviewCheck = (spot) => {
    if (spot.numReviews === 1) {
      return "Review";
    }
    if (spot.numReviews > 1) {
      return "Reviews";
    }
    if (!spot.numReviews) {
      return "";
    }
  };

  const handleStarCheck = (spot) => {
    if (spot.avgStarRating) {
      return spot.avgStarRating.toFixed(1);
    } else {
      return "";
    }
  };

  const handleNumReviewCheck = (spot) => {
    if (spot.numReviews) {
      return " · " + spot.numReviews;
    } else {
      return "New";
    }
  };

  //change the return to the review list, not the review headers
  const handleBeTheFirstToPost = () => {
    if (!spot.numReviews) {
      if (currentUser && currentUser?.id === spot.ownerId) {
        return (
          <>
            Review placeholder
          </>
        );
      }
      if (!currentUser) {
        return (
          <>
            Review placeholder
          </>
        );
      } else if (currentUser) {
        return <>Be the first to post a review!</>;
      }
    }
    if (spot.numReviews) {
      return (
        <>
          Review placeholder
        </>
      );
    }
  };

  return (
    <>
      <div className="spot-details-page">
        <div className="spot-details-container">
          <div className="spot-details-top">
            <div className="spot-details-info">
              <h1>{spot.name}</h1>
              <p>
                {spot.city}, {spot.state}, {spot.country}
              </p>
            </div>
          </div>
          <div className="spot-preview">
            <img src={previewImage.url} alt="Spot Preview" />
          </div>
          <div className="spot-images">
            <img src={previewImage.url} alt="Spot Preview" />
            <img src={previewImage.url} alt="Spot Preview" />
            <img src={previewImage.url} alt="Spot Preview" />
            <img src={previewImage.url} alt="Spot Preview" />
          </div>
        </div>

        <div className="spot-description-container">
          <h2 className="spot-owner">
            Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
          </h2>
          <p className="spot-description">{spot.description}</p>
          <p className="spot-reserve">
            ${spot.price} night{" · "}
            <FaStar />
            {handleStarCheck(spot)}
            {"  "}
            {handleNumReviewCheck(spot)} {handleReviewCheck(spot)}
          </p>
          <button onClick={handleClickReserve} className="spot-reserve-button">
            Reserve
          </button>
        </div>
        <div className="spot-review-container">
          <div className="spot-review-header"><FaStar />
            {handleStarCheck(spot)}
            {"   "}
            {handleNumReviewCheck(spot)} {handleReviewCheck(spot)}</div>
          <div className="spot-reviews">{handleBeTheFirstToPost()}</div>
        </div>
      </div>
    </>
  );
}
