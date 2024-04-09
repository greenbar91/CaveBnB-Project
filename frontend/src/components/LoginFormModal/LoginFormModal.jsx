import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disableSubmit,setDisableSubmit] = useState(false)
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors({});
    return dispatch(sessionActions.loginThunk({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message && data.message === "Invalid credentials") {
          setErrors({ credential: "The provided credentials were invalid" });
        } else if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  useEffect(()=> {
    if(credential.length < 4 || password.length < 6){
      setDisableSubmit(true)
    } else {
      setDisableSubmit(false)
    }
  },[credential,password])

  // const handleDemoUserOnClick = () => {

  // }

  return (
    <>
      <h1 className='login'>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p className='login-error'>{errors.credential}</p>
        )}
        <button type="submit" disabled={disableSubmit}>Log In</button>
      </form>
      <button className='demo-user-button' onClick={'a'}>Log in as Demo user</button>
    </>
  );
}

export default LoginFormModal;
