import * as spotsActions from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import SpotReviews from "../SpotReviews";
import "./SpotDetails.css";

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

  const handleReviewCheck = () => {
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

  const handleStarCheck = () => {
    if (spot.avgStarRating) {
      return spot.avgStarRating.toFixed(1);
    } else {
      return "";
    }
  };

  const handleNumReviewCheck = () => {
    if (spot.numReviews) {
      return " · " + spot.numReviews;
    } else {
      return "New";
    }
  };

  const handleBeTheFirstToPost = () => {
    if (!spot.numReviews) {
      if ((currentUser && currentUser?.id === spot.ownerId) || !currentUser) {
        return <SpotReviews />;
      } else if (currentUser) {
        return <>Be the first to post a review!</>;
      }
    }
    else {
      return <SpotReviews/>
    }
  };

  const previewImage = spot.SpotImages.find((image) => image.preview);
  return (
    <>
      <div className="spot-details-page">
        <div className="spot-details-container">
          <div className="spot-details-top">
            <div className="spot-details-info">
              <h1>{spot.name}</h1>
              <p className="spot-location">
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
            {handleStarCheck()}
            {"  "}
            {handleNumReviewCheck()} {handleReviewCheck()}
          </p>
          <button onClick={handleClickReserve} className="spot-reserve-button">
            Reserve
          </button>
        </div>
        <div className="spot-review-container">
          <div className="spot-review-header">
            <FaStar />
            {handleStarCheck()}
            {"   "}
            {handleNumReviewCheck()} {handleReviewCheck()}
          </div>
          {handleBeTheFirstToPost()}
        </div>
      </div>
    </>
  );
}