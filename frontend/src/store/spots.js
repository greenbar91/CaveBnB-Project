import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/getSpots";
const GET_SPOT_DETAILS = "spots/getSpotDetails";
const GET_CURRENT_USER_SPOTS = "spots/getCurrentUserSpots";
const CREATE_SPOT = "spots/createSpot";
const CREATE_SPOT_IMAGE = "spots/createSpotImage";
const UPDATE_SPOT = "spots/updateSpot";
const DELETE_SPOT = "spots/deleteSpots";

export const getSpots = (payload) => {
  return { type: GET_SPOTS, payload };
};

export const getSpotDetails = (payload) => {
  return { type: GET_SPOT_DETAILS, payload };
};

export const getCurrentUserSpots = (payload) => {
  return { type: GET_CURRENT_USER_SPOTS, payload };
};

export const createSpot = (payload) => {
  return { type: CREATE_SPOT, payload };
};

export const createSpotImage = (payload) => {
  return { type: CREATE_SPOT_IMAGE, payload };
};

export const updateSpot = (payload) => {
  return { type: UPDATE_SPOT, payload };
};

export const deleteSpots = (payload) => {
  return { type: DELETE_SPOT, payload };
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
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(getSpotDetails(data));
    return data;
  }
  if (!res.ok) {
    const data = await res.json();
    return data;
  }
};

export const createSpotThunk = (newSpot) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newSpot),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(createSpot(data));
    return data;
  }
  if (!res.ok) {
    const data = await res.json();
    return data;
  }
};

export const createSpotImageThunk = (image) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${image.spotId}/images`, {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(image),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(createSpotImage(data));
    return data;
  }

  if (!res.ok) {
    const data = await res.json();
    return data;
  }
};

export const getCurrentUserSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");
  console.log(res);

  if (res.ok) {
    const data = await res.json();
    console.log(data);
    dispatch(getCurrentUserSpots(data));
    return data;
  }
  if (!res.ok) {
    const data = await res.json();
    return data;
  }
};

export const updateSpotThunk = (spot, spotId) => async (dispatch) => {
  // console.log(spot);
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const data = await res.json();
    console.log(data);
    dispatch(updateSpot(data));
    return data;
  }
  if (!res.ok) {
    const data = await res.json();
    return data;
  }
};

export const deleteSpotsThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if(res.ok){
    const data = await res.json()
    dispatch(deleteSpots(data))
  }
  if (!res.ok) {
    const data = await res.json();
    return data;
  }
};

const initialState = {};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOTS:
      return { ...state, ...action.payload };
    case GET_SPOT_DETAILS:
      return { ...state, [action.payload.id]: action.payload };
    case CREATE_SPOT:
      return { ...state, [action.payload.id]: action.payload };
    case CREATE_SPOT_IMAGE:
      return {
        ...state,
        [action.payload.spotId]: {
          ...state[action.payload.spotId],
          SpotImages: [
            ...state[action.payload.spotId].SpotImages,
            {
              url: action.payload.url,
              preview: action.payload.preview,
              spotId: action.payload.spotId,
            },
          ],
        },
      };
    case GET_CURRENT_USER_SPOTS:
      return { ...state, ...action.payload };
    case UPDATE_SPOT:
      return { ...state, [action.payload.id]: action.payload };
    case DELETE_SPOT:
      delete [action.payload.id];
      return{...state}
    default:
      return state;
  }
};

export default spotsReducer;
