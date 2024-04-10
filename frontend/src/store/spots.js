import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/getSpots";

export const getSpots = (payload) => {
  return {
    type: GET_SPOTS,
    payload
  };
};

export const getAllSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')

    if(res.ok){
        const data = await res.json()
        dispatch(getSpots(data))
    }
    if(!res.ok){
        const data = await res.json()
        return data
    }
}

const initialState = { spots:[]}

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOTS:
        return {...state, spots:action.payload}
        default:
        return state
    }
}

export default spotsReducer
