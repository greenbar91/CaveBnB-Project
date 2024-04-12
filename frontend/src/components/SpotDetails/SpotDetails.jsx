import * as spotsActions from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import './SpotDetails.css'
import { useParams } from "react-router-dom";

export default function SpotDetails(){
    const {spotId} = useParams()
    const spot = useSelector(state => state.spot[Number(spotId)])
    const dispatch = useDispatch()

    useEffect(()=> {
        if(spotId){
        dispatch(spotsActions.getSpotDetailsThunk(Number(spotId)))
    }
},[dispatch, spotId])

const testSpot = useSelector(state => state.spot)
console.log(testSpot)
    return (<>
        <section className="spot-details-container">
        <img src={spot.previewImage}></img>
        </section>

    </>)

}
