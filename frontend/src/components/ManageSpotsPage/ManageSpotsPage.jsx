import { useEffect, useState } from "react";
import * as spotsActions from "../../store/spots";
import "./ManageSpotsPage.css";
import { useDispatch, useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpotsModal from "../DeleteSpotsModal";

export default function ManageSpotsPage() {
  const currentSpots = useSelector((state) => state.spots.Spots);
  const [sortedSpots, setSortedSpots] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentSpots) {
      const sorted = [...currentSpots].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setSortedSpots(sorted);
    }
  }, [currentSpots]);

  useEffect(() => {
    dispatch(spotsActions.getCurrentUserSpotsThunk());
  }, [dispatch]);

  if (!sortedSpots) {
    return null;
  }

  const handleOnClickToCreateSpots = () => {
    navigate("/spots/new");
  };

  return (
    <>
      <h1 className="manage-spots-header">Manage your spots</h1>
      <div className="create-spot-modal-button">
        {!currentSpots.length && (
          <button onClick={handleOnClickToCreateSpots}>
            Create a new Spot
          </button>
        )}
      </div>

      <ul className="spots-container">
        {Object.keys(sortedSpots).map((spotId) => {
          const spot = sortedSpots[spotId];

          return (
            <>
              <div key={spotId} className="spot">
                <NavLink to={`/spots/${spot?.id}`}>
                  <div className="image-container">
                    <img src={spot?.previewImage}></img>
                  </div>
                  <div className="spot-info-container">
                    <div className="spot-info-left">
                      <li title={spot?.name}>
                        {spot?.city}, {spot?.state}
                      </li>
                      <li className="price">
                        ${spot?.price} <span className="night">night</span>
                      </li>
                    </div>
                    <div className="spot-info-right">
                      <li>
                        {spot?.avgRating ? (
                          <>
                            <FaStar /> {spot?.avgRating.toFixed(1)}
                          </>
                        ) : (
                          "New"
                        )}
                      </li>
                    </div>
                  </div>
                </NavLink>
                <div className="button-container">
                  <button
                    className="spot-update-button"
                    onClick={()=>navigate(`/spots/${spot.id}/edit`)}
                  >
                    Update
                  </button>
                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={<DeleteSpotsModal spotId={spot.id} />}
                  />
                </div>
              </div>
            </>
          );
        })}
      </ul>
    </>
  );
}
