import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disableSignupButton, setDisableSignupButton] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signupThunk({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors((prevErrors) => ({ ...prevErrors, ...data.errors }));
          }
          if (!email.includes("@")) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "Invalid email",
            }));
          }
        });
    } else {
      setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }
  };

  useEffect(() => {
    if (
      !email.length ||
      !username.length ||
      !firstName.length ||
      !lastName.length ||
      !password.length ||
      !confirmPassword.length ||
      username.length < 4 ||
      password.length < 6
    ) {
      setDisableSignupButton(true);
    } else {
      setDisableSignupButton(false);
    }
  }, [
    confirmPassword.length,
    email.length,
    firstName.length,
    lastName.length,
    password.length,
    username.length,
  ]);

  return (
    <>
      <form onSubmit={handleSubmit} className="signup-form-container">
        <h1>Sign Up</h1>
        <div className="input-container">
          <label>
            <input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div className="input-container">
          <label>
            <input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {errors.username && <p>{errors.username}</p>}
        </div>
        <div className="input-container">
          <label>
            <input
              placeholder="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          {errors.firstName && <p>{errors.firstName}</p>}
        </div>
        <div className="input-container">
          <label>
            <input
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          {errors.lastName && <p>{errors.lastName}</p>}
        </div>
        <div className="input-container">
          <label>
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p>{errors.password}</p>}
        </div>
        <div className="input-container">
          <label>
            <input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>

        <button type="submit" disabled={disableSignupButton}>
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
