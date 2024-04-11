import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as spotsActions from '../../store/spots';
import './HomePage.css'

export default  function HomePage(){
    const dispatch = useDispatch()
    const spots = useSelector(state => state.spots.Spots);

    useEffect(()=> {
        dispatch(spotsActions.getAllSpotsThunk())
    },[dispatch])

    if (!spots) {
        return null;
      }


    return (
        <ul className="spots-container" >
          {Object.keys(spots).map(spotId => {
            const spot = spots[spotId];
            return (
              <div key={spotId} className="spot">
                <img src={spot.previewImage}></img>
                <li title={spot.name}>{spot.city}, {spot.state}</li>
                <li>${spot.price}{'/'}night</li>
                <li>{spot.avgRating ? 'Average star rating: ' + spot.avgRating : 'New'}</li>
              </div>
            );
          })}
        </ul>
      );
    }
