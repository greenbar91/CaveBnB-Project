import "./DeleteSpotsModal.css";
import { useDispatch, useSelector} from "react-redux";
import { useModal } from "../../context/Modal";
import * as spotsActions from "../../store/spots";
import { useEffect } from "react";

export default function DeleteSpotsModal({spotId, groupId}) {
    const { closeModal } = useModal();
    const dispatch = useDispatch()
    const spot = useSelector((state)=> state.spots.Spots[groupId].id)


    useEffect(() => {
        dispatch(spotsActions.getCurrentUserSpotsThunk());
        console.log('dispatch')
      }, [ dispatch,spot ]);

    const handleDelete = () => {
        dispatch(spotsActions.deleteSpotsThunk(spotId))
        dispatch(spotsActions.getCurrentUserSpotsThunk());
        closeModal()
    }

    const handleKeepSpot = () => {
        closeModal()
    }


  return (
    <div className="delete-spots-modal-container">
      <h2>Confirm Delete</h2>
      <div className="delete-spots-modal-container">
        <p>Are you sure you want to remove this spot from the listings?</p>
        <button className="modal-button-delete-yes" onClick={handleDelete}>Yes (Delete Spot)</button>
        <div>
          <button className="modal-button-delete-no" onClick={handleKeepSpot}>No (Keep Spot)</button>
        </div>
      </div>
    </div>
  );
}
