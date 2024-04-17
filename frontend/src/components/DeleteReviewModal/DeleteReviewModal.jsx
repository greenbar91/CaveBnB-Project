import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteReviewModal.css";

import * as reviewActions from '../../store/reviews'
import * as spotsActions from "../../store/spots";

export default function DeleteReviewModal({reviewId, spotId}) {

    const { closeModal } = useModal();
    const dispatch = useDispatch()


    const handleDelete = () => {
        dispatch(reviewActions.deleteReviewThunk(reviewId))
        dispatch(spotsActions.getSpotDetailsThunk(Number(spotId)));
        dispatch(reviewActions.getReviewsBySpotIdThunk(Number(spotId)));
        closeModal()
    }

    const handleKeepSpot = () => {
        closeModal()
    }


  return (
    <div className="delete-review-modal-container">
      <h2>Confirm Delete</h2>
      <div className="delete-review-modal-container">
        <p>Are you sure you want to delete this review?</p>
        <button className="modal-button-delete-yes" onClick={handleDelete}>
          Yes (Delete Review)
        </button>
        <div>
          <button className="modal-button-delete-no" onClick={handleKeepSpot}>
            No (Keep Review)
          </button>
        </div>
      </div>
    </div>
  );
}
