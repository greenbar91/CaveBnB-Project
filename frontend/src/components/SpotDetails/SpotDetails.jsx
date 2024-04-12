import * as spotsActions from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import "./SpotDetails.css";
import { useParams } from "react-router-dom";

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

  const previewImage = spot.SpotImages.find((image) => image.preview);

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

        <div className="spot-description">
          <h2>
            Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
          </h2>
          <p>{spot.description}</p>
        </div>
      </div>
    </>
  );
}
