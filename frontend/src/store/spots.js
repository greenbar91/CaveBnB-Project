import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/getSpots";
const GET_SPOT_DETAILS = "spots/getSpotDetails";

export const getSpots = (payload) => {
  return {
    type: GET_SPOTS,
    payload,
  };
};

export const getSpotDetails = (payload) => {
  return { type: GET_SPOT_DETAILS, payload };
};

export const getAllSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");

  if (res.ok) {
    const data = await res.json();
    dispatch(getSpots(data));
  }
  if (!res.ok) {
    const data = await res.json();
    return data;
  }
};

export const getSpotDetailsThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`)

    if(res.ok){
        const data = await res.json();
        dispatch(getSpotDetails(data));
        return data
    }
    if(!res.ok){
        const data = await res.json()
        return data
    }
}

const initialState ={} ;

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOTS:
      return { ...state, ...action.payload };
    case GET_SPOT_DETAILS:
        return {...state, [action.payload.id]:action.payload}
    default:
      return state;
  }
};

export default spotsReducer;
