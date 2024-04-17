import { csrfFetch } from "./csrf";

const GET_REVIEWS_BY_SPOTID = "reviews/getReviewsBySpotId";
const POST_REVIEW = "reviews/postReview";
const DELETE_REVIEW = 'reviews/deleteReview'

export const getReviewsBySpotId = (payload) => {
  return {
    type: GET_REVIEWS_BY_SPOTID,
    payload,
  };
};

export const postReview = (payload) => {
  return {
    type: POST_REVIEW,
    payload,
  };
};

export const deleteReview = (payload) => {
  return {type:DELETE_REVIEW, payload}
}

export const getReviewsBySpotIdThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const data = await res.json();
    dispatch(getReviewsBySpotId(data));
    return data;
  }
  if (!res.ok) {
    const data = await res.json();
    return data;
  }
};

export const postReviewThunk = (review) => async(dispatch) => {
  const res = await csrfFetch(`/api/spots/${review.spotId}/reviews`,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(review)
  })

  if(res.ok){
    const data = await res.json()
    dispatch(postReview(data))
    return data
  }
  if (!res.ok) {
    const data = await res.json();
    return data;
  }
}

export const deleteReviewThunk = (reviewId) => async(dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method:'DELETE',
    headers:{
      'Content-Type':'application/json'
    },
  })

  if(res.ok){
    const data = await res.json()
    dispatch(deleteReview(data))
  }
}

const initialState = {};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVIEWS_BY_SPOTID:
      return { ...state, ...action.payload };
    case POST_REVIEW:
      return {...state, [action.payload.spotId]: action.payload}
    case DELETE_REVIEW:
      delete [action.payload.id]
      return {...state}
    default:
      return state;
  }
};

export default reviewReducer;
