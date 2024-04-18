import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteReviewModal.css";

import * as reviewActions from '../../store/reviews'
import * as spotsActions from "../../store/spots";
import { useEffect } from "react";

export default function DeleteReviewModal({reviewId, spotId}) {

    const { closeModal } = useModal();
    const dispatch = useDispatch()
    const reviews = useSelector((state)=> state.reviews)

    useEffect(()=> {
      dispatch(reviewActions.getReviewsBySpotIdThunk(Number(spotId)));
      dispatch(spotsActions.getSpotDetailsThunk(Number(spotId)));
    },[dispatch, reviews, spotId])


    const handleDelete = () => {
        dispatch(reviewActions.deleteReviewThunk(reviewId))
        dispatch(reviewActions.getReviewsBySpotIdThunk(Number(spotId)));
        dispatch(spotsActions.getSpotDetailsThunk(Number(spotId)));
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
