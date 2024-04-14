import "./CreateSpotPage.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import * as spotActions from "../../store/spots";

export default function CreateSpotPage() {
  const dispatch = useDispatch();
  const ownerId = useSelector((state) => state.session.user.id);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [url3, setUrl3] = useState("");
  const [url4, setUrl4] = useState("");

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const checkErrors = {};

    if (!address.length) {
      checkErrors.address = "Address is required";
    }
    if (!city.length) {
      checkErrors.city = "City is required";
    }
    if (!state.length) {
      checkErrors.state = "State is required";
    }
    if (!country.length) {
      checkErrors.country = "Country is required";
    }
    if (!lat) {
      checkErrors.lat = "Latitude is required";
    }
    if (!lng) {
      checkErrors.lng = "Longitude is required";
    }
    if (!name.length) {
      checkErrors.name = "Name is required";
    }
    if (!price) {
      checkErrors.price = "Price is required";
    }
    if (!previewUrl.length) {
      checkErrors.previewUrl = "Preview image is required";
    }

    if (description.length < 30) {
      checkErrors.description = "Description needs a minimum of 30 characters";
    }

    const validateImageUrl = (url) => {
      const pattern = /\.(png|jpe?g)$/i;
      return pattern.test(url);
    };

    if (!validateImageUrl(url1) && url1.length) {
      checkErrors.url1 =
        "Please enter a valid image URL ending with .png, .jpg, or .jpeg";
    }
    if (!validateImageUrl(url2)&& url2.length) {
      checkErrors.url2 =
        "Please enter a valid image URL ending with .png, .jpg, or .jpeg";
    }
    if (!validateImageUrl(url3)&& url3.length) {
      checkErrors.url3 =
        "Please enter a valid image URL ending with .png, .jpg, or .jpeg";
    }
    if (!validateImageUrl(url4) && url4.length) {
      checkErrors.url4 =
        "Please enter a valid image URL ending with .png, .jpg, or .jpeg";
    }

    if (!Object.values(checkErrors).length) {
      const newSpot = {
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

      const createdSpot = await dispatch(spotActions.createSpotThunk(newSpot));
      const createdSpotId = createdSpot.id;

      const newSpotPreviewImage = {
        url: previewUrl,
        preview: true,
        spotId: createdSpotId,
      };

      const newSpotImage1 = {
        url: url1,
        preview: false,
        spotId: createdSpotId,
      };

      const newSpotImage2 = {
        url: url2,
        preview: false,
        spotId: createdSpotId,
      };

      const newSpotImage3 = {
        url: url3,
        preview: false,
        spotId: createdSpotId,
      };

      const newSpotImage4 = {
        url: url4,
        preview: false,
        spotId: createdSpotId,
      };

      dispatch(spotActions.createSpotImageThunk(newSpotPreviewImage))


    }

    setErrors(checkErrors);
  };


  return (
    <div className="create-spot-container">
      <form className="create-spot-form" onSubmit={HandleSubmit}>
        <section className="create-spot-form-container">
          <h1>Create a new Spot</h1>
          <h3>Where&apos;s your place located?</h3>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <div className="input-wrapper">
            <label htmlFor="" className="country">
              Country {errors && <span className="error-msg"> {errors.country}</span>}
            </label>
            <input
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <label>
              Street Address{" "}
              {errors && <span className="error-msg"> {errors.address}</span>}
            </label>
            <input
              placeholder="Street Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <label>
              City {errors && <span className="error-msg"> {errors.city}</span>}
            </label>
            <input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <label>
              State {errors && <span className="error-msg"> {errors.state}</span>}
            </label>
            <input
              placeholder="STATE"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <label>
              Latitude {errors && <span className="error-msg"> {errors.lat}</span>}
            </label>
            <input
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            <label>
              Longitude{" "}
              {errors && <span className="error-msg"> {errors.lng}</span>}
            </label>
            <input
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
          </div>
        </section>
        <section className="create-spot-form-container">
          <h1>Describe your place to guests</h1>
          <p>
            Mention the best features of your space, any special amenities like
            fast wif or parking, and what you love about the neighborhood.
          </p>
          <div className="input-wrapper">
            <label>
              <textarea
                placeholder="Description"
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
        <section className="create-spot-form-container">
          <h1>Liven up your spot with photos</h1>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <div className="input-wrapper">
            <label>
              <input
                placeholder="Preview Image URL"
                value={previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
              />
            </label>
            {errors && <span className="error-msg"> {errors.previewUrl}</span>}
            <label>
              <input
                placeholder="Image URL"
                value={url1}
                onChange={(e) => setUrl1(e.target.value)}
              />
            </label>
            {errors && <span className="error-msg"> {errors.url1}</span>}
            <label>
              <input
                placeholder="Image URL"
                value={url2}
                onChange={(e) => setUrl2(e.target.value)}
              />
            </label>
            {errors && <span className="error-msg"> {errors.url2}</span>}
            <label>
              <input
                placeholder="Image URL"
                value={url3}
                onChange={(e) => setUrl3(e.target.value)}
              />
            </label>
            {errors && <span className="error-msg"> {errors.url3}</span>}
            <label>
              <input
                placeholder="Image URL"
                value={url4}
                onChange={(e) => setUrl4(e.target.value)}
              />
            </label>
            {errors && <span className="error-msg">{errors.url4}</span>}
          </div>
        </section>
        <button className="create-spot-submit-button" type="submit">Create Spot</button>
      </form>
    </div>
  );
}
