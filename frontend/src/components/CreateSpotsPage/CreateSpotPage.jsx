import "./CreateSpotPage.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import * as spotActions from "../../store/spots";

export default function CreateSpotPage() {
  const dispatch = useDispatch();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [errors,setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({})

    const checkErrors = {}

    if()

  }

  let error = true;
  return (
    <div className="create-spot-container">
      <form className="create-spot-form">
        <section className="create-spot-form-container">
          <h1>Create a new Spot</h1>
          <h3>Where&apos;s your place located?</h3>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <div className="input-wrapper">
            <label htmlFor="" className="country" >
              Country {error && <span className="error-msg">* error msg</span>}
            </label>
            <input placeholder="Country" value={country} onChange={(e)=> setCountry(e.target.value)} />
            <label>
              Street Address{" "}
              {error && <span className="error-msg">* error msg</span>}
            </label>
            <input placeholder="Street Address" />
            <label>
              City {error && <span className="error-msg">* error msg</span>}
            </label>
            <input placeholder="City" />
            <label>
              State {error && <span className="error-msg">* error msg</span>}
            </label>
            <input placeholder="STATE" />
            <label>
              Latitude {error && <span className="error-msg">* error msg</span>}
            </label>
            <input placeholder="Latitude" />
            <label>
              Longitude{" "}
              {error && <span className="error-msg">* error msg</span>}
            </label>
            <input placeholder="Longitude" />
          </div>
        </section>
        <section className="create-spot-form-container">
          <h1>Describe your place to guests</h1>
          <p>
            Mention the best features of your space, any special amentities like
            fast wif or parking, and what you love about the neighborhood.
          </p>
          <div className="input-wrapper">
            <label>
              <textarea
                placeholder="Description"
                className="description-input"
              />
              {error && <span className="error-msg">* error msg</span>}
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
            <input placeholder="Name of your spot" />
            {error && <span className="error-msg">* error msg</span>}
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
              $ <input placeholder="Price per Night (USD)" />
            </label>
            {error && <span className="error-msg">* error msg</span>}
          </div>
        </section>
        <section className="create-spot-form-container">
          <h1>Liven up your spot with photos</h1>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <div className="input-wrapper">
            <label>
              <input placeholder="Preview Image URL" />
            </label>
            {error && <span className="error-msg">* error msg</span>}
            <label>
              <input placeholder="Image URL" />
            </label>
            {error && <span className="error-msg">* error msg</span>}
            <label>
              <input placeholder="Image URL" />
            </label>
            {error && <span className="error-msg">* error msg</span>}
            <label>
              <input placeholder="Image URL" />
            </label>
            {error && <span className="error-msg">* error msg</span>}
            <label>
              <input placeholder="Image URL" />
            </label>
            {error && <span className="error-msg">* error msg</span>}
          </div>
        </section>
        <button className="create-spot-submit-button">Create Spot</button>
      </form>
    </div>
  );
}
