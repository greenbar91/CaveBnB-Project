import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as spotsActions from '../../store/spots';


export default  function HomePage(){
    const dispatch = useDispatch()
    const spots = useSelector(state => state.spots.spots.Spots);

    useEffect(()=> {
        dispatch(spotsActions.getAllSpotsThunk())
    },[dispatch])

    if (!spots) {
        return null;
      }


    return (
        <div className="spots-container">
          {Object.keys(spots).map(spotId => {
            const spot = spots[spotId];
            return (
              <div key={spotId} className="spot">
                <h2>{spot.name}</h2>
                <p>State: {spot.state}, City: {spot.city}</p>

              </div>
            );
          })}
        </div>
      );
    }
