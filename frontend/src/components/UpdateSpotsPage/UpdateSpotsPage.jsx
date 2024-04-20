import "./UpdateSpotsPage.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spots";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateSpotsPage() {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots[spotId]);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(spotActions.getSpotDetailsThunk(spotId));
  }, [dispatch, spotId]);

  const ownerId = useSelector((state) => state.session.user.id);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (spot) {
      setAddress(spot.address || '');
      setCity(spot.city || '');
      setState(spot.state || '');
      setCountry(spot.country || '');
      setLat(spot.lat || '');
      setLng(spot.lng || '');
      setName(spot.name || '');
      setDescription(spot.description || '');
      setPrice(spot.price || '');
    }
  }, [spot]);


  const HandleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const checkErrors = {};

    if (!address.length) {
      checkErrors.address = "* Address is required";
    }
    if (!city.length) {
      checkErrors.city = "* City is required";
    }
    if (!state.length) {
      checkErrors.state = "* State is required";
    }
    if (!country.length) {
      checkErrors.country = "* Country is required";
    }
    if (!lat) {
      checkErrors.lat = "* Latitude is required";
    }
    if (!lng) {
      checkErrors.lng = "* Longitude is required";
    }
    if (!name.length) {
      checkErrors.name = "* Name is required";
    }
    if (!price) {
      checkErrors.price = "* Price is required";
    }

    if (description.length < 30) {
      checkErrors.description = "* Description needs a minimum of 30 characters";
    }



    if (!Object.values(checkErrors).length) {
      const updatedSpot = {
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      };

      dispatch(spotActions.updateSpotThunk(updatedSpot, spotId))
      navigate(`/spots/${spotId}`)
      dispatch(spotActions.getSpotDetailsThunk(spotId))

    }

    setErrors(checkErrors);
  };

  return (
    <div className="create-spot-container">
      <form className="create-spot-form" onSubmit={HandleSubmit}>
        <section className="create-spot-form-container">
          <h1>Update your Spot</h1>
          <h3>Where&apos;s your place located?</h3>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <div className="input-wrapper">
            <label htmlFor="" className="country">
              Country {errors && <span className="error-msg2"> {errors.country}</span>}
            </label>
            <input
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <label>
              Street Address{" "}
              {errors && <span className="error-msg2"> {errors.address}</span>}
            </label>
            <input
              placeholder="Street Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="city-state-grid">
              <div className="city">
            <label>
              City {errors && <span className="error-msg2"> {errors.city}</span>}
            </label>
            <input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            </div>
            <div className="state">
            <label>
              State {errors && <span className="error-msg2"> {errors.state}</span>}
            </label>
            <input
              placeholder="STATE"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            </div>
            </div>
            <div className="lat-lng-grid">
              <div>
            <label className="lat">
              Latitude {errors && <span className="error-msg2"> {errors.lat}</span>}
            </label>
            <input
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            </div>
            <div className="lng">
            <label>
              Longitude{" "}
              {errors && <span className="error-msg2"> {errors.lng}</span>}
            </label>
            <input
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
            </div>
            </div>
          </div>
        </section>
        <section className="create-spot-form-container">
          <h1>Describe your place to guests</h1>
          <p>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <div className="input-wrapper">
            <label>
              <textarea
                placeholder="Please write at least 30 characters"
                className="description-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors && <span className="error-msg"> {errors.description}</span>}
            </label>
          </div>
        </section>
        <section className="create-spot-form-container">
          <h1>Create a title for your spot</h1>
          <p>
            Catch guests&apos; attention with a spot title that highlights what
            makes your place special.
          </p>
          <div className="input-wrapper">
            <label></label>
            <input
              placeholder="Name of your spot"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors && <span className="error-msg"> {errors.name}</span>}
          </div>
        </section>
        <section className="create-spot-form-container">
          <h1>Set a base price for your spot</h1>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <div className="input-wrapper">
            <label>
              ${" "}
              <input
                placeholder="Price per Night (USD)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
            {errors && <span className="error-msg"> {errors.price}</span>}
          </div>
        </section>

        <button className="create-spot-submit-button" type="submit">Update your Spot</button>
      </form>
    </div>
  );
}
