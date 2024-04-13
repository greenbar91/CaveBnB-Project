import "./CreateSpotPage.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import * as spotActions from "../../store/spots";

export default function CreateSpotPage() {
  const dispatch = useDispatch();
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
            <label htmlFor="" className="country">
              Country {error && <span className="error-msg">* error msg</span>}
            </label>
            <input placeholder="Country" />
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
          <label>
            {error && <span className="error-msg">* error msg</span>}
            <textarea placeholder="Description" className="description-input" />
          </label>
        </section>
      </form>
    </div>
  );
}
