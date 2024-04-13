import * as spotsActions from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import "./SpotDetails.css";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function SpotDetails() {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots[Number(spotId)]);
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
    return (window.alert('Feature coming soon'))
  }

  const previewImage = spot.SpotImages.find((image) => image.preview);

  let reviewCheck;
  if(spot.numReviews <= 1){
    reviewCheck = 'review'
  } else{
    reviewCheck = 'reviews'
  }

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
          <p className="spot-reserve">${spot.price} night{' • '}<FaStar/>{spot.avgStarRating.toFixed(1)}{' • '}{spot.numReviews}{' '}{reviewCheck}</p>
          <button onClick={handleClickReserve} className="spot-reserve-button">Reserve</button>
        </div>
      </div>
    </>
  );
}
