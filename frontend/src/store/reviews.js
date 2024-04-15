import { csrfFetch } from "./csrf";

const GET_REVIEWS_BY_SPOTID = "reviews/getReviewsBySpotId";
// const POST_REVIEW = 'reviews/postReview'

export const getReviewsBySpotId = (payload) => {
  return {
    type: GET_REVIEWS_BY_SPOTID,
    payload,
  };
};

export const getReviewsBySpotIdThunk = (spotId) => async(dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if(res.ok){
        const data = await res.json()
        dispatch(getReviewsBySpotId(data))
        return data
    }
    if(!res.ok){
        const data = await res.json()
        return data
    }
}

const initialState = {};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVIEWS_BY_SPOTID:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reviewReducer
