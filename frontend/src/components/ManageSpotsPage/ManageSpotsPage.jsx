import { useEffect } from "react";
import * as spotsActions from "../../store/spots";
import "./ManageSpotsPage.css";
import { useDispatch, useSelector } from "react-redux";

export default function ManageSpotsPage() {
  const currentUser = useSelector((state) => state.session.user);
  const currentSpots = useSelector((state) => state.spots);
  console.log(currentSpots);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(spotsActions.getCurrentUserSpotsThunk());
  }, [dispatch]);
}
