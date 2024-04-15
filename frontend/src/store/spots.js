import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/getSpots";
const GET_SPOT_DETAILS = "spots/getSpotDetails";
const CREATE_SPOT = "spots/createSpot";
const CREATE_SPOT_IMAGE = "spots/createSpotImage";

export const getSpots = (payload) => {
  return { type: GET_SPOTS, payload };
};

export const getSpotDetails = (payload) => {
  return { type: GET_SPOT_DETAILS, payload };
};

export const createSpot = (payload) => {
  return { type: CREATE_SPOT, payload };
};

export const createSpotImage = (payload) => {
  return { type: CREATE_SPOT_IMAGE, payload };
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
  const res = await csrfFetch(`/api/spots/${image.spotId}/images`,{
    method:'POST',
    header: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify(image)
  })

  if(res.ok){
    const data = await res.json()
    dispatch(createSpotImage(data))
    return data
  }

  if (!res.ok) {
    const data = await res.json();
    return data;
  }
}

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
            { url: action.payload.url, preview: action.payload.preview , spotId:action.payload.spotId},
          ],
        },
      };
    default:
      return state;
  }
};

export default spotsReducer;
