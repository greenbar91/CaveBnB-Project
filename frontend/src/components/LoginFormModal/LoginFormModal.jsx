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

  const handleDemoUserOnClick = () => {
    return dispatch(sessionActions.loginThunk({ credential:'Demo-lition', password:'password' }))
    .then(() => {
      closeModal();
    })
  }

  return (
    <div >
      <h1 className='login-header'>Log In</h1>
      <form onSubmit={handleSubmit} className='login-form'>
        <label className='login'>

          <input
          className='login-input'
          placeholder='Username or Email'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className='login'>

          <input
          className='login-input'
          placeholder='Password'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p className='login-error'>{errors.credential}</p>
        )}
        <button type="submit" disabled={disableSubmit} className='login-button'>Log In</button>
      <button className='demo-user-button' onClick={handleDemoUserOnClick}>Demo user</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
