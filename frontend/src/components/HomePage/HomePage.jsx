import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as spotsActions from "../../store/spots";
import "./HomePage.css";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function HomePage() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.Spots);

  useEffect(() => {
    dispatch(spotsActions.getAllSpotsThunk());
  }, [dispatch]);

  if (!spots) {
    return null;
  }

  return (
    <ul className="spots-container">
      {Object.keys(spots).map((spotId) => {
        const spot = spots[spotId];
        // console.log(spot)
        return (
          <>
            <div key={spotId} className="spot">
              <Link to={`spots/${spot.id}`}>
                <div className="image-container">
                  <img src={spot.previewImage}></img>
                </div>
                <div className="spot-info-container">
                  <div className="spot-info-left">
                    <li title={spot.name}>
                      {spot.city}, {spot.state}
                    </li>
                    <li className="price">
                      ${spot.price} <span className="night">night</span>
                    </li>
                  </div>
                  <div className="spot-info-right">
                    <li>
                      {spot.avgRating ? (
                        <>
                          <FaStar />{" "}
                          {spot.avgRating.toFixed(1)}
                        </>
                      ) : (
                        "New"
                      )}
                    </li>
                  </div>
                </div>
              </Link>
            </div>
          </>
        );
      })}
    </ul>
  );
}
