import { useState, useEffect, useRef } from 'react';
import { useDispatch} from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { NavLink, useNavigate } from "react-router-dom";

function ProfileButton({ user }) {

  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate()

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logoutThunk());
    closeMenu();
    navigate('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden") + (user ? "" : " small");



  return (
    <>
      <button className='profile-button' onClick={toggleMenu}>
        <FaUserCircle className='user-icon'/>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div className='usermenu'>
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <li className='manage-spots-container'><NavLink to={'/spots/current'} className='manage-spots' onClick={()=> setShowMenu(false)}>Manage Spots</NavLink></li>

            <li>
              <button onClick={logout} className='logout-button'>Log Out</button>
            </li>
          </div>
        ) : (
          <>
          <div className='login-signup-dropdown'>
            <OpenModalMenuItem
              itemText="Sign up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
            <OpenModalMenuItem
              itemText="Log in"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
          </div>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
